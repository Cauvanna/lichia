// src/context/ReviewContext.tsx (SIMPLIFICADO)

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from '../types';
import { mockReviews, mockUsers, mockGames } from '../data/mockData';

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

  const addReview = async (
    gameId: string,
    rating: number,
    content: string
  ): Promise<{ success: boolean; message?: string }> => {
    const game = mockGames.find(g => g.id === gameId);
    if (!game) {
      return { success: false, message: "Jogo não encontrado." };
    }
    const newReview: Review = {
      id: String(Date.now()),
      userId: mockUsers[0].id,
      gameId: gameId,
      rating: rating,
      content: content,
      date: new Date().toISOString(),
      likes: 0,
      user: mockUsers[0],
      game: game,
    };
    setReviews(prev => [newReview, ...prev]);
    return { success: true, message: "Avaliação adicionada com sucesso!" };
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