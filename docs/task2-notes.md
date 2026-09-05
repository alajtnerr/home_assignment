# Task 2: Frontend Testing — Notes & Decisions

## Scope

The assignment describes a generic scenario ("You are testing a web application built using Angular") without pointing to a specific, live application. Rather than writing tests against an assumed/hypothetical form structure, a small real Angular application was built specifically to make the Login E2E tests genuinely executable and verifiable — not just theoretical code.

## Why a purpose-built app instead of an existing public site

A few alternatives were considered and ruled out along the way:

- **The ALDI US site itself** — inspecting its bundled JavaScript (`createElement`, `useState`, `useContext` calls, and references to "Instacart") showed it's a **React** application (running on the Instacart platform), not Angular, so it doesn't fit the assignment's stated scenario.
- **Public Angular auth demos** (e.g. the RealWorld "Conduit" app) — these either lacked a real password-based login, lacked a registration flow, or (as happened during testing) went down entirely due to an external DNS/infrastructure issue outside our control. Relying on a third-party demo for a graded deliverable introduces exactly this kind of flakiness risk.

Building a minimal app removes that dependency entirely: the tests run against something fully under our control, with a genuine backend, and can be re-run reliably at any time (including by a reviewer).

## What was built

- **`mock-app/`** — a minimal Angular 22 application (Angular CLI default scaffold) with three routes: `/login`, `/register`, `/home`. Uses template-driven forms (`FormsModule`) and calls a backend via `HttpClient`.
- **`mock-backend/`** — a minimal Express server with an in-memory user store and three endpoints: `POST /api/register`, `POST /api/login`, `DELETE /api/users/:email`.

## Test data strategy

Each test (`beforeEach`) registers a **fresh, uniquely-named user** via a direct API call (not through the UI — faster and decoupled from the login flow itself), then exercises the login UI. `afterEach` deletes that user via the API. This keeps every test run isolated and repeatable, with no leftover data between runs — this was a deliberate design goal from the start, and is only possible because the backend is self-hosted (public demo APIs generally don't expose a delete-user endpoint).

## Notable issue found and fixed along the way

Angular 22 defaults to **zoneless change detection**. A plain class field (`errorMessage = ''`) updated inside an RxJS `subscribe()` callback did not trigger a UI update, because there's no `zone.js` patching async callbacks anymore. The fix was to use a `signal('')` for the error message instead of a plain field, and call it as a function in the template (`errorMessage()`). This is a real, current Angular gotcha worth knowing for any Angular 20+ project.

## Docker (see Bonus Questions section)

Both `mock-app` and `mock-backend` have their own `Dockerfile`, orchestrated by a root-level `docker-compose.yml`. This doubles as the practical, working example for the Docker bonus question (see the assignment's Bonus Questions answers).
