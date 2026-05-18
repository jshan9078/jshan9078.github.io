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
}

export interface Experience extends Project {
  company: string;
  location?: string;
  contract: string;
  highlights?: string[];
}
