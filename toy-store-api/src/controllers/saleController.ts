import { Request, Response } from 'express';
import { SaleService } from '../services/saleService';
import { createSaleSchema } from '../types';

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  async createSale(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createSaleSchema.parse(req.body);
      const sale = await this.saleService.createSale(validatedData);

      res.status(201).json({
        success: true,
        data: sale,
        message: 'Sale created successfully',
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

  async getSalesByCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Customer ID is required',
        });
        return;
      }

      const sales = await this.saleService.getSalesByCustomer(customerId);

      res.status(200).json({
        success: true,
        data: sales,
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

  async getAllSales(_req: Request, res: Response): Promise<void> {
    try {
      const sales = await this.saleService.getAllSales();

      res.status(200).json({
        success: true,
        data: sales,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
} 