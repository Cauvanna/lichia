import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Game } from '../types';

interface WishlistContextType {
  wishlistItems: string[];
  wishlistGames: Game[];
  addToWishlist: (gameId: string) => Promise<boolean>;
  removeFromWishlist: (gameId: string) => Promise<boolean>;
  isInWishlist: (gameId: string) => boolean;
  toggleWishlist: (gameId: string) => Promise<void>;
  fetchWishlistFromBackend: () => Promise<void>;
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
  const { user, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [wishlistGames, setWishlistGames] = useState<Game[]>([]);

  const addToWishlist = async (gameId: string) => {
    if (!user || !token) return false;
    let id_usuario = user.id;
    if (typeof id_usuario === 'string' && /^\d+$/.test(id_usuario)) {
      id_usuario = parseInt(id_usuario, 10);
    }
    try {
      const req = {
        comunicacao: 'request-adicionar-desejo',
        username: user.username,
        id_usuario: id_usuario,
        token,
        id_jogo: parseInt(gameId, 10)
      };
      const response = await fetch('http://localhost:8080/request-adicionar-desejo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      const data = await response.json();
      if (data.mensagem && data.mensagem.includes('sucesso')) {
        setWishlistItems(prev => prev.includes(gameId) ? prev : [...prev, gameId]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const removeFromWishlist = async (gameId: string) => {
    if (!user || !token) return false;
    let id_usuario = user.id;
    if (typeof id_usuario === 'string' && /^\d+$/.test(id_usuario)) {
      id_usuario = parseInt(id_usuario, 10);
    }
    try {
      const req = {
        comunicacao: 'request-remover-desejo',
        username: user.username,
        id_usuario: id_usuario,
        token,
        id_jogo: parseInt(gameId, 10)
      };
      const response = await fetch('http://localhost:8080/request-remover-desejo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      const data = await response.json();
      if (data.mensagem && data.mensagem.includes('sucesso')) {
        setWishlistItems(prev => prev.filter(id => id !== gameId));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const isInWishlist = (gameId: string) => wishlistItems.includes(gameId);

  const toggleWishlist = async (gameId: string) => {
    if (isInWishlist(gameId)) {
      await removeFromWishlist(gameId);
    } else {
      await addToWishlist(gameId);
    }
  };

  // Busca a lista de desejos do backend e atualiza o estado
  const fetchWishlistFromBackend = async () => {
    if (!user || !token) return;
    let id_usuario = user.id;
    if (typeof id_usuario === 'string' && /^\d+$/.test(id_usuario)) {
      id_usuario = parseInt(id_usuario, 10);
    }
    const req = {
      comunicacao: 'request-lista-de-desejos',
      usr_alvo: user.username,
      id_usr_alvo: id_usuario,
      id_usr_solicitante: id_usuario,
      usr_solicitante: user.username,
      token
    };
    try {
      const response = await fetch('http://localhost:8080/request-lista-de-desejos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      const data = await response.json();
      let games: Game[] = [];
      if (Array.isArray(data)) {
        games = data;
      } else if (Array.isArray(data.desejos)) {
        games = data.desejos;
      }
      setWishlistGames(games.map((g: any) => ({
        id: String(g.id),
        titulo: g.titulo,
        genero: g.genero,
        anoLancamento: g.anoLancamento,
        consoleLancamento: g.consoleLancamento,
        ehHandheld: g.ehHandheld,
        maxJogadores: g.maxJogadores,
        temOnline: g.temOnline,
        publisher: g.publisher,
        temSequencia: g.temSequencia,
        precoUsual: g.precoUsual,
        duracaoMainStoryAverage: g.duracaoMainStoryAverage,
        duracaoMainStoryExtras: g.duracaoMainStoryExtras,
        duracaoCompletionistAverage: g.duracaoCompletionistAverage,
        // Campos opcionais para compatibilidade com GameCard e filtros
        title: g.titulo,
        developer: g.publisher,
        releaseYear: g.anoLancamento,
        genres: typeof g.genero === 'string' ? g.genero.split(',').map((x: string) => x.trim()) : [],
        coverImage: g.coverImage || 'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg',
        rating: g.rating || 0,
        description: g.description || `Um jogo de ${g.genero} lançado em ${g.anoLancamento}.`,
      })));
      setWishlistItems(games.map((g: any) => String(g.id)));
    } catch (e) {
      // Em caso de erro, não altera a lista
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistGames,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      fetchWishlistFromBackend
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
