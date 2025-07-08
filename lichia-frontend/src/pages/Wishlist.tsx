import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Search, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GameContext';
import GameCard from '../components/ui/GameCard';

const Wishlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wishlistItems, wishlistGames, removeFromWishlist, fetchWishlistFromBackend, isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { games, isLoading: gamesLoading } = useGames();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterGenre, setFilterGenre] = useState('all');
  const [viewMode] = useState<'list'>('list'); // Fixa o modo de exibição como 'list'
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [rawWishlistJson, setRawWishlistJson] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showLoginNoticeId, setShowLoginNoticeId] = useState<string | null>(null);

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
            {/* Removido o seletor de modo de exibição (grid/list) */}
          </div>
        </div>
        {/* Lista de jogos */}
        {filteredGames.length > 0 ? (
          <div className="space-y-4">
            {filteredGames.map((game) => {
              const isWishlisted = isInWishlist(game.id);
              return (
                <div key={game.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                  <img src={game.coverImage} alt={game.titulo} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{game.titulo}</h3>
                    <p className="text-gray-400 text-sm">{game.publisher} • {game.anoLancamento}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          setShowLoginNoticeId(game.id);
                          setTimeout(() => setShowLoginNoticeId(null), 2500);
                          return;
                        }
                        setLoadingId(game.id);
                        await toggleWishlist(game.id);
                        setLoadingId(null);
                      }}
                      disabled={loadingId === game.id}
                      className={`rounded-full p-2 transition-all duration-200 hover:scale-110 ${
                        isWishlisted
                          ? 'bg-red-500 text-white'
                          : 'bg-black/50 text-white hover:bg-red-500'
                      }`}
                      title={isWishlisted ? 'Remover da wishlist' : 'Adicionar à wishlist'}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>
                    {showLoginNoticeId === game.id && (
                      <div className="absolute top-12 right-0 bg-gray-900 text-white text-xs rounded shadow-lg px-4 py-2 z-50 border border-lichia-from animate-fade-in">
                        Registre-se e faça login para adicionar um jogo à sua Lista de Desejos
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
      </div>
    </div>
  );
};

export default Wishlist;
