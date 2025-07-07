import { Game, User, Review, Activity } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'gamer_dev',
    displayName: 'Gamer Dev',
    avatar: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Desenvolvedor e entusiasta de jogos indie. Sempre em busca do próximo grande jogo!',
    joinDate: '2022-08-15T10:00:00Z',
    gamesPlayed: 120,
    followers: 580,
    following: 120,
    visibilidade: true,
    dataNascimento: '1995-05-20',
    dataCadastro: '2022-08-15T10:00:00Z',
  },
  {
    id: '2',
    username: 'pixel_princess',
    displayName: 'Pixel Princess',
    avatar: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Amante de jogos retrô e pixel art. Colecionadora de consoles antigos.',
    joinDate: '2021-03-22T14:30:00Z',
    gamesPlayed: 350,
    followers: 1200,
    following: 250,
    visibilidade: true,
    dataNascimento: '1992-11-10',
    dataCadastro: '2021-03-22T14:30:00Z',
  },
];

export const mockGames: Game[] = [
    // Seus dados de games.json podem ser convertidos para este formato
    {
        "id": "1",
        "title": "Stardew Valley",
        "developer": "ConcernedApe",
        "releaseYear": 2016,
        "rating": 4.8,
        "userRating": 5,
        "coverImage": "https://images.igdb.com/igdb/image/upload/t_cover_big/xrpmf4kwsf2qa1bocnpp.jpg",
        "screenshots": ["https://images.igdb.com/igdb/image/upload/t_screenshot_huge/sot0r3bqqp5vsgj3wmon.jpg", "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/p5bls9jmafyae92qupcf.jpg"],
        "description": "Você herdou a antiga fazenda do seu avô em Stardew Valley. Equipado com ferramentas de segunda mão e algumas moedas, você parte para começar sua nova vida.",
        "genres": ["RPG", "Simulação", "Indie"],
        "platforms": ["PC", "PS4", "Xbox One", "Switch"],
        "playStatus": "completed"
    },
    {
        "id": "2",
        "title": "The Witcher 3: Wild Hunt",
        "developer": "CD Projekt Red",
        "releaseYear": 2015,
        "rating": 4.9,
        "userRating": 5,
        "coverImage": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r75.jpg",
        "screenshots": ["https://images.igdb.com/igdb/image/upload/t_screenshot_huge/q7u1fcj5rhchx3vjfs6y.jpg", "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/g6bavledk2ixwog6g8jz.jpg"],
        "description": "Como o caçador de monstros Geralt de Rívia, explore um vasto mundo aberto, persiga a Criança da Profecia e enfrente a Caçada Selvagem.",
        "genres": ["RPG", "Ação", "Aventura"],
        "platforms": ["PC", "PS4", "Xbox One", "Switch"],
        "playStatus": "playing"
    },
    {
        "id": "3",
        "title": "Hollow Knight",
        "developer": "Team Cherry",
        "releaseYear": 2017,
        "rating": 4.7,
        "coverImage": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7i.jpg",
        "screenshots": ["https://images.igdb.com/igdb/image/upload/t_screenshot_huge/g6bavledk2ixwog6g8jz.jpg"],
        "description": "Explore um vasto reino em ruínas de insetos e heróis. Lute contra chefes e desvende mistérios antigos em um clássico de ação e aventura.",
        "genres": ["Metroidvania", "Indie", "Plataforma"],
        "platforms": ["PC", "PS4", "Xbox One", "Switch"],
        "playStatus": "plan_to_play"
    },
    // Adicione mais jogos conforme necessário
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    userId: '1',
    gameId: '1',
    rating: 5,
    content: 'Um dos jogos mais relaxantes e viciantes que já joguei. A quantidade de conteúdo é impressionante para um jogo feito por uma pessoa. Recomendo a todos!',
    date: '2023-04-10T18:00:00Z',
    likes: 15,
    user: mockUsers[0],
    game: mockGames[0],
  },
  {
    id: 'r2',
    userId: '2',
    gameId: '2',
    rating: 5,
    content: 'Uma obra-prima dos RPGs. A história, os personagens, o mundo... tudo é perfeito. Horas e horas de exploração e diversão garantidas.',
    date: '2023-05-20T12:00:00Z',
    likes: 42,
    user: mockUsers[1],
    game: mockGames[1],
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'review',
    user: mockUsers[0],
    game: mockGames[0],
    date: '2023-04-10T18:00:00Z',
    rating: 5,
    content: 'Um dos jogos mais relaxantes e viciantes que já joguei.'
  },
  {
    id: 'a2',
    type: 'wishlist',
    user: mockUsers[1],
    game: mockGames[2],
    date: '2023-06-01T10:00:00Z',
  },
  {
    id: 'a3',
    type: 'completed',
    user: mockUsers[0],
    game: mockGames[1],
    date: '2023-05-15T22:00:00Z',
  }
];