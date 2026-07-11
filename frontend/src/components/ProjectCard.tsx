import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/types/portfolio";

export const ProjectCard = ({ project }: { project: Project }) => (
  <article className="project-card" data-testid={`project-${project.slug}-card`}>
    <div className="project-meta"><span data-testid={`project-${project.slug}-index`}>{project.index}</span><span data-testid={`project-${project.slug}-discipline`}>{project.discipline}</span></div>
    <h3 data-testid={`project-${project.slug}-title`}>{project.title}</h3><p data-testid={`project-${project.slug}-focus`}>{project.focus}</p>
    <Link className="project-link" to={`/portfolio/projects/${project.slug}`} data-testid={`project-${project.slug}-link`}>View project record <ArrowUpRight aria-hidden="true" /></Link>
  </article>
);