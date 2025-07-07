import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
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
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      setError('You must be logged in to write a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addReview(game.id, rating, content);
      
      if (result.success) {
        setSuccess(result.message || 'Review added successfully!');
        setTimeout(() => {
          onClose();
          setRating(0);
          setContent('');
          setSuccess('');
        }, 1500);
      } else {
        setError(result.message || 'Failed to add review');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setRating(0);
      setContent('');
      setError('');
      setSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-16 h-20 object-cover rounded"
            />
            <div>
              <h2 className="text-xl font-bold text-white">Write a Review</h2>
              <p className="text-gray-400">{game.title}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                You need to be logged in to write a review. 
                <a href="/login" className="text-yellow-300 hover:text-yellow-200 underline ml-1">
                  Sign in here
                </a>
              </p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Your Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting || !isAuthenticated}
                  className="hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600 hover:text-yellow-400'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-white font-medium ml-2">{rating}/5</span>
              )}
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting || !isAuthenticated}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none disabled:opacity-50"
              rows={6}
              placeholder="Share your thoughts about this game... What did you like or dislike? Would you recommend it to others?"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-400 text-sm">
                {content.length}/1000 characters
              </p>
              {content.length > 1000 && (
                <p className="text-red-400 text-sm">Character limit exceeded</p>
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Game Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Developer:</span>
                <span className="text-white ml-2">{game.developer}</span>
              </div>
              <div>
                <span className="text-gray-400">Release Year:</span>
                <span className="text-white ml-2">{game.releaseYear}</span>
              </div>
              <div>
                <span className="text-gray-400">Average Rating:</span>
                <div className="flex items-center gap-1 ml-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white">{game.rating}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Genres:</span>
                <span className="text-white ml-2">{game.genres.slice(0, 2).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated || rating === 0 || content.length > 1000}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isSubmitting ? 'Publishing...' : 'Publish Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;