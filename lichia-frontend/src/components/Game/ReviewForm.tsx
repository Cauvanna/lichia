import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { RatingStars } from '../UI/RatingStars';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewFormProps {
  gameId: number;
  onSubmit: (review: { rating: number; comment: string }) => void;
  initialRating?: number | null;
  initialComment?: string;
}

export const ReviewForm = ({
  gameId,
  onSubmit,
  initialRating = null,
  initialComment = ''
}: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = () => {
    if (!user) {
      setError('Você precisa estar logado para enviar uma resenha');
      return;
    }

    if (!rating) {
      setError('Por favor, dê uma avaliação');
      return;
    }

    if (comment.trim().length < 10) {
      setError('A resenha deve ter pelo menos 10 caracteres');
      return;
    }

    onSubmit({ rating, comment });
    setSuccess('Resenha enviada com sucesso!');
    setError('');

    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!user) {
    return (
      <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
        <Typography variant="body1">
          Faça login para avaliar este jogo e escrever resenhas
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialRating ? 'Editar sua resenha' : 'Escrever resenha'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Sua avaliação:
        </Typography>
        <RatingStars rating={rating} onRatingChange={setRating} />
      </Box>

      <TextField
        label="Sua resenha"
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        {initialRating ? 'Atualizar Resenha' : 'Enviar Resenha'}
      </Button>
    </Box>
  );
};