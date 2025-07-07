import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { Calendar, User, Eye, EyeOff, Star, Heart, ArrowLeft } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = mockUsers.find(u => u.id === id);

  if (!user) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500"
            />
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.displayName}</h1>
              <p className="text-gray-400 text-lg mb-4">@{user.username}</p>
              
              <p className="text-gray-300 mb-6 max-w-2xl">{user.bio}</p>
              
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.gamesPlayed}</div>
                  <div className="text-gray-400 text-sm">Games Jogados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.followers}</div>
                  <div className="text-gray-400 text-sm">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.following}</div>
                  <div className="text-gray-400 text-sm">Seguindo</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Membro desde {formatDate(user.joinDate)}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Seguir
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate(`/user/${id}/reviews`)}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Histórico de Avaliações</h3>
            </div>
            <p className="text-gray-400">Veja as avaliações e resenhas deste usuário</p>
          </button>

          <button
            onClick={() => navigate(`/user/${id}/wishlist`)}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Lista de Desejos</h3>
            </div>
            <p className="text-gray-400">Veja a lista de jogos desejados</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;