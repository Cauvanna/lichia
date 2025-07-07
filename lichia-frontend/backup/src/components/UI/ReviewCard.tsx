import React from 'react';
import { Review } from '../../types';
import { Star, Heart, MessageCircle, Calendar } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onUserClick: (userId: string) => void;
  onGameClick: (gameId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onUserClick, onGameClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-start gap-4">
        <img
          src={review.user.avatar}
          alt={review.user.displayName}
          className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
          onClick={() => onUserClick(review.userId)}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 
              className="text-white font-semibold cursor-pointer hover:text-purple-400 transition-colors"
              onClick={() => onUserClick(review.userId)}
            >
              {review.user.displayName}
            </h3>
            <span className="text-gray-400">reviewed</span>
            <span 
              className="text-purple-400 font-medium cursor-pointer hover:text-purple-300 transition-colors"
              onClick={() => onGameClick(review.gameId)}
            >
              {review.game.title}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
              <span className="text-white font-medium ml-1">{review.rating}/5</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(review.date)}
            </div>
          </div>
          
          <p className="text-gray-300 mb-4 leading-relaxed">{review.content}</p>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{review.likes}</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Reply</span>
            </button>
          </div>
        </div>
        
        <img
          src={review.game.coverImage}
          alt={review.game.title}
          className="w-16 h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
          onClick={() => onGameClick(review.gameId)}
        />
      </div>
    </div>
  );
};

export default ReviewCard;