import React from 'react';
import { Review } from '../../types';
import { Star, Calendar, StarHalf } from 'lucide-react';

interface ReviewCardProps {
  review: any;
  onUserClick?: (userId: string) => void;
  onGameClick?: (gameId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onUserClick, onGameClick }) => {
  // DEBUG: Mostra o valor original do campo date/data_criacao recebido
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[DEBUG ReviewCard] Valor original de review.date:', review?.date);
    if (review?.data_criacao) {
      console.log('[DEBUG ReviewCard] Valor de review.data_criacao:', review.data_criacao);
    }
    if (review?.data) {
      console.log('[DEBUG ReviewCard] Valor de review.data:', review.data);
    }
  }, [review]);

  // Corrige o acesso ao campo de data para evitar erro de undefined
  const getDate = () => {
    if (!review) return '';
    return review.date || review.data_criacao || review.data || '';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Se vier no formato 'YYYY-MM-DD', converte corretamente para data local
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      return dateObj.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    // fallback para outros formatos
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleGameTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGameClick) {
      const gameId = review?.gameId;
      if (gameId) {
        onGameClick(String(gameId));
      }
    }
  };

  // Renderiza estrelas e meias estrelas conforme a nota
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalf key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-2">
      <div className="flex items-start gap-4">
        <img
          src={review.user.avatar}
          alt={review.user.displayName}
          className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
          onClick={() => onUserClick && onUserClick(review.userId)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className="text-white font-semibold cursor-pointer hover:text-purple-400 transition-colors"
              onClick={() => onUserClick && onUserClick(review.userId)}
            >
              {review.user.displayName}
            </h3>
            <span className="text-gray-400">avaliou</span>
            <span
              className="text-lichia-from font-medium cursor-pointer hover:text-lichia-to transition-colors"
              onClick={handleGameTitleClick}
            >
              {review.game.titulo_jogo || review.game.title || review.game.titulo}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
              <span className="text-white font-medium ml-1">{review.rating}/5</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(getDate())}
            </div>
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed">{review.content}</p>
        </div>
        <img
          src={review.game.coverImage}
          alt={review.game.title}
          className="w-16 h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
          onClick={() => onGameClick && onGameClick(review.gameId)}
        />
      </div>
    </div>
  );
};

export default ReviewCard;
