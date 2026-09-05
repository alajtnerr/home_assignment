import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * E2E tests for the Login feature, targeting a purpose-built mock Angular
 * app (see /mock-app) backed by a minimal Express API (see /mock-backend).
 * This avoids depending on any external/third-party demo service, whose
 * availability is outside our control.
 *
 * A fresh user is created via the API before each test and deleted via
 * the API afterward, so every run starts and ends with a clean slate.
 */

const API_BASE_URL = process.env.API_BASE_URL;

test.describe('Login', () => {
  let loginPage;
  let testUser;
  let apiContext;

  test.beforeEach(async ({ page }) => {
    testUser = {
      email: `qa_test_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`,
      password: 'TestPassword123!',
    };

    apiContext = await request.newContext();
    const response = await apiContext.post(`${API_BASE_URL}/register`, {
      data: testUser,
    });
    if (!response.ok()) {
      throw new Error(
        `Failed to create test user via API: ${response.status()} ${await response.text()}`
      );
    }

    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterEach(async () => {
    await apiContext.delete(`${API_BASE_URL}/users/${testUser.email}`);
    await apiContext.dispose();
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    await loginPage.login(testUser.email, testUser.password);

    await expect(page).toHaveURL(/\/home/);
    await expect(
      page.getByRole('heading', { name: `Welcome, ${testUser.email}!` })
    ).toBeVisible();
  });

  test('shows an error and does not log in with an invalid password', async ({
    page,
  }) => {
    await loginPage.login(testUser.email, 'clearly-wrong-password');

    await expect(page).toHaveURL(/\/login/);
    const message = await loginPage.getErrorMessage();
    expect(message).toMatch(/invalid/i);
  });

  test('does not submit the form when required fields are empty', async ({
    page,
  }) => {
    await loginPage.loginButton.click();

    // Native HTML5 "required" validation blocks submission — no navigation.
    await expect(page).toHaveURL(/\/login/);
  });
});