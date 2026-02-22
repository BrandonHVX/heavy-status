import { getAllPostsForSitemap } from "@/lib/wordpress";

export async function GET(request: Request) {
  try {
    const posts = await getAllPostsForSitemap();
    const baseUrl = process.env.SITE_URL || new URL(request.url).origin;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
    xml += '<channel>\n';
    xml += `  <title>Heavy Status</title>\n`;
    xml += `  <link>${baseUrl}</link>\n`;
    xml += `  <description>Breaking news, community stories, and live coverage</description>\n`;
    xml += `  <language>en-us</language>\n`;
    xml += `  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />\n`;

    for (const post of posts.slice(0, 20)) {
      xml += `  <item>\n`;
      xml += `    <title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>\n`;
      xml += `    <link>${baseUrl}/article/${post.slug}</link>\n`;
      xml += `    <guid isPermaLink="true">${baseUrl}/article/${post.slug}</guid>\n`;
      xml += `    <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n`;
      xml += `  </item>\n`;
    }

    xml += '</channel>\n</rss>';

    return new Response(xml, {
      headers: { 'Content-Type': 'application/rss+xml' },
    });
  } catch {
    return new Response("Error generating feed", { status: 500 });
  }
}
