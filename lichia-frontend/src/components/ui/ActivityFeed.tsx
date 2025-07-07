import React from 'react';
import { Activity } from '../../types';
import { Heart, Star, Play, Check, Calendar } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
  onUserClick: (userId: string) => void;
  onGameClick: (gameId: string) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, onUserClick, onGameClick }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'review':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'rating':
        return <Star className="w-5 h-5 text-purple-400" />;
      case 'wishlist':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'completed':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'started':
        return <Play className="w-5 h-5 text-blue-400" />;
      default:
        return <div className="w-5 h-5 bg-gray-400 rounded-full" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    const userName = activity.user.displayName;
    const gameTitle = activity.game.title;
    
    switch (activity.type) {
      case 'review':
        return (
          <>
            <span 
              className="text-purple-400 font-medium cursor-pointer hover:text-purple-300"
              onClick={() => onUserClick(activity.user.id)}
            >
              {userName}
            </span>
            <span className="text-gray-300"> reviewed </span>
            <span 
              className="text-white font-medium cursor-pointer hover:text-gray-300"
              onClick={() => onGameClick(activity.game.id)}
            >
              {gameTitle}
            </span>
            {activity.rating && (
              <span className="text-yellow-400 ml-1">({activity.rating}/5 stars)</span>
            )}
          </>
        );
      case 'rating':
        return (
          <>
            <span 
              className="text-purple-400 font-medium cursor-pointer hover:text-purple-300"
              onClick={() => onUserClick(activity.user.id)}
            >
              {userName}
            </span>
            <span className="text-gray-300"> rated </span>
            <span 
              className="text-white font-medium cursor-pointer hover:text-gray-300"
              onClick={() => onGameClick(activity.game.id)}
            >
              {gameTitle}
            </span>
            {activity.rating && (
              <span className="text-yellow-400 ml-1">{activity.rating}/5 stars</span>
            )}
          </>
        );
      case 'wishlist':
        return (
          <>
            <span 
              className="text-purple-400 font-medium cursor-pointer hover:text-purple-300"
              onClick={() => onUserClick(activity.user.id)}
            >
              {userName}
            </span>
            <span className="text-gray-300"> added </span>
            <span 
              className="text-white font-medium cursor-pointer hover:text-gray-300"
              onClick={() => onGameClick(activity.game.id)}
            >
              {gameTitle}
            </span>
            <span className="text-gray-300"> to wishlist</span>
          </>
        );
      case 'completed':
        return (
          <>
            <span 
              className="text-purple-400 font-medium cursor-pointer hover:text-purple-300"
              onClick={() => onUserClick(activity.user.id)}
            >
              {userName}
            </span>
            <span className="text-gray-300"> completed </span>
            <span 
              className="text-white font-medium cursor-pointer hover:text-gray-300"
              onClick={() => onGameClick(activity.game.id)}
            >
              {gameTitle}
            </span>
          </>
        );
      case 'started':
        return (
          <>
            <span 
              className="text-purple-400 font-medium cursor-pointer hover:text-purple-300"
              onClick={() => onUserClick(activity.user.id)}
            >
              {userName}
            </span>
            <span className="text-gray-300"> started playing </span>
            <span 
              className="text-white font-medium cursor-pointer hover:text-gray-300"
              onClick={() => onGameClick(activity.game.id)}
            >
              {gameTitle}
            </span>
          </>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm">
                {getActivityText(activity)}
              </div>
            </div>
            
            {activity.content && (
              <p className="text-gray-300 text-sm mb-2 line-clamp-2">{activity.content}</p>
            )}
            
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Calendar className="w-3 h-3" />
              {formatDate(activity.date)}
            </div>
          </div>
          
          <img
            src={activity.game.coverImage}
            alt={activity.game.title}
            className="w-12 h-16 object-cover rounded cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
            onClick={() => onGameClick(activity.game.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;