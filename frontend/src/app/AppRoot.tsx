import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";

const ContactPage = lazy(() => import("@/pages/ContactPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProjectPage = lazy(() => import("@/pages/ProjectPage"));
const ResearchPage = lazy(() => import("@/pages/ResearchPage"));

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname, hash]);
  return null;
}

// Fallback loader for code-split routes
function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', opacity: 0.5 }}>
      <div className="spin" style={{ width: '2rem', height: '2rem', border: '2px solid', borderRadius: '50%', borderTopColor: 'transparent' }} aria-hidden="true" />
    </div>
  );
}

export default function AppRoot() { 
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/portfolio" element={<HomePage />} />
            <Route path="/portfolio/projects/:slug" element={<ProjectPage />} />
            <Route path="/portfolio/research" element={<ResearchPage />} />
            <Route path="/portfolio/contact" element={<ContactPage />} />
          </Route>
          <Route path="/portofolio/*" element={<Navigate to="/portfolio" replace />} />
          <Route path="*" element={<Navigate to="/portfolio" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  ); 
}