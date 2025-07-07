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
      // Get current user from localStorage or context
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'You must be logged in to write a review' };
      }

      // Extract username from token (in real app, this would be handled differently)
      const username = token.replace('user-', '').replace('-logged', '');

      // Create JSON for backend
      const reviewRequest = {
        comunicacao: "criar-registro-game",
        id_jogo: gameId,
        username,
        token,
        nota: rating.toString(),
        resenha: content || "vazia"
      };

      console.log('Review request JSON:', JSON.stringify(reviewRequest, null, 2));

      // Simulate backend response
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      const mockResponse = {
        comunicacao: "criar-registro-game",
        mensagem: "registro adicionado com sucesso"
      };

      // Create new review object
      const newReview: Review = {
        id: Date.now().toString(),
        userId: '1', // In real app, this would come from auth context
        gameId,
        rating,
        content: content || '',
        date: new Date().toISOString(),
        likes: 0,
        user: {
          id: '1',
          username,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          avatar: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'Gaming enthusiast',
          followers: 0,
          following: 0,
          gamesPlayed: 0,
          joinDate: new Date().toISOString()
        },
        game: {
          id: gameId,
          title: 'Game Title', // In real app, this would be fetched
          coverImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'
        } as any
      };

      setReviews(prev => [newReview, ...prev]);

      return { success: true, message: mockResponse.mensagem };
    } catch (error) {
      return { success: false, message: 'Failed to add review. Please try again.' };
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