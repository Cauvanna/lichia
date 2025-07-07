import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockGames } from '../data/mockData';
import { Search, Grid, List, Gamepad2 } from 'lucide-react';
import GameCard from '../components/ui/GameCard';

const ExploreGames: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterGenre, setFilterGenre] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get all unique genres for filtering
  const allGenres = Array.from(new Set(mockGames.flatMap(game => game.genres)));

  // Filter and sort games
  const filteredGames = mockGames
    .filter(game => {
      // Adicionando uma verificação de segurança para evitar erros
      if (!game || typeof game.title !== 'string' || typeof game.developer !== 'string') {
        return false;
      }
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
          return (b.rating || 0) - (a.rating || 0);
        case 'releaseYear':
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        default:
          return 0;
      }
    });

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const GameListItem: React.FC<{ game: any }> = ({ game }) => (
    <div
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer group"
      onClick={() => handleGameClick(game.id)}
    >
      {/* ... (código do GameListItem) ... */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Explorar Games</h1>
              <p className="text-gray-400">Descubra novos jogos em nosso catálogo completo</p>
            </div>
          </div>

          <div className="text-gray-400">
            {filteredGames.length} {filteredGames.length === 1 ? 'game encontrado' : 'games encontrados'}
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
                placeholder="Buscar games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
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
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
            >
              <option value="title">Título</option>
              <option value="rating">Nota Média</option>
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
              viewMode === 'grid' ? (
                <GameCard
                  key={game.id}
                  game={game}
                  onGameClick={handleGameClick}
                  showStatus={false}
                />
              ) : (
                <GameListItem key={game.id} game={game} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-12 max-w-md mx-auto">
              <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum game encontrado</h3>
              <p className="text-gray-400 mb-6">
                Tente ajustar sua busca ou filtros
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreGames;