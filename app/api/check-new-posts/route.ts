import { NextResponse } from "next/server";

const GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL || "https://heavy-status.com/graphql";
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY || "";
const SITE_URL = process.env.SITE_URL || "https://heavy-status.com";

const CHECK_WINDOW_MINUTES = 10;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .trim();
}

async function getRecentPosts(): Promise<any[]> {
  const cutoff = new Date(Date.now() - CHECK_WINDOW_MINUTES * 60 * 1000);
  const afterDate = cutoff.toISOString();

  const query = `
    query RecentPosts($after: String!) {
      posts(
        first: 10,
        where: {
          orderby: { field: DATE, order: DESC },
          dateQuery: { after: { year: ${cutoff.getUTCFullYear()}, month: ${cutoff.getUTCMonth() + 1}, day: ${cutoff.getUTCDate()} } }
        }
      ) {
        nodes {
          databaseId
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { after: afterDate } }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Failed to fetch posts from WordPress");

  const json = await response.json();
  const posts = json.data?.posts?.nodes || [];

  return posts.filter(
    (post: any) => new Date(post.date) >= cutoff
  );
}

async function getAlreadySentIds(): Promise<Set<string>> {
  const isV2Key = ONESIGNAL_API_KEY.startsWith("os_v2_");
  const apiUrl = isV2Key
    ? `https://api.onesignal.com/notifications?app_id=${ONESIGNAL_APP_ID}&limit=20`
    : `https://onesignal.com/api/v1/notifications?app_id=${ONESIGNAL_APP_ID}&limit=20`;
  const authHeader = isV2Key
    ? `Key ${ONESIGNAL_API_KEY}`
    : `Basic ${ONESIGNAL_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    });
    if (!response.ok) return new Set();
    const data = await response.json();
    const notifications = data.notifications || [];
    const urls = new Set<string>();
    for (const n of notifications) {
      if (n.url) urls.add(n.url);
    }
    return urls;
  } catch {
    return new Set();
  }
}

async function sendNotification(post: any): Promise<any> {
  const title = post.title || "New Post on Heavy Status";
  const excerpt = post.excerpt
    ? stripHtml(post.excerpt).substring(0, 200)
    : "Check out the latest news on Heavy Status!";
  const url = post.slug ? `${SITE_URL}/article/${post.slug}` : SITE_URL;
  const imageUrl = post.featuredImage?.node?.sourceUrl || "";

  const payload: any = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: "push",
    included_segments: ["Subscribed Users"],
    headings: { en: stripHtml(title) },
    contents: { en: excerpt },
    url,
  };

  if (imageUrl) {
    payload.big_picture = imageUrl;
    payload.chrome_web_image = imageUrl;
  }

  const isV2Key = ONESIGNAL_API_KEY.startsWith("os_v2_");
  const apiUrl = isV2Key
    ? "https://api.onesignal.com/notifications"
    : "https://onesignal.com/api/v1/notifications";
  const authHeader = isV2Key
    ? `Key ${ONESIGNAL_API_KEY}`
    : `Basic ${ONESIGNAL_API_KEY}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!ONESIGNAL_API_KEY || !ONESIGNAL_APP_ID) {
      return NextResponse.json(
        { error: "OneSignal not configured" },
        { status: 500 }
      );
    }

    const [recentPosts, alreadySentUrls] = await Promise.all([
      getRecentPosts(),
      getAlreadySentIds(),
    ]);

    if (recentPosts.length === 0) {
      return NextResponse.json({
        message: "No new posts in the last " + CHECK_WINDOW_MINUTES + " minutes",
        notified: 0,
      });
    }

    const newPosts = recentPosts.filter((post: any) => {
      const postUrl = post.slug
        ? `${SITE_URL}/article/${post.slug}`
        : SITE_URL;
      return !alreadySentUrls.has(postUrl);
    });

    if (newPosts.length === 0) {
      return NextResponse.json({
        message: "Recent posts already notified",
        recent_count: recentPosts.length,
        notified: 0,
      });
    }

    const results = [];
    for (const post of newPosts) {
      const result = await sendNotification(post);
      results.push({ title: post.title, slug: post.slug, result });
    }

    return NextResponse.json({
      message: `Sent ${newPosts.length} notification(s)`,
      notified: newPosts.length,
      notifications: results,
    });
  } catch (error: any) {
    console.error("Check new posts error:", error);
    return NextResponse.json(
      { error: "Failed to check for new posts", message: error.message },
      { status: 500 }
    );
  }
}
