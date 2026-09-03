export interface Link {
  to: string;
  label: string;
  newTab?: boolean;
}

export interface Screenshot {
  src: string;
  label: string;
}

export interface Skill {
  slug: string;
  name: string;
  logo: { light: string; dark: string };
  color: string;
}

export interface BenchRow {
  model: string;
  harness: string;
  browser: string;
  value: number;
  display: string;
  time: string;
  cost: string;
  highlight?: boolean;
}

export interface WebBenchRow {
  model: string;
  thinking: string;
  harness: string;
  score: number; // % of the 45 tasks passed (pass@1)
  time: number; // average seconds per task
  cost: number; // average USD per task
  outTok: number; // average output tokens per task
  steps: number; // average browser CLI calls per task
  passes?: number; // tasks passed (drilldown)
  tasks?: number; // tasks attempted (drilldown)
  wallTotal?: number; // median end-to-end seconds per task, including model latency (drilldown)
  reasonTok?: number; // median reasoning tokens per task (drilldown)
}

export interface Benchmarks {
  // BU-bench (accuracy) section — optional so a project can render only the WebBench section
  barTitle?: string;
  repoUrl?: string;
  buRows?: BenchRow[];
  barCaption?: string[];
  // WebBench (efficiency) section — optional so a project can render only the BU section
  tableTitle?: string;
  tableDesc?: string;
  webRows?: WebBenchRow[];
  tableCaption?: string[];
}

export interface Project {
  slug: string;
  name: string;
  logo: { light: string; dark: string };
  shortDescription: string;
  description: string;
  links: Link[];
  color: string;
  period: { from: Date; to?: Date };
  type: string;
  skills: Skill[];
  screenshots?: Screenshot[];
  pdf?: string;
  install?: string;
  installPip?: string;
  downloads?: string;
  downloadsUrl?: string;
  benchmarks?: Benchmarks;
  techMetrics?: { value: string; label: string; note: string }[];
}

export interface Experience extends Project {
  company: string;
  location?: string;
  contract: string;
  highlights?: string[];
}
