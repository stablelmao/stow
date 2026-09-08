"use client";

import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { Brand } from "./brand";

export function DriveHeader({ configured }: { configured: boolean }) {
  return (
    <header className="drive-header container">
      <Brand />
      <span className="drive-label">PERSONAL DRIVE</span>
      <div className="account-slot">
        {configured ? <UserButton /> : <Link href="/"><ArrowLeft size={17} /> Preview mode</Link>}
      </div>
    </header>
  );
}

