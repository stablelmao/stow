"use client";

import { UserButton, useClerk } from "@clerk/nextjs";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { Brand } from "./brand";

function AccountControls() {
  const { openUserProfile } = useClerk();
  return <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <button className="button-reset" style={{ fontSize: 12, fontWeight: 700 }} onClick={() => openUserProfile()}>Account settings</button>
    <UserButton />
  </div>;
}

export function DriveHeader({ configured }: { configured: boolean }) {
  return (
    <header className="drive-header container">
      <Brand />
      <span className="drive-label">PERSONAL DRIVE</span>
      <div className="account-slot">
        {configured ? <AccountControls /> : <Link href="/"><ArrowLeft size={17} /> Preview mode</Link>}
      </div>
    </header>
  );
}

