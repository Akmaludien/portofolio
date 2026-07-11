import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "@/data/portfolio";
import { ThemeToggle } from "@/components/ThemeToggle";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const closeMenu = () => { setOpen(false); requestAnimationFrame(() => menuRef.current?.focus()); };
  return (
    <header className="site-header" data-testid="site-header">
      <div className="header-inner">
        <Link className="brand" to="/portfolio" aria-label="Akmaludien Ramadhan portfolio home" data-testid="brand-home-link">
          <span className="brand-mark" aria-hidden="true"><b>A</b><b>R</b></span>
          <span className="brand-copy"><strong>Akmaludien Ramadhan</strong><small>ML · Climate Systems</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary" data-testid="desktop-navigation">
          {navItems.map((item) => <Link key={item.label} to={item.to} aria-current={pathname === item.to ? "page" : undefined} data-testid={`desktop-${item.label.toLowerCase()}-link`}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button ref={menuRef} className="icon-button mobile-menu-trigger" type="button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)} data-testid="mobile-menu-open-button"><Menu aria-hidden="true" /></button>
        </div>
      </div>
      {open && <div className="mobile-menu" data-testid="mobile-navigation-panel">
        <button ref={closeRef} className="icon-button mobile-close" type="button" aria-label="Close navigation" onClick={closeMenu} data-testid="mobile-menu-close-button"><X aria-hidden="true" /></button>
        <nav aria-label="Mobile primary" data-testid="mobile-navigation">
          {navItems.map((item, index) => <Link key={item.label} to={item.to} onClick={closeMenu} data-testid={`mobile-${item.label.toLowerCase()}-link`}><span>0{index + 1}</span>{item.label}</Link>)}
        </nav>
      </div>}
    </header>
  );
};