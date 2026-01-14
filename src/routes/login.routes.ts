import express , { Router, type Request, type Response } from 'express';
import { loginUser } from '../services/login.services.js';

const router = Router();
router.use(express.json());

router.post('/', async (req : Request, res :Response) => {
    const response = await loginUser(req.body)
    res.json(response);
});
// {
//     "email": "user@example.com",
//     "password": "password123"
// }



export { router as loginRoutes };