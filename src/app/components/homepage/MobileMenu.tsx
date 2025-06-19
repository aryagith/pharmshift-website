'use client';

import React from 'react';
import {
    SwipeableDrawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    IconButton,
    Avatar,
    Box,
    Typography,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    onOpen?: () => void;
}

export default function MobileMenu({ open, onClose, onOpen }: MobileMenuProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const handleNav = (path: string) => {
        router.push(path);
        onClose();
    };

    return (
        <SwipeableDrawer
            anchor="top"
            open={open}
            onClose={onClose}
            onOpen={onOpen || (() => { })}
            disableDiscovery={false}
            PaperProps={{
                sx: {
                    background: 'rgba(10,10,10,0.95)',
                    backdropFilter: 'blur(12px)',
                    color: '#fff',
                    height: '100vh',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 2 }}>
                <Button
                    disableRipple
                    onClick={() => {
                        router.push('/') 
                        onClose();}
                    }
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
                <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

            <List>
                {[
                    { label: 'Home', path: '/' },
                    { label: 'Reviews', path: '/reviews' },
                    { label: 'Quizzes', path: '/quizselection' },
                ].map((item) => (
                    <ListItem disablePadding key={item.label}>
                        <ListItemButton onClick={() => handleNav(item.path)}>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 300 }}>{item.label}</Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                {/* Chatbot (Coming Soon) */}
                {['Chatbot', 'OSCE Studybot Review'].map((label) => (
                    <ListItem disablePadding key={label}>
                        <ListItemButton>
                            <ListItemText
                                primary={
                                    <Box>
                                        <Typography sx={{ fontSize: '1.125rem', fontWeight: 300 }}>{label}</Typography>
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
                                                textShadow: '0 1px 8px rgba(106,90,249,0.25), 0 1px 8px rgba(0,198,251,0.15)',
                                            }}
                                        >
                                            Coming soon!
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1 }} />

            {!session ? (
                <Box sx={{ px: 2, py: 1 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleNav('/auth/signin')}
                        sx={{
                            borderRadius: 2,
                            fontSize: '1.125rem',
                            fontWeight: 300,
                        }}
                    >
                        Login/Sign-Up
                    </Button>
                </Box>
            ) : (
                <Box sx={{ px: 2, py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                            src={session.user?.image || undefined}
                            sx={{
                                mr: 1,
                                bgcolor: session.user?.image ? undefined : '#1B4CD7',
                                color: '#fff',
                            }}
                        >
                            {!session.user?.image &&
                                (session.user?.name
                                    ? session.user.name.charAt(0).toUpperCase()
                                    : session.user?.email?.charAt(0).toUpperCase())}
                        </Avatar>
                        <Box>
                            <Typography fontWeight={600}>{session.user?.name || 'User'}</Typography>
                            <Typography fontSize={13} color="#b0b0b0">
                                {session.user?.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 1, fontSize: '1.125rem', fontWeight: 300 }}
                        onClick={() => handleNav('/profile')}
                    >
                        Profile
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={{ fontSize: '1.125rem', fontWeight: 300 }}
                        onClick={() => {
                            signOut();
                            onClose();
                        }}
                    >
                        Sign Out
                    </Button>
                </Box>
            )}
        </SwipeableDrawer>
    );
}
