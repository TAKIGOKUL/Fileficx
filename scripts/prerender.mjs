// Pre-renders every route to static HTML so each URL serves real content without JavaScript,
// with its own title, description, canonical URL and (only where appropriate) the AdSense script.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');
const { render, ROUTES, SITE_URL, seoFor, GUIDES } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const setAttr = (html, re, value) => html.replace(re, (_, pre) => `${pre}${esc(value)}"`);

for (const route of ROUTES) {
  const [, page = 'home', slug] = route.split('/');
  const seo = seoFor(page || 'home', slug);
  const url = SITE_URL + seo.path;
  let html = template.replace('<!--app-html-->', render(route));

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  html = setAttr(html, /(<meta name="description" content=")[^"]*"/, seo.description);
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*"/, url);
  html = setAttr(html, /(<meta property="og:url" content=")[^"]*"/, url);
  html = setAttr(html, /(<meta property="og:title" content=")[^"]*"/, seo.title);
  html = setAttr(html, /(<meta property="og:description" content=")[^"]*"/, seo.description);
  html = setAttr(html, /(<meta name="twitter:url" content=")[^"]*"/, url);
  html = setAttr(html, /(<meta name="twitter:title" content=")[^"]*"/, seo.title);
  html = setAttr(html, /(<meta name="twitter:description" content=")[^"]*"/, seo.description);

  if (!seo.ads) {
    // Legal/contact pages: no ad code at all
    html = html.replace(/\s*<script async src="https:\/\/pagead2\.googlesyndication\.com[^>]*><\/script>/, '');
  }

  if (route !== '/') {
    // Homepage FAQ/HowTo structured data only belongs on the homepage
    html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    const g = page === 'guides' && slug ? GUIDES.find((x) => x.slug === slug) : null;
    if (g) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: g.title,
        description: g.summary,
        dateModified: g.updated,
        author: { '@type': 'Organization', name: 'Fileficx' },
        publisher: { '@type': 'Organization', name: 'Fileficx', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
        mainEntityOfPage: url,
      };
      html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`);
    }
  }

  const out = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${SITE_URL}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : r.startsWith('/guides') ? '0.8' : '0.5'}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Pre-rendered ${ROUTES.length} routes for ${SITE_URL}`);
