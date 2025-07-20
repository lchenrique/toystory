import { prisma } from '../utils/database';
import { CreateSaleInput } from '../types';

export class SaleService {
  async createSale(data: CreateSaleInput) {
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const sale = await prisma.sale.create({
      data: {
        customerId: data.customerId,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return sale;
  }

  async getSalesByCustomer(customerId: string) {
    const sales = await prisma.sale.findMany({
      where: { customerId },
      orderBy: { date: 'desc' },
    });

    return sales;
  }

  async getAllSales() {
    const sales = await prisma.sale.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return sales;
  }
} 