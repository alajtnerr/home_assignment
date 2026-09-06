import { test, expect } from '@playwright/test';

/**
 * API tests for the Task Management endpoints, backed by the mock-backend
 * (see /mock-backend). Uses Playwright's built-in `request` fixture, which
 * needs no browser — these tests exercise the API directly over HTTP.
 */

const API_BASE_URL = process.env.API_BASE_URL;

test.describe('Task Management API', () => {
  test.describe('POST /tasks', () => {
    test('creates a new task and returns 201 with the created task', async ({
      request,
    }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: {
          title: 'Write test report',
          description: 'Summarize findings',
          completed: false,
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toMatchObject({
        title: 'Write test report',
        description: 'Summarize findings',
        completed: false,
      });
      expect(body.id).toBeTruthy();
    });

    test('returns 400 when title is missing', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: { description: 'No title provided' },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBeTruthy();
    });
  });

  test.describe('GET /tasks/{id}', () => {
    let createdTask;

    test.beforeEach(async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: { title: 'Task for GET test' },
      });
      createdTask = await response.json();
    });

    test('retrieves an existing task by id and returns 200', async ({
      request,
    }) => {
      const response = await request.get(
        `${API_BASE_URL}/tasks/${createdTask.id}`
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toEqual(createdTask);
    });

    test('returns 404 for a non-existent task id', async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/tasks/non-existent-id`
      );

      expect(response.status()).toBe(404);
    });
  });

  test.describe('PUT /tasks/{id}', () => {
    let createdTask;

    test.beforeEach(async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: { title: 'Original title', completed: false },
      });
      createdTask = await response.json();
    });

    test('updates an existing task and returns 200 with the updated task', async ({
      request,
    }) => {
      const response = await request.put(
        `${API_BASE_URL}/tasks/${createdTask.id}`,
        {
          data: { title: 'Updated title', completed: true },
        }
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toMatchObject({
        id: createdTask.id,
        title: 'Updated title',
        completed: true,
      });
    });

    test('returns 404 when updating a non-existent task', async ({
      request,
    }) => {
      const response = await request.put(
        `${API_BASE_URL}/tasks/non-existent-id`,
        {
          data: { title: 'Does not matter' },
        }
      );

      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /tasks/{id}', () => {
    let createdTask;

    test.beforeEach(async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: { title: 'Task to delete' },
      });
      createdTask = await response.json();
    });

    test('deletes an existing task and returns 204', async ({ request }) => {
      const response = await request.delete(
        `${API_BASE_URL}/tasks/${createdTask.id}`
      );
      expect(response.status()).toBe(204);

      // Confirm it's actually gone.
      const getResponse = await request.get(
        `${API_BASE_URL}/tasks/${createdTask.id}`
      );
      expect(getResponse.status()).toBe(404);
    });

    test('returns 404 when deleting a non-existent task', async ({
      request,
    }) => {
      const response = await request.delete(
        `${API_BASE_URL}/tasks/non-existent-id`
      );
      expect(response.status()).toBe(404);
    });
  });
});