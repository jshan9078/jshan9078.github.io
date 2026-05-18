import Assets from "./assets";
import { getSkills } from "./skills";
import type { Project } from "./types";

export type { Project } from "./types";

const url = (file: string) => `/logos/${file}`;

const projects: Project[] = [
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
      { label: "Hack the North Winner", src: url("ross_win.png") },
      { label: "Robot Hardware", src: url("ross_robot.png") },
      { label: "ML Segmentation", src: url("ross_segmented.png") },
      { label: "CAD Model", src: url("ross_cad.png") },
      { label: "Wiring", src: url("ross_wiring.png") },
    ],
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
      { label: "Landing Page", src: url("soundtrack2.png") },
      { label: "Biometrics", src: url("soundtrack1.png") },
      { label: "Calibration", src: url("soundtrack3.png") },
      { label: "Video Editor", src: url("soundtrack4.png") },
      { label: "Music Playlists", src: url("soundtrack5.png") },
      { label: "Timeline", src: url("soundtrack6.png") },
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
    description: `Rex is an autonomous pathfinding robot in the form of a dog that helps those with blindness navigate. It has a conversational agent built-in to allow for communication with the user that leverages a vector database. It listens to your request — whatever it may be — and interprets that to be a nearby location. For example, if you told it "I'm feeling hungry", it would lead you to the nearest food spot. Along the way, it will look out for obstacles in your path and avoid them if necessary. It focuses highly on accessibility.`,
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
      { label: "Usage", src: url("usage.png") },
      { label: "CAD", src: url("cad.jpg") },
      { label: "Winners at Hack the North 2024", src: url("htn.jpg") },
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
      { label: "Call Interface", src: url("omniverse1.png") },
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
      { label: "Pipeline", src: url("friended1.png") },
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
