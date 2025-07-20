import { Request, Response } from 'express';
import { StatisticsService } from '../services/statisticsService';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  async getDailySalesStats(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const stats = await this.statisticsService.getDailySalesStats(startDate as string, endDate as string);

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async getTopCustomersStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.statisticsService.getTopCustomersStats();

      // Transform to match frontend expectations
      const transformedStats = {
        highestVolume: {
          clientId: stats.highestVolume.customerId || '',
          name: stats.highestVolume.name || '',
          total: stats.highestVolume.total || 0
        },
        highestAverage: {
          clientId: stats.highestAverage.customerId || '',
          name: stats.highestAverage.name || '',
          average: stats.highestAverage.average || 0
        },
        highestFrequency: {
          clientId: stats.highestFrequency.customerId || '',
          name: stats.highestFrequency.name || '',
          frequency: stats.highestFrequency.frequency || 0
        },
      };

      res.status(200).json(transformedStats);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
} 