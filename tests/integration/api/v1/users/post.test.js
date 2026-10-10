import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonimous user", () => {
    test("With unique and valid data", async () => {
      let userInputValues = {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      };
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputValues),
      });

      expect(response.status).toBe(201);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        ...userInputValues,
        id: responseBody.id,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With duplicate 'email'", async () => {
      let userInputValues1 = {
        username: "emailduplicateuser1",
        email: "emailduplicateuser1@example.com",
        password: "password123",
      };
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputValues1),
      });

      expect(response1.status).toBe(201);

      let userInputValues2 = {
        username: "emailduplicateuser2",
        email: "EmailDuplicateUser1@example.com",
        password: "password123",
      };
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputValues2),
      });

      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        status_code: 400,
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    });

    test("With duplicate 'username'", async () => {
      let userInputValues3 = {
        username: "usernameduplicateuser",
        email: "usernameduplicateuser1@example.com",
        password: "password123",
      };
      const response3 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputValues3),
      });

      expect(response3.status).toBe(201);

      let userInputValues4 = {
        username: "UsernameDuplicateUser",
        email: "usernameDuplicateUser2@example.com",
        password: "password123",
      };
      const response4 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputValues4),
      });

      expect(response4.status).toBe(400);
      const responseBody4 = await response4.json();
      expect(responseBody4).toEqual({
        name: "ValidationError",
        status_code: 400,
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
      });
    });
  });
});
