import { ArrowDown, ArrowUpRight, Database, RadioTower, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";
import { usePageMeta } from "@/hooks/usePageMeta";

const disciplines = [{ icon: Database, name: "Machine Learning Engineering" }, { icon: Waves, name: "Climate Intelligence" }, { icon: RadioTower, name: "IoT Telemetry" }];
export default function HomePage() {
  const reduceMotion = useReducedMotion();
  usePageMeta("Akmaludien Ramadhan | ML & Climate Intelligence", "Portfolio of Akmaludien Ramadhan, focused on machine learning, climate intelligence, IoT telemetry, and environmental data analytics.");
  return <>
    <section className="hero" data-testid="home-hero-section"><div className="hero-media" aria-hidden="true" /><motion.div className="hero-content" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <p className="eyebrow" data-testid="hero-specialization-label">ML engineering · environmental systems</p><h1 data-testid="hero-heading">Engineering intelligence from climate and telemetry data.</h1>
      <p className="hero-summary" data-testid="hero-summary">Akmaludien Ramadhan works across machine learning, climate intelligence, IoT telemetry, and environmental data analytics.</p>
      <div className="hero-actions"><a className="primary-action" href="#projects" data-testid="hero-projects-link">Review selected work <ArrowDown aria-hidden="true" /></a><Link className="secondary-action" to="/portfolio/contact" data-testid="hero-contact-link">Contact <ArrowUpRight aria-hidden="true" /></Link></div>
    </motion.div></section>
    <section className="discipline-band" aria-label="Areas of focus" data-testid="discipline-band">{disciplines.map(({ icon: Icon, name }, index) => <div key={name} data-testid={`discipline-${index + 1}`}><span className="discipline-index">0{index + 1}</span><Icon aria-hidden="true" /><span>{name}</span></div>)}</section>
    <section id="projects" className="section-shell" data-testid="selected-projects-section"><div className="section-heading"><div><p className="eyebrow" data-testid="projects-eyebrow">Selected work / 02</p><h2 data-testid="projects-heading">Flagship project records</h2></div><p data-testid="projects-description">A focused view of the two projects central to Akmaludien’s engineering portfolio.</p></div><div className="project-grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></section>
    <section className="evidence-band" data-testid="evidence-standard-section"><p className="eyebrow" data-testid="evidence-eyebrow">Evidence standard</p><h2 data-testid="evidence-heading">Verified claims first. Unsupported detail stays unpublished.</h2><p data-testid="evidence-description">Architecture, evaluation, credentials, and research are included only when source material can support them.</p><Link className="text-link" to="/portfolio/research" data-testid="research-center-link">Research Center <ArrowUpRight aria-hidden="true" /></Link></section>
  </>;
}