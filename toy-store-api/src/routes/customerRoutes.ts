import { Router, type Router as ExpressRouter } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticateToken } from '../middlewares/auth';

const router: ExpressRouter = Router();
const customerController = new CustomerController();

// All customer routes require authentication
router.use(authenticateToken);

router.post('/', customerController.createCustomer.bind(customerController));
router.get('/', customerController.getCustomers.bind(customerController));
router.get('/:id', customerController.getCustomerById.bind(customerController));
router.put('/:id', customerController.updateCustomer.bind(customerController));
router.delete('/:id', customerController.deleteCustomer.bind(customerController));

export default router; 