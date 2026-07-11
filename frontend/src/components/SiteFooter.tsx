import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="site-footer" data-testid="site-footer">
    <div className="footer-signature">
      <span className="footer-monogram" aria-hidden="true">AR</span>
      <div><p className="eyebrow" data-testid="footer-availability-label">Machine learning · Climate · IoT</p><h2 data-testid="footer-heading">Build systems that make environmental data useful.</h2></div>
    </div>
    <Link className="text-link" to="/portfolio/contact" data-testid="footer-contact-link">Start a conversation <ArrowUpRight aria-hidden="true" /></Link>
    <p className="copyright" data-testid="copyright-text">© {new Date().getFullYear()} Akmaludien Ramadhan</p>
  </footer>
);