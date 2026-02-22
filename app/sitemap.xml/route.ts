import { getAllPostsForSitemap } from "@/lib/wordpress";

export async function GET(request: Request) {
  try {
    const posts = await getAllPostsForSitemap();
    const baseUrl = process.env.SITE_URL || new URL(request.url).origin;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/featured</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/explore</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/live</loc>\n    <changefreq>always</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    for (const post of posts) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/article/${post.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(post.date).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `    <news:news>\n`;
      xml += `      <news:publication>\n`;
      xml += `        <news:name>Heavy Status</news:name>\n`;
      xml += `        <news:language>en</news:language>\n`;
      xml += `      </news:publication>\n`;
      xml += `      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>\n`;
      xml += `      <news:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>\n`;
      xml += `    </news:news>\n`;
      xml += `  </url>\n`;
    }

    xml += '</urlset>';

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch {
    return new Response("Error generating sitemap", { status: 500 });
  }
}
