import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Simulação de chamada API com timeout
    setTimeout(() => {
      // Mock de resposta do backend
      if (formData.username === 'alice' && formData.senha === 'minhasenha') {
        const response = {
          autenticado: true,
          token: 'user-alice-logged'
        };

        console.log('Resposta do servidor (mock):', JSON.stringify(response));
        localStorage.setItem('authToken', response.token);
        setSuccess(true);

        // Redireciona após login bem-sucedido
        setTimeout(() => navigate('/'), 1500);
      } else {
        const response = {
          autenticado: false,
          mensagem: 'username ou senha inválidos'
        };

        console.log('Resposta do servidor (mock):', JSON.stringify(response));
        setError(response.mensagem);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Login realizado com sucesso!</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.senha}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};