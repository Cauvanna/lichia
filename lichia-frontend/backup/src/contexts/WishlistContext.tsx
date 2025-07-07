import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistContextType {
  wishlistItems: string[];
  addToWishlist: (gameId: string) => void;
  removeFromWishlist: (gameId: string) => void;
  isInWishlist: (gameId: string) => boolean;
  toggleWishlist: (gameId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>(['3']);

  const addToWishlist = (gameId: string) => {
    // TODO: Adicionar lógica de backend aqui
    // Ex: fetch('/api/wishlist', { method: 'POST', body: { gameId } })
    setWishlistItems(prev => {
      if (!prev.includes(gameId)) {
        return [...prev, gameId];
      }
      return prev;
    });
  };

  const removeFromWishlist = (gameId: string) => {
    // TODO: Adicionar lógica de backend aqui
    // Ex: fetch(`/api/wishlist/${gameId}`, { method: 'DELETE' })
    setWishlistItems(prev => prev.filter(id => id !== gameId));
  };

  const isInWishlist = (gameId: string) => {
    return wishlistItems.includes(gameId);
  };

  const toggleWishlist = (gameId: string) => {
    if (isInWishlist(gameId)) {
      removeFromWishlist(gameId);
    } else {
      addToWishlist(gameId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};