import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ExperienceData from '@/data/experience';

function formatPeriod(from: Date, to?: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const fromStr = fmt(from);
  const toStr = to ? fmt(to) : 'Present';
  return `${fromStr} — ${toStr}`;
}

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease },
  },
};

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = timelineRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="experience-page" ref={timelineRef}>
      <motion.div
        className="experience-page__header reveal"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">Work History</div>
        <h1 className="section-title">Experience</h1>
      </motion.div>

      <motion.div
        className="experience-timeline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {ExperienceData.items.map((exp) => (
          <motion.div
            key={exp.slug}
            className="experience-item reveal"
            variants={itemVariants}
          >
            <div className="experience-item__period">
              {formatPeriod(exp.period.from, exp.period.to)}
            </div>
            <h2 className="experience-item__company">{exp.company}</h2>
            <div className="experience-item__role">{exp.name}</div>
            {exp.location && (
              <div className="experience-item__location">{exp.location}</div>
            )}
            {exp.description && (
              <p className="experience-item__description">{exp.description}</p>
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
