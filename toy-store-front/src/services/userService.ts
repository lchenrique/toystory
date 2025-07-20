import api from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export const userService = {
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

export default userService;