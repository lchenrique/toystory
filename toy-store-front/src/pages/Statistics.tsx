import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import statisticsService from '../services/statisticsService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const Statistics: React.FC = () => {
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [clientHighlights, setClientHighlights] = useState<ClientStatisticsHighlight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01', // Data inicial das vendas no seed
    endDate: '2024-01-12'    // Data final das vendas no seed
  });

  useEffect(() => {
    loadStatistics();
  }, [dateRange]);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [salesData, highlightsData] = await Promise.all([
        statisticsService.getDailySales(dateRange.startDate, dateRange.endDate),
        statisticsService.getClientHighlights()
      ]);

      setDailySales(salesData);
      setClientHighlights(highlightsData);
    } catch (err: any) {
      console.error('Error loading statistics:', err);
      setError('Falha ao carregar estatísticas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const resetToDefaultPeriod = () => {
    setDateRange({ startDate: '2024-01-01', endDate: '2024-01-12' });
  };

  const isDefaultPeriod = () => {
    return dateRange.startDate === '2024-01-01' && dateRange.endDate === '2024-01-12';
  };

  // Chart configuration
  const chartData = {
    labels: dailySales.map(sale => formatDate(sale.date)),
    datasets: [
      {
        label: 'Daily Sales (R$)',
        data: dailySales.map(sale => sale.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tendência de Vendas Diárias',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
        <span className="ml-3 text-gray-600">Carregando estatísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estatísticas de Vendas</h1>
          <p className="text-gray-600 mt-1">Analise o desempenho da sua loja e insights dos clientes</p>
        </div>
        <button
          onClick={loadStatistics}
          className="btn-secondary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar Dados
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="card">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Período</h2>
            <button
              onClick={resetToDefaultPeriod}
              className={`btn-secondary text-sm flex items-center ${isDefaultPeriod() ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isDefaultPeriod() ? 'Usando Período Padrão' : 'Resetar para Padrão'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="form-label">Data Inicial</label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="form-label">Data Final</label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>💡 <strong>Dica:</strong> Use o período padrão (1-12 de jan, 2024) para ver os dados de exemplo do banco de dados.</p>
          </div>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Vendas Diárias</h2>
          {dailySales.length > 0 ? (
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">Nenhum dado de venda disponível para o período selecionado</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Highlights */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Destaques dos Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highest Sales Volume */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Maior Volume de Vendas</h3>
                  <p className="text-sm text-blue-600">Receita total</p>
                </div>
              </div>
              {clientHighlights?.highestVolume ? (
                <div>
                  <p className="text-2xl font-bold text-blue-900 mb-2">
                    {formatCurrency(clientHighlights.highestVolume.total)}
                  </p>
                  <p className="text-sm text-blue-700">
                    {clientHighlights.highestVolume.name}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum dado disponível</p>
              )}
            </div>

            {/* Highest Average Sale */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Maior Venda Média</h3>
                  <p className="text-sm text-green-600">Por transação</p>
                </div>
              </div>
              {clientHighlights?.highestAverage ? (
                <div>
                  <p className="text-2xl font-bold text-green-900 mb-2">
                    {formatCurrency(clientHighlights.highestAverage.average)}
                  </p>
                  <p className="text-sm text-green-700">
                    {clientHighlights.highestAverage.name}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum dado disponível</p>
              )}
            </div>

            {/* Most Frequent Buyer */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Comprador Mais Frequente</h3>
                  <p className="text-sm text-purple-600">Dias de compra</p>
                </div>
              </div>
              {clientHighlights?.highestFrequency ? (
                <div>
                  <p className="text-2xl font-bold text-purple-900 mb-2">
                    {clientHighlights.highestFrequency.frequency} dias
                  </p>
                  <p className="text-sm text-purple-700">
                    {clientHighlights.highestFrequency.name}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum dado disponível</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {dailySales.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {dailySales.length}
                </p>
                <p className="text-sm text-gray-600">Dias com vendas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dailySales.reduce((sum, sale) => sum + sale.total, 0))}
                </p>
                <p className="text-sm text-gray-600">Receita total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dailySales.reduce((sum, sale) => sum + sale.total, 0) / dailySales.length)}
                </p>
                <p className="text-sm text-gray-600">Vendas médias diárias</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;