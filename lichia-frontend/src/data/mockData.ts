import { Game, User, Review, Activity } from '../types';

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    developer: 'CD Projekt RED',
    releaseYear: 2020,
    genres: ['RPG', 'Action', 'Open World'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    coverImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 8.2,
    userRating: 9,
    description: 'An open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamour, and ceaseless body modification.',
    screenshots: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isWishlisted: false,
    playStatus: 'completed'
  },
  {
    id: '2',
    title: 'The Witcher 3: Wild Hunt',
    developer: 'CD Projekt RED',
    releaseYear: 2015,
    genres: ['RPG', 'Action', 'Fantasy'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    coverImage: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 9.3,
    userRating: 10,
    description: 'A story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.',
    screenshots: [
      'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isWishlisted: false,
    playStatus: 'completed'
  },
  {
    id: '3',
    title: 'Hollow Knight',
    developer: 'Team Cherry',
    releaseYear: 2017,
    genres: ['Metroidvania', 'Indie', 'Platformer'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    coverImage: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 9.0,
    description: 'A challenging 2D action-adventure through a vast ruined kingdom of insects and heroes.',
    screenshots: [
      'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isWishlisted: true,
    playStatus: 'plan_to_play'
  },
  {
    id: '4',
    title: 'Elden Ring',
    developer: 'FromSoftware',
    releaseYear: 2022,
    genres: ['RPG', 'Action', 'Fantasy'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    coverImage: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 9.5,
    userRating: 9,
    description: 'A fantasy action-RPG adventure set within a world full of mystery and peril.',
    screenshots: [
      'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isWishlisted: false,
    playStatus: 'playing'
  },
  {
    id: '5',
    title: 'Hades',
    developer: 'Supergiant Games',
    releaseYear: 2020,
    genres: ['Roguelike', 'Indie', 'Action'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    coverImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 9.2,
    description: 'A rogue-like dungeon crawler in which you defy the god of the dead.',
    screenshots: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    isWishlisted: false,
    playStatus: 'completed'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'gamingmaster',
    displayName: 'Gaming Master',
    avatar: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'RPG enthusiast and indie game lover. Always looking for the next great adventure.',
    followers: 1234,
    following: 567,
    gamesPlayed: 89,
    joinDate: '2022-01-15'
  },
  {
    id: '2',
    username: 'indiegamer',
    displayName: 'Indie Explorer',
    avatar: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Discovering hidden gems in the indie gaming world.',
    followers: 890,
    following: 234,
    gamesPlayed: 156,
    joinDate: '2021-08-22'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    gameId: '1',
    rating: 9,
    content: 'Despite its rocky launch, Cyberpunk 2077 has become one of my favorite RPGs. The story is compelling, the world is incredibly detailed, and the character development is top-notch.',
    date: '2024-01-15',
    likes: 45,
    user: mockUsers[0],
    game: mockGames[0]
  },
  {
    id: '2',
    userId: '2',
    gameId: '2',
    rating: 10,
    content: 'The Witcher 3 is a masterpiece. Every quest feels meaningful, and the world is so rich and detailed. Geralt\'s journey is unforgettable.',
    date: '2024-01-10',
    likes: 78,
    user: mockUsers[1],
    game: mockGames[1]
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'review',
    user: mockUsers[0],
    game: mockGames[0],
    content: 'Just finished Cyberpunk 2077 and wow, what a ride!',
    rating: 9,
    date: '2024-01-15'
  },
  {
    id: '2',
    type: 'completed',
    user: mockUsers[1],
    game: mockGames[1],
    date: '2024-01-14'
  },
  {
    id: '3',
    type: 'wishlist',
    user: mockUsers[0],
    game: mockGames[2],
    date: '2024-01-13'
  },
  {
    id: '4',
    type: 'started',
    user: mockUsers[1],
    game: mockGames[3],
    date: '2024-01-12'
  }
];