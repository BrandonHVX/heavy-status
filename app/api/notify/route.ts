import { NextRequest, NextResponse } from "next/server";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY || "";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

export async function POST(request: NextRequest) {
  try {
    const reqAuth = request.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (webhookSecret && reqAuth !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!ONESIGNAL_API_KEY || !ONESIGNAL_APP_ID) {
      return NextResponse.json(
        { error: "OneSignal not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const title = body.post_title || body.title || "New Post on Heavy Status";
    const excerpt = body.post_excerpt || body.excerpt || "";
    const slug = body.post_name || body.slug || "";
    const imageUrl = body.featured_image || body.image || "";

    const message = excerpt
      ? stripHtml(excerpt).substring(0, 200)
      : "Check out the latest news on Heavy Status!";

    const url = slug
      ? `${process.env.SITE_URL || "https://heavy-status.com"}/article/${slug}`
      : process.env.SITE_URL || "https://heavy-status.com";

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

    return NextResponse.json({
      success: true,
      notification_id: result.id,
      recipients: result.recipients,
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
  return NextResponse.json({
    status: "Webhook endpoint active",
    usage:
      "POST with { title, excerpt, slug, image } to send push notification",
  });
}
