// lib/theme.ts
import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1B4CD7',
    },
    background: {
      default: '#000000', // Page background is black
      paper: '#121212',    // Default for Paper, but we override MuiMenu
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiButton: {
      // ... your button styles ...
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
        paper: ({ theme }) => ({
          backgroundColor: 'rgb(0, 0, 0)', // Solid, pure jet black
          
          // No backdrop-filter needed if background is also black & menu is solid black

          color: theme.palette.text.primary, // White text for items
          borderRadius: 12,                  // Your existing border radius

          // --- Thin Grey Outline ---
          // You can adjust the color and opacity (alpha) of the border
          // theme.palette.grey[700] is a mid-dark gray.
          // alpha(theme.palette.grey[700], 0.7) makes it slightly transparent.
          // For a more solid but still subtle gray, you could use:
          // border: `1px solid ${theme.palette.grey[800]}`, 
          // Or a specific hex value with slight transparency:
          border: `1px solid rgba(100, 100, 100, 0.6)`, // Example: A subtle, slightly transparent gray

          // Optional: A very subtle shadow can complement the border
          // If the border is the main separator, the shadow might be less critical
          // or could be a very tight, dark shadow if used.
          // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          boxShadow: 'none', // Or remove shadow if border is enough
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
          // Hover for solid black background
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.06), // Very subtle light hover
          },
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.25),
            },
          },
          '&.Mui-focusVisible': {
             backgroundColor: alpha(theme.palette.common.white, 0.08),
          }
        }),
      },
    },
  },
  typography: {
    // ... your typography styles ...
    fontFamily: '"Roboto Flex", sans-serif',
    h2: {
      fontSize: '4rem', // 64px
      fontWeight: 800,
      lineHeight: 1.1,
    },
    h6: {
      fontSize: '1.375rem', // 22px
      fontWeight: 300,
      lineHeight: 1.6,
    },
  },
});

export default theme;