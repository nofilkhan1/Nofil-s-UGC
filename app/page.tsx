import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Camera, CircleDollarSign, Layers3 } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <header className="public-nav page-frame"><BrandMark /><nav className="cluster" aria-label="Public navigation"><Link href="/auth/sign-in" className="button button--ghost">Sign in</Link><Link href="/auth/sign-up" className="button button--primary">Join CreatorDock <ArrowRight size={16} aria-hidden="true" /></Link></nav></header>
        <div className="hero__grid page-frame">
          <div className="hero__content">
            <p className="eyebrow">The simpler UGC casting desk</p>
            <h1 className="hero__title">Post the brief. <em>Meet the right creators.</em></h1>
            <p className="hero__copy">Brands publish focused Instagram and TikTok campaigns. Creators apply with a clear per-post quote. Every decision stays visible in one calm workspace.</p>
            <div className="cluster" style={{ marginTop: "1.8rem" }}><Link href="/auth/sign-up?role=brand" className="button button--primary">Post a campaign <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/auth/sign-up?role=creator" className="button button--secondary">Join as a creator</Link></div>
          </div>
          <div className="casting-stack" aria-label="Campaign and creator preview">
            <article className="casting-card casting-card--one"><div className="casting-card__top"><span className="badge badge--instagram"><Camera size={13} aria-hidden="true" /> Instagram</span><span className="badge badge--success">Open call</span></div><h2 style={{ marginTop: "1rem" }}>Summer skin routine</h2><p className="muted">3 honest, product-led Reels for a clean skincare launch.</p><div className="metric-strip"><span className="metric"><small className="muted">Posts</small><strong>3 Reels</strong></span><span className="metric"><small className="muted">Starts</small><strong>Jun 12</strong></span><span className="metric"><small className="muted">Applied</small><strong>18</strong></span></div></article>
            <article className="casting-card casting-card--two"><div className="mini-profile"><span className="mini-profile__avatar" aria-hidden="true" /><span><strong>Maya Chen</strong><small className="muted" style={{ display: "block" }}>Beauty & everyday lifestyle</small></span></div><div className="metric-strip"><span className="metric"><small className="muted">Quote</small><strong>$180 / post</strong></span><span className="metric"><small className="muted">Portfolio</small><strong>12 pieces</strong></span><span className="metric"><small className="muted">Status</small><strong>Pending</strong></span></div></article>
            <article className="casting-card casting-card--three"><div className="casting-card__top"><span className="cluster"><BadgeCheck color="var(--color-success)" aria-hidden="true" /><span><strong>Creator approved</strong><small className="muted" style={{ display: "block" }}>Maya has been notified.</small></span></span></div></article>
          </div>
        </div>
      </section>
      <section className="how-it-works page-frame" id="how-it-works"><p className="eyebrow">One clean handoff</p><h2 className="page-title" style={{ maxWidth: "14ch" }}>From open call to creator selection.</h2><div className="steps"><article className="step"><Layers3 aria-hidden="true" /><h3>Publish the requirements</h3><p className="muted">Choose Instagram or TikTok, describe the content, set post count, and define the campaign window.</p></article><article className="step"><CircleDollarSign aria-hidden="true" /><h3>Creators apply with a quote</h3><p className="muted">Every application includes a creator profile, portfolio links, and a clear price per post.</p></article><article className="step"><CalendarDays aria-hidden="true" /><h3>Decide and notify</h3><p className="muted">Brands approve or reject from the applicant list. The creator gets an in-app decision instantly.</p></article></div></section>
    </>
  );
}
