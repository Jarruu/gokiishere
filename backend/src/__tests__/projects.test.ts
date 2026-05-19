import { describe, it, expect } from "vitest";
import app from "../index.js";

describe("Projects API", () => {
  it("should get all projects", async () => {
    const res = await app.request("/api/projects");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("meta");
  });

  it("should return 404 for non-existent project", async () => {
    const res = await app.request("/api/projects/non-existent-id");
    expect(res.status).toBe(404);
  });

  it("should require authentication for POST /api/projects", async () => {
    const res = await app.request("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "Test Project" }),
    });

    expect(res.status).toBe(401);
  });
});
