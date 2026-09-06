# Task 3: API Testing — Endpoint Overview

Tested against the Task Management endpoints added to the mock-backend (see `mock-backend/index.js` and [`docs/task2-notes.md`](./task2-notes.md) for why a self-hosted backend was used instead of a public API).

## Endpoints & Expected Behavior

| Method | Endpoint | Success | Failure |
|---|---|---|---|
| `POST` | `/api/tasks` | `201 Created` — returns the created task (`id`, `title`, `description`, `completed`) | `400 Bad Request` if `title` is missing/not a string |
| `GET` | `/api/tasks/{id}` | `200 OK` — returns the matching task | `404 Not Found` if no task exists with that id |
| `PUT` | `/api/tasks/{id}` | `200 OK` — returns the updated task (only provided fields are changed) | `404 Not Found` if no task exists with that id |
| `DELETE` | `/api/tasks/{id}` | `204 No Content` — empty body | `404 Not Found` if no task exists with that id |

## Sample response bodies

**`POST /api/tasks`** (request: `{ "title": "Write test report", "description": "Summarize findings", "completed": false }`)
```json
{
  "id": "b3f1c2a0-...",
  "title": "Write test report",
  "description": "Summarize findings",
  "completed": false
}
```

**`GET /api/tasks/{id}`** (not found)
```json
{ "error": "Task not found." }
```

**`POST /api/tasks`** (missing title)
```json
{ "error": "Title is required and must be a string." }
```

## Test suite

See [`tests/tasks-api.spec.js`](../tests/tasks-api.spec.js) — 8 tests covering the success and failure path for all four endpoints, using Playwright's built-in `request` fixture (no browser needed for pure API tests). Each `GET`/`PUT`/`DELETE` test creates its own task via `POST` in a `beforeEach`, so tests don't depend on each other or on ordering.
