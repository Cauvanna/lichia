import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { useReviews } from '../context/ReviewContext';
import { Star, ArrowLeft, MessageCircle } from 'lucide-react';
import ReviewCard from '../components/ui/ReviewCard';

const UserReviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserReviews } = useReviews();

  const user = mockUsers.find(u => u.id === id);
  const userReviews = getUserReviews(id || '');

  if (!user) {
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

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/user/${id}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para {user.displayName}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Avaliações de {user.displayName}</h1>
              <p className="text-gray-400">{userReviews.length} avaliações</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {userReviews.length > 0 ? (
          <div className="space-y-6">
            {userReviews.map((review) => (
              <ReviewCard
                key={review.id}
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
            <p className="text-gray-400 mb-6">Este usuário ainda não fez avaliações.</p>
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