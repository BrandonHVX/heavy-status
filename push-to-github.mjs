import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) throw new Error('X_REPLIT_TOKEN not found');

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': xReplitToken } }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings || !accessToken) throw new Error('GitHub not connected');
  return accessToken;
}

async function main() {
  const owner = 'BrandonHVX';
  const repo = 'heavy-status';
  
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });

  // Get the default branch
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const defaultBranch = repoData.default_branch;
  console.log(`Default branch: ${defaultBranch}`);

  // Get the latest commit SHA on the default branch
  let baseSha;
  try {
    const { data: refData } = await octokit.git.getRef({ owner, repo, ref: `heads/${defaultBranch}` });
    baseSha = refData.object.sha;
    console.log(`Latest commit on ${defaultBranch}: ${baseSha}`);
  } catch (e) {
    console.log('No existing commits, creating initial commit');
    baseSha = null;
  }

  // Collect all files from the workspace
  const workspace = '/home/runner/workspace';
  const ignorePatterns = ['.git', 'node_modules', '.next', '.replit', 'replit.nix', '.config', '.cache', '.local', '.upm', 'generated-icon.png', '.breakpoints'];
  
  function getAllFiles(dir, prefix = '') {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (ignorePatterns.some(p => entry.name === p || entry.name.startsWith('.'))) continue;
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, relPath));
      } else if (entry.isFile()) {
        files.push({ fullPath, relPath });
      }
    }
    return files;
  }

  const files = getAllFiles(workspace);
  console.log(`Found ${files.length} files to push`);

  // Create blobs for each file
  const treeItems = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(file.fullPath);
      const isBinary = content.includes(0);
      
      const { data: blob } = await octokit.git.createBlob({
        owner, repo,
        content: content.toString(isBinary ? 'base64' : 'utf8'),
        encoding: isBinary ? 'base64' : 'utf-8',
      });

      treeItems.push({
        path: file.relPath,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
    } catch (e) {
      console.log(`Skipping ${file.relPath}: ${e.message}`);
    }
  }

  console.log(`Created ${treeItems.length} blobs`);

  // Create tree
  const treeParams = { owner, repo, tree: treeItems };
  if (baseSha) treeParams.base_tree = undefined; // Full tree replacement
  
  const { data: tree } = await octokit.git.createTree({ owner, repo, tree: treeItems });
  console.log(`Created tree: ${tree.sha}`);

  // Create commit
  const commitParams = {
    owner, repo,
    message: 'Update SITE_URL to news-pwa.vercel.app for push notifications and metadata',
    tree: tree.sha,
  };
  if (baseSha) commitParams.parents = [baseSha];

  const { data: commit } = await octokit.git.createCommit(commitParams);
  console.log(`Created commit: ${commit.sha}`);

  // Update reference
  try {
    await octokit.git.updateRef({
      owner, repo,
      ref: `heads/${defaultBranch}`,
      sha: commit.sha,
      force: true,
    });
    console.log(`Updated ${defaultBranch} to ${commit.sha}`);
  } catch {
    await octokit.git.createRef({
      owner, repo,
      ref: `refs/heads/${defaultBranch}`,
      sha: commit.sha,
    });
    console.log(`Created ${defaultBranch} at ${commit.sha}`);
  }

  console.log(`\nSuccessfully pushed all changes to https://github.com/${owner}/${repo}`);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
