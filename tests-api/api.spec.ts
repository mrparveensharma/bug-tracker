import { test, expect } from "@playwright/test";

let testBugId: number;

test("Call Health Check", async ({ request }) => {
  console.log("Starting test...");

  const healthCheckResponse = await request.get("health");
  expect(healthCheckResponse.ok()).toBeTruthy();
  expect(await healthCheckResponse.json()).toEqual(
    expect.objectContaining({
      status: "ok",
    })
  );
});

test("Create a bug", async ({ request }) => {
  const timestamp = Date.now();
  const newBug = {
    title: `Test Bug ${timestamp}`,
    description: "This is a test bug created by Playwright",
    status: "Open",
    priority: "Medium",
  };

  const response = await request.post("bugs", {
    data: newBug,
  });

  expect(response.ok()).toBeTruthy();
  const bug = await response.json();

  testBugId = bug.id;

  expect(bug).toMatchObject({
    id: expect.any(Number),
    title: newBug.title,
    description: newBug.description,
    status: newBug.status,
    priority: newBug.priority,
    created_at: expect.any(String),
    updated_at: expect.any(String),
  });
});

test("Update a bug", async ({ request }) => {
  const timestamp = Date.now();
  const updatedBug = {
    title: `Updated Bug ${timestamp}`,
    description: "This bug was updated by Playwright",
    status: "In Progress",
    priority: "High",
  };

  const response = await request.put(`bugs/${testBugId}`, {
    data: updatedBug,
  });

  expect(response.ok()).toBeTruthy();
  const bug = await response.json();

  expect(bug).toMatchObject({
    id: testBugId,
    title: updatedBug.title,
    description: updatedBug.description,
    status: updatedBug.status,
    priority: updatedBug.priority,
    created_at: expect.any(String),
    updated_at: expect.any(String),
  });
});

test("Get a specific bug", async ({ request }) => {
  const response = await request.get(`bugs/${testBugId}`);

  expect(response.ok()).toBeTruthy();
  const bug = await response.json();

  expect(bug.id).toBe(testBugId);
  expect(bug).toMatchObject({
    id: testBugId,
    title: expect.stringContaining("Updated Bug"),
    description: "This bug was updated by Playwright",
    status: "In Progress",
    priority: "High",
    created_at: expect.any(String),
    updated_at: expect.any(String),
  });
});

test("Delete a bug", async ({ request }) => {
  const deleteResponse = await request.delete(`bugs/${testBugId}`);
  expect(deleteResponse.ok()).toBeTruthy();

  const getResponse = await request.get(`bugs/${testBugId}`);
  expect(getResponse.status()).toBe(404);
});
