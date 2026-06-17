import slmsContent from '../../static/blogs/slms-and-the-future.md?raw';

export interface Blog {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const blogs: Blog[] = [
  {
    slug: 'slms-and-the-future',
    title: 'SLMs and the Future',
    date: '2026-06-17',
    excerpt: 'An analysis of Small Language Models (SLMs), their optimization techniques, advantages, and why specialized models represent the future of sustainable AI.',
    content: slmsContent,
  },
];
