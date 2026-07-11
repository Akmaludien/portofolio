import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ResearchPage() {
  usePageMeta("Research Center | Akmaludien Ramadhan", "Research center for verified publications and environmental data work by Akmaludien Ramadhan.");
  return <section className="record-page research-page" data-testid="research-page"><Link className="back-link" to="/portfolio" data-testid="research-back-link"><ArrowLeft aria-hidden="true" /> Portfolio</Link><header className="record-header"><p className="eyebrow" data-testid="research-eyebrow">Research center</p><h1 data-testid="research-heading">Research, with a traceable source.</h1><p data-testid="research-summary">Public research records are limited to materials available for direct verification.</p></header><div className="research-principle" data-testid="research-verification-standard"><ShieldCheck aria-hidden="true" /><div><h2 data-testid="research-standard-heading">Verification standard</h2><p data-testid="research-standard-description">Abstracts, methods, citations, documents, and publication links are published together—never inferred from incomplete records.</p></div></div></section>;
}