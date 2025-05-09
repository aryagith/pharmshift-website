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
              alignItems: 'center',
            }}
          >
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300 }}>
              Home
            </Button>
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300 }}>
              About us
            </Button>

            {/* Resources with hoverable dropdown */}
            <Box
              onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
              onMouseLeave={() => setAnchorEl(null)}
            >
              <Button
                color="inherit"
                sx={{ fontSize: '1.125rem', fontWeight: 300 }}
              >
                Resources
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                  onMouseEnter: () => setAnchorEl(anchorEl),
                  onMouseLeave: () => setAnchorEl(null),
                  disablePadding: true,
                  sx: {
                    backgroundColor: '#000',
                  },
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: '#000', // Jet black
                    borderRadius: '12px',    // Fully rounded corners
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
                    mt: 1,
                    overflow: 'hidden',
                  },
                }}
              >
                {['Quizzes', 'Chatbot', 'OSCE Studybot', 'Review'].map((item) => (
                  <MenuItem
                    key={item}
                    sx={{
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 300,
                      px: 2.5,
                      py: 1.25,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Menu>


            </Box>
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
