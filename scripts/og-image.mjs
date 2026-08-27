// Generates a project's OpenGraph card image (1200x630 PNG) at build time so
// every project — including future ones — gets an on-brand card whose main text
// is the project name, matching the hand-made blog cards. The layout mirrors
// them: a small grey line (the author's name) above a large near-white line
// (the project name), left-aligned and vertically centered on the site's black.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const HERE = dirname(fileURLToPath(import.meta.url));
const FONT_REGULAR = join(HERE, "og-assets/Geist-Regular.ttf");
const FONT_SEMIBOLD = join(HERE, "og-assets/Geist-SemiBold.ttf");

const W = 1200;
const H = 630;
const MARGIN = 90;
const MAX_TEXT_WIDTH = W - MARGIN * 2;
const AUTHOR = "Jonathan Shanmuganantham";

const escXml = (t) =>
  String(t)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Geist has no metrics API here, so estimate the title width from an average
// glyph advance and shrink the font size until it fits one line. Project names
// are short, so this only ever kicks in for unusually long future names.
const AVG_ADVANCE = 0.58; // fraction of font size, tuned for Geist SemiBold
function fitFontSize(text, base, min, maxWidth) {
  const est = text.length * AVG_ADVANCE * base;
  if (est <= maxWidth) return base;
  return Math.max(min, Math.floor(base * (maxWidth / est)));
}

export function projectCardSvg(title) {
  const size = fitFontSize(title, 72, 40, MAX_TEXT_WIDTH);
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <text x="${MARGIN}" y="282" font-family="Geist" font-weight="400" font-size="30" fill="#888888">${escXml(AUTHOR)}</text>
  <text x="${MARGIN}" y="380" font-family="Geist" font-weight="600" font-size="${size}" fill="#ededed">${escXml(title)}</text>
</svg>`;
}

let fontFiles;
function getFontFiles() {
  if (!fontFiles) {
    // Touch the files early so a missing font is a clear error, not a blank card.
    readFileSync(FONT_REGULAR);
    readFileSync(FONT_SEMIBOLD);
    fontFiles = [FONT_REGULAR, FONT_SEMIBOLD];
  }
  return fontFiles;
}

export function renderProjectCard({ title, outFile }) {
  const resvg = new Resvg(projectCardSvg(title), {
    fitTo: { mode: "width", value: W },
    font: {
      fontFiles: getFontFiles(),
      loadSystemFonts: false,
      defaultFontFamily: "Geist",
    },
  });
  const png = resvg.render().asPng();
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, png);
}
