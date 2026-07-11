import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/types/portfolio";

export const ProjectCard = ({ project }: { project: Project }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      className="project-card"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
      data-testid={`project-${project.slug}-card`}
    >
      <div className="project-meta"><span data-testid={`project-${project.slug}-index`}>Record / {project.index}</span><span data-testid={`project-${project.slug}-discipline`}>{project.discipline}</span></div>
      <div className="project-identity" aria-hidden="true"><span>{project.index}</span><i /></div>
      <div className="project-copy"><h3 data-testid={`project-${project.slug}-title`}>{project.title}</h3><p data-testid={`project-${project.slug}-focus`}>{project.focus}</p></div>
      <Link className="project-link" to={`/portfolio/projects/${project.slug}`} aria-label={`View ${project.title} project record`} data-testid={`project-${project.slug}-link`}>View project record <ArrowUpRight aria-hidden="true" /></Link>
    </motion.article>
  );
};