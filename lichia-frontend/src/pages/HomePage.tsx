import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { GameCard } from '../components/Game/GameCard';
import { GameDialog } from '../components/Game/GameDialog';
import gamesData from '../assets/games.json';
import { useAuth } from '../contexts/AuthContext';
import { mockGameService } from '../services/mockGameService';

export const HomePage = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userReviews, setUserReviews] = useState<Record<number, any>>({});
  const { user } = useAuth();

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setGames(gamesData);
      setLoading(false);

      // Carregar avaliações do usuário
      if (user) {
        setUserReviews(mockGameService.getUserReviews(user.username));
      }
    }, 1000);
  }, [user]);

  const handleGameSelect = (gameId: number) => {
    setSelectedGame(gameId);
  };

  const handleCloseDialog = () => {
    setSelectedGame(null);
  };

  const handleSubmitReview = (review: { rating: number; comment: string }) => {
    if (!selectedGame || !user) return;

    // Salvar avaliação localmente
    mockGameService.saveReview({
      gameId: selectedGame,
      userId: 1, // ID do usuário mockado
      username: user.username,
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date().toISOString()
    });

    // Atualizar estado
    setUserReviews(prev => ({
      ...prev,
      [selectedGame]: {
        ...review,
        id: Date.now() // ID temporário
      }
    }));
  };

  const filteredGames = games.filter(game =>
    game.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedGameData = games.find(game => game.id === selectedGame) || null;
  const userReviewForSelected = selectedGame ? userReviews[selectedGame] : null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Descubra Jogos Incríveis
        </Typography>

        <TextField
          placeholder="Buscar jogos..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {filteredGames.map(game => (
              <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}>
                <GameCard
                  game={game}
                  onSelect={handleGameSelect}
                  userRating={userReviews[game.id]?.rating}
                />
              </Grid>
            ))}
          </Grid>

          {filteredGames.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" color="text.secondary">
                Nenhum jogo encontrado
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Tente alterar sua busca
              </Typography>
            </Box>
          )}
        </>
      )}

      {selectedGame && (
        <GameDialog
          open={!!selectedGame}
          game={selectedGameData}
          onClose={handleCloseDialog}
          onSubmitReview={handleSubmitReview}
          userReview={userReviewForSelected}
        />
      )}
    </Container>
  );
};