import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { main as convertBlog } from "./convert-blog-to-html.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const configPath = path.join(projectRoot, "site.config.json");
const distPath = path.join(projectRoot, "dist");

let siteConfig = {};
if (fs.existsSync(configPath)) {
  try {
    siteConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (e) {}
}

const siteUrl = siteConfig.site_url || "https://globalmediasports.es";

// 1. Patch dist/index.html: replace {{SITE_URL}} with site_url
const indexPath = path.join(distPath, "index.html");
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, "utf-8");
  html = html.replace(/\{\{SITE_URL\}\}/g, siteUrl);
  fs.writeFileSync(indexPath, html, "utf-8");
}

// 2. Generate dist/robots.txt with Sitemap
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(distPath, "robots.txt"), robotsTxt, "utf-8");

try {
  convertBlog(siteConfig);
} catch (error) {}

try {
  execSync("node seo-scripts/generate-sitemap.js", { stdio: "pipe", cwd: projectRoot });
} catch (error) {}

console.log("Build success");
