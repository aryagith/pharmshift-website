// lib/theme.ts
import { createTheme, alpha } from '@mui/material/styles';

// Import Poppins weights
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';

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
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          textTransform: 'none',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundColor: alpha('#ffffff', 0.05),
          },
          '&:active': {
            backgroundColor: alpha('#ffffff', 0.08),
          },
          '&:focus-visible': {
            outline: `2px solid ${alpha('#ffffff', 0.2)}`,
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          backgroundColor: '#1B4CD7',
          '&:hover': {
            backgroundColor: '#163db0',
          },
          '&:active': {
            backgroundColor: '#122f8b',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: 'rgb(0, 0, 0)',
          color: theme.palette.text.primary,
          borderRadius: 12,
          border: '',
          boxShadow: 'none',
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontSize: '1rem',
          fontWeight: 400,
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.06),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.25),
            },
          },
          '&.Mui-focusVisible': {
            backgroundColor: alpha(theme.palette.common.white, 0.08),
          },
        }),
      },
    },
  },

  // ✅ Typography using Poppins
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h2: {
      fontSize: '4rem',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h6: {
      fontSize: '1.375rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
    },
  },
});

export default theme;
