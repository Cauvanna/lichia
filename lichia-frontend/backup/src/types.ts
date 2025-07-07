export interface Game {
    id: string;
    title: string;
    developer: string;
    releaseYear: number;
    rating: number;
    userRating?: number;
    coverImage: string;
    screenshots: string[];
    description: string;
    genres: string[];
    platforms: string[];
    playStatus?: 'playing' | 'completed' | 'dropped' | 'plan_to_play';
  }
  
  export interface User {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    joinDate: string;
    gamesPlayed: number;
    followers: number;
    following: number;
    visibilidade: boolean;
    dataNascimento: string;
    dataCadastro: string;
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
    game: Pick<Game, 'id' | 'title' | 'coverImage'>;
  }
  
  export interface Activity {
      id: string;
      type: 'review' | 'rating' | 'wishlist' | 'completed' | 'started';
      user: Pick<User, 'id' | 'displayName' | 'avatar'>;
      game: Pick<Game, 'id' | 'title' | 'coverImage'>;
      date: string;
      rating?: number;
      content?: string;
  }