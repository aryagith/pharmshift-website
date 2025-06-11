'use client';

import { AccountCircle, Logout } from '@mui/icons-material';
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

  const handleClick = (item: string) => {
    if (item === 'Quizzes') {
      router.push('/quizselection');
    }
    if (item === "Home") {
      router.push('/');
    }
  };


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
          <Button
            disableRipple
            onClick={() => router.push('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              color: 'white',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 450 }} >
              PharmShift
            </Typography>
          </Button>

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
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300, borderRadius: 2 }} onClick={(e) => { router.push('/') }}>
              Home
            </Button>
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300, borderRadius: 2 }} onClick={() => router.push('/reviews')}>
              Reviews
            </Button>

            {/* Resources Dropdown*/}
            <Box>
              <Button
                color="inherit"
                sx={{ fontSize: '1.125rem', fontWeight: 300, borderRadius: 2 }}
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
                
              //   paper: {
              //     sx: (theme) => ({
              //       background: 'rgba(10, 10, 10, 0.55)',
              //       backdropFilter: 'blur(24px) saturate(180%)',
              //       WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              //       border: '1px solid rgba(255,255,255,0.10)',
              //       borderRadius: '14px',
              //       boxShadow: '0 8px 32px rgba(0,0,0,0.85)',
              //       color: '#fff',
              //       overflow: 'hidden',
              //       transition: 'background 0.3s',
              //     }),
              // },
              // }
              // }
              >
                {['Quizzes', 'Chatbot', 'OSCE Studybot Review'].map((item) => (
                  <MenuItem key={item} onClick={() => { handleClick(item) }}>
                    <Box>
                      <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 400 }}>{item}</Typography>
                      {(item === 'Chatbot' || item === 'OSCE Studybot Review') && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            letterSpacing: 0.5,
                            background: 'linear-gradient(90deg, #6a5af9, #00c6fb, #6a5af9)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            animation: 'gradient-move 3s ease-in-out infinite',
                            '@keyframes gradient-move': {
                              '0%': { backgroundPosition: '0% 50%' },
                              '50%': { backgroundPosition: '100% 50%' },
                              '100%': { backgroundPosition: '0% 50%' },
                            },
                            backgroundSize: '200% 200%',
                            opacity: 1, // Ensure full visibility
                            textShadow: '0 1px 8px rgba(106,90,249,0.25), 0 1px 8px rgba(0,198,251,0.15)',
                          }}
                        >
                          Coming soon!
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
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
                  borderRadius: 2,
                  fontSize: '1.125rem',
                  fontWeight: 300,
                }}
              >
                Login/Sign-Up
              </Button>
            ) : (
              <>
                <IconButton onClick={(e) => setAccountAnchor(e.currentTarget)} sx={{ p: 0 }}>
                  <Avatar
                    src={session.user?.image || undefined}
                    sx={{ bgcolor: session.user?.image ? undefined : '#1B4CD7', color: '#fff' }}
                  >
                    {!session.user?.image && (session.user?.name ? session.user.name.charAt(0).toUpperCase() : (session.user?.email ? session.user.email.charAt(0).toUpperCase() : '?'))}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={accountAnchor}
                  open={openAccount}
                  onClose={() => setAccountAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1.25,
                        minWidth: 260,
                        borderRadius: 3,
                        p: 1.5,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                      },
                    },
                  }}
                >
                  {/* User Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, px: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
                        {session.user?.name || 'User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                        {session.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ my: 1, borderBottom: '1px solid #eee' }} />
                  {/* Profile Option */}
                  <MenuItem onClick={() => { setAccountAnchor(null); router.push('/profile'); }}>
                    <AccountCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                    <Box>
                      <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 400 }}>Profile</Typography>
                      {
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            letterSpacing: 0.5,
                            background: 'linear-gradient(90deg, #6a5af9, #00c6fb, #6a5af9)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            animation: 'gradient-move 3s ease-in-out infinite',
                            '@keyframes gradient-move': {
                              '0%': { backgroundPosition: '0% 50%' },
                              '50%': { backgroundPosition: '100% 50%' },
                              '100%': { backgroundPosition: '0% 50%' },
                            },
                            backgroundSize: '200% 200%',
                            opacity: 1, // Ensure full visibility
                            textShadow: '0 1px 8px rgba(106,90,249,0.25), 0 1px 8px rgba(0,198,251,0.15)',
                          }}
                        >
                          Coming soon!
                        </Typography>
                      }
                    </Box>
                  </MenuItem>
                  {/* Sign Out Option */}
                  <MenuItem
                    onClick={event => {
                      event.preventDefault();
                      setAccountAnchor(null);
                      signOut().catch(console.error);
                    }}
                    sx={{ color: 'error.main', fontWeight: 500 }}
                  >
                    <Logout sx={{ mr: 1, verticalAlign: 'middle' }} />
                    <Typography sx={{fontSize: '1rem', fontWeight: 400 }}>Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

