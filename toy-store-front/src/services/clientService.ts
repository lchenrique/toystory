import api from './api';
import { normalizeClientData } from '../utils/dataNormalization';

// Types will be defined in more detail as we implement the data normalization utilities
interface ApiResponse {
  data: any;
  meta: any;
}

interface Client {
  id: string;
  name: string;
  email: string;
  birthDate: Date;
  missingLetter: string;
  sales: any[];
  totalSales: number;
  averageSaleValue: number;
  uniquePurchaseDays: number;
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    try {
      const response = await api.get<ApiResponse>('/customers');
      return normalizeClientData(response.data);
    } catch (error) {
      console.error('clientService: Error fetching clients:', error);
      throw error;
    }
  },

  async createClient(clientData: Partial<Client>): Promise<Client> {
    try {
      const response = await api.post<any>('/customers', clientData);
      const normalizedClients = normalizeClientData({ data: { clientes: [response.data] } });
      return normalizedClients[0];
    } catch (error) {
      console.error('clientService: Error creating client:', error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      const response = await api.delete(`/customers/${id}`);
    } catch (error) {
      console.error('clientService: Error deleting client:', error);
      throw error;
    }
  },
};

export default clientService;