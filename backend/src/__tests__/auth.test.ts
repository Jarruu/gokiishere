import { describe, it, expect } from "vitest";
import app from "../index.js";

describe("Auth API", () => {
  it("should return 401 for invalid credentials", async () => {
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "wrong", password: "password" }),
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.status).toBe("error");
  });

  it("should return 400 for missing fields", async () => {
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "admin" }),
    });

    expect(res.status).toBe(400); // Zod validation error
  });
});
