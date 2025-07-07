import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#FF5252', // Vermelho Lichia
    },
    secondary: {
      main: '#4CAF50', // Verde complementar
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});