// lib/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1B4CD7',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#1B4CD7',
          '&:hover': {
            backgroundColor: '#163db0',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
          padding: '4px 0',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#fff',               // white text
          fontSize: '1rem',            // clean readable size
          fontWeight: 400,
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)', // soft hover
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto Flex", sans-serif',
    h2: {
      fontSize: '4rem',     // 64px
      fontWeight: 800,
      lineHeight: 1.1,
    },
    h6: {
      fontSize: '1.375rem', // 22px
      fontWeight: 300,
      lineHeight: 1.6,
    },
  }

});

export default theme;
