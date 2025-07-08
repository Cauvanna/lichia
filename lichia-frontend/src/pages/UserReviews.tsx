import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import { useReviews } from '../context/ReviewContext';
import { Star, ArrowLeft, MessageCircle } from 'lucide-react';
import ReviewCard from '../components/ui/ReviewCard';
import lichiaLogoUrl from '../assets/lichia.png';

const UserReviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchReviews = async () => {
      if (!user || !token) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        // Corrige o corpo do request para o formato esperado pelo backend
        const reqBody = {
          comunicacao: 'request-historico-avaliacoes',
          usr_alvo: user.username, // usuário alvo é o próprio usuário logado
          id_usr_alvo: parseInt(id || user.id, 10),
          id_usr_solicitante: parseInt(user.id, 10),
          usr_solicitante: user.username,
          token: token
        };
        const response = await fetch('http://localhost:8080/request-historico-avaliacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody)
        });
        const data = await response.json();
        if (data.mensagem) {
          setError(data.mensagem);
        } else {
          // Mapeia os dados do backend para o formato esperado pelo ReviewCard
          const mappedReviews = Array.isArray(data) ? data.map((item: any, idx: number) => ({
            id: String(idx),
            userId: String(item.id_autor),
            gameId: item.id_jogo ? String(item.id_jogo) : '',
            rating: item.nota ?? 0,
            content: item.resenha || '',
            date: item.data_criacao || '',
            likes: 0,
            user: {
              id: String(item.id_autor),
              username: item.autor || '',
              displayName: item.autor || '',
              avatar: '/src/assets/lichia.png', // ou um avatar padrão
              bio: '',
              followers: 0,
              following: 0,
              gamesPlayed: 0,
              joinDate: '',
            },
            game: {
              id: item.id_jogo ? String(item.id_jogo) : '',
              title: item.titulo || '',
              developer: '',
              releaseYear: 0,
              rating: item.nota ?? 0,
              genres: [],
              platforms: [],
              coverImage: '',
              description: '',
              userRating: undefined,
              screenshots: [],
              isWishlisted: false,
              playStatus: undefined,
              titulo: '',
              genero: '',
              anoLancamento: 0,
              consoleLancamento: '',
              ehHandheld: false,
              maxJogadores: 1,
              temOnline: false,
              publisher: '',
              temSequencia: false,
              precoUsual: 0,
              duracaoMainStoryAverage: 0,
              duracaoMainStoryExtras: 0,
              duracaoCompletionistAverage: 0,
            },
          })) : [];
          setReviews(mappedReviews);
        }
      } catch (e) {
        setError('Erro ao buscar avaliações do usuário.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    // eslint-disable-next-line
  }, [id, user, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="text-white text-lg">Carregando avaliações...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error || 'Usuário não encontrado'}</h1>
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

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  // Corrige o botão de voltar para o perfil do usuário
  const isOwnProfile = id === user.id;
  const backToProfile = () => {
    if (isOwnProfile) {
      navigate('/profile');
    } else {
      navigate(`/user/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={backToProfile}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para {user.displayName}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={lichiaLogoUrl}
              alt={user.displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Avaliações de {user.displayName}</h1>
              <p className="text-gray-400">{reviews.length} avaliações</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <ReviewCard
                key={idx}
                review={review}
                onUserClick={handleUserClick}
                onGameClick={handleGameClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma avaliação ainda</h3>
            <p className="text-gray-400 mb-6">Este usuário ainda não possui avaliações.</p>
            <button
              onClick={() => navigate(`/user/${id}`)}
              className="bg-lichia-from hover:bg-lichia-to text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Voltar ao Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;
