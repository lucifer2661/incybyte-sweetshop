import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
 
    return Promise.reject(error);
  }
);
if (
  error.response?.status === 401 &&
  window.location.pathname !== '/login'
) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateSweetDto {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateSweetDto {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface RestockDto {
  amount: number;
}

export interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

// Auth API
export const authApi = {
  register: (data: RegisterDto) => api.post<AuthResponse>('/api/auth/register', data),
  login: (data: LoginDto) => api.post<AuthResponse>('/api/auth/login', data),
};

// Sweets API
export const sweetsApi = {
  getAll: () => api.get<Sweet[]>('/api/sweets'),
  getById: (id: string) => api.get<Sweet>(`/api/sweets/${id}`),
  create: (data: CreateSweetDto) => api.post<Sweet>('/api/sweets', data),
  update: (id: string, data: UpdateSweetDto) => api.put<Sweet>(`/api/sweets/${id}`, data),
  delete: (id: string) => api.delete<Sweet>(`/api/sweets/${id}`),
  search: (params: SearchParams) => api.get<Sweet[]>('/api/sweets/search', { params }),
};

// Inventory API
export const inventoryApi = {
  purchase: (id: string) => api.post<Sweet>(`/api/inventory/${id}/purchase`),
  restock: (id: string, data: RestockDto) => api.post<Sweet>(`/api/inventory/${id}/restock`, data),
};





