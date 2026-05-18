import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Same dummy data
const blogPosts: Record<
  string,
  {
    slug: string;
    title: string;
    date: string;
    description: string;
    techStack: string[];
    repoUrl?: string;
    demoUrl?: string;
    content: string;
  }
> = {
  "building-agent-workflows": {
    slug: "building-agent-workflows",
    title: "Building Agent Workflows with LangGraph",
    date: "2024-12-15",
    description:
      "How I built a multi-agent system using LangGraph to automate code reviews and debugging. The workflow orchestrates three specialized agents that collaborate to find and fix bugs.",
    techStack: ["LangGraph", "Claude", "Python", "FastAPI"],
    repoUrl: "https://github.com/jshan9078/agent-workflows",
    content: `
## Introduction

Building agent workflows requires careful orchestration of multiple components...

## Architecture

The system consists of three main agents:
- **Research Agent** - Finds relevant context
- **Analysis Agent** - Identifies issues  
- **Fix Agent** - Implements solutions

## Key Challenges

One of the biggest challenges was handling agent communication...
    `,
  },
  "mcp-custom-tools": {
    slug: "mcp-custom-tools",
    title: "Creating Custom MCP Tools",
    date: "2024-11-20",
    description:
      "A deep dive into building custom Model Context Protocol tools for file operations, git commands, and memory management. I show how to extend Claude Desktop with your own tools.",
    techStack: ["MCP", "TypeScript", "Claude Desktop", "Node.js"],
    repoUrl: "https://github.com/jshan9078/mcp-tools",
    content: `
## What is MCP?

The Model Context Protocol (MCP) is a standard for connecting AI models to external tools...

## Building Your First Tool

Let's create a file system tool that can read, write, and list files...
    `,
  },
  "subagent-prompting": {
    slug: "subagent-prompting",
    title: "Subagent Prompting Techniques",
    date: "2024-10-05",
    description:
      "Techniques for building effective subagents with custom prompts. Covers role definition, context window management, and output parsing for specialized tasks.",
    techStack: ["Claude", "Prompt Engineering", "JSON Schema"],
    content: `
## The Art of Subagent Prompts

Creating effective subagents starts with clear role definition...
    `,
  },
};

export default function AgentBlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="agent-blog-post">
        <div className="agent-blog-post__container">
          <Link to="/agents" className="agent-blog-post__back">
            ← Back to Agents
          </Link>
          <h1 className="agent-blog-post__not-found">Post not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-blog-post">
      <div className="agent-blog-post__container">
        <Link to="/agents" className="agent-blog-post__back">
          ← Back
        </Link>

        <header className="agent-blog-post__header">
          <h1 className="agent-blog-post__title">{post.title}</h1>
          <time className="agent-blog-post__date">{post.date}</time>
        </header>

        <div className="agent-blog-post__tags">
          {post.techStack.map((tag) => (
            <span key={tag} className="agent-blog-post__tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="agent-blog-post__links">
          {post.repoUrl && (
            <a
              href={post.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="agent-blog-post__link"
            >
              Repo
            </a>
          )}
          {post.demoUrl && (
            <a
              href={post.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="agent-blog-post__link"
            >
              Demo
            </a>
          )}
        </div>

        <article className="agent-blog-post__content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}