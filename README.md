# ALDI US — QA Engineer Homework Assignment

This repository contains my submission for the QA Engineer homework assignment: manual test design, end-to-end frontend testing, and API testing using Playwright with JavaScript.

## Structure

```
home_assignment/
├── docs/
│   └── task1-manual-testing.md   # Task 1: manual test cases + bug report
├── tests/
│   ├── login.spec.js             # Task 2: Angular login E2E tests
│   └── tasks-api.spec.js         # Task 3: Task management API tests
├── .github/workflows/            # CI pipeline (GitHub Actions)
├── playwright.config.js
├── package.json
└── README.md
```

## Tasks

- **Task 1 — Manual Testing:** see [`docs/task1-manual-testing.md`](./docs/task1-manual-testing.md) for the test cases and bug report for the "Add to Shopping List" feature.
- **Task 2 — Frontend Testing:** Playwright E2E tests for the Login feature, covering successful login and invalid-password handling.
- **Task 3 — API Testing:** Playwright test suite for the Task Management API (`POST`, `GET`, `PUT`, `DELETE /tasks`).

## Setup

```bash
npm install
npx playwright install
```

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
