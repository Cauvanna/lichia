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
  // Initialize with some games already in wishlist (from mockData)
  const [wishlistItems, setWishlistItems] = useState<string[]>(['3']);

  const addToWishlist = (gameId: string) => {
    setWishlistItems(prev => {
      if (!prev.includes(gameId)) {
        return [...prev, gameId];
      }
      return prev;
    });
  };

  const removeFromWishlist = (gameId: string) => {
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