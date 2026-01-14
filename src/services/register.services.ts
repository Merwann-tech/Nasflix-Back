import { prisma } from "../lib/prisma.js";
import { hashPassword } from "./password.services.js";
import { createToken } from "./token.services.js";


export async function createUser(Body: {
  password: string;
  firstname: string;
  lastname: string;
  email: string;
}) {
  if (!Body.password || !Body.firstname || !Body.lastname || !Body.email) {
    return {
      status: 400,
      error: "Missing required fields",
    };
  }
  if (Body.password.length < 8) {
    return {
      status: 400,
      error: "Password must be at least 8 characters long",
    };
  }
  const hashedPassword = await hashPassword(Body.password);
  if (!isValidEmail(Body.email)) {
    return {
      status: 400,
      error: "Invalid email format",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: Body.email,
    },
  });
  if (existingUser) {
    return {
      status: 409,
      error: "Email already in use",
    };
  }

  await prisma.user.create({
    data: {
      firstname: Body.firstname,
      lastname: Body.lastname,
      email: Body.email,
      password: hashedPassword,
    },
  });
  return {
    status: 201,
    message: "User created successfully",
    token: createToken({ userEmail: Body.email }),
  };
}

export function isValidEmail(email: string): boolean {
  const emailPattern = /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

