import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import clientService from '../../services/clientService';
import statisticsService from '../../services/statisticsService';

interface SidebarStats {
  totalClients: number;
  totalSales: number;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState<SidebarStats>({ totalClients: 0, totalSales: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    loadSidebarStats();
  }, []);

  const loadSidebarStats = async () => {
    try {
      const [clients, dailySales] = await Promise.all([
        clientService.getClients(),
        statisticsService.getDailySales('2024-01-01', '2024-01-12')
      ]);

      const totalSales = dailySales.reduce((sum, sale) => sum + sale.total, 0);

      setStats({
        totalClients: clients.length,
        totalSales
      });
    } catch (error) {
      console.error('Error loading sidebar stats:', error);
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

  const menuItems = [
    {
      path: '/',
      label: 'Painel Principal',
      description: 'Visão geral e insights',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      end: true
    },
    {
      path: '/clients',
      label: 'Gestão de Clientes',
      description: 'Gerenciar clientes e letras faltantes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      path: '/statistics',
      label: 'Estatísticas',
      description: 'Análises de vendas e relatórios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col h-screen flex-shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-blue-700 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Loja de Brinquedos</h2>
            <p className="text-xs text-blue-300 mt-1">Sistema de Gestão</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation - Flex grow to take available space */}
      <nav className="mt-6 px-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center py-3 mt-2 px-3 mb-1 rounded-lg transition-all duration-200 ease-in-out group relative ${
                isActive
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
          >
            <span className={`${isCollapsed ? '' : 'mr-3'}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <div className="flex-1">
                <span className="font-medium block">{item.label}</span>
                <span className="text-xs text-blue-300 opacity-75">{item.description}</span>
              </div>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-300 mt-1">{item.description}</div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats Section */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-blue-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Estatísticas Rápidas
            </h3>
            <button
              onClick={loadSidebarStats}
              className="p-1 rounded hover:bg-blue-700 transition-colors duration-200"
              title="Atualizar estatísticas"
            >
              <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-700/30 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="text-xs text-blue-200">Clientes</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {isLoading ? '...' : stats.totalClients}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-700/30 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-xs text-blue-200">Vendas</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {isLoading ? '...' : formatCurrency(stats.totalSales)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Fixed at bottom */}
      <div className="p-4 border-t border-blue-700 flex-shrink-0">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center p-2 bg-blue-700/30 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-blue-300 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            
            {/* System Info */}
            <div className="text-center">
              <p className="text-xs text-blue-300">Loja de Brinquedos</p>
              <p className="text-xs text-blue-400 mt-1">v1.0.0</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;