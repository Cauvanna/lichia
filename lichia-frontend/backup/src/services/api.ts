import axios from 'axios';

// A URL base da sua API Ktor
export const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptador: Adiciona o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);