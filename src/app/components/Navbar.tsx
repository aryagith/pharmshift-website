'use client';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Container,
} from '@mui/material';
import { useState } from 'react';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Toolbar disableGutters sx={{ minHeight: 80 }}>
          {/* Logo - LEFT (unaltered) */}
          <Typography variant="h4" sx={{ fontWeight: 350 }}>
            PharmShift
          </Typography>

          {/* Nav Links - CENTERED ABSOLUTELY */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 3,
            }}
          >
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300 }}>
              Home
            </Button>
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300 }}>
              About us
            </Button>
            <Button
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ fontSize: '1.125rem', fontWeight: 300 }}
            >
              Resources
            </Button>
          </Box>

          {/* Login */}
          <Box sx={{ position: 'absolute', right: 0 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '999px',
                fontSize: '1.125rem',
                fontWeight: 300,
              }}
            >
              Login
            </Button>
          </Box>


        </Toolbar>
      </Container>
    </AppBar>
  );
}
