import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import { RatingStars } from '../UI/RatingStars';
import { ReviewForm } from './ReviewForm';
import { useAuth } from '../../contexts/AuthContext';

interface Game {
  id: number;
  titulo: string;
  genero: string;
  anoLancamento: number;
  consoleLancamento: string;
  ehHandheld: boolean;
  maxJogadores: number;
  temOnline: boolean;
  publisher: string;
  temSequencia: boolean;
  precoUsual: number;
  duracaoMainStoryAverage: number;
  duracaoMainStoryExtras: number;
  duracaoCompletionistAverage: number;
  coverImage: string;
  descricao: string;
}

interface Review {
  id: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface GameDialogProps {
  open: boolean;
  game: Game | null;
  onClose: () => void;
  onSubmitReview: (review: { rating: number; comment: string }) => void;
  userReview?: Review | null;
}

export const GameDialog = ({
  open,
  game,
  onClose,
  onSubmitReview,
  userReview
}: GameDialogProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (game) {
      // Simular carregamento de reviews
      setTimeout(() => {
        setReviews([
          {
            id: 1,
            userId: 2,
            username: 'Gamer123',
            rating: 4.5,
            comment: 'Jogo incrível! Os gráficos são ótimos para a época e a jogabilidade é viciante.',
            createdAt: '2023-10-15'
          },
          {
            id: 2,
            userId: 3,
            username: 'ReviewMaster',
            rating: 3,
            comment: 'Bom jogo, mas poderia ter mais conteúdo. A história é um pouco curta.',
            createdAt: '2023-10-10'
          }
        ]);
      }, 500);
    }
  }, [game]);

  if (!game) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{game.titulo}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={game.coverImage || 'https://via.placeholder.com/400x600?text=Game+Cover'}
              alt={game.titulo}
              sx={{ width: '100%', borderRadius: 1 }}
            />

            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Informações</Typography>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2"><strong>Lançamento:</strong> {game.anoLancamento}</Typography>
                <Typography variant="body2"><strong>Console:</strong> {game.consoleLancamento}</Typography>
                <Typography variant="body2"><strong>Gênero:</strong> {game.genero}</Typography>
                <Typography variant="body2"><strong>Publisher:</strong> {game.publisher}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2"><strong>Tempo de jogo:</strong></Typography>
              <Typography variant="body2">História principal: {game.duracaoMainStoryAverage.toFixed(1)}h</Typography>
              <Typography variant="body2">História + extras: {game.duracaoMainStoryExtras.toFixed(1)}h</Typography>
              <Typography variant="body2">Complecionista: {game.duracaoCompletionistAverage.toFixed(1)}h</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              {game.descricao}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip label={`${game.maxJogadores} jogador${game.maxJogadores > 1 ? 'es' : ''}`} />
              <Chip
                label={game.temOnline ? 'Multiplayer online' : 'Singleplayer'}
                color={game.temOnline ? 'primary' : 'default'}
              />
              <Chip
                label={game.ehHandheld ? 'Portátil' : 'Console'}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Avaliações
            </Typography>

            {userReview ? (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle1">Sua avaliação</Typography>
                <RatingStars rating={userReview.rating} readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>{userReview.comment}</Typography>
              </Box>
            ) : null}

            <ReviewForm
              gameId={game.id}
              onSubmit={onSubmitReview}
              initialRating={userReview?.rating}
              initialComment={userReview?.comment || ''}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Resenhas da comunidade
            </Typography>

            {reviews.length === 0 ? (
              <Typography variant="body1">Nenhuma resenha ainda. Seja o primeiro a avaliar!</Typography>
            ) : (
              reviews.map(review => (
                <Box key={review.id} sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{review.username[0]}</Avatar>
                    <Typography variant="subtitle1">{review.username}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <RatingStars rating={review.rating} readOnly />
                  <Typography variant="body1" sx={{ mt: 1 }}>{review.comment}</Typography>
                </Box>
              ))
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};