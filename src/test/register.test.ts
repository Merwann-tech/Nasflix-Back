import { vi, describe, it, expect, beforeEach, test } from "vitest";
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
import type { Response } from "express";

const findUnique = prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>;
const create = prisma.user.create as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
    vi.resetAllMocks();
});

interface MockResponse extends Partial<Response> {
    statusCode: number;
    body: unknown;
}

function makeMockResponse(): MockResponse {
    const res: MockResponse = {
        statusCode: 0,
        body: null,
        status(code: number) {
            this.statusCode = code;
            return this as unknown as Response;
        },
        json(obj: unknown) {
            this.body = obj;
            return this as unknown as Response;
        },
    };
    return res;
}

describe("createUser", () => {
    it("returns 400 when missing fields", async () => {
        const res = makeMockResponse() as Response;
        const result = await createUser(
            {
                password: "",
                firstname: "",
                lastname: "",
                email: "",
            },
            res
        );
        expect((result as unknown as MockResponse).statusCode).toBe(400);
    });

    it("returns 400 when password is too short", async () => {
        const res = makeMockResponse() as Response;
        const result = await createUser(
            {
                password: "short",
                firstname: "John",
                lastname: "Doe",
                email: "test@test.com",
            },
            res
        );
        expect((result as unknown as MockResponse).statusCode).toBe(400);
    });

    it("returns 400 when email is invalid", async () => {
        const res = makeMockResponse() as Response;
        const result = await createUser(
            {
                password: "validpassword",
                firstname: "John",
                lastname: "Doe",
                email: "invalidemail",
            },
            res
        );
        expect((result as unknown as MockResponse).statusCode).toBe(400);
    });

    it("returns 409 when email is already in use", async () => {
        findUnique.mockResolvedValue({
            id: "existing-user-id",
            firstname: "Existing",
            lastname: "User",
            email: "test@test.com",
        });
        const res = makeMockResponse() as Response;
        const result = await createUser(
            {
                password: "validpassword",
                firstname: "John",
                lastname: "Doe",
                email: "test@test.com",
            },
            res
        );
        expect(prisma.user.findUnique).toHaveBeenCalled();
        expect((result as unknown as MockResponse).statusCode).toBe(409);
    });

    it("creates a user when data is valid", async () => {
        findUnique.mockResolvedValue(null);
        create.mockResolvedValue({
            id: "b3d9e2f0-1a2b-4c3d-8e9f-0123456789ab",
            firstname: "Alice",
            lastname: "Doe",
            email: "alice@prisma.io",
        });

        const res = makeMockResponse() as Response;
        const result = await createUser(
            {
                password: "securepassword",
                firstname: "Alice",
                lastname: "Doe",
                email: "alice@prisma.io",
            },
            res
        );

        expect(prisma.user.findUnique).toHaveBeenCalled();
        expect(prisma.user.create).toHaveBeenCalled();
        expect((result as unknown as MockResponse).statusCode).toBe(201);
    });
});

test("isValidEmail should validate email format", () => {
    const validEmails = [
        "test@example.com",
        "john.doe@company.co",
        "user+label@sub.domain.org",
        "firstname.lastname@domain.fr",
    ];
    const invalidEmails = [
        "plainaddress",
        "@missingusername.com",
        "username@.nodomain",
        "username@domain,com",
        "username@domain..com",
        "username@domain",
    ];
    validEmails.forEach((email) => {
        expect(isValidEmail(email), `Échec pour l'email valide: ${email}`).toBe(true);
    });
    invalidEmails.forEach((email) => {
        expect(isValidEmail(email), `Échec pour l'email invalide: ${email}`).toBe(false);
    });
});
