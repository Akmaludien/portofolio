import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { projects } from "@/data/portfolio";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ProjectPage() {
  const { slug } = useParams(); const project = projects.find((item) => item.slug === slug);
  usePageMeta(project ? `${project.title} | Akmaludien Ramadhan` : "Project not found", project ? `${project.title} project record.` : "Portfolio project record not found.");
  if (!project) return <Navigate to="/portfolio" replace />;
  return <article className="record-page" data-testid={`project-${project.slug}-page`}><Link className="back-link" to="/portfolio#projects" data-testid="project-back-link"><ArrowLeft aria-hidden="true" /> Selected work</Link><header className="record-header"><p className="eyebrow" data-testid="project-record-discipline">{project.discipline} · Project {project.index}</p><h1 data-testid="project-record-title">{project.title}</h1><p data-testid="project-record-focus">{project.focus}</p></header><div className="record-rail" data-testid="project-record-evidence-note"><span>Publication standard</span><p>This record intentionally contains no architecture, metrics, dates, links, or outcomes that are absent from the verified workspace evidence.</p></div><section className="record-contact" data-testid="project-contact-section"><h2 data-testid="project-contact-heading">Discuss the engineering context</h2><Link className="primary-action" to="/portfolio/contact" data-testid="project-contact-link">Contact Akmal <ArrowUpRight aria-hidden="true" /></Link></section></article>;
}