import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  //todo
  describe("Anonimous user", () => {
    test("With nonexistent username case match", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/nonexistentuser",
      );

      expect(response.status).toBe(404);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrrado no sistema.",
        action: "Verifique o username está digitado corretamente.",
        status_code: 404,
      });
    });

    test("With exact case match", async () => {
      let userInputValues = {
        username: "SameCaseUser",
        email: "samecaseuser@example.com",
        password: "password123",
      };
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputValues),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/" + userInputValues.username,
      );

      expect(response2.status).toBe(200);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        ...userInputValues,
        id: responseBody2.id,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });
      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      let userInputValues = {
        username: "DifferentCaseUser",
        email: "differentcaseuser@example.com",
        password: "password123",
      };
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputValues),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/" +
          userInputValues.username.toLowerCase(),
      );

      expect(response2.status).toBe(200);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        ...userInputValues,
        id: responseBody2.id,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });
      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });
  });
});
