import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Usando os campos corretos para a API
      const response = await api.post<{success: boolean, data: AuthResponse, message: string}>('/auth/login', { email, password });
      
      // A API retorna { success: true, data: { user, token }, message }
      const authData = response.data.data;
      
      // Armazena o token de autenticação
      if (authData.token) {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
      
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout(): void {
    // Limpa os dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Opcionalmente, você pode fazer uma chamada para o backend para invalidar o token
    // api.post('/auth/logout');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
  
  getCurrentUser(): { id: string; email: string; name: string; role?: string } | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

export default authService;