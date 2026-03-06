# SEO Implementation

This app implements SEO following [Google Search Essentials](https://developers.google.com/search/docs) and current best practices.

## What’s in place

### 1. **Site URL and config**
- **`site.config.json`** – `site_url` (e.g. `https://globalmediasports.es`) is used for canonical URLs, sitemap, blog, and `robots.txt`. Change it for staging or other domains.

### 2. **Main HTML (`index.html`)**
- **Canonical** – Points to the homepage URL (replaced at build from `site_url`).
- **Meta** – `description`, `robots` (index, follow), **Open Graph** (`og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `og:locale`), **Twitter** (`twitter:card`, `twitter:title`, `twitter:description`).
- **JSON-LD** – `Organization` (name, url, logo, sameAs) and `WebSite` (url, name, publisher) for rich results and Knowledge Panel.

### 3. **Per-route meta (SPA)**
- **`react-helmet-async`** – Each route gets its own `<title>` and `<meta name="description">` (and canonical/OG when not `noindex`).
- **`src/lib/seo.ts`** – Defines title/description per path; **`src/components/PageSEO.tsx`** applies them. Dashboard, admin, and editor routes use `noindex, nofollow`.

### 4. **Crawling and discovery**
- **`robots.txt`** – Generated in `dist/` at build: `Allow: /` and `Sitemap: <site_url>/sitemap.xml`.
- **`sitemap.xml`** – Generated in `dist/` at build: homepage, `/register`, `/login`, `/terms`, `/privacy`, `/legal`, `/clauses`, `/contract`, and all blog HTML under `/blog/`.

### 5. **Blog**
- **`seo-scripts/convert-blog-to-html.js`** – Each post has its own HTML with `<title>`, meta description, canonical, OG/Twitter, and JSON-LD (e.g. `BlogPosting`). Uses `site_url` from `site.config.json`.

## Build

```bash
npm run build
```

This runs `vite build` then `node seo-scripts/build.js`, which:

1. Replaces `{{SITE_URL}}` in `dist/index.html` with `site_url` from `site.config.json`.
2. Writes `dist/robots.txt` with the sitemap URL.
3. Converts blog markdown to HTML (if `seo/content` exists).
4. Generates `dist/sitemap.xml`.

## Optional improvements

- **OG image** – For best social previews, use an image **1200×630**. Put it in `public/` (e.g. `og-image.png`) and set `og:image` in `index.html` to `{{SITE_URL}}/og-image.png`.
- **hreflang** – If you add other languages/regions, add `hreflang` and alternate URLs in the head and sitemap.
- **Structured data** – Add `WebPage` or `FAQPage` JSON-LD on specific pages if it fits the content.
