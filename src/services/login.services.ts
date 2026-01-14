import { prisma } from "../lib/prisma.js";
import { verifyPassword } from "./password.services.js";
import { createToken } from "./token.services.js";

export async function loginUser(Body: { email: string; password: string }) {
  if (!Body.email || !Body.password) {
    return {
      status: 400,
      error: "Missing required fields",
    };
  } 
    const user = await prisma.user.findUnique({
        where: {
            email: Body.email,
        },
    });
    if (!user) {    
        return {
            status: 401,
            error: "Invalid email or password",
        };
    }   
    const isPasswordValid = await verifyPassword(user.password, Body.password);
    if (!isPasswordValid) {
        return {
            status: 401,
            error: "Invalid email or password",
        };
    }
    return {
        status: 200,
        message: "Login successful",  
        token: createToken({ userId: user.id }),  
    };
}   


