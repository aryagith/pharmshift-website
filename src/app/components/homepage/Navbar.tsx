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
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300, borderRadius: 2 }} onClick={(e) => {router.push('/')}}>
              Home
            </Button>
            <Button color="inherit" sx={{ fontSize: '1.125rem', fontWeight: 300, borderRadius: 2 }}>
              About us
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
                  // slotProps={{
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
                    <MenuItem key={item} onClick={() => {handleClick(item)}}>{item}</MenuItem>
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
                        mt: 1.25, // adjust this value to move the menu down (10px ≈ 1.25 theme spacing)
                      },
                    },
                  }}
                  // slotProps={{
                  //   paper: {
                  //     sx: {
                  //       backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  //       backdropFilter: 'blur(16px)',
                  //       WebkitBackdropFilter: 'blur(16px)',
                  //       border: '1px solid rgba(255, 255, 255, 0.15)',
                  //       borderRadius: '12px',
                  //       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
                  //       color: '#fff',
                  //       overflow: 'hidden',
                  //     },
                  //   },
                  // }}
                  
                >
                    <MenuItem onClick={() => router.push('/profile')}>
                    <AccountCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => {
                        event.preventDefault();
                        signOut().catch(console.error);
                      }}
                    >
                    <Logout sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Sign out
                    </MenuItem>
                  {/* <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <Logout sx={{alignItems }} />
                  Sign out
                  </MenuItem> */}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

