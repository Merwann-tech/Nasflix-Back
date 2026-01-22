import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "./password.services.js";
import { createToken } from "./token.services.js";

export async function createUser(
    Body: {
        password: string;
        firstname: string;
        lastname: string;
        email: string;
    },
    res: Response
): Promise<Response> {
    if (!Body.password || !Body.firstname || !Body.lastname || !Body.email) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (Body.password.length < 8) {
        return res
            .status(400)
            .json({ message: "Password must be at least 8 characters long" });
    }
    const hashedPassword = await hashPassword(Body.password);
    if (!isValidEmail(Body.email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: Body.email,
        },
    });
    if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
    }

    const user = await prisma.user.create({
        data: {
            firstname: Body.firstname,
            lastname: Body.lastname,
            email: Body.email,
            password: hashedPassword,
        },
    });
    return res
        .status(201)
        .json({ message: "User created successfully", token: createToken({ userId: user.id }) });
}

export function isValidEmail(email: string): boolean {
    const emailPattern = /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
