import type { NavItem, Project } from "@/types/portfolio";

export const projects: Project[] = [
  { slug: "rainfall-monitoring", title: "Rainfall Monitoring and Prediction", discipline: "Climate intelligence", focus: "Environmental data analytics", index: "01" },
  { slug: "skd-learning-platform", title: "SKD Learning Platform", discipline: "Learning systems", focus: "Software engineering", index: "02" },
];

export const navItems: NavItem[] = [
  { label: "Home", to: "/portfolio" },
  { label: "Projects", to: "/portfolio#projects" },
  { label: "Research", to: "/portfolio/research" },
  { label: "Contact", to: "/portfolio/contact" },
];