import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/config";

export default function SignInPage() {
  if (!isClerkConfigured) return <main className="auth-page">Authentication is not configured yet.</main>;
  return <main className="auth-page"><SignIn forceRedirectUrl="/drive" /></main>;
}
