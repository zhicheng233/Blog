'use strict';

const { URL } = require('url');

const SITE_URL = 'https://blog.zhicheng233.top';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function plainText(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function absoluteUrl(path) {
  return new URL(path, `${SITE_URL}/`).href;
}

function staticPostPage(post, indexable = true) {
  const canonical = absoluteUrl(post.path);
  const title = `${post.title} | 志成zhi_cheng的Blog`;
  const content = post.content || '';
  const description = plainText(content).slice(0, 160) || post.title;
  const published = post.date && post.date.toISOString ? post.date.toISOString() : undefined;
  const modified = post.updated && post.updated.toISOString ? post.updated.toISOString() : published;
  const image = post.cover ? absoluteUrl(post.cover) : undefined;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    mainEntityOfPage: canonical,
    url: canonical,
    datePublished: published,
    dateModified: modified,
    description,
    author: { '@type': 'Person', name: '志成zhi_cheng' },
    publisher: { '@type': 'Organization', name: '志成zhi_cheng的Blog' }
  };

  if (image) schema.image = image;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${indexable ? 'index,follow' : 'noindex,nofollow'}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <script type="application/ld+json">${escapeJson(schema)}</script>
</head>
<body>
  <main>
    <article>
      <h1>${escapeHtml(post.title)}</h1>
      <p>发布于 <time datetime="${escapeHtml(published || '')}">${escapeHtml(post.date ? post.date.format('YYYY-MM-DD') : '')}</time></p>
      ${content}
    </article>
  </main>
</body>
</html>`;
}

function legacyRedirect(post) {
  const canonical = absoluteUrl(post.path);
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${escapeHtml(canonical)}"><meta http-equiv="refresh" content="0; url=${escapeHtml(canonical)}"><script>location.replace(${JSON.stringify(canonical)});</script><title>Redirecting</title></head><body><a href="${escapeHtml(canonical)}">${escapeHtml(canonical)}</a></body></html>`;
}

hexo.extend.generator.register('seo-static-pages', function seoStaticPages(locals) {
  const routes = [];
  const urls = [];
  const config = hexo.config.seo_static_pages || {};
  const posts = locals.posts.sort('-date').toArray().filter((post) => post.published && !post.hidden);

  for (const post of posts) {
    urls.push({ loc: absoluteUrl(post.path), lastmod: post.updated ? post.updated.toISOString() : undefined });

    if (config.legacy_html_redirects) {
      routes.push({ path: `/post/${post.slug}.html`, data: legacyRedirect(post) });
    }
  }

  const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const url of urls) {
    sitemap.push('  <url>');
    sitemap.push(`    <loc>${escapeHtml(url.loc)}</loc>`);
    if (url.lastmod) sitemap.push(`    <lastmod>${escapeHtml(url.lastmod)}</lastmod>`);
    sitemap.push('  </url>');
  }
  sitemap.push('</urlset>');
  routes.push({ path: 'sitemap.xml', data: sitemap.join('\n') });

  return routes;
});

// hexo-hide-posts replaces the post generator during after_init. Keep its
// hidden-post output, then replace only public routes with static HTML.
hexo.extend.filter.register('after_init', function installStaticPostGenerator() {
  const dynamicPostGenerator = hexo.extend.generator.get('post');

  hexo.extend.generator.register('post', async function staticPostGenerator(locals) {
    const dynamicRoutes = await dynamicPostGenerator.call(this, locals);
    const publicPosts = locals.posts.sort('-date').toArray().filter((post) => post.published && !post.hidden);
    const hiddenPosts = (locals.hidden_posts ? locals.hidden_posts.toArray() : [])
      .filter((post) => post.published && post.hidden);
    const staticPaths = new Set(publicPosts.concat(hiddenPosts).map((post) => post.path));
    const remainingRoutes = dynamicRoutes.filter((route) => !staticPaths.has(route.path));
    const staticRoutes = publicPosts
      .map((post) => ({ path: post.path, data: staticPostPage(post) }))
      .concat(hiddenPosts.map((post) => ({ path: post.path, data: staticPostPage(post, false) })));

    return remainingRoutes.concat(staticRoutes);
  });
});
