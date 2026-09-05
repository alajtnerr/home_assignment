# QA Engineer Homework Assignment

This repository contains my submission for the QA Engineer homework assignment: manual test design, end-to-end frontend testing, and API testing using Playwright with JavaScript.

## Structure

```
home_assignment/
├── docs/
│   ├── task1-manual-testing.md   # Task 1: manual test cases + bug report
│   ├── task2-notes.md            # Task 2: decisions & notes
│   └── screenshots/
├── mock-app/                     # Task 2: purpose-built Angular login app
├── mock-backend/                 # Task 2: minimal Express API backing mock-app
├── pages/
│   └── LoginPage.js              # Task 2: Page Object for the login flow
├── tests/
│   ├── login.spec.js             # Task 2: Angular login E2E tests
│   └── tasks-api.spec.js         # Task 3: Task management API tests
├── docker-compose.yml            # Bonus: containerized mock-app + mock-backend
├── .github/workflows/            # CI pipeline (GitHub Actions)
├── playwright.config.js
├── package.json
└── README.md
```

## Tasks

- **Task 1 — Manual Testing:** see [`docs/task1-manual-testing.md`](./docs/task1-manual-testing.md) for the test cases and bug report for the Saved List feature.
- **Task 2 — Frontend Testing:** Playwright E2E tests for a Login feature, covering successful login, invalid-password handling, and empty-field validation. See [`docs/task2-notes.md`](./docs/task2-notes.md) for why a purpose-built Angular app + backend were used instead of an existing public site.
- **Task 3 — API Testing:** Playwright test suite for the Task Management API (`POST`, `GET`, `PUT`, `DELETE /tasks`).

## Setup

```bash
npm install
npx playwright install
```

### Task 2 prerequisites

The Login E2E tests target a small local Angular app + backend (see `mock-app/` and `mock-backend/`). Either run them natively, or via Docker (recommended — see below).

**Native:**
```bash
cd mock-backend && npm install && node index.js
```
In a separate terminal:
```bash
cd mock-app && npm install && ng serve
```

**Docker (recommended):**
```bash
docker compose up --build
```
This starts both services with a single command — see the Docker bonus answer for more detail.

## Running the tests

```bash
npx playwright test
```

To view the HTML report after a run:

```bash
npx playwright show-report
```

## CI

Tests run automatically on every push and pull request via GitHub Actions (see `.github/workflows/`).
