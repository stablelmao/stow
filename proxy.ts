import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/config";

const isProtectedRoute = createRouteMatcher(["/drive(.*)", "/api(.*)"]);
const clerkHandler = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();
}, {
  frontendApiProxy: { enabled: true },
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured) return NextResponse.next();
  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
