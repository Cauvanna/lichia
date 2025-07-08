import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Play, Check, Clock, Plus, Calendar, Users, GamepadIcon, Edit, MessageCircle, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ui/ReviewModal';
import ReviewCard from '../components/ui/ReviewCard';

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
  const [gameReviews, setGameReviews] = useState<any[]>([]);
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
          // Usa a imagem da pasta public/covers se existir
          coverImage: `/covers/${data.id}.jpg`,
          rating: data.nota_media || 0,
//           description: data.description || `Um jogo de ${data.genero} lançado em ${data.anoLancamento}.`,
          // outros campos opcionais podem ser mapeados aqui
        });
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar dados do jogo');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
    // Busca avaliações do jogo
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const reqBody: any = {
          comunicacao: 'request-lista-de-avaliacoes',
          id_jogo: parseInt(id, 10),
          username: isAuthenticated && user ? user.username : '',
          token: isAuthenticated && user && token ? token : ''
        };
        const response = await fetch('http://localhost:8080/request-lista-de-avaliacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody)
        });
        if (!response.ok) throw new Error('Erro ao buscar avaliações do jogo');
        const data = await response.json();
        if (Array.isArray(data)) {
          setGameReviews(data);
        } else {
          setGameReviews([]);
        }
      } catch (err) {
        setGameReviews([]);
      }
    };
    fetchReviews();
  }, [id, isAuthenticated, user, token]);

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
        {/* Dados do jogo */}
        {game && (
          <div className="flex flex-col lg:flex-row w-full min-w-[320px] max-w-3xl mx-auto">
            {/* Imagem do jogo */}
            <div className="flex flex-col items-center justify-start lg:mr-8 mb-6 lg:mb-0">
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-64 h-64 object-cover rounded-xl border-4 border-lichia-from"
              />
            </div>
            {/* Dados do jogo ao lado da imagem */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
              <div className="mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold text-lg">{game.rating?.toFixed(1) ?? '0.0'}</span>
                <span className="text-gray-400 text-sm">Nota média</span>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-lichia-from" />
                <span className="text-gray-300 text-sm">Desejado por <span className="font-bold text-white">{game.quant_desejantes ?? 0}</span> jogadores</span>
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
              {/* Botão Adicionar à Lista de Desejos */}
              <div className="flex flex-col gap-2 mb-4 w-2/3 max-w-xs">
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white'}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                  {isWishlisted ? 'Remover da Wishlist' : 'Adicionar à Lista de Desejos'}
                </button>
                {/* Botão para adicionar avaliação */}
                {isAuthenticated && (
                  <button
                    onClick={handleReviewClick}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-lichia-from text-white hover:bg-lichia-to transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    Adicionar Avaliação
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Lista simples de avaliações abaixo dos dados do jogo */}
        <div className="mt-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Avaliações do Jogo</h3>
          <div className="space-y-4">
            {gameReviews.length === 0 ? (
              <span className="text-gray-400">Nenhuma avaliação registrada para este jogo ainda.</span>
            ) : (
              gameReviews.map((review, idx) => (
                <div key={idx} className="bg-gray-800 rounded-lg p-4">
                  <div className="text-white font-semibold mb-1">{review.autor || review.autor_nome}</div>
                  <div className="text-gray-300 mb-2">Nota: <span className="font-bold">{review.nota}</span></div>
                  <div className="text-gray-200">{review.resenha}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <ReviewModal
          game={game}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default GameDetail;
