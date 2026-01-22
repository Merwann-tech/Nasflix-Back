import { Router } from 'express';
const router = Router();

import { loginRoutes } from './login.routes.js';
import { registerRoutes } from './register.routes.js';
import { houseRoutes } from './house.route.js';

router.use('/houses', houseRoutes);
router.use('/register', registerRoutes);
router.use('/login', loginRoutes);

export default router;