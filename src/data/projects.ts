import Assets from "./assets";
import { getSkills } from "./skills";
import type { Project } from "./types";

export type { Project } from "./types";

const url = (file: string) => `/logos/${file}`;

// Shared WebBench data, rendered on both the browser-automation-cli page and the WebBench project.
const WEBBENCH = {
  tableTitle: "WebBench",
  tableDesc:
    "44 tasks built around real-world user interactions on live sites (Amazon, eBay, Google Flights, OpenStreetMap, YouTube, Gmail, Spotify, and more), from multi-hop reads to signed-in account actions and canvas work. Configurations span Claude (Claude Code), Gemini (Antigravity), GPT-5.6 (Codex CLI), and Muse Spark (Muse Code). Each configuration gets only [browser-automation-cli](/projects/browser-cli) and a [skill](https://github.com/jshan9078/browser-automation-cli/blob/main/SKILL.md) explaining how to use it; every run is judged from captured evidence at pass@1. [See all tasks](https://github.com/jshan9078/web-bench/tree/main/tasks).",
  webRows: [
    { model: "Haiku 4.5", thinking: "n/a", harness: "Claude Code", score: 69.5, time: 51.0, cost: 0.198, outTok: 3896, steps: 14 },
    { model: "Gemini 3.7 Flash", thinking: "low", harness: "Antigravity", score: 95.5, time: 26.0, cost: 0.117, outTok: 1810, steps: 16 },
    { model: "Gemini 3.7 Flash", thinking: "medium", harness: "Antigravity", score: 100.0, time: 44.6, cost: 0.254, outTok: 11341, steps: 22 },
    { model: "Gemini 3.7 Flash", thinking: "high", harness: "Antigravity", score: 97.7, time: 34.6, cost: 0.187, outTok: 8939, steps: 20 },
    { model: "GPT-5.6 Luna", thinking: "low", harness: "Codex CLI", score: 83.7, time: 30.0, cost: 0.014, outTok: 1380, steps: 10 },
    { model: "GPT-5.6 Luna", thinking: "medium", harness: "Codex CLI", score: 88.4, time: 40.2, cost: 0.016, outTok: 1734, steps: 12 },
    { model: "GPT-5.6 Luna", thinking: "high", harness: "Codex CLI", score: 84.1, time: 49.3, cost: 0.022, outTok: 2962, steps: 16 },
    { model: "GPT-5.6 Luna", thinking: "xhigh", harness: "Codex CLI", score: 95.5, time: 65.5, cost: 0.023, outTok: 3356, steps: 16 },
    { model: "GPT-5.6 Luna", thinking: "max", harness: "Codex CLI", score: 93.0, time: 100.7, cost: 0.03, outTok: 4271, steps: 17 },
    { model: "Muse Spark 1.2", thinking: "low", harness: "Muse Code", score: 97.7, time: 51.7, cost: 0.006, outTok: 3044, steps: 14 },
    { model: "Muse Spark 1.2", thinking: "medium", harness: "Muse Code", score: 90.9, time: 68.5, cost: 0.009, outTok: 4211, steps: 20 },
    { model: "Muse Spark 1.2", thinking: "high", harness: "Muse Code", score: 97.7, time: 80.2, cost: 0.009, outTok: 4954, steps: 18 },
    { model: "Muse Spark 1.2", thinking: "xhigh", harness: "Muse Code", score: 97.7, time: 64.5, cost: 0.01, outTok: 6549, steps: 22 },
    { model: "Muse Spark 1.2", thinking: "ultra", harness: "Muse Code", score: 100.0, time: 80.2, cost: 0.009, outTok: 6341, steps: 24 },
    { model: "Sonnet 5", thinking: "low", harness: "Claude Code", score: 97.7, time: 21.0, cost: 0.313, outTok: 1376, steps: 8 },
    { model: "Sonnet 5", thinking: "medium", harness: "Claude Code", score: 93.2, time: 27.0, cost: 0.393, outTok: 1697, steps: 8 },
    { model: "Sonnet 5", thinking: "high", harness: "Claude Code", score: 93.2, time: 38.6, cost: 0.454, outTok: 2548, steps: 10 },
    { model: "Sonnet 5", thinking: "xhigh", harness: "Claude Code", score: 97.7, time: 44.0, cost: 0.511, outTok: 3444, steps: 11 },
    { model: "Sonnet 5", thinking: "max", harness: "Claude Code", score: 95.5, time: 59.5, cost: 0.594, outTok: 5064, steps: 12 },
    { model: "Opus 5", thinking: "low", harness: "Claude Code", score: 97.7, time: 30.9, cost: 0.403, outTok: 1726, steps: 12 },
    { model: "Opus 5", thinking: "medium", harness: "Claude Code", score: 97.7, time: 39.0, cost: 0.508, outTok: 2448, steps: 14 },
    { model: "Opus 5", thinking: "high", harness: "Claude Code", score: 100.0, time: 54.9, cost: 0.583, outTok: 3648, steps: 20 },
    { model: "Opus 5", thinking: "xhigh", harness: "Claude Code", score: 95.5, time: 67.2, cost: 0.685, outTok: 4233, steps: 20 },
    { model: "Opus 5", thinking: "max", harness: "Claude Code", score: 97.7, time: 94.6, cost: 0.842, outTok: 5805, steps: 24 },
  ],
  tableCaption: [
    "44 live-site tasks per configuration; time, cost, tokens, and steps are per-task medians.",
    "Score is pass@1, judged by a Claude Sonnet judge from captured evidence at capture time.",
    "Bot walls are never scored as failures: verified walls are excluded and retried.",
    "Agents run uncapped: no turn or wall-clock budget is imposed by the harness.",
  ],
};

const projects: Project[] = [
  {
    slug: "browser-cli",
    color: "#5e95e3",
    description: `A self-hosted browser automation daemon and CLI client built for LLM coding agents. It provides persistent, authenticated web sessions that agents control through standard subprocess commands (\`navigate\`, \`snapshot\`, \`click\`, \`type\`, \`screenshot\`) without requiring MCP servers, browser extensions, or framework-specific SDKs.\n\n### Technical Details\n\n**Rust Daemon & Protocol**: Built entirely in Rust, driving Chrome for Testing directly over WebSocket connections via raw Chrome DevTools Protocol (CDP). Eliminates Node and Python runtime overhead, dropping per-command latency from 40ms to 2ms and baseline daemon memory consumption by ~90MB. The client communicates with the daemon over a JSON-based Unix domain socket.\n\n**Persistent Auth & Session Lifecycle**: Runs headless by default for agent operations, spawning headed Chromium windows only when a user needs to complete interactive logins. Cookies, local storage, and session tokens persist across agent turns and daemon restarts. Inactive browser targets are automatically frozen and hibernated to disk, reducing idle resource footprint during long-running tasks.\n\n**Compact Accessibility Snapshots**: Generates filtered accessibility tree snapshots containing only visible, actionable elements across nested iframes and shadow DOM boundaries. Assigns stable numeric references per element, reducing context consumption from ~6,700 tokens (raw DOM dump) to ~245 tokens on standard pages. Rejects ambiguous selectors to avoid misclicks.\n\n**Packaging & Distribution**: Distributed as prebuilt binary wheels for Linux and macOS (x86_64 and ARM64) on PyPI. A single \`browser install skill\` command installs the bundled \`SKILL.md\` into major agent harnesses (Claude Code, Codex, OpenCode) for seamless integration.`,
    shortDescription:
      "A Rust browser automation daemon and CLI providing persistent, authenticated web sessions and token-efficient page snapshots for coding agents.",
    links: [
      {
        to: "https://github.com/jshan9078/browser-automation-cli",
        label: "GitHub",
      },
      {
        to: "https://pypi.org/project/browser-automation-cli/",
        label: "PyPI",
      },
    ],
    logo: Assets.Rust,
    name: "Browser Automation CLI",
    period: { from: new Date(2026, 7, 1) },
    skills: getSkills("rust", "python", "llm", "multi-agent"),
    type: "Developer Tooling & Agent Infra",
    screenshots: [],
    install: "uv tool install browser-automation-cli",
    installPip: "pip install browser-automation-cli",
    downloads: "6k",
    downloadsUrl: "https://pepy.tech/projects/browser-automation-cli",
    techMetrics: [
      { value: "~2 ms", label: "Per-command latency", note: "Rust daemon over raw CDP" },
      { value: "~245", label: "Tokens / snapshot", note: "compact a11y tree, typical page" },
      { value: "~2%", label: "Idle CPU", note: "parked, frozen + hibernated" },
      { value: "~0.4 s", label: "Daemon cold start", note: "launch to ready" },
    ],
    benchmarks: {
      barTitle: "BU Bench V1 (browser-use/benchmark)",
      repoUrl: "https://github.com/browser-use/benchmark",
      buRows: [
        { harness: "Claude Code", browser: "browser-automation-cli", model: "Opus 4.7", value: 87, display: "87%", time: "166s", cost: "$1.80", highlight: true },
        { harness: "BrowserCode 0.0.3", browser: "BrowserUse Cloud", model: "Opus 4.7", value: 86, display: "86%", time: "401s", cost: "$1.50" },
        { harness: "Browser Use Cloud v3", browser: "integrated", model: "Opus 4.7", value: 78, display: "78%", time: "259s", cost: "$1.34" },
        { harness: "Claude Code", browser: "Agent Browser", model: "Opus 4.7", value: 77, display: "77%", time: "N/A", cost: "N/A" },
        { harness: "Claude Code", browser: "BrowserUse Cloud", model: "Opus 4.7", value: 74, display: "74%", time: "360s", cost: "$0.97" },
        { harness: "Browser Use 0.13.7", browser: "BrowserUse Cloud", model: "Opus 4.7", value: 74, display: "74%", time: "478s", cost: "N/A" },
        { harness: "Browser Use 0.11.7", browser: "BrowserUse Cloud", model: "Opus 4.7", value: 65, display: "65%", time: "305s", cost: "N/A" },
        { harness: "Stagehand", browser: "Browserbase", model: "Opus 4.7", value: 51, display: "51%", time: "N/A", cost: "N/A" },
      ],
      barCaption: [
        "Every harness x browser-tool permutation on Opus 4.7 in browser-use/benchmark, plus browser-automation-cli.",
        "Benchmark uses same 100 tasks and gemini-2.5-flash judge in accordance with Browser Use's repo.",
        "Browsers are opened in headful mode when the agent is blocked by captchas / bot checks for user to complete.",
      ],
    },
  },
  {
    slug: "web-bench",
    color: "#a78bfa",
    description: `WebBench is a benchmark for how efficiently an LLM drives a browser on real websites. Every configuration is given the same browser tool ([browser-automation-cli](https://github.com/jshan9078/browser-automation-cli)) and the same 44 live-site tasks, spanning multi-hop reads, e-commerce flows, vision and canvas work, signed-in account actions, and interactive web tools, then measured on accuracy and the cost of success: time, tokens, tool calls, and dollars per task.\n\n### Technical Details\n\n**Matrix**: 28 configurations: Claude (Opus 5, Sonnet 5, Haiku 4.5) via Claude Code, GPT-5.6 Luna via the Codex CLI, and Muse Spark 1.2 via Muse Code across five thinking levels each, plus Gemini 3.7 Flash across three levels via the Antigravity harness, every configuration run over the same 44 tasks at pass@1 (1,200+ runs). Haiku 4.5 does not support the effort parameter, so its five sweeps are treated as replicate runs and reported as a single averaged configuration.\n\n**Pretraining-proof tasks**: read tasks target current real-world data that cannot be in any training set (the agent must navigate and read), action tasks are verified from screenshots and harness-captured ground truth (cart contents, end-state text), and signed-in tasks create private, reversible account state that the run screenshots and then undoes. Every verifier enforces grounding: a correct-sounding answer with no supporting navigation in the trace fails.\n\n**Judging**: every LLM-judged verdict is issued by a Claude Sonnet judge from the captured evidence, with contested failures re-audited adversarially. Verified bot walls are excluded and retried rather than scored as failures.\n\n**Capture-first**: each run writes a durable raw bundle (full model trace, end-state evidence, screenshots, token usage, and a headless video) before any judging, so verdicts can be re-derived offline without ever re-running the models.\n\n**Cost accounting**: Claude costs are the CLI's own reported cost per run; Gemini, GPT-5.6, and Muse Spark costs are computed from captured per-call token usage (cached and uncached input, output including reasoning) at each provider's public pricing, held constant across the matrix so only the model and thinking level vary.`,
    shortDescription:
      "A benchmark measuring how efficiently different LLMs drive a browser on real websites with respect to completion time, tokens used, and cost.",
    links: [
      {
        to: "https://github.com/jshan9078/web-bench",
        label: "GitHub",
      },
    ],
    logo: Assets.LLM,
    name: "WebBench",
    period: { from: new Date(2026, 7, 1) },
    skills: getSkills("python", "llm", "multi-agent"),
    type: "LLM Benchmark & Evaluation",
    benchmarks: {
      ...WEBBENCH,
    },
  },
  {
    slug: "slm-vulnerability-detection",
    color: "#5e95e3",
    description: `On-device Small Language Models (1B to 12B) fine-tuned for C/C++ CWE vulnerability detection, benchmarked against a frozen frontier model (gpt-5.6-luna) on both raw source and compiler-derived LLVM IR. The goal is a security reviewer cheap and fast enough to run on every pull request without a cloud API.\n\n### Key Findings\n\n**Synthetic parity**: with reasoning-distillation SFT, a 9B model matches the frontier on a clean synthetic benchmark (0.626 vs 0.629 balanced accuracy) at a third of the false-positive rate.\n\n**The discrimination wall**: on real-world CVE code every on-device model sits at chance balanced accuracy (0.50 to 0.51), and even the frontier only reaches 0.545. An isolated function often isn't decidable without the macros, types, and callers around it.\n\n**Small models still win where it counts**: on minimal-diff CVE pairs the on-device models lead the frontier on pair-consistency (0.226 vs 0.156) and family-level CWE naming (0.442 vs 0.362), and a 2.6B model names real weaknesses about as accurately as the frontier.\n\n**DPO shifts caution, not skill**: preference optimization slid the operating point along the ROC diagonal, making the model quieter without making it better at telling vulnerable from safe.\n\n### Technical Details\n\n**Benchmarks**: a synthetic benchmark from a custom generator where every insecure sample is proven insecure by a dynamic oracle that crashes the binary with a real payload, plus a real-world benchmark built from PrimeVul, BigVul, and Juliet.\n\n**Training**: off-policy reasoning distillation from a Claude Opus teacher, LoRA supervised fine-tuning across five architectures (Liquid AI LFM2.5, Qwen-3.5-9B, Qwen2.5-Coder-7B, Gemma-4-12B), a LoRA rank sweep on both source and LLVM IR, and a Direct Preference Optimization stage on top.\n\n**Infrastructure**: all training and evaluation ran on AWS with a single NVIDIA L40S (48 GB) per job, at a total compute cost of $404.\n\n**Deployment**: a detect-then-name cascade with a reviewer in the loop, where a generalist screens the diff and a 2.6B real-code specialist names the CWE on whatever gets flagged.`,
    shortDescription:
      "Post-training on-device SLMs (reasoning-distillation SFT + DPO) for C/C++ CWE vulnerability detection, benchmarked against a frontier model on synthetic and real-world code.",
    links: [
      {
        to: "https://github.com/jshan9078/cwe-model-training",
        label: "GitHub",
      },
      { to: "/blog/slm-vulnerability-detection", label: "Blog Post" },
    ],
    logo: Assets.LLM,
    name: "On-Device SLMs for Vulnerability Detection",
    period: { from: new Date(2026, 7, 12), to: new Date(2026, 7, 12) },
    skills: getSkills("python", "pytorch", "llm", "aws", "cpp", "compilers"),
    type: "SLM Post-Training & Security",
    screenshots: [],
    pdf: "/cwe-slm-paper.pdf",
  },
  {
    slug: "opencord",
    color: "#5e95e3",
    description: `A serverless Discord-to-AI bridge enabling developers to run persistent, stateful AI coding agent sessions directly inside Discord threads. Built using Vercel Sandboxes and the OpenCode SDK, OpenCord allows chat-based execution, debugging, and environment control.\n\n### Technical Details\n\n**Core Integration**: Built with Vercel Sandboxes and the OpenCode SDK to launch isolated Linux developer sandboxes straight from chat threads.\n\n**Real-Time SSE Relay**: Architected a custom TypeScript relay that streams AI reasoning steps, tool usage events, and text deltas from Server-Sent Events (SSE) directly into Discord message sinks.\n\n**Distributed State Management**: Orchestrated Vercel Blob to build a distributed persistence layer, securing multi-provider OAuth tokens, thread context, and workspace metadata inside a stateless, serverless architecture.`,
    shortDescription:
      "A serverless Discord-to-AI bridge that runs persistent AI coding agent sessions and real-time SSE relays straight in chat threads.",
    links: [
      { to: "https://github.com/jshan9078/OpenCord", label: "GitHub" },
    ],
    logo: Assets.TypeScript,
    name: "OpenCord",
    period: { from: new Date(2026, 4), to: new Date(2026, 4) },
    skills: getSkills("ts", "llm"),
    type: "Agent Harnesses & Developer Tools",
    screenshots: [],
  },
  {
    slug: "ross",
    color: "#5e95e3",
    description: `ROSS makes visual art accessible to those with visual impairments. We use computer vision to segment paintings/photographs and then apply mathematical procedures to turn those segments into vectors the robot can follow. We also added narration as the robot draws on the user's palm and music generation powered by multimodal sentiment analysis.\n\n### Technical Details\n\n**Segmentation**: We input an image into Meta SAM (Segment Anything Model) to isolate meaningful elements (e.g., trees, people).\n\n**Path Planning**: For each mask, we generate a simplified stroke outline and convert detected strokes into intelligent graph structures that understand connectivity and optimal traversal.\n\n**Vectorization**: Pixel-based stroke data is transformed into smooth mathematical curves using algorithms like Ramer-Douglas-Peucker simplification.\n\n**Calibration**: Digital coordinates are converted into real-world millimeter measurements with 1mm spacing accuracy.\n\n**Feedback**: Parts of the painting are categorized as warm or cool based on color proximity to red or blue. A two-axis robot draws with two brushes: one with a heated resistor (warm) and one with alcohol/hand sanitizer (cold) to convey color via temperature.\n\n**Hardware Control**: Numerical outputs are fed to an Arduino to control the hardware.\n\n**Narration**: While painting, relevant music is generated based on sentiment, along with a Bob Ross voiceover using a fine-tuned HuggingFace model.`,
    shortDescription:
      "ROSS makes visual art accessible to those with visual impairments by bridging visual ideas with touch, temperature and sound. Winner at Hack the North 2025.",
    links: [
      { to: "https://github.com/FowlFarmer/HTN2025", label: "GitHub" },
      { to: "https://devpost.com/software/ross-42pnvi", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "ROSS",
    period: { from: new Date() },
    skills: getSkills("python", "pytorch", "vertex", "llm", "opencv"),
    type: "AI/ML & Robotics",
    screenshots: [
      { label: "Hack the North Winner", src: url("ross_win.webp") },
      { label: "Robot Hardware", src: url("ross_robot.webp") },
      { label: "ML Segmentation", src: url("ross_segmented.webp") },
      { label: "CAD Model", src: url("ross_cad.webp") },
      { label: "Wiring", src: url("ross_wiring.webp") },
    ],
  },
  {
    slug: "microgradcpp",
    color: "#5e95e3",
    description: `A highly modular, performance-oriented C++ implementation of Andrej Karpathy's micrograd autograd engine and neural network. This project ports the scalar-based automatic differentiation system to C++, featuring custom operator overloading, dynamic backpropagation, and a complete Multi-Layer Perceptron (MLP) API.\n\n### Technical Details\n\n**Autograd Engine**: Leverages custom C++ pointer structures for dynamic computational graph tracking. Overloads math operators (\`+\`, \`-\`, \`*\`, \`/\`, \`pow\`) to construct automatic backpropagation DAGs natively.\n\n**Neural Network**: Implements a Multi-Layer Perceptron (MLP) library, supporting dynamic initialization of neurons, layers, and network architectures.\n\n**Model Training**: Standardizes model training on true normalized Mean Squared Error (MSE) loss.\n\n**Testing Suite**: Includes a dedicated unit testing suite validating mathematical derivatives and gradient outputs against reference evaluations.`,
    shortDescription:
      "A modular, high-performance C++ autograd engine and neural network library featuring dynamic backpropagation and normalized MSE training.",
    links: [
      { to: "https://github.com/jshan9078/microgradcpp", label: "GitHub" },
    ],
    logo: Assets.Cpp,
    name: "MicrogradCPP",
    period: { from: new Date(2026, 4), to: new Date(2026, 4) },
    skills: getSkills("cpp"),
    type: "C++ & Deep Learning",
    screenshots: [],
  },
  {
    slug: "psa-grade-predictor",
    color: "#5e95e3",
    description: `This project uses computer vision to predict PSA (Professional Sports Authenticator) grades (1-10) for collectible cards by analyzing both front and back images. The model achieves a **0.84 Quadratic Weighted Kappa (QWK)** on validation data (0.90 QWK on training) using CORAL ordinal regression, delivering a 55% loss reduction and 86% less overfitting compared to standard classification baselines.\n\n### Technical Details\n\n**Asymmetric Architecture**: Dual-branch CNN layout optimizing capacity distribution: a ResNet-18 encoder (11M params) for front scans and a ResNet-34 encoder (21M params) for back scans, totaling 32M parameters. Input images are standardized at 384x384.\n\n**Ordinal Loss Formulation**: Consistent Rank Logits (CORAL) ordinal regression, augmented with custom auxiliary objectives: physical border edge damage detector loss and artwork centering alignment loss.\n\n**Optimized Preprocessing**: Converts raw scans to the LAB color space, applying Contrast Limited Adaptive Histogram Equalization (CLAHE), Sobel gradients, and Laplacian filters. Reimplemented in OpenCV for a 10-50x preprocessing speedup.\n\n**Training**:\n* **Hardware**: 1x NVIDIA Tesla T4 GPU (16 GB VRAM) on GCP Vertex AI n1-standard-8\n* **Optimization & Loss**: CORAL ordinal regression loss, AdamW optimizer, learning rate of 3e-4 (ReduceLROnPlateau), batch size of 16\n* **Regularization**: Dropout of 0.25 and weight decay of 2e-4\n* **Configuration**: 50 epochs, 384×384 image size`,
    shortDescription:
      "A PyTorch deep learning model for automated PSA card grading using an asymmetric dual-branch CNN and ordinal regression.",
    links: [
      { to: "https://github.com/jshan9078/PSAGradePredictor", label: "GitHub" },
    ],
    logo: Assets.PyTorch,
    name: "PSA Grade Estimator",
    period: { from: new Date(2025, 9), to: new Date(2025, 9) },
    skills: getSkills("pytorch", "vertex", "python", "gcp", "opencv", "docker"),
    type: "Deep Learning & Computer Vision",
    screenshots: [],
    pdf: "/technical-paper.pdf",
  },
  {
    slug: "soundtrack",
    color: "cyan",
    description: `SoundTrack utilizes biomedical data (e.g. EEG, ECG) to ascertain a user's mood and emotions. It captures images and occasional video clips of the user's surroundings, analyzing them to determine the context. Using this information, it selects and generates music in real-time, adapting the soundtrack to match the user's emotional state and environment.\n\n### Technical Details\n\n**Data Capture**: Images and video clips are captured periodically using the device's camera. Biomedical data is collected using appropriate sensors.\n\n**Signal Processing**: Biomedical data is processed to convert it to the frequency domain and obtain Power Spectral Density (PSD) data. PSD data and location data are attributed to specific emotions/moods using machine learning models.\n\n**Music Selection**: Images are processed using Gemini to extract information about the scene. The extracted information, along with user song preferences and mood derived from biomedical data, is fed into Gemini 2.5 to generate song recommendations. Spotify API is used to fetch and play the recommended songs.\n\n**Video Generation**: Python processing is used to stitch together pairs of images and audio. Basic transitions are used for video clips to create a seamless montage. Lyria is used to generate background music based on the overall theme of the video.\n\n**Backend**: Built using Python and FastAPI, providing a robust and scalable framework. Data is ingested using Firebase to handle real-time and batch data. FFmpeg is used to stitch together the images and video.`,
    shortDescription:
      "Backend and infra for smart glasses that choose music based on your mood (EEG data) and surroundings (via camera) powered by multimodal LLMs.",
    links: [
      { to: "https://github.com/jshan9078/SoundTrack", label: "GitHub" },
      {
        to: "https://devpost.com/software/soundtrack-nydh19",
        label: "Devpost",
      },
    ],
    logo: Assets.Unknown,
    name: "SoundTrack",
    period: { from: new Date(2024, 11, 1), to: new Date() },
    skills: getSkills("llm", "vertex", "ts", "firebase"),
    type: "Full-Stack & AI",
    screenshots: [
      { label: "Landing Page", src: url("soundtrack2.webp") },
      { label: "Biometrics", src: url("soundtrack1.webp") },
      { label: "Calibration", src: url("soundtrack3.webp") },
      { label: "Video Editor", src: url("soundtrack4.webp") },
      { label: "Music Playlists", src: url("soundtrack5.webp") },
      { label: "Timeline", src: url("soundtrack6.webp") },
    ],
  },
  {
    slug: "PowerMap",
    color: "#5e95e3",
    description: `PowerMap serves as a tool for collecting vehicle data and using it to determine the best locations in a city to place EV chargers. Data collection is done using OpenCV powered by a TensorFlow car detection model. From there, we create heat maps to show the densities of cars at certain points. Using DBSCAN clustering, we identify clusters with high vehicle activity. Then, we use a greedy selection algorithm for ranking these clusters. The tool integrates Taipy and Google Maps for effective data visualization.`,
    shortDescription:
      "Tool for collecting vehicle data and using it to determine the best locations in a city to place EV chargers.",
    links: [
      { to: "https://github.com/DhushanK/Car-Density-Track", label: "GitHub" },
      { to: "https://devpost.com/software/powermap", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "PowerMap",
    period: { from: new Date() },
    skills: getSkills("python", "scikit", "tensorflow", "opencv", "maps"),
    type: "Computer Vision and ML",
    screenshots: [
      { label: "Upload", src: url("powermap1.jpg") },
      { label: "Data Visualization", src: url("powermap2.jpg") },
      { label: "Heat Map", src: url("powermap3.jpg") },
      { label: "Stack", src: url("powermap4.jpg") },
    ],
  },
  {
    slug: "rex-autonomous-robot",
    color: "#5e95e3",
    description: `Rex is an autonomous pathfinding robot in the form of a dog that helps those with blindness navigate. It has a conversational agent built-in to allow for communication with the user that leverages a vector database. It listens to your request, whatever it may be, and interprets that to be a nearby location. For example, if you told it "I'm feeling hungry", it would lead you to the nearest food spot. Along the way, it will look out for obstacles in your path and avoid them if necessary. It focuses highly on accessibility.`,
    shortDescription:
      "Rex is an autonomous pathfinding robot that helps those with blindness navigate. It has a built-in conversational agent to allow for communication with the user.",
    links: [
      {
        to: "https://devpost.com/software/rex-inywpb",
        label: "Video of Usage",
      },
      { to: "https://github.com/jshan9078/Rex", label: "Firmware GitHub" },
      {
        to: "https://github.com/jshan9078/Rex-Web-App",
        label: "Companion App",
      },
    ],
    logo: Assets.Rex,
    name: "Rex, the Dog",
    period: { from: new Date() },
    skills: getSkills("llm", "js", "reactjs", "rpi", "python"),
    type: "AI/ML & Robotics",
    screenshots: [
      { label: "Hardware", src: url("rex.png") },
      { label: "Usage", src: url("usage.webp") },
      { label: "CAD", src: url("cad.jpg") },
      { label: "Winners at Hack the North 2024", src: url("htn.webp") },
    ],
  },
  {
    slug: "distributed-scraper",
    color: "#5e95e3",
    description: `A multi-purpose distributed web scraping framework deployed on Google Kubernetes Engine (GKE) using Terraform. It orchestrates multiple scraper pods to efficiently collect high-resolution Pokemon card images from PSA, utilizing a PostgreSQL-backed work queue for coordination and preventing race conditions.\n\n### Technical Details\n\n**Infrastructure**: Full GitOps deployment using Terraform to provision GKE clusters, Cloud SQL instances, GCS buckets, and VPC networking.\n\n**Orchestration**: Uses Kubernetes to manage distributed scraper pods, with autoscaling capabilities to handle workload demands.\n\n**Coordination**: Implements a custom work queue state machine in PostgreSQL, using atomic \`FOR UPDATE SKIP LOCKED\` operations to ensure no two pods process the same certificate simultaneously.\n\n**Data Pipeline**: Selenium and BeautifulSoup for scraping, Pillow for image processing (cropping/optimization), and direct upload to Google Cloud Storage.`,
    shortDescription:
      "Multi-purpose distributed web scraping framework on Google Kubernetes Engine with PostgreSQL work queue coordination; deployed via Terraform.",
    links: [
      {
        to: "https://github.com/jshan9078/DistributedScraper",
        label: "GitHub",
      },
    ],
    logo: Assets.Terraform,
    name: "Distributed Scraper",
    period: { from: new Date() },
    skills: getSkills("kubernetes", "terraform", "gcp", "PostgreSQL", "python"),
    type: "Infra & Distributed Systems",
    screenshots: [],
  },
  {
    slug: "Omniverse",
    color: "#5e95e3",
    description: `Omniverse is your live personal assistant 24/7. A user can create a variety of tutors targeted towards any topic they want. You can upload documents for this "tutor" to read up on and understand the context. Then, you can interact with them through a live video-call, receiving guidance and help about any subject within that topic.`,
    shortDescription:
      "Omniverse is your live personal assistant 24/7. A user can create a variety of tutors targeted towards any topic they want.",
    links: [
      { to: "https://github.com/LGeoff31/omniverse_finished", label: "GitHub" },
      { to: "https://devpost.com/software/omniverse", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "Omniverse",
    period: { from: new Date() },
    skills: getSkills("ts", "langchain", "PostgreSQL", "next", "llm"),
    type: "Full-Stack and AI",
    screenshots: [
      { label: "Call Interface", src: url("omniverse1.webp") },
      { label: "Create Tutors", src: url("omniverse2.jpg") },
      { label: "Pipeline", src: url("omniverse3.jpg") },
    ],
  },
  {
    slug: "ambience",
    color: "#5e95e3",
    description: `By uploading your book or manga to the web app, you can generate a Spotify playlist that dynamically changes as the mood in the story changes. Leveraging Gemini's multi-modal capabilities and Spotify's API, Ambience is able to analyze the text and generate a playlist that fits the mood of the story.`,
    shortDescription:
      "Web app that allows users to find the perfect background music to accompany their books/manga.",
    links: [
      { to: "https://github.com/jshan9078/Ambience", label: "GitHub" },
      { to: "https://devpost.com/software/ambience-z7qkds", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "Ambience",
    period: { from: new Date() },
    skills: getSkills("vertex", "js", "reactjs", "fastapi", "python"),
    type: "AI & Full-Stack",
    screenshots: [
      { label: "Ambience", src: url("ambience1.jpg") },
      { label: "Upload", src: url("ambience2.jpg") },
      { label: "Reader", src: url("ambience3.jpg") },
      { label: "Stack", src: url("ambience4.jpg") },
    ],
  },
  {
    slug: "InterView",
    color: "#5e95e3",
    description: `InterView is an AI-powered web app that helps HR departments train new recruiters by providing them with immediate feedback on their interviewing techniques. By processing interview audio in real-time, it identifies potential biases related to age, gender, or ethnic background. It then offers constructive feedback, guiding recruiters on how to conduct more equitable and effective interviews.`,
    shortDescription:
      "Web app that helps HR train recruiters to conduct more equitable and effective interviews.",
    links: [
      { to: "https://github.com/jshan9078/interviewapp", label: "GitHub" },
      { to: "https://devpost.com/software/interview-7eugcy", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "InterView",
    period: { from: new Date() },
    skills: getSkills(
      "gcp",
      "js",
      "reactjs",
      "flask",
      "python",
      "redis",
      "langchain",
      "fastapi",
      "vertex",
    ),
    type: "AI & Full-Stack",
    screenshots: [
      { label: "User Interface", src: url("interview1.jpg") },
      { label: "Stack", src: url("interview2.jpg") },
    ],
  },
  {
    slug: "Telekinesis",
    color: "#5e95e3",
    description: `A recreation of Pac-Man and Flappy Bird without the use of a keyboard and solely hand gestures. The project connects various facets of programming and math. We used Python with Django for the backend including CRUD functionality, Taipy for the frontend, PyGame for general game logic, and OpenCV/TensorFlow/Mediapipe for hand gesture recognition.`,
    shortDescription:
      "A recreation of Pac-Man and Flappy Bird without the use of a keyboard and solely hand gestures.",
    links: [
      {
        to: "https://github.com/TianYao12/Telekinesis/tree/JonathanBranch",
        label: "GitHub",
      },
      { to: "https://devpost.com/software/telekinesis", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "Telekinesis",
    period: { from: new Date() },
    skills: getSkills("django", "opencv", "python", "tensorflow"),
    type: "Computer Vision, ML, Game Dev",
    screenshots: [
      { label: "Usage", src: url("telekinesis.jpg") },
      { label: "Pac-Man", src: url("telekinesis2.jpg") },
      { label: "Flappy Bird", src: url("telekinesis3.jpg") },
    ],
  },
  {
    slug: "Serenity",
    color: "#5e95e3",
    description: `Serenity is a Chrome extension for teachers to control speech speed during lessons. Students can also use Serenity as a practice tool. When you hit the start button, it records you using the microphone and shows a live transcription. Every time you take a pause, the speed of speech updates and provides cues on if you should slow down or keep going. You can stop recording by verbally stating "stop recording".`,
    shortDescription:
      "Chrome extension for teachers to control speech speed during lessons. Students can also use Serenity as a practice tool.",
    links: [
      { to: "https://github.com/jshan9078/Serenity", label: "GitHub" },
      { to: "https://devpost.com/software/serenity-i3aont", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "Serenity",
    period: { from: new Date() },
    skills: getSkills("html", "js", "css", "llm"),
    type: "AI & Chrome Extensions",
    screenshots: [
      { label: "Usage", src: url("serenity1.jpg") },
      { label: "Usage", src: url("serenity2.jpg") },
      { label: "Usage", src: url("serenity3.jpg") },
    ],
  },
  {
    slug: "friended",
    color: "#5e95e3",
    description: `The front end was designed using Next, TypeScript and Tailwind CSS. Moreover, the website was first designed in Figma before implementation. The backend was designed using Supabase. We chose Supabase for its low-latency and its support for embeddings. We used web scrapers to scrape data from LinkedIn and Devpost. This data was then embedded using OpenAI's embedding tool. Then, PostgreSQL was used to apply cosine similarity to determine how closely related two people were through the use of pgvector.`,
    shortDescription:
      "Web app that is a vector-based search engine to find teammates at hackathons similar to you.",
    links: [
      {
        to: "https://github.com/Adam-Omarali/friended/tree/final-stretch",
        label: "GitHub",
      },
      { to: "https://devpost.com/software/friended", label: "Devpost" },
    ],
    logo: Assets.Rex,
    name: "friended.",
    period: { from: new Date() },
    skills: getSkills("ts", "supabase", "PostgreSQL", "next", "llm", "reactjs"),
    type: "Full-Stack and AI",
    screenshots: [
      { label: "Pipeline", src: url("friended1.webp") },
      { label: "Recommendations", src: url("friended2.jpg") },
      { label: "Profile", src: url("friended3.jpg") },
    ],
  },
  {
    slug: "grocery",
    color: "#5e95e3",
    description: `Our product takes your list of grocery items and searches an automatically generated database of deals and prices at numerous stores. We collect this data by collecting prices from grocery store websites and couponing websites. We show you the best way to purchase items from stores nearby your postal code, choosing the best deals per item, and algorithmically determining a fast way to make your grocery run.`,
    shortDescription:
      "A website for users to find discounts at their local grocery stores and to determine their most cost-effective and time-efficient shopping trip.",
    links: [
      { to: "https://github.com/patrick-gu/htv8", label: "GitHub" },
      {
        to: "https://devpost.com/software/grocery-run-jzobac",
        label: "Devpost",
      },
    ],
    logo: Assets.Rex,
    name: "Grocery Run",
    period: { from: new Date() },
    skills: getSkills("js", "reactjs", "fastapi", "python", "maps"),
    type: "Full-Stack and Data Analytics",
    screenshots: [
      { label: "Optimizing Costs", src: url("grocery1.jpg") },
      { label: "Visualization", src: url("grocery2.jpg") },
      { label: "Find Sales", src: url("grocery3.jpg") },
    ],
  },
];

const ProjectsData = { items: projects };
export default ProjectsData;
