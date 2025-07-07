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
      // Create JSON for backend
      const loginRequest = {
        comunicacao: "login",
        username,
        senha
      };
      
      console.log('Login request JSON:', JSON.stringify(loginRequest, null, 2));
      
      // Simulate backend response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login response
      const mockResponse = {
        comunicacao: "login",
        autenticado: true,
        token: `user-${username}-logged`
      };
      
      if (mockResponse.autenticado) {
        const mockUser: User = {
          id: '1',
          username,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          avatar: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'Gaming enthusiast and reviewer',
          visibilidade: true,
          dataNascimento: '1990-01-01',
          dataCadastro: new Date().toISOString()
        };
        
        setUser(mockUser);
        setToken(mockResponse.token);
        localStorage.setItem('token', mockResponse.token);
        
        return { success: true };
      } else {
        return { success: false, message: 'Invalid username or password' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
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
      // Create JSON for backend
      const registerRequest = {
        comunicacao: "registro-usuario",
        username,
        senha,
        dataNascimento,
        visibilidade
      };
      
      console.log('Register request JSON:', JSON.stringify(registerRequest, null, 2));
      
      // Simulate backend response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - simulate success or failure
      const isUsernameAvailable = !['admin', 'test', 'user'].includes(username.toLowerCase());
      
      if (isUsernameAvailable) {
        const mockResponse = {
          comunicacao: "registro-usuario",
          registrado: true,
          mensagem: "Usuario registrado com sucesso!"
        };
        
        return { success: true, message: mockResponse.mensagem };
      } else {
        const mockResponse = {
          comunicacao: "registro-usuario",
          registrado: false,
          mensagem: "Usuario com mesmo nome ja registrado"
        };
        
        return { success: false, message: mockResponse.mensagem };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (user && token) {
      // Create JSON for backend
      const logoutRequest = {
        comunicacao: "logout",
        username: user.username,
        token
      };
      
      console.log('Logout request JSON:', JSON.stringify(logoutRequest, null, 2));
      
      // Simulate backend call
      await new Promise(resolve => setTimeout(resolve, 500));
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