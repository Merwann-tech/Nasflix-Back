import { vi, describe, it, expect, beforeEach,test } from "vitest";
import { isValidEmail } from "../services/register.services.js";


vi.mock("../lib/prisma.js", () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});
import { createUser } from "../services/register.services.js";
import { prisma } from "../lib/prisma.js";

const findUnique = prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>;
const create = prisma.user.create as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createUser", () => {
  it("returns 400 when missing fields", async () => {
    const res = await createUser({
      password: "",
      firstname: "",
      lastname: "",
      email: "",
    });
    expect(res.status).toBe(400);
  });
  it("returns 400 when password is too short", async () => {
    const res = await createUser({
      password: "short",
      firstname: "John",
      lastname: "Doe",
      email: "test@test.com",
    });
    expect(res.status).toBe(400);
  });
  it("returns 400 when email is invalid", async () => {
    const res = await createUser({
      password: "validpassword",
      firstname: "John",
      lastname: "Doe",
      email: "invalidemail",
    });
    expect(res.status).toBe(400);
  });
  it("returns 409 when email is already in use", async () => {
    findUnique.mockResolvedValue({
      id: "existing-user-id",
      firstname: "Existing",
      lastname: "User",
      email: "test@test.com",
    });
    const res = await createUser({
      password: "validpassword",
      firstname: "John",
      lastname: "Doe",
      email: "test@test.com",
    });
    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(res.status).toBe(409);
  });

  it("creates a user when data is valid", async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({
      id: "b3d9e2f0-1a2b-4c3d-8e9f-0123456789ab",
      firstname: "Alice",
      lastname: "Doe",
      email: "alice@prisma.io",
    });

    const res = await createUser({
      password: "securepassword",
      firstname: "Alice",
      lastname: "Doe",
      email: "alice@prisma.io",
    });

    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(prisma.user.create).toHaveBeenCalled();
    expect(res.status).toBe(201);
  });
});


test('isValidEmail should validate email format', () => {
    const validEmails = [
    "test@example.com",
    "john.doe@company.co",
    "user+label@sub.domain.org",
    "firstname.lastname@domain.fr"
    ]
    const invalidEmails = [
    "plainaddress",
    "@missingusername.com",
    "username@.nodomain",
    "username@domain,com",
    "username@domain..com",
    "username@domain"
    ]
    validEmails.forEach(email => {
        expect(isValidEmail(email), `Échec pour l'email valide: ${email}`).toBe(true)
    })
    invalidEmails.forEach(email => {
        expect(isValidEmail(email), `Échec pour l'email valide: ${email}`).toBe(false)

    })
})
