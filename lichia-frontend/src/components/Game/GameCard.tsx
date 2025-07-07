import { Card, CardMedia, CardContent, Typography, CardActions, Button, Chip, Box } from '@mui/material';
import { RatingStars } from '../UI/RatingStars';
import { useAuth } from '../../contexts/AuthContext';

interface Game {
  id: number;
  titulo: string;
  genero: string;
  anoLancamento: number;
  coverImage: string;
  duracaoMainStoryAverage: number;
}

interface GameCardProps {
  game: Game;
  onSelect: (gameId: number) => void;
  userRating?: number | null;
}

export const GameCard = ({ game, onSelect, userRating }: GameCardProps) => {
  const { user } = useAuth();

  return (
    <Card sx={{
      maxWidth: 300,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={game.coverImage || 'https://via.placeholder.com/300x200?text=Game+Cover'}
        alt={game.titulo}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ height: 64, overflow: 'hidden' }}>
          {game.titulo}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip label={game.anoLancamento} size="small" />
          <Chip label={game.genero.split(',')[0]} size="small" color="primary" />
        </Box>

        {user && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Sua avaliação:
            </Typography>
            <RatingStars rating={userRating} readOnly />
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onSelect(game.id)}
          fullWidth
        >
          Ver detalhes
        </Button>
      </CardActions>
    </Card>
  );
};