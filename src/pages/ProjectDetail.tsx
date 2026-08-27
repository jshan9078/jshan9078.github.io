import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ProjectsData from "@/data/projects";
import type { WebBenchRow } from "@/data/types";
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

type MarkerShape = "circle" | "square" | "triangle" | "diamond";

const WB_MODELS: { model: string; shape: MarkerShape }[] = [
  { model: "Opus 5", shape: "circle" },
  { model: "Sonnet 5", shape: "square" },
  { model: "Haiku 4.5", shape: "triangle" },
  { model: "Gemini 3.7 Flash", shape: "diamond" },
];

// Shape encodes model; opacity encodes thinking level (more thinking = more intense).
const THINK_ORDER = ["low", "medium", "high", "xhigh", "max"];
const THINK_OPACITY: Record<string, number> = {
  low: 0.32,
  medium: 0.5,
  high: 0.68,
  xhigh: 0.84,
  max: 1,
};

type MarkerHandlers = {
  onMouseEnter?: (e: ReactMouseEvent) => void;
  onMouseMove?: (e: ReactMouseEvent) => void;
  onMouseLeave?: (e: ReactMouseEvent) => void;
};

const Marker = ({
  shape,
  x,
  y,
  fill = "#ffffff",
  opacity = 1,
  r = 5.5,
  interactive,
  handlers,
}: {
  shape: MarkerShape;
  x: number;
  y: number;
  fill?: string;
  opacity?: number;
  r?: number;
  interactive?: boolean;
  handlers?: MarkerHandlers;
}) => {
  const common = {
    fill,
    fillOpacity: opacity,
    stroke: "var(--bg)",
    strokeWidth: 1.5,
    style: interactive ? { cursor: "pointer" } : undefined,
    ...handlers,
  };
  if (shape === "square") {
    const s = r * 1.8;
    return <rect x={x - s / 2} y={y - s / 2} width={s} height={s} {...common} />;
  }
  if (shape === "triangle") {
    const s = r * 1.5;
    return <polygon points={`${x},${y - s} ${x - s},${y + s * 0.85} ${x + s},${y + s * 0.85}`} {...common} />;
  }
  if (shape === "diamond") {
    const s = r * 1.45;
    return <polygon points={`${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`} {...common} />;
  }
  return <circle cx={x} cy={y} r={r} {...common} />;
};

const median = (arr: number[]) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function WebBenchScatter({ rows }: { rows: WebBenchRow[] }) {
  const W = 680;
  const H = 440;
  const ml = 64;
  const mr = 20;
  const mt = 20;
  const mb = 56;
  const plotW = W - ml - mr;
  const plotH = H - mt - mb;
  const bottom = mt + plotH;

  const times = rows.map((r) => r.time);
  const costs = rows.map((r) => r.cost);
  const xMax = Math.ceil(Math.max(...times) / 30) * 30;
  const yMax = Math.ceil(Math.max(...costs) / 0.3) * 0.3;
  const sx = (t: number) => ml + (t / xMax) * plotW;
  const sy = (c: number) => mt + (1 - c / yMax) * plotH;
  const medT = median(times);
  const medC = median(costs);

  const xTicks = Array.from({ length: xMax / 30 + 1 }, (_, i) => i * 30);
  const yTicks = Array.from({ length: Math.round(yMax / 0.3) + 1 }, (_, i) => +(i * 0.3).toFixed(2));
  const shapeFor = (m: string) => WB_MODELS.find((x) => x.model === m) ?? WB_MODELS[0];

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ row: WebBenchRow; left: number; top: number } | null>(null);
  const at = (row: WebBenchRow) => (e: ReactMouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ row, left: e.clientX - rect.left, top: e.clientY - rect.top });
  };

  return (
    <div className="bench-scatter" ref={wrapRef}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="WebBench cost versus time per configuration">
        {/* ideal quadrant: low time, low cost (bottom-left) */}
        <rect x={ml} y={sy(medC)} width={sx(medT) - ml} height={bottom - sy(medC)} className="bench-scatter__ideal" />
        <text x={ml + 8} y={bottom - 8} className="bench-scatter__ideal-label">
          ideal · low time, low cost
        </text>

        {/* quadrant medians */}
        <line x1={sx(medT)} y1={mt} x2={sx(medT)} y2={bottom} className="bench-scatter__div" />
        <line x1={ml} y1={sy(medC)} x2={ml + plotW} y2={sy(medC)} className="bench-scatter__div" />

        {/* axes */}
        <line x1={ml} y1={bottom} x2={ml + plotW} y2={bottom} className="bench-scatter__axis" />
        <line x1={ml} y1={mt} x2={ml} y2={bottom} className="bench-scatter__axis" />

        {/* ticks */}
        {xTicks.map((t) => (
          <text key={`x${t}`} x={sx(t)} y={bottom + 18} textAnchor="middle" className="bench-scatter__tick">
            {t}
          </text>
        ))}
        {yTicks.map((c) => (
          <text key={`y${c}`} x={ml - 10} y={sy(c) + 4} textAnchor="end" className="bench-scatter__tick">
            ${c.toFixed(2)}
          </text>
        ))}

        {/* axis titles */}
        <text x={ml + plotW / 2} y={H - 8} textAnchor="middle" className="bench-scatter__axis-title">
          Time / task (s)
        </text>
        <text
          transform={`translate(16 ${mt + plotH / 2}) rotate(-90)`}
          textAnchor="middle"
          className="bench-scatter__axis-title"
        >
          Cost / task ($)
        </text>

        {/* points: shape = model, opacity = thinking level */}
        {rows.map((r, i) => {
          const s = shapeFor(r.model);
          return (
            <Marker
              key={i}
              shape={s.shape}
              opacity={THINK_OPACITY[r.thinking] ?? 1}
              x={sx(r.time)}
              y={sy(r.cost)}
              interactive
              handlers={{ onMouseEnter: at(r), onMouseMove: at(r), onMouseLeave: () => setHover(null) }}
            />
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
          <span className="bench-scatter__tip-row">{hover.row.thinking} thinking</span>
          <span className="bench-scatter__tip-row">{hover.row.harness}</span>
          <span className="bench-scatter__tip-meta">
            {hover.row.time}s · ${hover.row.cost.toFixed(2)}
          </span>
        </div>
      )}
      <div className="bench-scatter__legend">
        <div className="bench-legend-group">
          {WB_MODELS.map((m) => (
            <span key={m.model} className="bench-legend-item">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <Marker shape={m.shape} x={8} y={8} r={5} />
              </svg>
              {m.model}
            </span>
          ))}
        </div>
        <div className="bench-legend-group">
          <span className="bench-legend-cap">Thinking</span>
          <span className="bench-legend-item">low</span>
          <span className="bench-legend-ramp">
            {THINK_ORDER.map((t) => (
              <svg key={t} viewBox="0 0 16 16" aria-hidden="true">
                <Marker shape="circle" opacity={THINK_OPACITY[t]} x={8} y={8} r={5} />
              </svg>
            ))}
          </span>
          <span className="bench-legend-item">max</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = ProjectsData.items.find((p) => p.slug === slug);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("time");
  const [sortDir, setSortDir] = useState<number>(1);

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

  const THINK_RANK: Record<string, number> = { low: 0, medium: 1, high: 2, xhigh: 3, max: 4 };
  const BENCH_COLS: {
    key: string;
    label: string;
    rank?: boolean;
    fmt?: (v: number) => string;
  }[] = [
    { key: "model", label: "Model" },
    { key: "thinking", label: "Thinking", rank: true },
    { key: "harness", label: "Harness" },
    { key: "time", label: "Time", fmt: (v) => `${v}s` },
    { key: "tokens", label: "Tokens", fmt: (v) => `${Math.round(v / 1000)}k` },
    { key: "calls", label: "Calls", fmt: (v) => `${v}` },
    { key: "cost", label: "Cost / task", fmt: (v) => `$${v.toFixed(2)}` },
  ];
  const sortedRows = project.benchmarks?.webRows
    ? [...project.benchmarks.webRows].sort((a, b) => {
        const col = BENCH_COLS.find((c) => c.key === sortKey);
        let x: string | number = (a as unknown as Record<string, string | number>)[sortKey];
        let y: string | number = (b as unknown as Record<string, string | number>)[sortKey];
        if (col?.rank) {
          x = THINK_RANK[a.thinking];
          y = THINK_RANK[b.thinking];
        }
        if (typeof x === "number" && typeof y === "number") return sortDir * (x - y);
        return sortDir * String(x).localeCompare(String(y));
      })
    : [];
  const sortBy = (key: string) => {
    if (key === sortKey) setSortDir((d) => -d);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

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
                  a: ({ href, children }) =>
                    href && href.startsWith("/") ? (
                      <Link className="bench-desc__link" to={href}>
                        {children}
                      </Link>
                    ) : (
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
          <WebBenchScatter rows={project.benchmarks.webRows} />
          <div className="bench-table-wrap">
            <table className="bench-table">
              <thead>
                <tr>
                  {BENCH_COLS.map((c) => (
                    <th
                      key={c.key}
                      className={`bench-th${sortKey === c.key ? " bench-th--on" : ""}`}
                      onClick={() => sortBy(c.key)}
                    >
                      {c.label}
                      <span className="bench-th__arr">
                        {sortKey === c.key ? (sortDir > 0 ? " ↑" : " ↓") : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
                  <tr key={i}>
                    {BENCH_COLS.map((c) => {
                      const raw = (row as unknown as Record<string, string | number>)[c.key];
                      return (
                        <td key={c.key}>
                          {c.fmt ? c.fmt(raw as number) : raw}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
