import { Router, type Router as ExpressRouter } from 'express';
import { SaleController } from '../controllers/saleController';
import { authenticateToken } from '../middlewares/auth';

const router: ExpressRouter = Router();
const saleController = new SaleController();

// All sale routes require authentication
router.use(authenticateToken);

router.post('/', saleController.createSale.bind(saleController));
router.get('/', saleController.getAllSales.bind(saleController));
router.get('/customer/:customerId', saleController.getSalesByCustomer.bind(saleController));

export default router; 