'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
} from '@mui/material';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import { useRouter } from 'next/navigation';
import React from 'react';

const quizzes = [
    {
        name: 'Quiz 1',
        route: '/quiz/1',
        icon: <PsychologyAltOutlinedIcon sx={{ fontSize: 70, mb: 2, color: 'primary.main' }} />,
    },
    {
        name: 'Quiz 2',
        route: '/quiz/2',
        icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 70, mb: 2, color: 'primary.main' }} />,
    },
    {
        name: 'Quiz 3',
        route: '/quiz/3',
        icon: <ScienceOutlinedIcon sx={{ fontSize: 70, mb: 2, color: 'primary.main' }} />,
    },
];

const QuizSelectionPage = () => {
    const [open, setOpen] = useState(false);
    const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
    const router = useRouter();

    const handleCardClick = (index: number) => {
        setSelectedQuizIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedQuizIndex(null);
    };

    const handleStart = () => {
        if (selectedQuizIndex !== null) {
            router.push(quizzes[selectedQuizIndex].route);
        }
        handleClose();
    };

    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" fontWeight={500} fontSize={'3.5rem'} gutterBottom>
                Choose a Quiz
            </Typography>

            <Grid container spacing={4} justifyContent="center" mt={4}>
                {quizzes.map((quiz, index) => (
                    <Grid item key={quiz.name}>
                        <Card
                            sx={{
                                width: 200,
                                height: 200,
                                background: 'rgba(18, 18, 18, 0.85)', // jet black glass
                                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
                                backdropFilter: 'blur(16px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                                borderRadius: 3,
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'white',
                                transition: 'transform 0.2s, background 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    background: 'rgba(30, 30, 30, 0.92)',
                                    boxShadow: '0 12px 40px 0 rgba(0,0,0,0.45)',
                                    transform: 'scale(1.04)',
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={() => handleCardClick(index)}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    px: 2,
                                    py: 2,
                                }}
                            >
                                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                                    {React.cloneElement(quiz.icon, {
                                        sx: { fontSize: 100, color: 'primary.main' },
                                    })}
                                </Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={425}
                                    fontSize="1.5rem"
                                    sx={{ pb: 0 }}
                                >
                                    {quiz.name}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            background: 'rgba(18, 18, 18, 0.95)',
                            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                            color: 'white',
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.08)',
                            p: 3,
                            textAlign: 'center',
                        },
                    },
                }}
            >
                <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    Are you sure you want to start the quiz?
                </DialogTitle>
                <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                            backgroundColor: '#1c1c1c',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#2a2a2a',
                            },
                            borderRadius: '999px',
                            px: 3,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleStart}
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '999px',
                            px: 3,
                        }}
                    >
                        Start
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default QuizSelectionPage;
