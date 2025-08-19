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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AccountCircle, Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import MobileMenu from './MobileMenu'; // <-- Make sure the path is correct

export default function Navbar() {
  const [resourcesAnchor, setResourcesAnchor] = useState<null | HTMLElement>(null);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = (item: string) => {
    if (item === 'Quizzes') router.push('/quizselection');
    if (item === 'Home') router.push('/');
    //I have added this line
    if (item === 'Study-Partner') router.push('/study-partner');
  };

  return (
    <>
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
              <Typography variant="h4" sx={{ fontWeight: 450 }}>
                PharmShift
              </Typography>
            </Button>

            {isMobile ? (
              <Box sx={{ marginLeft: 'auto' }}>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => setMobileOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <>
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
                  <Button
                    color="inherit"
                    sx={{ fontSize: '1.125rem', fontWeight: 300, borderRadius: 2 }}
                    onClick={() => router.push('/')}
                  >
                    Home
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ fontSize: '1.125rem', fontWeight: 300, borderRadius: 2 }}
                    onClick={() => router.push('/reviews')}
                  >
                    Reviews
                  </Button>
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
                      open={Boolean(resourcesAnchor)}
                      onClose={() => setResourcesAnchor(null)}
                    >
                       {['Quizzes', 'Chatbot', 'OSCE Studybot Review', 'Study-Partner'].map((item) => (
                  <MenuItem key={item} onClick={() => { handleClick(item) }}>
                    <Box>
                      <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 400 }}>{item}</Typography>
                      {(item === 'Chatbot' || item === 'OSCE Studybot Review' || item === 'Study-Partner') && (
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
                            opacity: 1, 
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
                          {!session.user?.image &&
                            (session.user?.name
                              ? session.user.name.charAt(0).toUpperCase()
                              : session.user?.email?.charAt(0).toUpperCase())}
                        </Avatar>
                      </IconButton>
                      <Menu
                        anchorEl={accountAnchor}
                        open={Boolean(accountAnchor)}
                        onClose={() => setAccountAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                       
                        <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1C4ED8', fontSize: 16, lineHeight: 1.1, mb: 0 }}>
                            {session.user?.name || 'User'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#b0b8d1', fontSize: 14, lineHeight: 1.1, mb: 0 }}>
                            {session.user?.email}
                          </Typography>
                        </Box>
                        <Box sx={{ borderBottom: '1px solid #e0e0e0', mx: 1, mb: 0.5 }} />
                      
                        <MenuItem onClick={() => { setAccountAnchor(null); router.push('/profile'); }} sx={{ display: 'block', alignItems: 'flex-start' }}>
                          <Box display="flex" alignItems="center">
                            <AccountCircle sx={{ mr: 1 }} />
                            <Typography component="span">Profile</Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              fontWeight: 700,
                              fontSize: '0.85rem',
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
                              opacity: 1,
                              textShadow: '0 1px 8px rgba(106,90,249,0.25), 0 1px 8px rgba(0,198,251,0.15)',
                              ml: 4,
                              mt: 0.5,
                            }}
                          >
                            Coming soon!
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            setAccountAnchor(null);
                            signOut().catch(console.error);
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Logout sx={{ mr: 1 }} />
                          Sign Out
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* MobileMenu Drawer */}
      {isMobile && (
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      )}
    </>
  );
}
