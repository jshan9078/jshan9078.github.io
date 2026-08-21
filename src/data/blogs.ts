import slmsContent from '../../static/blogs/slms-and-the-future.md?raw';
import cweSlmContent from '../../static/blogs/slm-vulnerability-detection.md?raw';

export interface Blog {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const blogs: Blog[] = [
  {
    slug: 'slm-vulnerability-detection',
    title: 'Can Small Language Models Deliver Frontier-Level Vulnerability Detection?',
    date: '2026-08-12',
    excerpt: 'I fine-tune five on-device SLMs for C/C++ CWE detection and benchmark them against a frontier model on synthetic and real-world code, finding where small models reach parity, where they beat the frontier, and where everything hits a wall.',
    content: cweSlmContent,
  },
  {
    slug: 'slms-and-the-future',
    title: 'SLMs and the Future',
    date: '2026-06-17',
    excerpt: 'An analysis of Small Language Models (SLMs), their optimization techniques, advantages, and why specialized models represent the future of sustainable AI.',
    content: slmsContent,
  },
];
