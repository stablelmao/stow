import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { isClerkConfigured } from "@/lib/config";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Stow — File sharing, minus the fuss",
  description: "A private, fast file host built for simple sharing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = <body>{children}</body>;

  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      {isClerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content}
    </html>
  );
}

