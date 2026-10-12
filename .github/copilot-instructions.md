# Project: Campus AI Agent
A university information system (alternative/complement to Platonus). The system stores data and runs processes; an AI Agent is an intelligent interface on top of it. This is NOT a hackathon MVP: write production-oriented, extensible code.

## Phase 1 scope
Roles implemented now: STUDENT and ADMIN. Roles TEACHER, CURATOR, DEAN_OFFICE exist in the RBAC enum and DB but have no UI yet.
Student: Dashboard, Profile, Academic Profile, Curriculum, Schedule, Grades/GPA, Documents, Requests/Applications, Notifications, Campus Info, AI Agent.
Admin: manage students, programs, groups, subjects, curricula, semesters, schedule, classrooms, grades (manual + CSV import), process applications.

## Stack
- Monorepo with pnpm workspaces: apps/api (NestJS), apps/web (Next.js App Router, Tailwind, shadcn/ui), packages/shared (shared TS types and zod schemas).
- PostgreSQL + Prisma (migrations, seed). TypeScript strict mode everywhere.
- Validation: zod (shared) / class-validator in API. API docs: Swagger (OpenAPI). Tests: Jest (api), Vitest/Playwright later (web).
- Logging: pino. Config via environment variables only (@nestjs/config with validation). Never hardcode secrets or API keys.

## Architecture rules
1. All business logic lives in the backend services. Frontend only calls the REST API.
2. Authorization is ALWAYS checked on the backend: JwtAuthGuard + RolesGuard + ownership checks (a student can only access their own data).
3. The AI layer NEVER touches the database directly. It calls a registry of strictly typed tools that call backend services with the current user's identity and permissions.
4. AI is not the source of truth. Official data (grades, schedule, documents) comes from the DB.
5. Critical/mutating AI actions require explicit user confirmation (two-step: propose -> confirm).
6. Every important action (by a user or by the AI) is written to an audit log: actor, actorType (USER|AI), action, entity, before/after, confirmed flag, timestamp.
7. Do not couple business logic to external systems (Platonus, LMS, accounting, library, access control). Put them behind interfaces in an integrations module.
8. Use consistent error handling (global exception filter, typed error codes), DTO validation on every endpoint, pagination on list endpoints.

## Code style
Small modules (controller, service, dto, tests per feature). Explicit return types. No `any`. Meaningful names. Write unit tests for business logic (GPA, curriculum progress, RBAC).
