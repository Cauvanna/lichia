import { Container, Typography } from '@mui/material';

export const HomePage = () => {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Bem-vindo à Lichia!
      </Typography>
      <Typography variant="body1">
        Plataforma de reviews e recomendações de games
      </Typography>
    </Container>
  );
};