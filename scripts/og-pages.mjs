// Per-route social-preview metadata. Add an entry here (and drop a matching
// public/og/<slug>.png) whenever a blog or project should get its own Twitter/OG card.
// The og-prerender step writes dist/<route>/index.html with these tags so crawlers
// (which do not run JS) see page-specific previews on the static GitHub Pages host.
export const pages = [
  {
    route: "blog/slm-vulnerability-detection",
    title:
      "Can Small Language Models Deliver Frontier-Level Vulnerability Detection?",
    description:
      "Fine-tuning five on-device SLMs for C/C++ CWE detection and benchmarking them against a frontier model on synthetic and real-world code.",
    image: "/og/slm-vulnerability-detection.png",
  },
  {
    route: "blog/slms-and-the-future",
    title: "SLMs and the Future",
    description:
      "An analysis of Small Language Models, their optimization techniques, advantages, and why specialized models represent the future of sustainable AI.",
    image: "/og/slms-and-the-future.png",
  },
  {
    route: "projects/slm-vulnerability-detection",
    title: "On-Device SLMs for Vulnerability Detection",
    description:
      "Post-training on-device SLMs (reasoning-distillation SFT and DPO) for C/C++ CWE vulnerability detection, benchmarked against a frontier model.",
    image: "/og/slm-vulnerability-detection.png",
  },
];
