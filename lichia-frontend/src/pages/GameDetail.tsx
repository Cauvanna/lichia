import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Play, Check, Clock, Plus, Calendar, Users, GamepadIcon, Edit, MessageCircle, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ui/ReviewModal';

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getGameReviews } = useReviews();
  const { isAuthenticated, user, token } = useAuth();
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [playStatus, setPlayStatus] = useState<string>('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        let reqBody: any = {
          comunicacao: 'request-pagina-de-game',
          id_jogo: parseInt(id, 10),
        };
        if (isAuthenticated && user && token) {
          reqBody.username = user.username;
          reqBody.token = token;
        } else {
          reqBody.username = '';
          reqBody.token = '';
        }
        const response = await fetch('http://localhost:8080/request-pagina-de-game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody)
        });
        if (!response.ok) throw new Error('Erro ao buscar dados do jogo');
        const data = await response.json();
        if (data.mensagem) throw new Error(data.mensagem);
        setGame({
          ...data,
          id: String(data.id),
          title: data.titulo,
          developer: data.publisher,
          releaseYear: data.anoLancamento,
          genres: typeof data.genero === 'string' ? data.genero.split(',').map((g: string) => g.trim()) : [],
          coverImage: data.coverImage || 'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg',
          rating: data.nota_media || 0,
          description: data.description || `Um jogo de ${data.genero} lançado em ${data.anoLancamento}.`,
          // outros campos opcionais podem ser mapeados aqui
        });
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar dados do jogo');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
    // eslint-disable-next-line
  }, [id, isAuthenticated, user, token]);

  const gameReviews = getGameReviews(id || '');
  const isWishlisted = game ? isInWishlist(game.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="text-white text-lg">Carregando dados do jogo...</span>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error || 'Game não encontrado'}</h1>
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

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(game.id);
  };

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleRatingClick = (rating: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setUserRating(rating);
  };

  const statusOptions = [
    { value: 'playing', label: 'Jogando', icon: Play, color: 'text-blue-400' },
    { value: 'completed', label: 'Completado', icon: Check, color: 'text-green-400' },
    { value: 'dropped', label: 'Abandonado', icon: Clock, color: 'text-red-400' },
    { value: 'plan_to_play', label: 'Pretendo Jogar', icon: Plus, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Game Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-full max-w-sm mx-auto rounded-lg shadow-xl"
            />
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{game.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium text-lg">{game.rating}</span>
              </div>
              <button
                onClick={handleWishlistToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white'}`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                {isWishlisted ? 'Remover da Wishlist' : 'Adicionar à Wishlist'}
              </button>
              {/* Botão para adicionar avaliação */}
              {isAuthenticated && (
                <button
                  onClick={handleReviewClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-lichia-from text-white hover:bg-lichia-to transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Adicionar Avaliação
                </button>
              )}
            </div>

            <div className="mb-4">
              <span className="text-gray-400">{game.developer} • {game.releaseYear}</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {game.genres && game.genres.map((genre: string, idx: number) => (
                <span key={idx} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">{genre}</span>
              ))}
            </div>
            <div className="mb-4">
              <span className="text-gray-400">{game.consoleLancamento}</span>
            </div>
            <div className="mb-4">
              <span className="text-gray-400">{game.description}</span>
            </div>
            {/* Outros campos detalhados podem ser exibidos aqui */}
          </div>
        </div>

        {/* Screenshots */}
        {game.screenshots && game.screenshots.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {game.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`${game.title} screenshot ${index + 1}`}
                  className={`rounded-lg cursor-pointer transition-all hover:scale-105 ${
                    selectedScreenshot === index ? 'ring-2 ring-lichia-from' : ''
                  }`}
                  onClick={() => setSelectedScreenshot(index)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Links */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate(`/game/${id}/wishers`)}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-lichia-from" />
                <div>
                  <h3 className="text-white font-semibold">Lista de Desejantes</h3>
                  <p className="text-gray-400 text-sm">Veja quem deseja este jogo</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate(`/game/${id}/reviews`)}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-lichia-from" />
                <div>
                  <h3 className="text-white font-semibold">Todas as Avaliações</h3>
                  <p className="text-gray-400 text-sm">{gameReviews.length} avaliações</p>
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Review Modal */}
      <ReviewModal
        game={game}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};

export default GameDetail;
