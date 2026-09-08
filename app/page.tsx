import Link from "next/link";
import { ArrowRight, CheckCircle, Lightning, LockKey, ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";
import { GoogleButton } from "@/components/google-button";
import { LandingPreview } from "@/components/landing-preview";
import { isClerkConfigured } from "@/lib/config";

export default function Home() {
  return (
    <main>
      <header className="site-header container">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#why">Why Stow</a>
          <a href="#how">How it works</a>
        </nav>
        <GoogleButton configured={isClerkConfigured} compact />
      </header>

      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span>NO CLUTTER</span><i /> <span>NO COMPRESSION</span></div>
          <h1>Send files.<br />Keep your <em>cool.</em></h1>
          <p>Fast, private file sharing without the folders, friction, or “storage almost full” warnings.</p>
          <div className="hero-actions">
            <GoogleButton configured={isClerkConfigured} />
            <span className="microcopy"><CheckCircle size={17} weight="fill" /> Free to start · no card</span>
          </div>
          {!isClerkConfigured && (
            <p className="setup-note">Preview mode is on. Connect Clerk and Vercel Blob to make sign-in and uploads live.</p>
          )}
        </div>
        <div className="hero-visual"><LandingPreview /></div>
      </section>

      <section className="signal-strip" aria-label="Product benefits">
        <div className="container signal-inner">
          <span><Lightning size={18} weight="fill" /> Direct, full-speed uploads</span>
          <span><LockKey size={18} weight="fill" /> Account-scoped storage</span>
          <span><ShareNetwork size={18} weight="fill" /> One-click share links</span>
        </div>
      </section>

      <section className="why container" id="why">
        <div className="section-kicker">WHY STOW</div>
        <div className="why-grid">
          <h2>Your files don’t need a productivity suite.</h2>
          <div className="why-copy">
            <p>Stow does one job: it gets a file from your screen to a shareable link, quickly and safely.</p>
            <Link href="/drive">Open your drive <ArrowRight size={18} /></Link>
          </div>
        </div>
        <div className="steps" id="how">
          <article><b>01</b><h3>Your account, your choice</h3><p>Choose an available sign-in method: email, phone, username, Apple, or Google. Manage your profile and security from Account settings.</p></article>
          <article><b>02</b><h3>Drop a file</h3><p>Upload directly to Vercel Blob—no server bottleneck.</p></article>
          <article><b>03</b><h3>Share the link</h3><p>Copy a clean, fast public URL in one click.</p></article>
        </div>
      </section>

      <footer className="container footer"><Brand /><span>Built for the files that just need to get there.</span><span>© {new Date().getFullYear()}</span></footer>
    </main>
  );
}

