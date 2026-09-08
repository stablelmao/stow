# Stow

A compact, production-ready file host built with Next.js 16, Clerk, and Vercel Blob. It includes Google account sign-in, direct-to-Blob uploads up to 2 GB, per-user file libraries, copyable public links, and authenticated deletion.

The app runs in a polished preview mode when credentials are absent, so the UI can be reviewed before any services are connected.

## Run locally

Requirements: Node.js 20.9+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Connect Google sign-in

1. Create or link a Vercel project.
2. Add Clerk from the Vercel Marketplace: `vercel integration add clerk`.
3. In Clerk, open **SSO connections** and enable **Google**. Clerk development instances can use shared OAuth credentials; production should use your own Google OAuth credentials and approved domains.
4. Pull the generated variables locally with `vercel env pull .env.local`.

The app expects:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
```

## Connect file storage

1. In the Vercel project, open **Storage** and create a Blob store.
2. Connect it to the project. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically.
3. Pull the variable locally again with `vercel env pull .env.local`.

Uploads are sent directly from the browser to Vercel Blob using short-lived upload tokens. The token route verifies the Clerk session and restricts every pathname to the authenticated user’s ID. Files are public-by-link; library listing and deletion stay account-scoped.

## Deploy

```bash
vercel
```

Or import the repository in the Vercel dashboard. No custom build settings are required.

## Commands

```bash
pnpm dev      # local development
pnpm build    # production build
pnpm start    # run the production server
pnpm lint     # ESLint
```

