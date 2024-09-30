const request = require("supertest");

const config = {
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
};

const API_PATH = "/";

describe("Health", () => {
  describe(`[GET ${API_PATH}]`, () => {
    it("should be healthy", () => {
      return request(config.apiBaseUrl)
        .get("/")
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ message: "Hello from root!" });
        });
    });
  });
});
