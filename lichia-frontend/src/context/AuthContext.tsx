// src/context/AuthContext.tsx (INTEGRADO)

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types'; // Supondo que você tenha um arquivo de tipos

// Função auxiliar para chamadas de API
async function apiCall(endpoint: string, body: object) {
    try {
        const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return await response.json();
    } catch (error) {
        console.error(`Erro na chamada da API para ${endpoint}:`, error);
        return { success: false, registrado: false, autenticado: false, mensagem: 'Erro de comunicação com o servidor.' };
    }
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, senha: string, dataNascimento: string, visibilidade: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa true para checar o localStorage

  useEffect(() => {
    // Carrega dados do usuário do localStorage ao iniciar a aplicação
    try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Falha ao carregar dados do localStorage", error);
        localStorage.clear(); // Limpa em caso de dados corrompidos
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user && !!token;

  const login = async (username: string, senha: string) => {
    setIsLoading(true);
    const body = { comunicacao: "login", username, senha };
    const data = await apiCall('/login', body);

    if (data.autenticado) {
      // Busca os dados completos do usuário após o login bem-sucedido
      const userDetailsResponse = await apiCall('/request-painel-usuario', {
        comunicacao: "request-painel-usuario",
        username: username,
        token: data.token
      });

      const userData: User = {
          id: userDetailsResponse.id,
          username: userDetailsResponse.nome,
          displayName: userDetailsResponse.nome,
          avatar: https://avatar.vercel.sh/${userDetailsResponse.nome}.png, // Avatar genérico
          bio: 'Bem-vindo à Lichia!',
          visibilidade: userDetailsResponse.visibilidade,
          dataNascimento: userDetailsResponse.data_nascimento,
          dataCadastro: new Date(userDetailsResponse.data_cadastro * 1000).toISOString(),
      };

      setUser(userData);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true, message: data.mensagem };
    } else {
      setIsLoading(false);
      return { success: false, message: data.mensagem };
    }
  };

  const register = async (username: string, senha: string, dataNascimento: string, visibilidade: boolean) => {
    setIsLoading(true);
    const body = { comunicacao: "registro-usuario", username, senha, dataNascimento, visibilidade };
    const data = await apiCall('/registro', body);
    setIsLoading(false);
    return { success:

data.registrado, message: data.mensagem };
  };

  const logout = async () => {
    setIsLoading(true);
    if (user && token) {
        const body = { comunicacao: "logout", username: user.username, token };
        await apiCall('/logout', body); // Não precisamos esperar a resposta
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoading(false);
  };

  const value = { user, token, isAuthenticated, login, register, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
