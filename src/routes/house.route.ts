import express , { Router, type Request, type Response } from 'express';
import { createHouse, deleteHouse } from '../services/house.services.js';
import { verifyTokenUsers } from '../middlewares/auth.js';
import { getHousesByUserId } from '../services/house.services.js';

interface AuthenticatedRequest extends Request {
    id?: string;
}

const router = Router();
router.use(express.json());

router.post('/', verifyTokenUsers,  async (req : AuthenticatedRequest, res :Response) => {
    const userId = req.id;
    const name = req.body.name as string;
    await createHouse(userId as string, name, res);
});

router.get('/', verifyTokenUsers, async (req : AuthenticatedRequest, res :Response) => {
    const userId = req.id;
    await getHousesByUserId(userId as string, res);
}); 

router.delete('/:houseId', verifyTokenUsers, async (req : AuthenticatedRequest, res :Response) => {
    const userId = req.id;
    const houseId = req.params.houseId as string;
    await deleteHouse(userId as string, houseId,  res);
}); 
export { router as houseRoutes };