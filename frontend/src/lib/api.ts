import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ============================
   REQUEST INTERCEPTOR
   - Adds JWT token if present
============================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
   - Handles 401 globally
============================ */
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

/* ============================
   TYPES
============================ */

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

/* ============================
   AUTH API
============================ */
export const authApi = {
  register: (data: RegisterDto) =>
    api.post<AuthResponse>('/api/auth/register', data),

  login: (data: LoginDto) =>
    api.post<AuthResponse>('/api/auth/login', data),
};

/* ============================
   SWEETS API
============================ */
export const sweetsApi = {
  getAll: () => api.get<Sweet[]>('/api/sweets'),

  getById: (id: string) =>
    api.get<Sweet>(`/api/sweets/${id}`),

  create: (data: CreateSweetDto) =>
    api.post<Sweet>('/api/sweets', data),

  update: (id: string, data: UpdateSweetDto) =>
    api.put<Sweet>(`/api/sweets/${id}`, data),

  delete: (id: string) =>
    api.delete(`/api/sweets/${id}`),

  search: (params: SearchParams) =>
    api.get<Sweet[]>('/api/sweets/search', { params }),
};

/* ============================
   INVENTORY API
============================ */
export const inventoryApi = {
  purchase: (id: string) =>
    api.post<Sweet>(`/api/inventory/${id}/purchase`),

  restock: (id: string, data: RestockDto) =>
    api.post<Sweet>(`/api/inventory/${id}/restock`, data),
};






