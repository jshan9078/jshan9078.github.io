// Post-build step: emit dist/<route>/index.html for each page in og-pages.mjs,
// identical to the built SPA shell but with page-specific OpenGraph/Twitter meta.
// GitHub Pages serves these files directly, so social crawlers get per-page cards
// while browsers still boot the React app and route normally.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "./og-pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://jshan9078.github.io";
const START = "<!-- og:start -->";
const END = "<!-- og:end -->";

const shell = readFileSync(join(DIST, "index.html"), "utf8");
const s = shell.indexOf(START);
const e = shell.indexOf(END);
if (s < 0 || e < 0) {
  console.error("[og-prerender] markers not found in dist/index.html");
  process.exit(1);
}
const before = shell.slice(0, s);
const after = shell.slice(e + END.length);

const esc = (t) =>
  String(t)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const metaBlock = (p) => {
  const url = `${SITE}/${p.route}`;
  const img = `${SITE}${p.image}`;
  const type = p.route.startsWith("blog/") ? "article" : "website";
  return `${START}
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="Jonathan Shanmuganantham" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(p.title)}" />
    <meta name="twitter:description" content="${esc(p.description)}" />
    <meta name="twitter:image" content="${img}" />
    ${END}`;
};

for (const p of pages) {
  const html = (before + metaBlock(p) + after).replace(
    /<title>[^<]*<\/title>/,
    `<title>${esc(p.title)}</title>`,
  );
  const file = join(DIST, p.route, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("[og-prerender]", p.route);
}
console.log(`[og-prerender] wrote ${pages.length} page(s)`);
