import React from 'react';
import { Game } from '../../types';
import { Star, Heart, Play, Check, Clock, Plus } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

interface GameCardProps {
  game: Game;
  onGameClick: (gameId: string) => void;
  showStatus?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameClick, showStatus = true }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(game.id);

  const getStatusIcon = () => {
    switch (game.playStatus) {
      case 'playing':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'completed':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'dropped':
        return <Clock className="w-4 h-4 text-red-400" />;
      case 'plan_to_play':
        return <Plus className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (game.playStatus) {
      case 'playing':
        return 'Playing';
      case 'completed':
        return 'Completed';
      case 'dropped':
        return 'Dropped';
      case 'plan_to_play':
        return 'Plan to Play';
      default:
        return '';
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(game.id);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group relative"
      onClick={() => onGameClick(game.id)}
    >
      <div className="relative">
        <img 
          src={game.coverImage} 
          alt={game.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 rounded-full p-2 transition-all duration-200 hover:scale-110 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-black/50 text-white hover:bg-red-500'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
        
        {showStatus && game.playStatus && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white text-sm font-medium">{getStatusText()}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-2">{game.developer} • {game.releaseYear}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-medium">{game.rating}</span>
          </div>
          
          {game.userRating && (
            <div className="flex items-center gap-1">
              <span className="text-purple-400 text-sm">Your rating:</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                <span className="text-purple-400 font-medium">{game.userRating}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {game.genres.slice(0, 3).map((genre, index) => (
            <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
              {genre}
            </span>
          ))}
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-3">{game.description}</p>
      </div>
    </div>
  );
};

export default GameCard;