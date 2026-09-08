"use client";

import { SignInButton } from "@clerk/nextjs";
import { GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";

export function GoogleButton({ configured, compact = false }: { configured: boolean; compact?: boolean }) {
  const inner = (
    <span className={`google-button ${compact ? "compact" : ""}`}>
      <GoogleLogo size={compact ? 17 : 19} weight="bold" aria-hidden="true" />
      <span>{compact ? "Sign in" : "Continue with Google"}</span>
    </span>
  );

  if (!configured) return <Link href="/drive">{inner}</Link>;

  return (
    <SignInButton mode="modal" forceRedirectUrl="/drive">
      <button className="button-reset">{inner}</button>
    </SignInButton>
  );
}

