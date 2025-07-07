import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from '../types';
import { mockReviews } from '../data/mockData';

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
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) {
        return { success: false, message: 'Você precisa estar logado para fazer uma avaliação.' };
      }
      const user = JSON.parse(userStr);

      const reviewRequest = {
        comunicacao: "criar-registro-game",
        id_jogo: gameId,
        username: user.username,
        token,
        nota: rating.toString(),
        resenha: content || "vazia"
      };

      console.log('Review request JSON:', JSON.stringify(reviewRequest, null, 2));

      // TODO: Substituir por uma chamada real ao backend
      // const response = await fetch('http://localhost:8080/review', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reviewRequest),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //     return { success: false, message: data.message || "Falha ao enviar avaliação" };
      // }
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReview: Review = {
        id: Date.now().toString(),
        userId: user.id,
        gameId,
        rating,
        content: content || '',
        date: new Date().toISOString(),
        likes: 0,
        user: user,
        game: {
          id: gameId,
          title: 'Game Title',
          coverImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'
        } as any
      };

      setReviews(prev => [newReview, ...prev]);

      return { success: true, message: "Avaliação adicionada com sucesso!" };
    } catch (error) {
      return { success: false, message: 'Falha ao adicionar avaliação. Tente novamente.' };
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
      getGameReviews
    }}>
      {children}
    </ReviewContext.Provider>
  );
};