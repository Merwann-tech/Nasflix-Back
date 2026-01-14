import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_SECRET: string = process.env.ACCESS_SECRET || 'da6900e54da3f4ea2a1193df8f8a02befbbf8d89217fb3aefaac15ee1bbf630f';

export function createToken(payload: object): string {
    return jwt.sign(payload, ACCESS_SECRET, { algorithm: 'HS256', expiresIn: '30min' });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, ACCESS_SECRET);
    } catch {
        return null;
    }
}
