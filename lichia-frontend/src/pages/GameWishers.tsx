import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockGames, mockUsers } from '../data/mockData';
import { Heart, ArrowLeft, Users } from 'lucide-react';

const GameWishers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const game = mockGames.find(g => g.id === id);
  // Mock data - in real app this would come from backend
  const wishers = mockUsers.slice(0, 2); // Simulate some users wanting this game

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Game não encontrado</h1>
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/game/${id}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para {game.title}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-16 h-20 object-cover rounded"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Desejantes de {game.title}</h1>
              <p className="text-gray-400">{wishers.length} usuários desejam este jogo</p>
            </div>
          </div>
        </div>

        {/* Wishers List */}
        {wishers.length > 0 ? (
          <div className="space-y-4">
            {wishers.map((user) => (
              <div
                key={user.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{user.displayName}</h3>
                    <p className="text-gray-400 mb-2">@{user.username}</p>
                    <p className="text-gray-300 text-sm">{user.bio}</p>
                  </div>

                  <div className="text-center">
                    <div className="text-white font-bold">{user.gamesPlayed}</div>
                    <div className="text-gray-400 text-sm">Games</div>
                  </div>

                  <div className="text-center">
                    <div className="text-white font-bold">{user.followers}</div>
                    <div className="text-gray-400 text-sm">Seguidores</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum desejante ainda</h3>
            <p className="text-gray-400 mb-6">Nenhum usuário adicionou este jogo à lista de desejos.</p>
            <button
              onClick={() => navigate(`/game/${id}`)}
              className="bg-lichia-from hover:bg-lichia-to text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Voltar ao Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameWishers;