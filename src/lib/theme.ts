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
      paper: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    // MuiBackdrop: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: 'rgba(0, 0, 0, 0.25)', // dark overlay
    //       backdropFilter: 'blur(24px) saturate(180%)',
    //       WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    //     },
    //   },
    // },
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
            backgroundColor: alpha('#ffffff', 0.08),
          },
          '&:active': {
            backgroundColor: alpha('#ffffff', 0.06),
          },
          '&:focus-visible': {
            outline: `2px solid ${alpha('#ffffff', 0.18)}`,
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
        paper: {
          background: 'rgba(10, 10, 10, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)', //Add to menu locally for glassy effect
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.85)',
          color: '#fff',
          overflow: 'hidden',
          transition: 'background 0.3s',
          width: 'fit-content',
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 400,
          borderRadius: 8,
          margin: '2px 6px',
          padding: '8px 18px',
          transition: 'background 0.15s',
          background: 'transparent',
          minHeight: 36,
          '&:hover': {
            backgroundColor: 'rgba(27,76,215,0.10)',
            backdropFilter: 'blur(8px) saturate(180%)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(27,76,215,0.18)',
            '&:hover': {
              backgroundColor: 'rgba(27,76,215,0.28)',
            },
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'rgba(27,76,215,0.15)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(10, 10, 10, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.85)',
          color: '#fff',
          overflow: 'hidden',
          transition: 'background 0.3s',
          width: 'fit-content',
          padding: 0,
        },
      },
    },
  },


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
