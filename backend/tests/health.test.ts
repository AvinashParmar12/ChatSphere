import request from "supertest";
import app from "../src/app";

describe("Health Check API", () => {
  it("should return API running", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "ChatSphere API Running",
    });
  });
});