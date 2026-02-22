export async function GET(request: Request) {
  const baseUrl = process.env.SITE_URL || new URL(request.url).origin;
  const body = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
