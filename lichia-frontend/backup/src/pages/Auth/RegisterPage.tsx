import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    senha: '',
    dataNascimento: '',
    visibilidade: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Simulação de chamada API com timeout
    setTimeout(() => {
      // Mock de resposta do backend
      if (formData.username === 'caue') {
        const response = {
          registrado: false,
          mensagem: 'Usuario com mesmo nome ja registrado'
        };

        console.log('Resposta do servidor (mock):', JSON.stringify(response));
        setError(response.mensagem);
      } else {
        const response = {
          registrado: true,
          mensagem: 'Usuario registrado com sucesso!'
        };

        console.log('Resposta do servidor (mock):', JSON.stringify(response));
        setSuccess(true);

        // Redireciona após registro bem-sucedido
        setTimeout(() => navigate('/login'), 2000);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Registro realizado com sucesso!</Alert>}

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
            value={formData.senha}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="dataNascimento"
            label="Data de Nascimento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.dataNascimento}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="visibilidade"
                checked={formData.visibilidade}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Conta pública"
            sx={{ mt: 1 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrar'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};