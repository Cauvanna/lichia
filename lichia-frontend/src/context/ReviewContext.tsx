// src/context/ReviewContext.tsx (SIMPLIFICADO)

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from '../types';
import { mockReviews, mockUsers, mockGames } from '../data/mockData';
import { useAuth } from "./AuthContext";

interface ReviewContextType {
  reviews: Review[];
  addReview: (gameId: string, rating: number, content: string) => Promise<{ success: boolean; message?: string }>;
  getUserReviews: (userId: string) => Review[];
  getGameReviews: (gameId: string) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

interface ReviewProviderProps {
  children: ReactNode;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const { user } = useAuth();

  const addReview = async (
    gameId: string,
    rating: number,
    content: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: "Usuário não autenticado." };
    }
    try {
      // Garante que id_jogo seja apenas a string do id do jogo
      const reqBody = {
        comunicacao: "request-criar-avaliacao",
        id_jogo: String(gameId),
        username: user.username,
        id_usuario: Number(user.id),
        token: localStorage.getItem('token') || '',
        nota: rating !== undefined && rating !== null ? String(rating) : '',
        resenha: content ?? ''
      };
      console.log("DEBUG JSON enviado para /request-criar-avaliacao:", reqBody);
      const response = await fetch("http://localhost:8080/request-criar-avaliacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      const data = await response.json();
      if (data.mensagem && data.mensagem.toLowerCase().includes("sucesso")) {
        return { success: true, message: data.mensagem };
      } else {
        return { success: false, message: data.mensagem || "Erro ao criar avaliação." };
      }
    } catch (e) {
      return { success: false, message: "Erro de conexão com o servidor." };
    }
  };

  const getUserReviews = (userId: string): Review[] => {
    return reviews.filter(review => review.userId === userId);
  };

  const getGameReviews = (gameId: string): Review[] => {
    return reviews.filter(review => review.gameId === gameId);
  };

  return (
    <ReviewContext.Provider value={{
      reviews,
      addReview,
      getUserReviews,
      getGameReviews,
    }}>
      {children}
    </ReviewContext.Provider>
  );
};
