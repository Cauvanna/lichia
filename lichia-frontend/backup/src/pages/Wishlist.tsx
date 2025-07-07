import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockGames, mockUsers } from '../data/mockData';
import { Heart, Search, Filter, Grid, List, Star, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/ui/GameCard';

const Wishlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterGenre, setFilterGenre] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Determine if this is the current user's wishlist or another user's
  const isOwnWishlist = !id || (isAuthenticated && user?.id === id);
  const targetUser = id ? mockUsers.find(u => u.id === id) : user;

  // Redirect to login if trying to access own wishlist without authentication
  if (isOwnWishlist && !isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Show error if user not found
  if (id && !targetUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Usuário não encontrado</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Filter games that are in the wishlist
  const wishlistGames = mockGames.filter(game => wishlistItems.includes(game.id));

  // Get all unique genres for filtering
  const allGenres = Array.from(new Set(mockGames.flatMap(game => game.genres)));

  // Filter and sort games
  const filteredGames = wishlistGames
    .filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.developer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = filterGenre === 'all' || game.genres.includes(filterGenre);
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'releaseYear':
          return b.releaseYear - a.releaseYear;
        case 'dateAdded':
        default:
          return 0; // In a real app, this would sort by actual date added
      }
    });

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleRemoveFromWishlist = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwnWishlist) {
      removeFromWishlist(gameId);
    }
  };

  const WishlistGameCard: React.FC<{ game: any }> = ({ game }) => {
    if (viewMode === 'list') {
      return (
        <div 
          className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer group"
          onClick={() => handleGameClick(game.id)}
        >
          <div className="flex items-center gap-4">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-16 h-20 object-cover rounded"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg mb-1 truncate">{game.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{game.developer} • {game.releaseYear}</p>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-medium">{game.rating}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {game.genres.slice(0, 3).map((genre: string, index: number) => (
                    <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
            </div>
            
            {isOwnWishlist && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleRemoveFromWishlist(game.id, e)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                  title="Remover da lista de desejos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="relative group">
        <GameCard
          game={game}
          onGameClick={handleGameClick}
          showStatus={false}
        />
        {isOwnWishlist && (
          <div className="absolute top-16 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => handleRemoveFromWishlist(game.id, e)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg"
              title="Remover da lista de desejos"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {id && (
          <button
            onClick={() => navigate(`/user/${id}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para {targetUser?.displayName}
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-3">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isOwnWishlist ? 'Minha Lista de Desejos' : `Lista de Desejos de ${targetUser?.displayName}`}
              </h1>
              <p className="text-gray-400">
                {isOwnWishlist ? 'Games que você quer jogar' : 'Games que este usuário quer jogar'}
              </p>
            </div>
          </div>
          
          <div className="text-gray-400">
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} na lista de desejos
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar na lista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os Gêneros</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="dateAdded">Data de Adição</option>
              <option value="title">Título</option>
              <option value="rating">Nota Média</option>
              <option value="releaseYear">Ano de Lançamento</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Games Grid/List */}
        {filteredGames.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredGames.map((game) => (
              <WishlistGameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {searchTerm || filterGenre !== 'all' ? 'Nenhum game encontrado' : 'Lista de desejos vazia'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterGenre !== 'all' 
                  ? 'Tente ajustar sua busca ou filtros'
                  : isOwnWishlist 
                    ? 'Comece adicionando jogos à sua lista de desejos'
                    : 'Este usuário ainda não adicionou jogos à lista de desejos'
                }
              </p>
              {!searchTerm && filterGenre === 'all' && isOwnWishlist && (
                <button
                  onClick={() => navigate('/explore')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Explorar Games
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;