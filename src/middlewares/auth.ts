import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/token.services.js';
import type { JwtPayload } from 'jsonwebtoken';



interface AuthenticatedRequest extends Request {
    id?: string;
}

export function verifyTokenUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Format d'autorisation invalide" });
    }
    const decoded = verifyToken(token);
    if (decoded === null || typeof decoded === "string" || typeof decoded !== "object") {
        return res.status(403).json({ message: "Token invalide ou expiré" });
    } else {

        req.id = (decoded as JwtPayload).userId;
        next();
    }
}