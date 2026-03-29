import express from "express";
import request from "supertest";

import { corsMiddleware } from "~/config/cors";

describe("CORS Middleware", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(corsMiddleware);
    app.get("/test-cors", (req, res) => {
      res.json({ message: "ok" });
    });
  });

  it("should allow requests from allowed origins", async () => {
    const allowedOrigin = "http://localhost:5173"; // This should match one of the origins in your env.CORS_ORIGINS
    const res = await request(app)
      .get("/test-cors")
      .set("Origin", allowedOrigin);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "ok" });
  });

  it("should deny requests from disallowed origins", async () => {
    const disallowedOrigin = "http://example.com"; // This should not match any of the origins in your env.CORS_ORIGINS
    const res = await request(app)
      .get("/test-cors")
      .set("Origin", disallowedOrigin);

    expect(res.status).toBe(500);
    console.log(res.error)
    expect((res.error as any).text).toContain(`Origin ${disallowedOrigin} not allowed by CORS`);
  });

  it("should allow requests without an Origin header", async () => {
    const res = await request(app)
      .get("/test-cors");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "ok" });
  });
});