import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockGames } from '../data/mockData';
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
  const { isAuthenticated } = useAuth();
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [playStatus, setPlayStatus] = useState<string>('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const game = mockGames.find(g => g.id === id);
  const gameReviews = getGameReviews(id || '');
  const isWishlisted = game ? isInWishlist(game.id) : false;

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Game não encontrado</h1>
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
                <span className="text-gray-400">({gameReviews.length} avaliações)</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{game.releaseYear}</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{game.developer}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {game.genres.map((genre, index) => (
                <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {game.platforms.map((platform, index) => (
                <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <GamepadIcon className="w-4 h-4" />
                  {platform}
                </span>
              ))}
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6">{game.description}</p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={playStatus}
                onChange={(e) => {
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  setPlayStatus(e.target.value);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <option value="">Adicionar à Library</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={handleWishlistToggle}
                className={`font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  isWishlisted
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white hover:bg-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                {isWishlisted ? 'Remover da Lista de Desejos' : 'Adicionar à Lista de Desejos'}
              </button>
              
              <button 
                onClick={handleReviewClick}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Criar Avaliação
              </button>
            </div>
            
            {/* Rating */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Avaliar este jogo</h3>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRatingClick(i + 1)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < userRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
                {userRating > 0 && (
                  <span className="text-white font-medium ml-2">{userRating}/5</span>
                )}
              </div>
              {!isAuthenticated && (
                <p className="text-gray-400 text-sm mt-2">
                  <button onClick={() => navigate('/login')} className="text-purple-400 hover:text-purple-300">
                    Faça login
                  </button> para avaliar este jogo
                </p>
              )}
            </div>
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
                    selectedScreenshot === index ? 'ring-2 ring-purple-500' : ''
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
                <Heart className="w-6 h-6 text-red-400" />
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
                <MessageCircle className="w-6 h-6 text-blue-400" />
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