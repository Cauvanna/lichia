import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  visibilidade: boolean;
  dataNascimento: string;
  dataCadastro: string;
}

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

  const login = async (username: string, senha: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const loginRequest = {
        comunicacao: "login",
        username,
        senha
      };
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginRequest)
      });
      const data = await response.json();
      if (data.autenticado) {
        // Usa o id_usuario retornado pelo backend
        const loggedUser: User = {
          id: data.id_usuario ? String(data.id_usuario) : '1',
          username,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          avatar: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: '',
          visibilidade: true,
          dataNascimento: '',
          dataCadastro: ''
        };
        setUser(loggedUser);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true, message: data.mensagem };
      } else {
        return { success: false, message: data.mensagem || 'Usuário ou senha incorretos.' };
      }
    } catch (error) {
      return { success: false, message: 'Erro ao fazer login. Tente novamente.' };
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
      // Monta o JSON conforme o backend espera
      const registerRequest = {
        comunicacao: "registro",
        username,
        senha,
        dataNascimento,
        visibilidade
      };
      const response = await fetch('http://localhost:8080/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerRequest)
      });
      const data = await response.json();
      if (data.registrado) {
        return { success: true, message: data.mensagem };
      } else {
        return { success: false, message: data.mensagem };
      }
    } catch (error) {
      return { success: false, message: 'Erro ao registrar. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (user && token) {
      const logoutRequest = {
        comunicacao: "logout",
        username: user.username,
        token
      };
      try {
        const response = await fetch('http://localhost:8080/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logoutRequest)
        });
        const data = await response.json();
        // Opcional: você pode checar data.autenticado ou data.mensagem para feedback
      } catch (error) {
        // Opcional: mostrar erro ao usuário
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
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
