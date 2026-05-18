import { Link } from "react-router-dom";

// Data types
interface StackCategory {
  title: string;
  items: string[];
}

interface CodingAgent {
  name: string;
  useCase: string;
  whenToUse: string;
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  content: string;
}

// Dummy data
const agentStack: StackCategory[] = [
  {
    title: "Frameworks",
    items: ["LangChain", "LangGraph", "LlamaIndex", "AutoGen", "CrewAI"],
  },
  {
    title: "Tools",
    items: ["Cursor", "Windsurf", "VS Code", "Claude Desktop", "OpenAI SDK"],
  },
  {
    title: "LLMs",
    items: ["Claude", "GPT-4o", "o1", "Gemini"],
  },
  {
    title: "MCPs",
    items: ["Filesystem", "Git", "Memory", "Brave", "Puppeteer"],
  },
  {
    title: "Subagents",
    items: ["Reviewer", "Debugger", "Researcher", "Writer", "Tester"],
  },
];

const codingAgents: CodingAgent[] = [
  { name: "Cursor", useCase: "code editor", whenToUse: "completion, refactoring" },
  { name: "Windsurf", useCase: "IDE", whenToUse: "debugging, multi-file" },
  { name: "Claude Code", useCase: "CLI", whenToUse: "terminal, file ops" },
  { name: "Copilot", useCase: "inline", whenToUse: "quick completions" },
];

const blogPosts: BlogPost[] = [
  {
    slug: "building-agent-workflows",
    title: "Building Agent Workflows with LangGraph",
    date: "Dec 2024",
    description: "Multi-agent system for code reviews.",
    techStack: ["LangGraph", "Claude", "Python"],
    repoUrl: "https://github.com/jshan9078/agent-workflows",
    content: "",
  },
  {
    slug: "mcp-custom-tools",
    title: "Creating Custom MCP Tools",
    date: "Nov 2024",
    description: "Building MCP tools for Claude Desktop.",
    techStack: ["MCP", "TypeScript"],
    repoUrl: "https://github.com/jshan9078/mcp-tools",
    content: "",
  },
  {
    slug: "subagent-prompting",
    title: "Subagent Prompting Techniques",
    date: "Oct 2024",
    description: "Effective subagent prompt patterns.",
    techStack: ["Claude", "Prompts"],
    content: "",
  },
];

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function AgentsPage() {
  return (
    <div className="agents-hub">
      <header className="agents-hub__header">
        <h1 className="agents-hub__title">Agents</h1>
        <p className="agents-hub__subtitle">My AI agent stack & experiments</p>
      </header>

      {/* Main Grid */}
      <div className="agents-hub__grid">
        {/* Stack Module */}
        <section className="agents-hub__module agents-hub__module--stack">
          <div className="agents-hub__module-header">
            <span>Stack</span>
          </div>
          <div className="agents-hub__module-content">
            {agentStack.map((cat) => (
              <div key={cat.title} className="agents-hub__stack-cat">
                <span className="agents-hub__stack-label">{cat.title}</span>
                <div className="agents-hub__stack-items">
                  {cat.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coding Agents Module */}
        <section className="agents-hub__module agents-hub__module--coding">
          <div className="agents-hub__module-header">
            <span>Coding</span>
          </div>
          <div className="agents-hub__module-content">
            {codingAgents.map((agent) => (
              <div key={agent.name} className="agents-hub__coding-item">
                <span className="agents-hub__coding-name">{agent.name}</span>
                <span className="agents-hub__coding-type">{agent.useCase}</span>
                <span className="agents-hub__coding-when">
                  when {agent.whenToUse}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Module */}
        <section className="agents-hub__module agents-hub__module--projects">
          <div className="agents-hub__module-header">
            <span>Projects</span>
          </div>
          <div className="agents-hub__module-content">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/agents/${post.slug}`}
                className="agents-hub__project-item"
              >
                <div className="agents-hub__project-info">
                  <span className="agents-hub__project-title">{post.title}</span>
                  <span className="agents-hub__project-meta">
                    {post.date} · {post.techStack.join(", ")}
                  </span>
                </div>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        </section>
      </div>

      </div>
  );
}