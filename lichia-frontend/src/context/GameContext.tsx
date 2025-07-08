// src/context/GameContext.tsx (NOVO)

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Game } from '../types';

interface GameContextType {
  games: Game[];
  isLoading: boolean;
  getGameById: (id: string) => Game | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGames = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGames must be used within a GameProvider');
  }
  return context;
};

// Adicione o GameProvider no seu App.tsx, dentro dos outros providers
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/games');
      const data = await response.json();

      // Ajusta os dados recebidos do backend para o formato esperado pelo frontend
      const formattedGames: Game[] = data.map((game: any) => ({
        id: String(game.id),
        titulo: game.titulo || '',
        genero: game.genero || '',
        anoLancamento: game.anoLancamento || 0,
        consoleLancamento: game.consoleLancamento || '',
        ehHandheld: game.ehHandheld ?? false,
        maxJogadores: game.maxJogadores || 1,
        temOnline: game.temOnline ?? false,
        publisher: game.publisher || '',
        temSequencia: game.temSequencia ?? false,
        precoUsual: game.precoUsual || 0,
        duracaoMainStoryAverage: game.duracaoMainStoryAverage || 0,
        duracaoMainStoryExtras: game.duracaoMainStoryExtras || 0,
        duracaoCompletionistAverage: game.duracaoCompletionistAverage || 0,
        // Adiciona o campo genres como array
        genres: typeof game.genero === 'string' ? game.genero.split(',').map((g: string) => g.trim()) : [],
        // Campos de compatibilidade frontend
        title: game.titulo || '',
        developer: game.publisher || '',
        releaseYear: game.anoLancamento || 0,
        // Aqui faz o mapeamento para a imagem da pasta public/covers
        coverImage: `/covers/${game.id}.jpg`,
        rating: game.nota_media || 0,
        description: `Um jogo de ${game.genero} lançado em ${game.anoLancamento}.`,
      }));

      setGames(formattedGames);
    } catch (error) {
      console.error("Falha ao buscar a lista de jogos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const getGameById = (id: string) => {
    return games.find(game => game.id === id);
  };

  const value = { games, isLoading, getGameById };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
