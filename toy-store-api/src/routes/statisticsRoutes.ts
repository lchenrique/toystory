import { Router, type Router as ExpressRouter } from 'express';
import { StatisticsController } from '../controllers/statisticsController';
import { authenticateToken } from '../middlewares/auth';

const router: ExpressRouter = Router();
const statisticsController = new StatisticsController();    

// All statistics routes require authentication
router.use(authenticateToken);

router.get('/daily-sales', statisticsController.getDailySalesStats.bind(statisticsController));
router.get('/top-customers', statisticsController.getTopCustomersStats.bind(statisticsController));

export default router; 