# Stow: Clerk and Blob setup

## 1. Clerk authentication

Create a Stow application at https://dashboard.clerk.com/.
Under User & authentication, enable email, phone number, and username. Configure email verification and phone SMS verification. Enable passwords if you want username-and-password login: a username is an identifier, not a verification method. Review required sign-up fields so users are not forced to provide all three identifiers unless that is intentional.

Under SSO connections, add Google and Apple for all users and enable sign-up and sign-in. Development instances use shared social credentials. Production requires your own Google OAuth credentials and Apple credentials. Follow the exact callback/return URLs shown by Clerk.

Google: https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google
Apple: https://clerk.com/docs/guides/configure/auth-strategies/social-connections/apple
Authentication options: https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options

Apple production requires an Apple Developer account, Team ID, Services ID, Key ID, and private key. Configure Apple's private email relay as described in the guide. Keep provider credentials in Clerk, not the repository.

For phone authentication, review Clerk's current SMS availability, allowed countries, and billing settings before testing real messages.

## 2. Vercel environment variables

Import stablelmao/stow as a Next.js project with root directory ./.
In Settings > Environment Variables, add keys from the same Clerk instance:

| Name | Value |
| --- | --- |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk publishable key |
| CLERK_SECRET_KEY | Clerk secret key |
| NEXT_PUBLIC_CLERK_SIGN_IN_URL | /sign-in |
| NEXT_PUBLIC_CLERK_SIGN_UP_URL | /sign-up |

Choose the intended Vercel environments. Use development keys for testing and production keys for launch. Never commit secret keys.

## 3. Blob storage

In Vercel Storage, create a Blob store named stow-files with Public access and connect it to the stow project. Confirm BLOB_READ_WRITE_TOKEN was added to the appropriate environments. Stow's current upload code requires a public store: anyone holding a file URL can download it. File listing and deletion require the owner's account.

Guide: https://vercel.com/docs/vercel-blob/client-upload

## 4. Deploy and test

Deploy or redeploy after configuring environment variables. Sign in through each enabled method. Open Account settings to manage profile details and security options supported by your Clerk configuration; use the avatar menu to sign out. Upload a small file, copy its URL, open it in another browser, and delete it from your drive.

Clerk's sign-in dialog controls which methods appear. Enabling a method in the dashboard does not require another custom login implementation in Stow.

Before public launch, complete Clerk production domain/DNS setup and provider credentials, switch Vercel to the corresponding live keys, and redeploy.
https://clerk.com/docs/guides/development/deployment/production

