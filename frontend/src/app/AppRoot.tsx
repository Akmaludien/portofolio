import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import ContactPage from "@/pages/ContactPage";
import HomePage from "@/pages/HomePage";
import ProjectPage from "@/pages/ProjectPage";
import ResearchPage from "@/pages/ResearchPage";

export default function AppRoot() { return <BrowserRouter><Routes><Route element={<Layout />}><Route path="/portfolio" element={<HomePage />} /><Route path="/portfolio/projects/:slug" element={<ProjectPage />} /><Route path="/portfolio/research" element={<ResearchPage />} /><Route path="/portfolio/contact" element={<ContactPage />} /></Route><Route path="/portofolio/*" element={<Navigate to="/portfolio" replace />} /><Route path="*" element={<Navigate to="/portfolio" replace />} /></Routes></BrowserRouter>; }