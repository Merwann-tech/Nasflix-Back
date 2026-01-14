import express , { Router, type Request, type Response } from 'express';

const router = Router();
router.use(express.json());

router.post('/', async (req : Request, res :Response) => {
    // TODO Logic for user login would go here
    res.json({ message: 'Login route' });
});




export { router as loginRoutes };