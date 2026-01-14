import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Response } from "express";
import { loginUser } from "../services/login.services.js";
import { prisma } from "../lib/prisma.js";

vi.mock("../lib/prisma.js", () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
        },
    },
}));

const findUnique = (prisma.user.findUnique as unknown) as ReturnType<typeof vi.fn>;

interface MockResponse {
    statusCode?: number;
    body?: unknown;
    status: (code: number) => MockResponse;
    json: (payload: unknown) => MockResponse;
}

function createRes(): MockResponse {
    const res: MockResponse = {
        status: vi.fn().mockImplementation(function (this: MockResponse, code: number) {
            this.statusCode = code;
            return this;
        }),
        json: vi.fn().mockImplementation(function (this: MockResponse, payload: unknown) {
            this.body = payload;
            return this;
        }),
    };
    return res;
}

beforeEach(() => {
    vi.resetAllMocks();
});

describe("loginUser", () => {
    const hashedPassword =
        "$argon2id$v=19$m=65536,t=3,p=4$NeChJ1X0KYOyVzxJG15Mig$BGUWKy6hS8EpL4PFhtnXSS4gu1J8YUewF9PXy59TZeU";

    it("returns 400 when missing fields", async () => {
        const res = createRes();
        await loginUser({ email: "", password: "" }, res as unknown as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(findUnique).not.toHaveBeenCalled();
    });

    it("returns 401 when password is incorrect", async () => {
        findUnique.mockResolvedValue({
            id: "existing-user-id",
            email: "test@test.com",
            password: hashedPassword,
        });
        const res = createRes();
        await loginUser({ email: "test@test.com", password: "wrongpass" }, res as unknown as Response);
        expect(findUnique).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 401 when email is incorrect", async () => {
        findUnique.mockResolvedValue(null);
        const res = createRes();
        await loginUser({ email: "wrongEmail@test.com", password: "password123" }, res as unknown as Response);
        expect(findUnique).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 200 when credentials are valid", async () => {
        findUnique.mockResolvedValue({
            id: "existing-user-id",
            email: "test@test.com",
            password: hashedPassword,
        });
        const res = createRes();
        await loginUser({ email: "test@test.com", password: "password123" }, res as unknown as Response);
        expect(findUnique).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
