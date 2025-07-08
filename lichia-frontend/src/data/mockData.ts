// src/data/mockData.ts (CORRIGIDO)

import { Game, User, Review, Activity } from '../types';
import gamesFromFile from './games';

// Mapeamento CORRETO dos dados do seu JSON para o tipo Game
const typedGames: Game[] = gamesFromFile.map((game: any) => {
  // O 'genero' pode ser uma string com múltiplas entradas, então dividimos
  const genres = typeof game.genero === 'string' ? game.genero.split(',') : [];

  return {
    id: String(game.id),
    title: game.titulo, // de 'titulo' para 'title'
    developer: game.publisher || 'N/A', // Usando 'publisher' como 'developer'
    releaseYear: game.anoLancamento, // de 'anoLancamento' para 'releaseYear'
    rating: game.rating || 0, // Adicionando um valor padrão
    coverImage: game.coverImage || 'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg', // Adicionando uma imagem padrão
    screenshots: game.screenshots || [],
    description: game.summary || `Um jogo de ${game.genero} lançado em ${game.anoLancamento}.`, // Criando uma descrição padrão
    genres: genres, // Usando os gêneros processados
    platforms: [game.consoleLancamento] || [], // Usando 'consoleLancamento'
//     playStatus: undefined, // Esses campos não estão no seu JSON
//     userRating: undefined,
  };
}).filter(game => game.title); // Garante que nenhum jogo sem título entre na lista

export const mockGames: Game[] = typedGames;

// --- DADOS MOCKADOS DE USUÁRIOS ---
export const mockUsers: User[] = [
    {
        id: '1',
        username: 'gamer_dev',
        displayName: 'Gamer Dev',
        avatar: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Desenvolvedor e entusiasta de jogos indie.',
        joinDate: '2022-08-15T10:00:00Z',
        gamesPlayed: 120,
        followers: 580,
        following: 120,
        visibilidade: true,
        dataNascimento: '1995-05-20',
        dataCadastro: '2022-08-15T10:00:00Z',
    },
];

// --- DADOS MOCKADOS DE REVIEWS E ATIVIDADES (Corrigido para não quebrar) ---
export const mockReviews: Review[] = [];
export const mockActivities: Activity[] = [];
