import type { Project } from "./types";
import generated from "./downloads.generated.json";

// Live download totals fetched at build time by scripts/fetch-downloads.mjs.
const liveDownloads = generated as Record<string, string>;

// Returns the live download count for a project, falling back to the hardcoded
// `downloads` value if no live figure is available (e.g. the build-time fetch
// failed or the project isn't on pepy).
export function getDownloads(project: Project): string | undefined {
  const pkg = project.downloadsUrl?.match(
    /pepy\.tech\/projects\/([^/?#]+)/,
  )?.[1];
  return (pkg && liveDownloads[pkg]) || project.downloads;
}
