// Build-time fetch of live PyPI download totals.
//
// pepy.tech's JSON API now requires a paid API key, but the download *badge*
// SVG it serves is public and contains the same all-time total. We fetch that
// badge, parse the number out of it, and write the result to
// src/data/downloads.generated.json, which the app reads at render time.
//
// This never throws: on any failure it keeps the previously generated value
// (or the hardcoded fallback baked into projects.ts), so a flaky network or a
// badge-format change can never break the build or blank out the pill.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const projectsSrc = resolve(here, "../src/data/projects.ts");
const outFile = resolve(here, "../src/data/downloads.generated.json");

// Discover which packages to fetch by scanning the project data for pepy URLs.
async function discoverPackages() {
  const text = await readFile(projectsSrc, "utf8");
  const pkgs = new Set();
  const re = /pepy\.tech\/projects\/([a-z0-9._-]+)/gi;
  let m;
  while ((m = re.exec(text)) !== null) pkgs.add(m[1]);
  return [...pkgs];
}

// Extract the download count from a shields-style badge SVG. The count is the
// last <text> element whose content looks like a number (e.g. "7k", "1.2M",
// "412"); the other text elements are the "downloads" label and its shadow.
function parseBadgeCount(svg) {
  const matches = [...svg.matchAll(/<text[^>]*>([^<]+)<\/text>/g)].map(
    (x) => x[1],
  );
  const numeric = matches.filter((t) => /^[\d.]+[kKmMbB]?$/.test(t.trim()));
  return numeric.length ? numeric[numeric.length - 1].trim() : null;
}

async function fetchCount(pkg) {
  const url = `https://static.pepy.tech/badge/${pkg}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "personal-site-build" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${pkg}`);
  const count = parseBadgeCount(await res.text());
  if (!count) throw new Error(`Could not parse count for ${pkg}`);
  return count;
}

async function main() {
  let existing = {};
  try {
    existing = JSON.parse(await readFile(outFile, "utf8"));
  } catch {
    // First run or missing file — start empty.
  }

  const packages = await discoverPackages();
  const result = { ...existing };

  for (const pkg of packages) {
    try {
      const count = await fetchCount(pkg);
      result[pkg] = count;
      console.log(`downloads: ${pkg} -> ${count}`);
    } catch (err) {
      const kept = existing[pkg];
      console.warn(
        `downloads: ${pkg} failed (${err.message})` +
          (kept ? ` — keeping ${kept}` : " — no previous value"),
      );
    }
  }

  await writeFile(outFile, JSON.stringify(result, null, 2) + "\n");
}

main().catch((err) => {
  // Even an unexpected top-level error must not fail the build.
  console.warn(`downloads: skipped (${err.message})`);
});
