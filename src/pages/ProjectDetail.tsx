import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ProjectsData from "@/data/projects";

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = ProjectsData.items.find((p) => p.slug === slug);

  const scrollToProjects = () => {
    navigate("/#projects");
  };

  if (!project) {
    return (
      <div className="project-detail">
        <button onClick={scrollToProjects} className="project-detail__back">
          <ArrowLeftIcon />
          <span>Back to Projects</span>
        </button>
        <div className="project-detail__not-found">
          Project not found.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="project-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="project-detail__nav-row">
        <button onClick={scrollToProjects} className="project-detail__back">
          <ArrowLeftIcon />
          <span>Back to Projects</span>
        </button>
        <div className="project-detail__links">
          {project.links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__link"
            >
              {link.label}
              <ExternalLinkIcon />
            </a>
          ))}
          {project.pdf && (
            <a
              href={project.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__link"
            >
              Technical Paper
              <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>

      <div className="project-detail__header">
        <h1 className="project-detail__name">{project.name}</h1>
        <div className="project-detail__period">{project.type}</div>
      </div>

      <div className="project-detail__skills">
        {project.skills.slice(0, 6).map((skill) => (
          <span key={skill.slug} className="project-detail__skill">
            {skill.name}
          </span>
        ))}
      </div>

      <div className="project-detail__description">
        <ReactMarkdown>{project.description}</ReactMarkdown>
      </div>

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="project-detail__screenshots">
          <h3 className="project-detail__section-title">Screenshots</h3>
          <div className="project-detail__screenshots-grid">
            {project.screenshots.map((screenshot, index) => (
              <div key={index} className="project-detail__screenshot">
                <img src={screenshot.src} alt={screenshot.label} />
                <div className="project-detail__screenshot-label">{screenshot.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.pdf && (
        <div className="project-detail__pdf">
          <h3 className="project-detail__section-title">Technical Paper</h3>
          <div className="project-detail__pdf-viewer">
            <iframe
              src={`${project.pdf}#toolbar=0`}
              title={`${project.name} Technical Paper`}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
