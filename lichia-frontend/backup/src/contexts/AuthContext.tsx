import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string, dataNascimento: string, visibilidade: boolean) => Promise<{ success: boolean; message?: string }>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user && !!token;
  
  // Adicione este useEffect para carregar dados do usuário se um token existir
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const login = async (username: string, senha: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comunicacao: 'login', username, senha }),
        });

        const data = await response.json();

        if (response.ok && data.autenticado) {
            // Supondo que o backend retorne os dados do usuário após o login
            // Se não, você precisará fazer outra chamada para buscar os dados do usuário
            const loggedUser: User = {
                id: data.user.id || '1', // Mock ID se não vier do backend
                username: data.user.username || username,
                displayName: data.user.displayName || username,
                avatar: data.user.avatar || 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=150',
                bio: data.user.bio || 'Entusiasta de games e avaliador.',
                visibilidade: data.user.visibilidade,
                dataNascimento: data.user.dataNascimento,
                dataCadastro: data.user.dataCadastro,
                joinDate: data.user.dataCadastro,
                gamesPlayed: data.user.gamesPlayed || 0,
                followers: data.user.followers || 0,
                following: data.user.following || 0,
            };
            setUser(loggedUser);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(loggedUser));
            return { success: true };
        } else {
            return { success: false, message: data.mensagem || 'Usuário ou senha inválidos' };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: 'Falha no login. Tente novamente.' };
    } finally {
        setIsLoading(false);
    }
  };

  const register = async (
    username: string, 
    senha: string, 
    dataNascimento: string, 
    visibilidade: boolean
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
        const response = await fetch('http://localhost:8080/register', { // Endpoint de registro
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comunicacao: 'registro-usuario', username, senha, dataNascimento, visibilidade }),
        });

        const data = await response.json();

        if (response.ok && data.registrado) {
            return { success: true, message: data.mensagem || 'Registro bem-sucedido!' };
        } else {
            return { success: false, message: data.mensagem || 'Falha no registro.' };
        }
    } catch (error) {
        console.error("Register error:", error);
        return { success: false, message: 'Falha no registro. Tente novamente.' };
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Adicionar lógica de logout no backend se necessário
    if (user && token) {
        console.log(`Logging out user ${user.username}`);
        // Exemplo:
        // await fetch('http://localhost:8080/logout', {
        //     method: 'POST',
        //     headers: { 'Authorization': `Bearer ${token}` }
        // });
    }
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};