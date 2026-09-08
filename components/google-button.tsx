"use client";

import { SignInButton } from "@clerk/nextjs";
import { UserCircle } from "@phosphor-icons/react";
import Link from "next/link";

export function GoogleButton({ configured, compact = false }: { configured: boolean; compact?: boolean }) {
  const inner = (
    <span className={`google-button ${compact ? "compact" : ""}`}>
      <UserCircle size={compact ? 17 : 19} weight="bold" aria-hidden="true" />
      <span>{configured ? "Sign in" : "Explore preview"}</span>
    </span>
  );

  if (!configured) return <Link href="/drive">{inner}</Link>;

  return (
    <SignInButton mode="modal" forceRedirectUrl="/drive">
      <button className="button-reset">{inner}</button>
    </SignInButton>
  );
}

