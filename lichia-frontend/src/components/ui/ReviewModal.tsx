import React, { useState } from 'react';
import { X, Star, Send, StarHalf } from 'lucide-react';
import { Game } from '../../types';
import { useReviews } from '../../context/ReviewContext';
import { useAuth } from '../../context/AuthContext';

interface ReviewModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ game, isOpen, onClose }) => {
  const { addReview } = useReviews();
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated || !user) {
      setError('Você precisa estar logado para registrar uma avaliação.');
      return;
    }

    if (rating === null) {
      setError('Por favor, selecione uma nota.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Envia o id do jogo corretamente para o addReview
      const result = await addReview(String(game.id), rating, content);

      if (result.success) {
        setSuccess(result.message || 'Avaliação publicada com sucesso!');
        setTimeout(() => {
          onClose();
          setRating(null);
          setContent('');
          setSuccess('');
        }, 1500);
      } else {
        setError(result.message || 'Falha ao publicar avaliação');
      }
    } catch (err) {
      setError('Um erro inesperado ocorreu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setRating(null);
      setHoverRating(null);
      setContent('');
      setError('');
      setSuccess('');
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((starIndex) => {
      const currentRating = hoverRating !== null ? hoverRating : rating;
      let starComponent;

      // Modificado para tratar o 0 corretamente
      if (currentRating !== null && currentRating >= starIndex) {
        starComponent = <Star className="w-8 h-8 text-yellow-400 fill-current" />;
      } else if (currentRating !== null && currentRating >= starIndex - 0.5) {
        starComponent = <StarHalf className="w-8 h-8 text-yellow-400 fill-current" />;
      } else {
        starComponent = <Star className="w-8 h-8 text-gray-300 fill-current" />;
      }

      return (
        <div
          key={starIndex}
          className="relative cursor-pointer"
          onMouseLeave={() => setHoverRating(null)}
        >
          <div
            className="absolute top-0 left-0 w-1/2 h-full"
            onMouseEnter={() => setHoverRating(starIndex - 0.5)}
            onClick={() => setRating(starIndex - 0.5)}
          />
          <div
            className="absolute top-0 right-0 w-1/2 h-full"
            onMouseEnter={() => setHoverRating(starIndex)}
            onClick={() => setRating(starIndex)}
          />
          {starComponent}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md relative transform transition-all duration-300 scale-95 animate-fade-in-up">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-lichia-500">Avalie {game.titulo}</h2>
        <p className="text-gray-400 mb-4">Selecione uma nota e, se quiser, deixe um comentário.</p>

        {/* --- Seção de Estrelas Corrigida com área para nota 0 --- */}
        <div className="flex items-center justify-center mb-4" onMouseLeave={() => setHoverRating(null)}>
            {/* INÍCIO DA MUDANÇA: Área para selecionar nota 0 */}
            <div
                className="w-8 h-8 cursor-pointer"
                onMouseEnter={() => setHoverRating(0)}
                onClick={() => setRating(0)}
            ></div>
            {/* FIM DA MUDANÇA */}

            <div className="flex space-x-1">
                {renderStars()}
            </div>
        </div>

        <div className="text-center text-lg font-bold text-yellow-400 mb-4 h-6">
            {/* Modificado para exibir a nota 0 corretamente */}
            {hoverRating !== null ? `${hoverRating} / 5` : (rating !== null ? `${rating} / 5` : 'Selecione a nota')}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full bg-gray-700 border border-gray-600 rounded p-3 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lichia-from resize-none"
            rows={4}
            placeholder="O que você achou do jogo?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />

          {error && <div className="text-red-400 mb-2 text-center">{error}</div>}
          {success && <div className="text-green-400 mb-2 text-center">{success}</div>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-lichia-from to-lichia-to text-white font-bold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isSubmitting || rating === null}
          >
            <Send className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Publicando...' : 'Publicar Avaliação'}
          </button>
        </form>

        {/* DEBUG: Exibe o id do jogo */}
        <div className="mt-4 text-xs text-gray-500">ID do jogo: {game?.id}</div>
      </div>
    </div>
  );
};

export default ReviewModal;
