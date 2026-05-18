import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectsData from '@/data/projects';
import SkillsData from '@/data/skills';

export default function Projects() {
  const [filter, setFilter] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const usedSkillSlugs = [...new Set(ProjectsData.items.flatMap((p) => p.skills.map((s) => s.slug)))];
  const availableSkills = SkillsData.filter((s) => usedSkillSlugs.includes(s.slug));

  const filtered = ProjectsData.items.filter((p) => {
    const matchesText =
      !filter ||
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(filter.toLowerCase()) ||
      p.type.toLowerCase().includes(filter.toLowerCase());

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every((slug) => p.skills.some((s) => s.slug === slug));

    return matchesText && matchesSkills;
  });

  const toggleSkill = (slug: string) => {
    setSelectedSkills((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const clearSkillFilters = () => setSelectedSkills([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = listRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filtered, listRef]);

  return (
    <div className="projects-page" ref={listRef}>
      <div className="projects-page__header">
        <div>
          <motion.div
            className="section-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Selected Work
          </motion.div>
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Projects
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <input
            type="text"
            placeholder="Search projects..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.5rem 1rem',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              outline: 'none',
              width: 'clamp(150px, 30vw, 200px)',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
          {(filter || selectedSkills.length > 0) && (
            <button
              onClick={() => { setFilter(''); clearSkillFilters(); }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.7rem',
                color: 'var(--ink-tertiary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Clear
            </button>
          )}
        </motion.div>
      </div>

      <motion.div
        className="skill-filter"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {availableSkills.map((skill) => (
          <button
            key={skill.slug}
            onClick={() => toggleSkill(skill.slug)}
            className={`skill-filter__chip ${selectedSkills.includes(skill.slug) ? 'skill-filter__chip--active' : ''}`}
            style={{
              '--skill-color': `var(--color-${skill.color})`,
            } as React.CSSProperties}
          >
            {skill.name}
          </button>
        ))}
      </motion.div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 0',
            color: 'var(--ink-tertiary)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          No projects match your filters.
        </div>
      ) : (
        <div className="projects-list">
          {filtered.map((project, index) => (
            <motion.div
              key={project.slug}
              className="project-row reveal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="project-row__index">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="project-row__content">
                <div className="project-row__type">{project.type}</div>
                <h2 className="project-row__name">{project.name}</h2>
                <p className="project-row__description">{project.shortDescription}</p>
                <div className="project-row__meta">
                  <div className="project-row__skills">
                    {project.skills.slice(0, 5).map((skill) => (
                      <span key={skill.slug} className="project-row__skill">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  <div className="project-row__links">
                    {project.links.map((link) => (
                      <a
                        key={link.to}
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-row__link"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
