import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { createCustomerSchema, updateCustomerSchema, customerFiltersSchema } from '../types';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createCustomerSchema.parse(req.body);
      const customer = await this.customerService.createCustomer(validatedData);

      res.status(201).json({
        success: true,
        data: customer,
        message: 'Customer created successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const filters = customerFiltersSchema.parse(req.query);
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;

      const customers = await this.customerService.getCustomers(filters, page, limit);

      res.status(200).json(customers);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Customer ID is required',
        });
        return;
      }
      const customer = await this.customerService.getCustomerById(id);

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Customer ID is required',
        });
        return;
      }
      const validatedData = updateCustomerSchema.parse(req.body);
      const customer = await this.customerService.updateCustomer(id, validatedData);

      res.status(200).json({
        success: true,
        data: customer,
        message: 'Customer updated successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's a "not found" error
        if (error.message.includes('not found') || error.message.includes('Customer not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
          });
        } else {
          res.status(400).json({
            success: false,
            error: error.message,
          });
        }
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Customer ID is required',
        });
        return;
      }
      const result = await this.customerService.deleteCustomer(id);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }
} 