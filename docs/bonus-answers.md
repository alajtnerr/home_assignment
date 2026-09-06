# Bonus Questions

## Docker

**What Docker is, and why it helps a QA engineer**

Docker packages an application (and everything it needs to run — runtime, dependencies, configuration) into a lightweight, portable **container**. Unlike a full virtual machine, containers share the host OS kernel, so they start in seconds and use a fraction of the resources.

For QA work specifically, this solves a few recurring pain points:

- **"Works on my machine" problems disappear.** A test environment defined in a `Dockerfile`/`docker-compose.yml` behaves identically on a laptop, a colleague's machine, and a CI runner — no more debugging environment drift.
- **Fast, disposable environments.** Spin up a clean instance of the app (and its dependencies — database, backend services) for every test run, then throw it away. No leftover state from a previous run contaminating results.
- **Parallel/isolated test runs.** Multiple versions or configurations of the same app can run side by side in separate containers without port or dependency conflicts.
- **Onboarding.** A new team member (or a reviewer of a take-home assignment, for that matter) runs one command instead of manually installing and configuring every dependency.

**A working example from this submission**

Rather than describe this abstractly, Tasks 2 and 3 of this assignment actually use Docker for exactly this purpose. The Angular login app (`mock-app/`) and its backend (`mock-backend/`) each have a `Dockerfile`, orchestrated by a single [`docker-compose.yml`](../docker-compose.yml) at the project root:

```yaml
services:
  backend:
    build: ./mock-backend
    ports:
      - "3000:3000"

  frontend:
    build: ./mock-app
    ports:
      - "4200:4200"
    depends_on:
      - backend
```

Running:
```bash
docker compose up --build
```
builds both images and starts both services together. The Playwright tests (`login.spec.js`, `tasks-api.spec.js`) then run against `http://localhost:4200` / `http://localhost:3000` exactly as if the services were running natively — the tests don't know or care that they're talking to containers.

## JUnit + Selenium

**Approach for automating the "Delete Task" feature**

Assuming a task list UI where each task row has a "Delete" button (possibly behind a confirmation dialog), the Selenium + JUnit approach follows the same shape as the Playwright tests in this repo, just with Java's tooling:

- **Selenium WebDriver** drives the browser (locating elements, clicking, reading text) — the Java equivalent of Playwright's `page` object.
- **JUnit 5** provides the test structure (`@Test`, `@BeforeEach`/`@AfterEach` for setup/teardown, assertions).
- A **Page Object** class encapsulates the locators and actions for the task list page, keeping the test methods themselves readable — the same pattern used for `LoginPage.js` in this repo.

```java
// TaskListPage.java — Page Object
public class TaskListPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    public TaskListPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void deleteTaskByTitle(String title) {
        WebElement taskRow = driver.findElement(
            By.xpath("//li[contains(., '" + title + "')]"));
        taskRow.findElement(By.cssSelector("button.delete-task")).click();

        // Confirm the deletion dialog, if present.
        WebElement confirmButton = wait.until(
            ExpectedConditions.elementToBeClickable(By.cssSelector("button.confirm-delete")));
        confirmButton.click();
    }

    public boolean isTaskPresent(String title) {
        return driver.findElements(
            By.xpath("//li[contains(., '" + title + "')]")).size() > 0;
    }
}
```

```java
// DeleteTaskTest.java — JUnit 5 test
class DeleteTaskTest {
    private WebDriver driver;
    private TaskListPage taskListPage;

    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
        driver.get("http://localhost:4200/tasks");
        taskListPage = new TaskListPage(driver);
    }

    @Test
    void deletingATaskRemovesItFromTheList() {
        String taskTitle = "Write test report";
        assertTrue(taskListPage.isTaskPresent(taskTitle),
            "Precondition failed: task should exist before deletion");

        taskListPage.deleteTaskByTitle(taskTitle);

        assertFalse(taskListPage.isTaskPresent(taskTitle),
            "Task should no longer be visible after deletion");
    }

    @AfterEach
    void tearDown() {
        driver.quit();
    }
}
```

This mirrors the structure of `tests/login.spec.js` in this repo — Page Object for the UI interactions, a clear precondition/action/assertion shape per test, and explicit setup/teardown so each test starts from a known state.

## CI Integration

**Approach**

Tests should run automatically on every push and pull request, so regressions are caught before merge, not after deployment. The pipeline should:

1. Check out the code and install dependencies.
2. Install the Playwright browsers (`npx playwright install --with-deps`).
3. Start any services the tests depend on (in this project: the mock backend and Angular app).
4. Wait until those services are actually ready to accept requests (not just "process started").
5. Run the test suite.
6. Publish the results (e.g. the HTML report) as a build artifact, so a failure can be diagnosed without re-running locally.
7. Fail the build/PR check if any test fails, blocking merge until fixed.

**Tool used in this submission: GitHub Actions**

This repo's [`.github/workflows/playwright.yml`](../.github/workflows/playwright.yml) implements exactly this pipeline — it installs dependencies for the root project *and* for `mock-app`/`mock-backend`, starts both services in the background, waits for them via `wait-on`, then runs `npx playwright test` and uploads the HTML report as an artifact on every push and pull request to `main`/`master`.

Other CI tools follow the same shape (checkout → install → start dependencies → test → report) — e.g. **GitLab CI** (`.gitlab-ci.yml`), **Jenkins** (a `Jenkinsfile` with declarative pipeline stages), or **CircleCI** (`.circleci/config.yml`). GitHub Actions was used here because the repo is hosted on GitHub, making it the most direct, zero-extra-setup option.
