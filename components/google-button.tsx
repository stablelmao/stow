"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { UserCircle } from "@phosphor-icons/react";
import Link from "next/link";

export function GoogleButton({ configured, compact = false }: { configured: boolean; compact?: boolean }) {
  if (!configured) return (
    <Link href="/drive" className={`google-button ${compact ? "compact" : ""}`}>
      <UserCircle size={compact ? 17 : 19} weight="bold" aria-hidden="true" />
      <span>Explore preview</span>
    </Link>
  );

  return <AuthenticatedActions compact={compact} />;
}

function AuthenticatedActions({ compact }: { compact: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className={`auth-actions ${compact ? "compact" : ""}`} aria-hidden="true" />;
  }

  if (isSignedIn) {
    return (
      <div className={`auth-actions ${compact ? "compact" : ""}`}>
        <a href="/drive" className={`google-button ${compact ? "compact" : ""}`}>Open drive</a>
        {compact ? <UserButton /> : null}
      </div>
    );
  }

  return (
    <div className={`auth-actions ${compact ? "compact" : ""}`}>
      {/* A document navigation lets Clerk synchronize its session before auth routes run. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/sign-in" className={`google-button ${compact ? "compact" : ""}`}>
        <UserCircle size={compact ? 17 : 19} weight="bold" aria-hidden="true" />
        <span>Sign in</span>
      </a>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/sign-up" className={`create-account-button ${compact ? "compact" : ""}`}>Create account</a>
    </div>
  );
}
