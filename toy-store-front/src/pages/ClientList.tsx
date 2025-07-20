import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clientService from '../services/clientService';
import { normalizeClientData } from '../utils/dataNormalization';
import { findFirstMissingLetter } from '../utils/missingLetter';

interface Client {
  id: string;
  name: string;
  email: string;
  birthDate: Date;
  missingLetter: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'email' | 'birthDate'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await clientService.getClients();
      const normalizedClients = response.map(client => ({
        ...client,
        missingLetter: findFirstMissingLetter(client.name)
      }));
      setClients(normalizedClients);
    } catch (err: any) {
      console.error('Error loading clients:', err);
      setError('Falha ao carregar clientes. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      setDeletingClientId(clientId);
      await clientService.deleteClient(clientId);
      
      // Remove client from local state
      setClients(prev => prev.filter(client => client.id !== clientId));
      
      // Show success message
      showToast('Cliente excluído com sucesso!', 'success');
    } catch (err: any) {
      console.error('Error deleting client:', err);
      showToast('Falha ao excluir cliente. Tente novamente.', 'error');
    } finally {
      setDeletingClientId(null);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleSort = (field: 'name' | 'email' | 'birthDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedClients = clients
    .filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      if (sortField === 'birthDate') {
        aValue = a.birthDate.getTime();
        bValue = b.birthDate.getTime();
      } else {
        aValue = a[sortField].toLowerCase();
        bValue = b[sortField].toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
        <span className="ml-3 text-gray-600">Carregando clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-600 mt-1">Gerencie os clientes da sua loja de brinquedos</p>
        </div>
        <Link
          to="/clients/new"
          className="btn-primary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Cliente
        </Link>
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

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="form-label">Buscar Clientes</label>
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  id="search"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('name')}
                className={`btn-secondary ${sortField === 'name' ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                Nome {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('email')}
                className={`btn-secondary ${sortField === 'email' ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('birthDate')}
                className={`btn-secondary ${sortField === 'birthDate' ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                Data de Nascimento {sortField === 'birthDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="card">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Nascimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Letra Faltante
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                        <p className="text-sm">Comece adicionando seu primeiro cliente</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">ID: {client.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(client.birthDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {client.missingLetter}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deletingClientId === client.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ml-auto"
                        >
                          {deletingClientId === client.id ? (
                            <>
                              <div className="spinner w-4 h-4 mr-2"></div>
                              Excluindo...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Excluir
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredAndSortedClients.length} de {clients.length} clientes
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;