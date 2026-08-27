// Post-build step: emit dist/<route>/index.html for each page, identical to the
// built SPA shell but with page-specific OpenGraph/Twitter meta. GitHub Pages
// serves these files directly, so social crawlers get per-page cards while
// browsers still boot the React app and route normally.
//
// Blog cards come from the curated list in og-pages.mjs. Project cards are
// generated automatically from src/data/projects.ts so every project gets a
// card without hand-maintaining a list; a curated og-pages.mjs entry for the
// same route wins. Each project also gets a generated card image (project name
// as the main text) unless a hand-made public/og/<slug>.png already exists.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pages as curatedPages } from "./og-pages.mjs";
import { renderProjectCard } from "./og-image.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");
const SITE = "https://jshan9078.github.io";

// Load the real project data through Vite so path aliases and asset imports
// resolve exactly as they do in the app. This is how every project — including
// ones added in the future — gets a card with no manual step. A failure here is
// fatal: we would rather fail the build than silently deploy projects with no
// social cards, which is exactly the regression this guards against.
async function autoProjectPages() {
  let vite;
  try {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
      logLevel: "error",
    });
    const mod = await vite.ssrLoadModule("/src/data/projects.ts");
    const projects = mod.default?.items ?? mod.default ?? [];
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("no projects found in src/data/projects.ts");
    }
    return projects.map((p) => {
      if (!p.slug || !p.name) {
        throw new Error(
          `project missing slug/name: ${JSON.stringify(p.slug ?? p.name ?? p)}`,
        );
      }
      const rel = `/og/${p.slug}.png`;
      const base = {
        route: `projects/${p.slug}`,
        title: p.name,
        description: p.shortDescription ?? "",
      };
      // A hand-made image (in public/, already copied into dist/og by the build)
      // takes precedence; otherwise generate a card into dist/og. If generation
      // fails, fall back to the default image so the card still works.
      if (existsSync(join(PUBLIC, rel))) return { ...base, image: rel };
      try {
        renderProjectCard({ title: p.name, outFile: join(DIST, rel) });
        return { ...base, image: rel };
      } catch (err) {
        console.warn(
          `[og-prerender] image gen failed for ${p.slug} (${err.message}) — using default.png`,
        );
        return { ...base, image: "/og/default.png" };
      }
    });
  } finally {
    await vite?.close();
  }
}

// Curated entries win over auto-generated ones for the same route.
const auto = await autoProjectPages();
const byRoute = new Map();
for (const p of auto) byRoute.set(p.route, p);
for (const p of curatedPages) byRoute.set(p.route, p);
const pages = [...byRoute.values()];
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
