import { Router } from 'express';
const router = Router();

import { loginRoutes } from './login.routes.js';
import { registerRoutes } from './register.routes.js';

router.use('/register', registerRoutes);
router.use('/login', loginRoutes);

export default router;