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
  Avatar,
  IconButton,
} from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const [resourcesAnchor, setResourcesAnchor] = useState<null | HTMLElement>(null);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const openResources = Boolean(resourcesAnchor);
  const openAccount = Boolean(accountAnchor);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Toolbar disableGutters sx={{ minHeight: 80 }}>
          {/* Logo - LEFT */}
          <Typography variant="h4" sx={{ fontWeight: 450 }}>
            PharmShift
          </Typography>

          {/* Nav Links - CENTERED */}
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

            {/* Resources Dropdown (Click-based) */}
            <Box>
              <Button
                color="inherit"
                sx={{ fontSize: '1.125rem', fontWeight: 300 }}
                onClick={(e) =>
                  setResourcesAnchor(resourcesAnchor ? null : e.currentTarget)
                }
              >
                Resources
              </Button>

              <Menu
                anchorEl={resourcesAnchor}
                open={openResources}
                onClose={() => setResourcesAnchor(null)}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
                      color: '#fff',
                      overflow: 'hidden',
                    },
                  },
                }}
              >
                {['Quizzes', 'Chatbot', 'OSCE Studybot Review'].map((item) => (
                  <MenuItem key={item}>{item}</MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

          {/* Right Side - Login or Avatar */}
          <Box sx={{ position: 'absolute', right: 0 }}>
            {!session ? (
              <Button
                variant="outlined"
                onClick={() => router.push('/auth/signin')}
                sx={{
                  borderRadius: '999px',
                  fontSize: '1.125rem',
                  fontWeight: 300,
                }}
              >
                Login
              </Button>
            ) : (
              <>
                <IconButton onClick={(e) => setAccountAnchor(e.currentTarget)} sx={{ p: 0 }}>
                  <Avatar
                    src={session.user?.image || '/default-avatar.png'}
                    alt={session.user?.name || 'User'}
                  />
                </IconButton>

                <Menu
                  anchorEl={accountAnchor}
                  open={openAccount}
                  onClose={() => setAccountAnchor(null)}
                  slotProps={{
                    paper: {
                      sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        overflow: 'hidden',
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>Sign out</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
