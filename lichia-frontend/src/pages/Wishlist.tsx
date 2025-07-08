import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Search, Grid, List, Star, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GameContext';
import GameCard from '../components/ui/GameCard';

const Wishlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wishlistItems, wishlistGames, removeFromWishlist, fetchWishlistFromBackend } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { games, isLoading: gamesLoading } = useGames();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterGenre, setFilterGenre] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [rawWishlistJson, setRawWishlistJson] = useState<any>(null);

  // Determine if this is the current user's wishlist or another user's
  const isOwnWishlist = !id || (isAuthenticated && user?.id === id);
  const targetUser = user; // Só permite wishlist do usuário logado

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isOwnWishlist && isAuthenticated) {
        setWishlistLoading(true);
        // --- DEBUG: Captura o JSON bruto ---
        try {
          // Copia da lógica do contexto, mas faz a requisição aqui para debug
          let id_usuario = user?.id;
          if (typeof id_usuario === 'string' && /^\d+$/.test(id_usuario)) {
            id_usuario = parseInt(id_usuario, 10);
          }
          const req = {
            comunicacao: 'request-lista-de-desejos',
            usr_alvo: user?.username,
            id_usr_alvo: id_usuario,
            id_usr_solicitante: id_usuario,
            usr_solicitante: user?.username,
            token: user?.token || ''
          };
          const response = await fetch('http://localhost:8080/request-lista-desejos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
          });
          const data = await response.json();
          setRawWishlistJson(data); // Salva o JSON bruto para debug
        } catch (e) {
          setRawWishlistJson({ erro: String(e) });
        }
        // --- Fim do debug ---
        await fetchWishlistFromBackend();
        setWishlistLoading(false);
      }
    };
    fetchWishlist();
    // eslint-disable-next-line
  }, [isOwnWishlist, isAuthenticated]);

  // Redirect to login if trying to access own wishlist without authentication
  if (isOwnWishlist && !isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Mostra erro se não houver usuário logado
  if (!targetUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Usuário não encontrado</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-lichia-from hover:bg-lichia-to text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Use os jogos completos vindos do backend
  const wishlistGamesList = wishlistGames;

  // Gêneros únicos para filtro
  const allGenres = Array.from(new Set(wishlistGamesList.flatMap(game => game.genres || [])));

  // Filtro e ordenação
  const filteredGames = wishlistGamesList
    .filter(game => {
      if (!game || !game.titulo) return false;
      const matchesSearch = (game.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.publisher || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = filterGenre === 'all' || (game.genres && game.genres.includes(filterGenre));
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => 0); // Ordenação pode ser ajustada

  if (gamesLoading || wishlistLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-white text-lg">Carregando lista de desejos...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-white">Minha Wishlist</h1>
        </div>
        <div className="text-gray-400 mb-4">
          {filteredGames.length} {filteredGames.length === 1 ? 'jogo na wishlist' : 'jogos na wishlist'}
        </div>
        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar na wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lichia-from"
              />
            </div>
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
            <div />
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
        {/* Lista de jogos */}
        {filteredGames.length > 0 ? (
          <div className={`$
            {viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {filteredGames.map((game) => (
              viewMode === 'grid' ? (
                <GameCard
                  key={game.id}
                  game={game}
                  onGameClick={() => navigate(`/game/${game.id}`)}
                  showStatus={false}
                />
              ) : (
                <div key={game.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                  <img src={game.coverImage} alt={game.titulo} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{game.titulo}</h3>
                    <p className="text-gray-400 text-sm">{game.publisher} • {game.anoLancamento}</p>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(game.id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                    title="Remover da wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Sua wishlist está vazia</h3>
              <p className="text-gray-400 mb-6">
                Adicione jogos à sua lista de desejos para encontrá-los facilmente depois.
              </p>
              <button
                onClick={() => navigate('/explore')}
                className="bg-lichia-from hover:bg-lichia-to text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Explorar Jogos
              </button>
            </div>
          </div>
        )}
        {/* DEBUG: Exibe o JSON bruto recebido do backend */}
        {rawWishlistJson && (
          <div className="bg-gray-800 text-gray-200 p-4 mb-4 rounded-lg overflow-x-auto text-xs">
            <strong>DEBUG JSON recebido do backend:</strong>
            <pre>{JSON.stringify(rawWishlistJson, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
