import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/config";

export default function SignUpPage() {
  if (!isClerkConfigured) return <main className="auth-page">Authentication is not configured yet.</main>;
  return <main className="auth-page"><SignUp /></main>;
}

