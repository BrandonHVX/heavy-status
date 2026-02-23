import { NextRequest, NextResponse } from "next/server";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY || "";
const SITE_URL = process.env.SITE_URL || "https://news-pwa.vercel.app";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const reqAuth = request.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (webhookSecret && reqAuth !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!ONESIGNAL_API_KEY || !ONESIGNAL_APP_ID) {
      return NextResponse.json(
        { error: "OneSignal not configured", app_id_set: !!ONESIGNAL_APP_ID, api_key_set: !!ONESIGNAL_API_KEY },
        { status: 500 }
      );
    }

    const body = await request.json();

    const postStatus = body.post_status || body.status || "";
    if (postStatus && postStatus !== "publish") {
      return NextResponse.json({
        skipped: true,
        reason: `Post status is "${postStatus}", not "publish"`,
      });
    }

    const title =
      body.post_title || body.title || "New Post on Heavy Status";
    const excerpt = body.post_excerpt || body.excerpt || "";
    const slug = body.post_name || body.slug || "";
    const imageUrl =
      body.post_thumbnail_url ||
      body.featured_image ||
      body.image ||
      "";

    const message = excerpt
      ? stripHtml(excerpt).substring(0, 200)
      : "Check out the latest news on Heavy Status!";

    const url = slug ? `${SITE_URL}/article/${slug}` : SITE_URL;

    const notificationPayload: any = {
      app_id: ONESIGNAL_APP_ID,
      target_channel: "push",
      included_segments: ["Subscribed Users"],
      headings: { en: stripHtml(title) },
      contents: { en: message },
      url: url,
    };

    if (imageUrl) {
      notificationPayload.big_picture = imageUrl;
      notificationPayload.chrome_web_image = imageUrl;
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
      body: JSON.stringify(notificationPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("OneSignal API error:", result);
      return NextResponse.json(
        { error: "Failed to send notification", details: result },
        { status: 500 }
      );
    }

    if (result.errors && result.errors.length > 0) {
      console.error("OneSignal warning:", result.errors);
      return NextResponse.json({
        success: false,
        error: "Notification not delivered",
        onesignal_errors: result.errors,
        recipients: result.recipients || 0,
        hint: result.errors.includes("All included players are not subscribed")
          ? "No users have subscribed to push notifications yet. Visit your site and allow notifications when prompted."
          : undefined,
        post_title: stripHtml(title),
        post_url: url,
      });
    }

    return NextResponse.json({
      success: true,
      notification_id: result.id,
      recipients: result.recipients,
      post_title: stripHtml(title),
      post_url: url,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isV2Key = ONESIGNAL_API_KEY.startsWith("os_v2_");
  const authHeader = isV2Key
    ? `Key ${ONESIGNAL_API_KEY}`
    : `Basic ${ONESIGNAL_API_KEY}`;

  let subscriberInfo: any = { status: "unknown" };

  if (ONESIGNAL_API_KEY && ONESIGNAL_APP_ID) {
    try {
      const appUrl = isV2Key
        ? `https://api.onesignal.com/apps/${ONESIGNAL_APP_ID}`
        : `https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}`;
      const appResponse = await fetch(appUrl, {
        headers: { Authorization: authHeader },
      });
      if (appResponse.ok) {
        const appData = await appResponse.json();
        subscriberInfo = {
          total_users: appData.players || "N/A",
          messageable_users: appData.messageable_players || "N/A",
          chrome_web_origin: appData.chrome_web_origin || "not set",
          chrome_web_default_notification_icon: appData.chrome_web_default_notification_icon || "not set",
        };
      } else {
        const errData = await appResponse.json().catch(() => ({}));
        subscriberInfo = { error: "Could not fetch app info", status: appResponse.status, details: errData };
      }
    } catch (e: any) {
      subscriberInfo = { error: e.message };
    }
  }

  return NextResponse.json({
    status: "Webhook endpoint active",
    configured: {
      app_id: ONESIGNAL_APP_ID ? `${ONESIGNAL_APP_ID.substring(0, 8)}...` : "NOT SET",
      api_key: ONESIGNAL_API_KEY ? "SET" : "NOT SET",
      site_url: SITE_URL,
    },
    subscribers: subscriberInfo,
    usage:
      "POST to this URL when a new post is published. Payload: post_title, post_excerpt, post_name, post_status, post_thumbnail_url",
  });
}
