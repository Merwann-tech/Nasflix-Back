import express , { Router, type Request, type Response } from 'express';

const router = Router();
router.use(express.json());





export { router as loginRoutes };