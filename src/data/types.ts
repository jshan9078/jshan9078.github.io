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
  time: number; // seconds
  tokens: number; // agent tokens
  calls: number; // browser CLI calls
  cost: number; // median USD per task
  ram: number; // peak RSS, MB
}

export interface Benchmarks {
  barTitle: string;
  repoUrl: string;
  buRows: BenchRow[];
  barCaption: string[];
  tableTitle: string;
  tableDesc?: string;
  webRows: WebBenchRow[];
  tableCaption: string[];
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
