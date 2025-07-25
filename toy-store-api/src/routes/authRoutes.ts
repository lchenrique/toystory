import { Router, type Router as ExpressRouter } from 'express';
import { AuthController } from '../controllers/authController';

const router: ExpressRouter = Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

export default router; 