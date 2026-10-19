# Campus AI Agent

Campus AI Agent is a university information system that brings student and administrative services together, with an AI assistant as an intelligent interface to official university data and processes.

## Monorepo structure

- `apps/api` — NestJS backend.
- `apps/mobile` — Expo React Native app and the main student/admin interface.
- `apps/web` — Next.js website; postponed.
- `packages/shared` — shared TypeScript types and Zod schemas.

## Setup on Windows

Prerequisites: install Node.js, pnpm, and Docker Desktop, then open PowerShell at the repository root.

1. Install workspace dependencies:

   ```powershell
   pnpm install
   ```

2. Start the local services:

   ```powershell
   docker compose up -d
   ```

3. Create the API environment file:

   ```powershell
   Copy-Item apps\api\.env.example apps\api\.env
   ```

4. Start the API from the repository root. It runs on port `4000`:

   ```powershell
   pnpm dev:api
   ```

5. In a separate PowerShell window, start the mobile app from its directory:

   ```powershell
   cd apps\mobile
   pnpm start --tunnel
   ```

The repository uses `.npmrc` with `node-linker=hoisted` for Expo compatibility.
