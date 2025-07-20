import { prisma } from '../utils/database';
import { DailySalesStats, TopCustomersStats } from '../types';

export class StatisticsService {
  async getDailySalesStats(startDate?: string, endDate?: string): Promise<DailySalesStats[]> {
    const where: any = {};
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const sales = await prisma.sale.findMany({
      where,
      select: {
        date: true,
        amount: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Group by date and calculate totals
    const dailyStatsMap = new Map<string, { date: string; total: number }>();
    
    sales.forEach(sale => {
      const dateStr = sale.date.toISOString().split('T')[0];
      if (dateStr) {
        const existing = dailyStatsMap.get(dateStr);
        if (existing) {
          existing.total += Number(sale.amount);
        } else {
          dailyStatsMap.set(dateStr, { date: dateStr, total: Number(sale.amount) });
        }
      }
    });

    return Array.from(dailyStatsMap.values()).slice(0, 30);
  }

  async getTopCustomersStats(): Promise<TopCustomersStats> {
    // Get all customers with their sales data
    const customersWithSales = await prisma.customer.findMany({
      include: {
        sales: true,
      },
    });

    // Calculate statistics for each customer
    const customerStats = customersWithSales.map(customer => {
      const sales = customer.sales;
      const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount), 0);
      const averageSale = sales.length > 0 ? totalSales / sales.length : 0;
      const uniqueDays = new Set(sales.map(sale => sale.date.toISOString().split('T')[0])).size;

      return {
        customerId: customer.id,
        name: customer.name,
        email: customer.email,
        total: totalSales,
        average: averageSale,
        frequency: uniqueDays,
      };
    });

    // Find customers with highest metrics (only customers with sales)
    const customersWithSalesData = customerStats.filter(customer => customer.total > 0);

    if (customersWithSalesData.length === 0) {
      // Return empty data if no customers have sales
      return {
        highestVolume: { customerId: '', name: '', email: '', total: 0, average: 0, frequency: 0 },
        highestAverage: { customerId: '', name: '', email: '', total: 0, average: 0, frequency: 0 },
        highestFrequency: { customerId: '', name: '', email: '', total: 0, average: 0, frequency: 0 },
      };
    }

    const highestVolume = customersWithSalesData.reduce((max, current) => 
      current.total > max.total ? current : max, customersWithSalesData[0]!);

    const highestAverage = customersWithSalesData.reduce((max, current) => 
      current.average > max.average ? current : max, customersWithSalesData[0]!);

    const highestFrequency = customersWithSalesData.reduce((max, current) => 
      current.frequency > max.frequency ? current : max, customersWithSalesData[0]!);

    return {
      highestVolume: highestVolume!,
      highestAverage: highestAverage!,
      highestFrequency: highestFrequency!,
    };
  }
} 