import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/ui/GameCard';
import ReviewCard from '../components/ui/ReviewCard';
import ActivityFeed from '../components/ui/ActivityFeed';
import { mockGames, mockReviews, mockActivities } from '../data/mockData';
import { TrendingUp, Star, Clock, Sparkles, Gamepad2, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const featuredGames = mockGames.slice(0, 4);
  const recommendedGames = mockGames.slice(2, 6);
  const recentActivities = mockActivities.slice(0, 5);
  const topReviews = mockReviews;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Descubra Sua Próxima
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lichia-from to-lichia-to ml-3">
                Aventura Gaming
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Acompanhe sua jornada gaming, descubra jogos, compartilhe suas impressões e conecte-se com outros gamers na sua plataforma social de games favorita
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-lichia-from hover:bg-lichia-to text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Fazer Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/explore')}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Explorar Games</h3>
              </div>
              <p className="text-gray-400">Descubra novos jogos e explore nosso catálogo completo</p>
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/library')}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3 group-hover:scale-110 transition-transform">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Minha Library</h3>
                  </div>
                  <p className="text-gray-400">Veja seus jogos e avaliações</p>
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-3 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Meu Painel</h3>
                  </div>
                  <p className="text-gray-400">Acesse seu perfil e configurações</p>
                </button>
              </>
            )}
          </div>
        </section>

        {/* Featured Games */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Games em Destaque</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onGameClick={handleGameClick}
              />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personalized Recommendations */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Recomendados</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onGameClick={handleGameClick}
                  />
                ))}
              </div>
            </section>

            {/* Recent Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Avaliações Recentes</h2>
              </div>

              <div className="space-y-4">
                {topReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onUserClick={handleUserClick}
                    onGameClick={handleGameClick}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Activity Feed */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-lichia-from to-lichia-to rounded-lg p-2">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Atividade Recente</h2>
              </div>
              
              <ActivityFeed
                activities={recentActivities}
                onUserClick={handleUserClick}
                onGameClick={handleGameClick}
              />
            </section>

            {/* Platform Stats */}
            <section className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Estatísticas da Plataforma</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Games Catalogados</span>
                  <span className="text-white font-bold">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Usuários Ativos</span>
                  <span className="text-white font-bold">15,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avaliações</span>
                  <span className="text-white font-bold">89,156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Listas de Desejos</span>
                  <span className="text-white font-bold">234,567</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;