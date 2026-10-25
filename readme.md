# Issue Tracker API

REST API for projects, members, issues and comments.
Node.js · TypeScript · Express · PostgreSQL · Prisma · Zod · JWT

## Setup

1. Install Node.js (LTS) and PostgreSQL. Create two empty databases:
   `createdb issue_tracker` and `createdb issue_tracker_test`
2. `npm install`
3. `cp .env.example .env` and `cp .env.test.example .env.test`, then fill in the values
4. `npm run db:migrate` (creates the tables)
5. `npm run dev` → http://localhost:3000/api/v1/health

## Environment variables

| Name           | Purpose                                  |
| -------------- | ---------------------------------------- |
| `NODE_ENV`     | `development`, `test` or `production`    |
| `PORT`         | HTTP port (default 3000)                 |
| `DATABASE_URL` | PostgreSQL connection string             |
| `JWT_SECRET`   | Secret for signing tokens (min 32 chars) |

## Scripts

| Command                       | What it does                            |
| ----------------------------- | --------------------------------------- |
| `npm run dev`                 | Start with auto-reload                  |
| `npm run build` / `npm start` | Compile and run the compiled app        |
| `npm run typecheck`           | Type-check without emitting files       |
| `npm run db:migrate`          | Create/apply a migration in development |
| `npm run db:deploy`           | Apply existing migrations (deployment)  |
| `npm run db:generate`         | Regenerate the Prisma client            |
| `npm test`                    | Run the tests against the test database |

## Endpoints

(All under `/api/v1`. Errors look like `{ "error": { "code", "message" } }`.)

| Method        | Path                                   | Access                                                         |
| ------------- | -------------------------------------- | -------------------------------------------------------------- |
| GET           | `/health`                              | Public                                                         |
| POST          | `/auth/register`, `/auth/login`        | Public                                                         |
| GET, PATCH    | `/users/me`                            | Authenticated                                                  |
| POST, GET     | `/projects`                            | Authenticated                                                  |
| GET           | `/projects/:projectId`                 | Member / admin                                                 |
| PATCH, DELETE | `/projects/:projectId`                 | Owner / admin                                                  |
| POST          | `/projects/:projectId/members`         | Owner / admin                                                  |
| DELETE        | `/projects/:projectId/members/:userId` | Owner / admin                                                  |
| POST, GET     | `/projects/:projectId/issues`          | Member / admin                                                 |
| GET           | `/issues/:issueId`                     | Member / admin                                                 |
| PATCH         | `/issues/:issueId`                     | Reporter / assignee / owner / admin (assigning: owner / admin) |
| DELETE        | `/issues/:issueId`                     | Owner / admin                                                  |
| POST, GET     | `/issues/:issueId/comments`            | Member / admin                                                 |
| PATCH, DELETE | `/comments/:commentId`                 | Author / owner / admin                                         |

## Issue list query

`GET /projects/:projectId/issues`

| Param                      | Default  | Rule                                                              |
| -------------------------- | -------- | ----------------------------------------------------------------- |
| `page`                     | 1        | integer ≥ 1                                                       |
| `limit`                    | 20       | 1–100                                                             |
| `status`                   | –        | `TODO`, `IN_PROGRESS`, `DONE`                                     |
| `priority`                 | –        | `LOW`, `MEDIUM`, `HIGH`                                           |
| `assigneeId`, `reporterId` | –        | user id                                                           |
| `search`                   | –        | 1–100 chars, matches title/description, case-insensitive          |
| `sortBy`                   | `number` | `number`, `title`, `priority`, `status`, `createdAt`, `updatedAt` |
| `order`                    | `desc`   | `asc`, `desc`                                                     |

Response: `{ "issues": [...], "pagination": { "page", "limit", "totalItems", "totalPages" } }`

## Indexes

| Index                          | Query it supports                            |
| ------------------------------ | -------------------------------------------- |
| `ProjectMember(userId)`        | `GET /projects` for non-admin users          |
| `Issue(projectId, status)`     | issue list filtered by status                |
| `Issue(projectId, assigneeId)` | issue list filtered by assignee              |
| `Comment(issueId)`             | comment list, and cascade delete of an issue |

## Sample requests

```bash
curl -X POST localhost:3000/api/v1/auth/register -H "Content-Type: application/json" \
  -d '{"email":"ali@test.com","password":"12345678"}'

curl -X POST localhost:3000/api/v1/auth/login -H "Content-Type: application/json" \
  -d '{"email":"ali@test.com","password":"12345678"}'     # → { "accessToken": "..." }

curl -X POST localhost:3000/api/v1/projects -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"name":"Website","key":"WEB"}'

curl "localhost:3000/api/v1/projects/1/issues?status=TODO&search=login&sortBy=createdAt&order=desc&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```
