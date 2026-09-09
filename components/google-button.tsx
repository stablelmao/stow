"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UserCircle } from "@phosphor-icons/react";
import Link from "next/link";

export function GoogleButton({ configured, compact = false }: { configured: boolean; compact?: boolean }) {
  if (!configured) return (
    <Link href="/drive" className={`google-button ${compact ? "compact" : ""}`}>
      <UserCircle size={compact ? 17 : 19} weight="bold" aria-hidden="true" />
      <span>Explore preview</span>
    </Link>
  );

  return (
    <div className={`auth-actions ${compact ? "compact" : ""}`}>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/drive">
          <button className={`google-button ${compact ? "compact" : ""}`}>
            <UserCircle size={compact ? 17 : 19} weight="bold" aria-hidden="true" />
            <span>Sign in</span>
          </button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/drive">
          <button className={`create-account-button ${compact ? "compact" : ""}`}>Create account</button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Link href="/drive" className={`google-button ${compact ? "compact" : ""}`}>Open drive</Link>
        {compact ? <UserButton /> : null}
      </SignedIn>
    </div>
  );
}

