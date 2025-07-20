import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Customer schemas
export const createCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  birthDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: 'Invalid date format' }),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerFiltersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

// Sale schemas
export const createSaleSchema = z.object({
  customerId: z.string(),
  amount: z.number().positive(),
  date: z.string().datetime().optional(),
});

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Statistics types
export interface DailySalesStats {
  date: string;
  total: number;
}

export interface CustomerStats {
  customerId: string;
  name: string;
  email: string;
  total: number;
  average: number;
  frequency: number;
}

export interface TopCustomersStats {
  highestVolume: CustomerStats;
  highestAverage: CustomerStats;
  highestFrequency: CustomerStats;
}

// Complex response format as specified in requirements
export interface CustomerListResponse {
  data: {
    clientes: Array<{
      info: {
        nomeCompleto: string;
        detalhes: {
          email: string;
          nascimento: string;
        };
      };
      estatisticas: {
        vendas: Array<{
          data: string;
          valor: number;
        }>;
      };
      duplicado?: {
        nomeCompleto: string;
      };
    }>;
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante: {
    status: string;
  };
}

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerFilters = z.infer<typeof customerFiltersSchema>;
export type CreateSaleInput = z.infer<typeof createSaleSchema>; 