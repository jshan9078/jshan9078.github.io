import { Link } from "react-router-dom";
import { useEffect } from "react";
import BaseData from "@/data/base";
import Assets from "@/data/assets";
import ExperienceData from "@/data/experience";
import ProjectsData from "@/data/projects";

function ProjectCard({
  project,
}: {
  project: (typeof ProjectsData.items)[number];
}) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card">
      <div className="project-card__title-row">
        <span className="project-card__name">{project.name}</span>
        <div className="project-card__links">
          {project.links.map((link) => (
            <button
              key={link.to}
              className="project-card__link"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(link.to, "_blank", "noopener,noreferrer");
              }}
            >
              {link.label.toLowerCase().includes("github") ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
      <p className="project-card__description">{project.shortDescription}</p>
      <Link to={`/projects/${project.slug}`} className="project-card__arrow">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </Link>
  );
}

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

function formatPeriod(from: Date, to?: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const fromStr = fmt(from);
  const toStr = to ? fmt(to) : "Present";
  return `${fromStr} — ${toStr}`;
}

export default function SinglePage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 60,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="single-page">
      <section id="home" className="hero">
        <div className="hero__left">
          <h1 className="hero__name">
            {BaseData.firstName}
            <br />
            {BaseData.lastName}
          </h1>

          <div className="hero__bio">
            <span className="hero__bio-main">
              <span>
                <strong>CS @ UWaterloo</strong>
              </span>
              <span className="hero__bio-divider">•</span>
              <span>
                <strong>SWE @ Shopify</strong>
              </span>
            </span>
            <span>Obsessed with building the best agentic harnesses</span>
            <span className="hero__bio-setup">
              Coding agent:{" "}
              <a
                href="https://pi.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pi
              </a>{" "}
              &bull; Model: qwen3.6-Plus
            </span>
          </div>

          <div className="hero__social-links">
            <a
              href="https://github.com/jshan9078"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/jonathanshan1/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link"
            >
              <LinkedInIcon />
            </a>
            <a href="mailto:jshan9078@gmail.com" className="hero__social-link">
              <EmailIcon />
            </a>
          </div>
        </div>

        <div className="hero__right">
          <img
            src={Assets.Pfp.light}
            alt="Jonathan Shanmuganantham"
            className="hero__image"
          />
        </div>

        <div className="scroll-indicator">
          <div className="scroll-indicator__line"></div>
        </div>
      </section>

      <section id="experience" className="experience-page">
        <div className="experience-page__header">
          <h1 className="section-title">Experience</h1>
        </div>

        <div className="experience-timeline">
          {ExperienceData.items.map((exp) => (
            <div key={exp.slug} className="experience-item">
              <div className="experience-item__period">
                {formatPeriod(exp.period.from, exp.period.to)}
              </div>
              <h2 className="experience-item__company">{exp.company}</h2>
              <div className="experience-item__role">{exp.name}</div>
              {exp.location && (
                <div className="experience-item__location">{exp.location}</div>
              )}
              {exp.description && (
                <p className="experience-item__description">
                  {exp.description}
                </p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="experience-item__highlights">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              {exp.skills.length > 0 && (
                <div className="experience-item__skills">
                  {exp.skills.map((skill) => (
                    <span key={skill.slug} className="experience-item__skill">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="projects-page">
        <h1 className="section-title">Projects</h1>

        <div className="projects-list">
          {ProjectsData.items.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
