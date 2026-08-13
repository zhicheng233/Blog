'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postPath = path.join(root, 'public', 'post', 'FixedTime比较在开发中的重要性', 'index.html');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const robotsPath = path.join(root, 'public', 'robots.txt');
const expectedUrl = 'https://blog.zhicheng233.top/post/FixedTime%E6%AF%94%E8%BE%83%E5%9C%A8%E5%BC%80%E5%8F%91%E4%B8%AD%E7%9A%84%E9%87%8D%E8%A6%81%E6%80%A7/';

for (const file of [postPath, sitemapPath, robotsPath]) {
  if (!fs.existsSync(file)) throw new Error(`Missing generated SEO file: ${file}`);
}

const post = fs.readFileSync(postPath, 'utf8');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const robots = fs.readFileSync(robotsPath, 'utf8');

for (const required of ['<title>FixedTime比较在开发中的重要性 | 志成zhi_cheng的Blog</title>', '时间侧信道攻击', 'rel="canonical"', 'application/ld+json', 'id="app"', 'static/js/120aa8f8.js']) {
  if (!post.includes(required)) throw new Error(`Target post is missing ${required}`);
}

if (!sitemap.includes(expectedUrl)) throw new Error('Sitemap does not contain the target canonical URL.');
if (sitemap.includes('.html')) throw new Error('Sitemap must not contain legacy .html URLs.');
if (!robots.includes('Sitemap: https://blog.zhicheng233.top/sitemap.xml')) throw new Error('robots.txt does not declare sitemap.xml.');

for (const slug of ['How-to-access-restricted-websites-by-direct', 'how-to-get-ewt-cookie', '浅谈V2ray & Cloudflare Zero Trust']) {
  const hiddenPath = path.join(root, 'public', 'post', slug, 'index.html');
  const hiddenPage = fs.readFileSync(hiddenPath, 'utf8');
  if (!hiddenPage.includes('noindex,nofollow')) throw new Error(`Hidden post ${slug} is missing noindex.`);
  if (sitemap.includes(slug)) throw new Error(`Hidden post ${slug} must not appear in sitemap.`);
}

console.log('SEO output verification passed.');
