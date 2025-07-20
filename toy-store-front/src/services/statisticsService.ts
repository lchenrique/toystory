import api from './api';

interface DailySales {
  date: string;
  total: number;
}

interface ClientStatisticsHighlight {
  highestVolume: {
    clientId: string;
    name: string;
    total: number;
  } | null;
  highestAverage: {
    clientId: string;
    name: string;
    average: number;
  } | null;
  highestFrequency: {
    clientId: string;
    name: string;
    frequency: number;
  } | null;
}

export const statisticsService = {
  async getDailySales(startDate?: string, endDate?: string): Promise<DailySales[]> {
    const params = { startDate, endDate };
    const response = await api.get<DailySales[]>('/statistics/daily-sales', { params });
    return response.data;
  },

  async getClientHighlights(): Promise<ClientStatisticsHighlight> {
    // Use the correct endpoint that exists in the backend
    const response = await api.get<ClientStatisticsHighlight>('/statistics/top-customers');
    return response.data;
  },
};

export default statisticsService;