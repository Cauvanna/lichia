import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/lichia.png';

export const Header = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src={logo}
              alt="Lichia Logo"
              style={{
                height: '40px',
                marginRight: '16px',
                //filter: 'brightness(0) invert(1)' // Opcional: se a logo for escura
              }}
            />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem'
                }}
              >
                LICHIA
              </Typography>
        </Box>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
        <Button color="inherit" component={Link} to="/register">Registrar</Button>
      </Toolbar>
    </AppBar>
  );
};