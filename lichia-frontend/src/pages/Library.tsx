import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Grid, List, Star, Play, Check, Clock, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/ui/GameCard';
import { mockGames } from '../data/mockData';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Filter games that have a play status (user's library)
  const libraryGames = mockGames.filter(game => game.playStatus);

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'playing', label: 'Jogando', icon: Play, color: 'text-blue-400' },
    { value: 'completed', label: 'Completados', icon: Check, color: 'text-green-400' },
    { value: 'dropped', label: 'Abandonados', icon: Clock, color: 'text-red-400' },
    { value: 'plan_to_play', label: 'Pretendo Jogar', icon: Plus, color: 'text-yellow-400' },
  ];

  // Filter and sort games
  const filteredGames = libraryGames
    .filter(game => {
        if (!game || !game.title || !game.developer) return false;
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.developer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || game.playStatus === filterStatus;
        return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'userRating':
          return (b.userRating || 0) - (a.userRating || 0);
        case 'releaseYear':
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        default:
          return 0;
      }
    });

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const getStatusStats = () => {
    const stats = {
      playing: libraryGames.filter(g => g.playStatus === 'playing').length,
      completed: libraryGames.filter(g => g.playStatus === 'completed').length,
      dropped: libraryGames.filter(g => g.playStatus === 'dropped').length,
      plan_to_play: libraryGames.filter(g => g.playStatus === 'plan_to_play').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  const LibraryGameCard: React.FC<{ game: any }> = ({ game }) => {
    if (viewMode === 'list') {
      const statusOption = statusOptions.find(s => s.value === game.playStatus);
      const StatusIcon = statusOption?.icon;

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

                {game.userRating && (
                  <div className="flex items-center gap-1">
                    <span className="text-lichia-from text-sm">Sua nota:</span>
                    <Star className="w-4 h-4 text-lichia-from fill-lichia-from" />
                    <span className="text-lichia-from font-medium">{game.userRating}</span>
                  </div>
                )}

                {StatusIcon && (
                  <div className={`flex items-center gap-1 ${statusOption?.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm">{statusOption?.label}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <GameCard
        key={game.id}
        game={game}
        onGameClick={handleGameClick}
        showStatus={true}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Lista de Desejos</h1>
              <p className="text-gray-400">Seus jogos desejados</p>
            </div>
          </div>

          <div className="text-gray-400">
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} na sua lista de desejos
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Jogando</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.playing}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Completados</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Pretendo Jogar</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.plan_to_play}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Abandonados</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.dropped}</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar na library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
              />
            </div>

            {/* Status & Sort Filters */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
            >
              <option value="title">Título</option>
              <option value="rating">Nota Média</option>
              <option value="userRating">Sua Nota</option>
              <option value="releaseYear">Ano de Lançamento</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-lichia-from text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-lichia-from text-white'
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
              <LibraryGameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {searchTerm || filterStatus !== 'all' ? 'Nenhum game encontrado' : 'Sua library está vazia'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Comece adicionando jogos à sua library'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => navigate('/explore')}
                  className="bg-lichia-from hover:bg-lichia-to text-white font-medium py-2 px-6 rounded-lg transition-colors"
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

export default Library;
