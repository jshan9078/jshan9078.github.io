import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ProjectsData from "@/data/projects";
import type { WebBenchRow } from "@/data/types";
import WebBench3D from "./WebBench3D";
import { getDownloads } from "@/data/downloads";

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
  </svg>
);

const WB_FAMILIES: { model: string; color: string }[] = [
  { model: "Opus 5", color: "#e0895a" },
  { model: "Sonnet 5", color: "#8ab4e8" },
  { model: "Haiku 4.5", color: "#c9a0e8" },
  { model: "Gemini 3.7 Flash", color: "#7ec9a3" },
  { model: "Gemini 3.8 Flash", color: "#4fa889" },
  { model: "GPT-5.6 Luna", color: "#e88ab0" },
  { model: "Muse Spark 1.2", color: "#e8d47a" },
  { model: "Muse Spark 1.3", color: "#66d1e0" },
];
const THINK_ORDER = ["low", "medium", "high", "xhigh", "max", "ultra"];
const famColor = (m: string) => WB_FAMILIES.find((f) => f.model === m)?.color ?? "#ffffff";
// Higher thinking level = stronger glow around the point (0 for low and n/a).
const glowT = (thinking: string) => {
  const i = THINK_ORDER.indexOf(thinking);
  return i <= 0 ? 0 : i / (THINK_ORDER.length - 1);
};

// Family include / exclude menu shared by the 3D chart and the configuration charts.
function WebBenchFilter({ rows, hidden, onToggle }: { rows: WebBenchRow[]; hidden: Set<string>; onToggle: (m: string) => void }) {
  const fams = WB_FAMILIES.filter((f) => rows.some((r) => r.model === f.model));
  return (
    <div className="bench-filter" role="group" aria-label="Models shown">
      <span className="bench-filter__label">Models</span>
      {fams.map((f) => {
        const on = !hidden.has(f.model);
        return (
          <button
            key={f.model}
            type="button"
            className={on ? "bench-filter__chip bench-filter__chip--on" : "bench-filter__chip"}
            aria-pressed={on}
            onClick={() => onToggle(f.model)}
          >
            <i style={{ background: f.color }} />
            {f.model}
          </button>
        );
      })}
    </div>
  );
}

const EFFORT_SHORT: Record<string, string> = { low: "low", medium: "med", high: "high", xhigh: "xhigh", max: "max", ultra: "ultra" };
type WBMetric = "cost" | "time" | "score";
const WB_CHARTS: { key: WBMetric; title: string; order: string; floor: number; fmt: (v: number) => string }[] = [
  { key: "cost", title: "Cost per task", order: "lowest first", floor: 0, fmt: (v) => `$${v < 0.1 ? v.toFixed(3) : v.toFixed(2)}` },
  { key: "time", title: "Browser-active time", order: "fastest first", floor: 0, fmt: (v) => `${Math.round(v)}s` },
  { key: "score", title: "Accuracy", order: "highest first", floor: 60, fmt: (v) => `${v.toFixed(1)}%` },
];

function WebBenchBarChart({
  rows, chart, hover, setHover,
}: {
  rows: WebBenchRow[];
  chart: (typeof WB_CHARTS)[number];
  hover: WebBenchRow | null;
  setHover: (r: WebBenchRow | null, e?: React.MouseEvent) => void;
}) {
  const base = (a: WebBenchRow, b: WebBenchRow) => b.score - a.score || a.time - b.time || a.cost - b.cost;
  const sorted = [...rows].sort((a, b) =>
    chart.key === "score" ? b.score - a.score || base(a, b) : a[chart.key] - b[chart.key] || base(a, b),
  );
  const max = Math.max(...rows.map((r) => r[chart.key]), chart.floor + 1e-9);
  const h = (v: number) => Math.max(2, ((v - chart.floor) / (max - chart.floor)) * 100);
  return (
    <div className="bench-bars__chart">
      <div className="bench-bars__title">
        {chart.title} <em>&middot; {chart.order}</em>
      </div>
      <div className={"bench-bars__plot" + (sorted.length > 14 ? " bench-bars__plot--dense" : "")}>
        {sorted.map((r) => {
          const key = `${r.model}-${r.thinking}`;
          const on = hover && hover.model === r.model && hover.thinking === r.thinking;
          return (
            <div
              key={key}
              className={"bench-bar" + (on ? " bench-bar--on" : "") + (hover && !on ? " bench-bar--dim" : "")}
              onMouseEnter={(e) => setHover(r, e)}
              onMouseMove={(e) => setHover(r, e)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="bench-bar__val">{chart.fmt(r[chart.key])}</span>
              <span className="bench-bar__col">
                <span className="bench-bar__fill" style={{ height: `${h(r[chart.key])}%`, background: famColor(r.model) }} />
              </span>
              <span className="bench-bar__lab">{EFFORT_SHORT[r.thinking] ?? ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Three ranked bar charts (cost, speed, accuracy) with a shared hover drilldown.
function WebBenchConfigs({ rows }: { rows: WebBenchRow[] }) {
  const [mode, setMode] = useState<"best" | "all">("best");
  const [hover, setHoverState] = useState<{ row: WebBenchRow; left: number; top: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const base = (a: WebBenchRow, b: WebBenchRow) => b.score - a.score || a.time - b.time || a.cost - b.cost;
  const shown =
    mode === "all"
      ? [...rows]
      : WB_FAMILIES.map((f) => rows.filter((r) => r.model === f.model).sort(base)[0]).filter(Boolean);
  const setHover = (r: WebBenchRow | null, e?: React.MouseEvent) => {
    if (!r || !e || !wrapRef.current) return setHoverState(null);
    const box = wrapRef.current.getBoundingClientRect();
    setHoverState({ row: r, left: e.clientX - box.left, top: e.clientY - box.top });
  };
  const hr = hover?.row ?? null;
  const flipX = hover && wrapRef.current ? hover.left > wrapRef.current.clientWidth * 0.62 : false;
  return (
    <div className="bench-bars" ref={wrapRef}>
      <div className="bench-view__toggle" role="tablist" aria-label="Configuration filter">
        <button
          type="button"
          className={mode === "best" ? "bench-view__btn bench-view__btn--on" : "bench-view__btn"}
          onClick={() => setMode("best")}
        >
          Best
        </button>
        <button
          type="button"
          className={mode === "all" ? "bench-view__btn bench-view__btn--on" : "bench-view__btn"}
          onClick={() => setMode("all")}
        >
          All effort levels
        </button>
      </div>
      {shown.length === 0 ? (
        <div className="bench-bars__empty">No models selected.</div>
      ) : (
        <div className="bench-bars__grid">
          {WB_CHARTS.map((c) => (
            <WebBenchBarChart key={c.key} rows={shown} chart={c} hover={hr} setHover={setHover} />
          ))}
        </div>
      )}
      {hover && (
        <div
          className="bench-bars__tip"
          style={{ left: hover.left + (flipX ? -14 : 14), top: hover.top + 14, transform: flipX ? "translateX(-100%)" : undefined }}
        >
          <b>
            <i style={{ background: famColor(hover.row.model) }} />
            {hover.row.model}
            {hover.row.thinking !== "n/a" && <em> [{hover.row.thinking}]</em>}
          </b>
          <span>{hover.row.harness}</span>
          <div className="bench-bars__tipgrid">
            <span>Pass@1</span>
            <b>
              {hover.row.score.toFixed(1)}%
              {hover.row.passes != null && <small> {hover.row.passes}/{hover.row.tasks}</small>}
            </b>
            <span>Median cost</span><b>${hover.row.cost.toFixed(3)}</b>
            <span>Browser-active time</span><b>{hover.row.time.toFixed(1)}s</b>
            {hover.row.wallTotal != null && (<><span>End-to-end time</span><b>{hover.row.wallTotal.toFixed(1)}s</b></>)}
            <span>Output tokens</span><b>{Math.round(hover.row.outTok).toLocaleString()}</b>
            {hover.row.reasonTok != null && (<><span>Reasoning tokens</span><b>{Math.round(hover.row.reasonTok).toLocaleString()}</b></>)}
            <span>Browser steps</span><b>{Math.round(hover.row.steps)}</b>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = ProjectsData.items.find((p) => p.slug === slug);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [wbHidden, setWbHidden] = useState<Set<string>>(() => new Set(["Gemini 3.7 Flash", "Muse Spark 1.2"]));
  const toggleWbFamily = (m: string) =>
    setWbHidden((h) => { const n = new Set(h); if (n.has(m)) n.delete(m); else n.add(m); return n; });
  const wbRows = useMemo(
    () => (project?.benchmarks?.webRows ?? []).filter((r) => !wbHidden.has(r.model)),
    [project, wbHidden],
  );

  const renderInstall = (cmd: string) => (
    <div className="project-detail__install" key={cmd}>
      <code className="project-detail__install-cmd">{cmd}</code>
      <button
        className="project-detail__install-copy"
        onClick={() => {
          navigator.clipboard?.writeText(cmd);
          setCopiedCmd(cmd);
          setTimeout(() => setCopiedCmd((c) => (c === cmd ? null : c)), 1500);
        }}
      >
        {copiedCmd === cmd ? "Copied" : "Copy"}
      </button>
    </div>
  );

  const scrollToProjects = () => {
    navigate("/#projects");
  };

  if (!project) {
    return (
      <div className="project-detail">
        <button onClick={scrollToProjects} className="project-detail__back">
          <ArrowLeftIcon />
          <span>Back to Projects</span>
        </button>
        <div className="project-detail__not-found">
          Project not found.
        </div>
      </div>
    );
  }

  // With benchmarks, pull the "Technical Details" block out of the description and render it last.
  const splitIdx = project.benchmarks
    ? project.description.indexOf("### Technical Details")
    : -1;
  const introMd = splitIdx >= 0 ? project.description.slice(0, splitIdx).trim() : project.description;
  const techMd = splitIdx >= 0 ? project.description.slice(splitIdx).trim() : "";
  const techNl = techMd.indexOf("\n");
  const techHeading = techNl >= 0 ? techMd.slice(0, techNl) : techMd;
  const techBody = techNl >= 0 ? techMd.slice(techNl).trim() : "";

  return (
    <motion.div
      className="project-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="project-detail__nav-row">
        <button onClick={scrollToProjects} className="project-detail__back">
          <ArrowLeftIcon />
          <span>Back to Projects</span>
        </button>
        <div className="project-detail__links">
          {project.downloads && project.downloadsUrl && (
            <a
              className="download-pill"
              href={project.downloadsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              {getDownloads(project)} downloads
            </a>
          )}
          {project.links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__link"
            >
              {link.label}
              <ExternalLinkIcon />
            </a>
          ))}
          {project.pdf && (
            <a
              href={project.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__link"
            >
              Technical Paper
              <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>

      <div className="project-detail__header">
        <h1 className="project-detail__name">{project.name}</h1>
        <div className="project-detail__period">{project.type}</div>
      </div>

      <div className="project-detail__skills">
        {project.skills.slice(0, 6).map((skill) => (
          <span key={skill.slug} className="project-detail__skill">
            {skill.name}
          </span>
        ))}
      </div>

      {project.install && (
        <div className="project-detail__installs">
          {renderInstall(project.install)}
          {project.installPip && (
            <>
              <span className="project-detail__install-or">or</span>
              {renderInstall(project.installPip)}
            </>
          )}
        </div>
      )}

      <div className="project-detail__description">
        <ReactMarkdown>{introMd}</ReactMarkdown>
      </div>

      {project.benchmarks && (
        <div className="project-detail__bench">
          {project.benchmarks.buRows && (
          <>
          <h3 className="project-detail__section-title bench-bu-title">
            {project.benchmarks.barTitle}
            <a
              className="bench-repo"
              href={project.benchmarks.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Benchmark repository on GitHub"
            >
              <GitHubIcon />
            </a>
          </h3>
          <div className="bench-table-wrap">
            <table className="bench-table bench-bu">
              <thead>
                <tr>
                  <th>Harness</th>
                  <th>Browser Tool</th>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>Time / task</th>
                  <th>Cost / task</th>
                </tr>
              </thead>
              <tbody>
                {project.benchmarks.buRows.map((r, i) => (
                  <tr key={i} className={r.highlight ? "bench-row--hl" : ""}>
                    <td>{r.harness}</td>
                    <td>{r.browser}</td>
                    <td>{r.model}</td>
                    <td className="bu-acc">
                      <span className="bu-acc__bar">
                        <span className="bu-acc__fill" style={{ width: `${r.value}%` }} />
                      </span>
                      <span className="bu-acc__val">{r.display}</span>
                    </td>
                    <td>{r.time}</td>
                    <td>{r.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bench-caption">
            {project.benchmarks.barCaption?.map((line, i) => (
              <span key={i} className="bench-caption__line">{line}</span>
            ))}
          </div>
          </>
          )}

          {project.benchmarks.webRows && (
          <>
          <h3 className="project-detail__section-title bench-table-title">
            {project.benchmarks.tableTitle}
          </h3>
          {project.benchmarks.tableDesc && (
            <div className="bench-desc">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a
                      className="bench-desc__link"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {project.benchmarks.tableDesc}
              </ReactMarkdown>
            </div>
          )}
          <WebBenchFilter rows={project.benchmarks.webRows} hidden={wbHidden} onToggle={toggleWbFamily} />
          <WebBench3D rows={wbRows} />
          <h3 className="project-detail__section-title bench-configs-title">Configurations</h3>
          <WebBenchConfigs rows={wbRows} />
          <div className="bench-caption">
            {project.benchmarks.tableCaption?.map((line, i) => (
              <span key={i} className="bench-caption__line">{line}</span>
            ))}
          </div>
          </>
          )}
        </div>
      )}

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="project-detail__screenshots">
          <h3 className="project-detail__section-title">Screenshots</h3>
          <div className="project-detail__screenshots-grid">
            {project.screenshots.map((screenshot, index) => (
              <div key={index} className="project-detail__screenshot">
                <img src={screenshot.src} alt={screenshot.label} />
                <div className="project-detail__screenshot-label">{screenshot.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.pdf && (
        <div className="project-detail__pdf">
          <h3 className="project-detail__section-title">Technical Paper</h3>
          <div className="project-detail__pdf-viewer">
            <iframe
              src={`${project.pdf}#toolbar=0`}
              title={`${project.name} Technical Paper`}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}

      {techMd && (
        <div className="project-detail__description project-detail__tech">
          <ReactMarkdown>{techHeading}</ReactMarkdown>
          {project.techMetrics && project.techMetrics.length > 0 && (
            <div className="tech-metrics">
              {project.techMetrics.map((m) => (
                <div key={m.label} className="tech-metric">
                  <span className="tech-metric__value">{m.value}</span>
                  <span className="tech-metric__label">{m.label}</span>
                  <span className="tech-metric__note">{m.note}</span>
                </div>
              ))}
            </div>
          )}
          <ReactMarkdown>{techBody}</ReactMarkdown>
        </div>
      )}
    </motion.div>
  );
}

export default ProjectDetail;
