import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyPassword } from "./password.services.js";
import { createToken } from "./token.services.js";

export async function loginUser(
    Body: { email: string; password: string },
    res: Response
) {
    if (!Body.email || !Body.password) {
        return res.status(400).json({ message: "Champs requis manquants" });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: Body.email,
        },
    });

    if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    const isPasswordValid = await verifyPassword(user.password, Body.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    return res
        .status(200)
        .json({ message: "Connexion réussie", token: createToken({ userId: user.id }) });
}
