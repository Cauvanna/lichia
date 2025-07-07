import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, EyeOff, Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
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
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">Nome</div>
                  <div className="text-gray-400 text-sm">{user.displayName}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xl font-bold text-white">
                    {user.visibilidade ? (
                      <Eye className="w-5 h-5 text-green-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {user.visibilidade ? 'Público' : 'Privado'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {formatDate(user.dataCadastro).split(' ')[2]}
                  </div>
                  <div className="text-gray-400 text-sm">Cadastro</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {formatDate(user.dataNascimento).split(' ')[2]}
                  </div>
                  <div className="text-gray-400 text-sm">Nascimento</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Membro desde {formatDate(user.dataCadastro)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/user/1/reviews')}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Histórico de Avaliações</h3>
            </div>
            <p className="text-gray-400">Veja todas as suas avaliações e resenhas</p>
          </button>

          <button
            onClick={() => navigate('/wishlist')}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Lista de Desejos</h3>
            </div>
            <p className="text-gray-400">Gerencie sua lista de jogos desejados</p>
          </button>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">Detalhes do Perfil</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nome de Usuário
                </label>
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  {user.username}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nome de Exibição
                </label>
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  {user.displayName}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Visibilidade do Perfil
                </label>
                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  user.visibilidade ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {user.visibilidade ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Perfil Público
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Perfil Privado
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Data de Nascimento
                </label>
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  {formatDate(user.dataNascimento)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Data de Cadastro
                </label>
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  {formatDate(user.dataCadastro)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Biografia
                </label>
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg min-h-[80px]">
                  {user.bio}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;