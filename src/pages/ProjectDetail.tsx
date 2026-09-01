import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
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
  { model: "GPT-5.6 Luna", color: "#e88ab0" },
];
const THINK_ORDER = ["low", "medium", "high", "xhigh", "max"];
const famColor = (m: string) => WB_FAMILIES.find((f) => f.model === m)?.color ?? "#ffffff";
// Higher thinking level = stronger glow around the point (0 for low and n/a).
const glowT = (thinking: string) => {
  const i = THINK_ORDER.indexOf(thinking);
  return i <= 0 ? 0 : i / (THINK_ORDER.length - 1);
};

// DeepSWE-style efficiency curves: y = score, x = avg time or avg cost per task.
// One connected line per model family across its thinking levels; most efficient is top-left.
function WebBenchCurves({ rows, metric }: { rows: WebBenchRow[]; metric: "time" | "cost" }) {
  const W = 680;
  const H = 430;
  const ml = 56;
  const mr = 24;
  const mt = 30;
  const mb = 52;
  const plotW = W - ml - mr;
  const plotH = H - mt - mb;
  const bottom = mt + plotH;
  const xs = rows.map((r) => r[metric]);
  const xMax = metric === "time" ? Math.ceil(Math.max(...xs) / 30) * 30 : Math.ceil(Math.max(...xs) / 0.3) * 0.3;
  const yMin = 55;
  // DeepSWE-style reversed x-axis: smaller (better) values on the right, so most efficient is top-right.
  const sx = (v: number) => ml + (1 - v / xMax) * plotW;
  const sy = (v: number) => mt + (1 - (v - yMin) / (100 - yMin)) * plotH;
  const xTicks =
    metric === "time"
      ? Array.from({ length: xMax / 30 + 1 }, (_, i) => i * 30)
      : Array.from({ length: Math.round(xMax / 0.3) + 1 }, (_, i) => +(i * 0.3).toFixed(2));
  const yTicks = [60, 70, 80, 90, 100];
  const fmtX = (v: number) => (metric === "time" ? `${v}s` : `$${v.toFixed(2)}`);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ row: WebBenchRow; left: number; top: number } | null>(null);
  const at = (row: WebBenchRow) => (e: ReactMouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ row, left: e.clientX - rect.left, top: e.clientY - rect.top });
  };

  return (
    <div className="bench-curves" ref={wrapRef}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`WebBench score versus average ${metric} per task`}
      >
        <defs>
          <filter id={`dot-glow-${metric}`} x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {yTicks.map((v) => (
          <line key={`gy${v}`} x1={ml} y1={sy(v)} x2={ml + plotW} y2={sy(v)} className="bench-curves__grid" />
        ))}
        <line x1={ml} y1={bottom} x2={ml + plotW} y2={bottom} className="bench-curves__axis" />
        {xTicks.map((v) => (
          <text key={`x${v}`} x={sx(v)} y={bottom + 18} textAnchor="middle" className="bench-curves__tick">
            {fmtX(v)}
          </text>
        ))}
        {yTicks.map((v) => (
          <text key={`y${v}`} x={ml - 10} y={sy(v) + 4} textAnchor="end" className="bench-curves__tick">
            {v}%
          </text>
        ))}
        <text x={ml + plotW / 2} y={H - 6} textAnchor="middle" className="bench-curves__axis-title">
          {metric === "time" ? "Median time per task" : "Median cost per task"}
        </text>
        <text x={ml + plotW - 8} y={mt + 4} textAnchor="end" className="bench-curves__ideal-label">
          most efficient
        </text>
        {WB_FAMILIES.map((f) => {
          const pts = rows
            .filter((r) => r.model === f.model)
            .sort((a, b) => THINK_ORDER.indexOf(a.thinking) - THINK_ORDER.indexOf(b.thinking));
          if (!pts.length) return null;
          const path = pts.map((r, i) => `${i ? "L" : "M"}${sx(r[metric])},${sy(r.score)}`).join(" ");
          // DeepSWE labeling: ONE two-line label per family (name + that endpoint's effort tag),
          // anchored at whichever curve endpoint is most isolated from other families' points,
          // offset outward into whitespace. All other dots stay unlabeled; hover has the details.
          // Anchor at the highest thinking endpoint so the label reads the same on both charts.
          const anchor = pts[pts.length - 1];
          const ax = sx(anchor[metric]);
          const ay = sy(anchor.score);
          const midX = (Math.max(...pts.map((r) => sx(r[metric]))) + Math.min(...pts.map((r) => sx(r[metric])))) / 2;
          const dir = ax <= midX ? -1 : 1; // push the label outward, away from the curve body
          const lx = Math.max(ml + 4, Math.min(ax + dir * 14, ml + plotW - 4));
          const ly = Math.max(mt + 12, ay - 14);
          const anchorSide = dir > 0 ? "start" : "end";
          return (
            <g key={f.model}>
              <path d={path} fill="none" stroke={f.color} strokeWidth={1.1} strokeOpacity={0.7} />
              {pts.map((r) => {
                const t = glowT(r.thinking);
                return (
                  <g key={r.thinking}>
                    {t > 0 && (
                      <circle
                        cx={sx(r[metric])}
                        cy={sy(r.score)}
                        r={4 + 5 * t}
                        fill={f.color}
                        opacity={0.25 + 0.55 * t}
                        filter={`url(#dot-glow-${metric})`}
                        pointerEvents="none"
                      />
                    )}
                    <circle
                      cx={sx(r[metric])}
                      cy={sy(r.score)}
                      r={3.5}
                      fill={f.color}
                      stroke="var(--bg)"
                      strokeWidth={1}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={at(r)}
                      onMouseMove={at(r)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </g>
                );
              })}
              <text x={lx} y={ly} textAnchor={anchorSide} className="bench-curves__fam" fill={f.color}>
                {f.model}
              </text>
              {anchor.thinking !== "n/a" && (
                <text x={lx} y={ly + 12} textAnchor={anchorSide} className="bench-curves__eff" fill={f.color}>
                  {anchor.thinking.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover && (
        <div
          className="bench-scatter__tip"
          style={{
            left: hover.left,
            top: hover.top,
            transform: hover.top < 90 ? "translate(-50%, 16px)" : "translate(-50%, calc(-100% - 14px))",
          }}
        >
          <span className="bench-scatter__tip-model">{hover.row.model}</span>
          {hover.row.thinking !== "n/a" && (
            <span className="bench-scatter__tip-row">{hover.row.thinking} thinking</span>
          )}
          <span className="bench-scatter__tip-row">{hover.row.harness}</span>
          <span className="bench-scatter__tip-meta">
            {hover.row.score}% · {hover.row.time}s · ${hover.row.cost.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

// DeepSWE-style compact leaderboard table with Best / All effort levels toggle.
function WebBenchConfigs({ rows }: { rows: WebBenchRow[] }) {
  const [mode, setMode] = useState<"best" | "all">("best");
  const shown =
    mode === "all"
      ? [...rows]
      : WB_FAMILIES.map((f) => {
          const fam = rows.filter((r) => r.model === f.model);
          return fam.sort((a, b) => b.score - a.score || a.cost - b.cost)[0];
        }).filter(Boolean);
  const sorted = shown.sort((a, b) => b.score - a.score || a.cost - b.cost);
  const ci = (p: number) => 1.96 * Math.sqrt(((p / 100) * (1 - p / 100)) / 45) * 100;
  return (
    <div className="bench-table">
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
      <div className="bench-table__scroll">
        <div className="bench-table__head">
          <span>Model</span>
          <span />
          <span className="bench-table__num">Pass@1</span>
          <span className="bench-table__num">Med cost</span>
          <span className="bench-table__num">Out tok</span>
          <span className="bench-table__num">Steps</span>
          <span className="bench-table__num">Time</span>
        </div>
        {sorted.map((r) => {
          const e = ci(r.score);
          return (
            <div key={`${r.model}-${r.thinking}`} className="bench-table__row" title={r.harness}>
              <span className="bench-table__model">
                <i style={{ background: famColor(r.model) }} />
                {r.model}
                {r.thinking !== "n/a" && <em>[{r.thinking}]</em>}
              </span>
              <span className="bench-table__barcell">
                <span className="bench-table__bar">
                  <span
                    className="bench-table__fill"
                    style={{ width: `${r.score}%`, background: famColor(r.model) }}
                  />
                  <span
                    className="bench-table__ci"
                    style={{ left: `${Math.max(0, r.score - e)}%`, width: `${Math.min(100, r.score + e) - Math.max(0, r.score - e)}%` }}
                  />
                </span>
              </span>
              <span className="bench-table__num">
                <b>{r.score.toFixed(1)}%</b> <small>&plusmn;{e.toFixed(0)}%</small>
              </span>
              <span className="bench-table__num">${r.cost.toFixed(2)}</span>
              <span className="bench-table__num">{(r.outTok / 1000).toFixed(1)}k</span>
              <span className="bench-table__num">{Math.round(r.steps)}</span>
              <span className="bench-table__num">{Math.round(r.time)}s</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = ProjectsData.items.find((p) => p.slug === slug);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [benchView, setBenchView] = useState<"3d" | "2d">("3d");

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
          <div className="bench-view">
            <div className="bench-view__toggle" role="tablist" aria-label="Chart view">
              <button
                type="button"
                className={benchView === "3d" ? "bench-view__btn bench-view__btn--on" : "bench-view__btn"}
                onClick={() => setBenchView("3d")}
              >
                3D
              </button>
              <button
                type="button"
                className={benchView === "2d" ? "bench-view__btn bench-view__btn--on" : "bench-view__btn"}
                onClick={() => setBenchView("2d")}
              >
                2D
              </button>
            </div>
            <span className="bench-view__note">
              Each point is a model + harness configuration: Claude models run in Claude Code, Gemini 3.7 Flash in Antigravity. A stronger glow marks a higher thinking level.
            </span>
          </div>
          {benchView === "3d" ? (
            <WebBench3D rows={project.benchmarks.webRows} />
          ) : (
            <>
              <WebBenchCurves rows={project.benchmarks.webRows} metric="time" />
              <WebBenchCurves rows={project.benchmarks.webRows} metric="cost" />
            </>
          )}
          <h3 className="project-detail__section-title bench-configs-title">Configurations</h3>
          <WebBenchConfigs rows={project.benchmarks.webRows} />
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
