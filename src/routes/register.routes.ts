import express, { Router, type Request, type Response } from "express";
import { createUser } from "../services/register.services.js";

const router = Router();
router.use(express.json());

router.post("/", async (req: Request, res: Response) => {
  await createUser(req.body, res);
});
// {
//     "email": "user@example.com",
//     "password": "password123",
//     "firstname": "John",
//     "lastname": "Doe"
// }

export { router as registerRoutes };
