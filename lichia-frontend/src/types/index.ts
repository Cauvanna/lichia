export interface Game {
  id: string; // ou number, mas manteremos string para compatibilidade
  titulo: string;
  genero: string;
  anoLancamento: number;
  consoleLancamento: string;
  ehHandheld: boolean;
  maxJogadores: number;
  temOnline: boolean;
  publisher: string;
  temSequencia: boolean;
  precoUsual: number;
  duracaoMainStoryAverage: number;
  duracaoMainStoryExtras: number;
  duracaoCompletionistAverage: number;
  // Campos opcionais do frontend para compatibilidade
  title?: string;
  developer?: string;
  releaseYear?: number;
  genres?: string[];
  platforms?: string[];
  coverImage?: string;
  rating?: number;
  userRating?: number;
  description?: string;
  screenshots?: string[];
  isWishlisted?: boolean;
  playStatus?: 'playing' | 'completed' | 'dropped' | 'plan_to_play';
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  gamesPlayed: number;
  joinDate: string;
}

export interface Review {
  id: string;
  userId: string;
  gameId: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  user: User;
  game: Game;
}

export interface GameList {
  id: string;
  title: string;
  description: string;
  games: Game[];
  creator: User;
  isPublic: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'review' | 'rating' | 'wishlist' | 'completed' | 'started';
  user: User;
  game: Game;
  content?: string;
  rating?: number;
  date: string;
}
