import { findFirstMissingLetter } from './missingLetter';

// Normalize client data from API response according to afazer.md specification
export function normalizeClientData(apiResponse: any): any[] {
  // Handle the API response structure from afazer.md
  if (!apiResponse || !apiResponse.data || !apiResponse.data.clientes) {
    console.warn('Invalid API response structure:', apiResponse);
    return [];
  }

  const clientes = apiResponse.data.clientes;
  
  return clientes.map((cliente: any, index: number) => {
    // Extract data from the nested structure, ignoring duplicates and redundant data
    const info = cliente.info || {};
    const detalhes = info.detalhes || {};
    const estatisticas = cliente.estatisticas || {};
    
    // Extract basic client information
    const name = info.nomeCompleto || '';
    const email = detalhes.email || '';
    const birthDate = detalhes.nascimento 
      ? new Date(detalhes.nascimento) 
      : new Date();
    
    // Extract sales data from estatisticas
    const sales = estatisticas.vendas || [];
    
    // Calculate derived values
    const totalSales = calculateTotalSales(sales);
    const averageSaleValue = calculateAverageSaleValue(sales);
    const uniquePurchaseDays = calculateUniquePurchaseDays(sales);
    const missingLetter = findFirstMissingLetter(name);
    
    // Return normalized client object
    return {
      id: cliente.id || `temp-${index}`,
      name,
      email,
      birthDate,
      sales,
      missingLetter,
      totalSales,
      averageSaleValue,
      uniquePurchaseDays,
    };
  });
}

// Helper functions for calculations
function calculateTotalSales(sales: any[]): number {
  return sales.reduce((total, sale) => total + (sale.valor || 0), 0);
}

function calculateAverageSaleValue(sales: any[]): number {
  if (sales.length === 0) return 0;
  const total = calculateTotalSales(sales);
  return total / sales.length;
}

function calculateUniquePurchaseDays(sales: any[]): number {
  const uniqueDays = new Set(sales.map(sale => sale.data));
  return uniqueDays.size;
}