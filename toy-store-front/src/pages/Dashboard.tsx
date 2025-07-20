import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clientService from '../services/clientService';
import statisticsService from '../services/statisticsService';

interface DashboardStats {
  totalClients: number;
  totalSales: number;
  averageSale: number;
  totalSalesCount: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalSales: 0,
    averageSale: 0,
    totalSalesCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar dados dos clientes e estatísticas
      const [clients, dailySales] = await Promise.all([
        clientService.getClients(),
        statisticsService.getDailySales('2024-01-01', '2024-01-12')
      ]);

      // Calcular estatísticas
      const totalSales = dailySales.reduce((sum, sale) => sum + sale.total, 0);
      const totalSalesCount = dailySales.length;
      const averageSale = totalSalesCount > 0 ? totalSales / totalSalesCount : 0;

      setStats({
        totalClients: clients.length,
        totalSales,
        averageSale,
        totalSalesCount
      });
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError('Falha ao carregar dados do painel');
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

  const dashboardStats = [
    {
      title: 'Total de Clientes',
      value: stats.totalClients.toString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Vendas Totais',
      value: formatCurrency(stats.totalSales),
      change: '+0%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Venda Média',
      value: formatCurrency(stats.averageSale),
      change: '+0%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'purple'
    },
    {
      title: 'Dias de Venda',
      value: stats.totalSalesCount.toString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'orange'
    }
  ];

  const quickActions = [
    {
      title: 'Adicionar Cliente',
      description: 'Cadastrar um novo cliente no sistema',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: '/clients/new',
      color: 'blue'
    },
    {
      title: 'Ver Estatísticas',
      description: 'Verificar análises detalhadas de vendas e clientes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/statistics',
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
        <span className="ml-3 text-gray-600">Carregando painel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Principal</h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao Sistema de Gestão da Loja de Brinquedos</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={loadDashboardData}
            className="btn-secondary flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar Dados
          </button>
        </div>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">do mês passado</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className={`p-3 rounded-lg ${getColorClasses(action.color)} mr-4 group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Insights Rápidos</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="font-medium text-blue-900">Receita Total</h3>
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.totalSales)}</p>
                <p className="text-sm text-blue-600 mt-1">De {stats.totalSalesCount} dias de venda</p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="font-medium text-green-900">Clientes Ativos</h3>
                </div>
                <p className="text-2xl font-bold text-green-900">{stats.totalClients}</p>
                <p className="text-sm text-green-600 mt-1">Cadastrados no sistema</p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="font-medium text-purple-900">Venda Média</h3>
                </div>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.averageSale)}</p>
                <p className="text-sm text-purple-600 mt-1">Por dia de venda</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Visão Geral do Sistema</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Banco de Dados Conectado</p>
                  <p className="text-xs text-blue-600">Todos os sistemas operacionais</p>
                </div>
                <span className="text-xs text-blue-500">Online</span>
              </div>
              
              <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Dados de Exemplo Carregados</p>
                  <p className="text-xs text-green-600">{stats.totalClients} clientes e {stats.totalSalesCount} dias de venda disponíveis</p>
                </div>
                <span className="text-xs text-green-500">Pronto</span>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900">Estatísticas Disponíveis</p>
                  <p className="text-xs text-purple-600">Ver análises detalhadas na seção de Estatísticas</p>
                </div>
                <Link to="/statistics" className="text-xs text-purple-500 hover:text-purple-700">Ver →</Link>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">Gestão de Clientes</p>
                  <p className="text-xs text-orange-600">Gerencie seus clientes e veja letras faltantes</p>
                </div>
                <Link to="/clients" className="text-xs text-orange-500 hover:text-orange-700">Gerenciar →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;