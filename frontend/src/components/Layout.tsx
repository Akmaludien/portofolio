import { Outlet } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const Layout = () => <><a className="skip-link" href="#main-content" data-testid="skip-to-content-link">Skip to content</a><SiteHeader /><main id="main-content" tabIndex={-1}><Outlet /></main><SiteFooter /></>;