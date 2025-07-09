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
        route: '/quizzes/cmb6w1ela0000d7yocnnjdhgs',
        icon: <PsychologyAltOutlinedIcon sx={{ fontSize: 70, mb: 2, color: 'primary.main' }} />,
    },
    {
        name: 'Quiz 2',
        route: '/quizzes/cmb6w1fi9002kd7yoo64hddxs',
        icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 70, mb: 2, color: 'primary.main' }} />,
    },
    {
        name: 'Quiz 3',
        route: '/quizzes/cmb6w1gkn0061d7yorzabgtj9',
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
                    <Grid key={quiz.name} >
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
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        {selectedQuizIndex !== null &&
                            React.cloneElement(quizzes[selectedQuizIndex].icon, {
                                sx: { fontSize: 70, color: '#1C3EB5' },
                            })}
                    </Box>
                    <DialogTitle
                        sx={{
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            width: '100%',
                            textAlign: 'center',
                            p: 0,
                            mb: 1.5,
                            color: 'white',
                        }}
                    >
                        Ready to start{' '}
                        <span style={{ color: '#1C3EB5', marginRight: 4 }}>
                            {selectedQuizIndex !== null ? quizzes[selectedQuizIndex].name : ''}
                        </span>
                        <span style={{ marginLeft: 1 }}>?</span>
                    </DialogTitle>
                    <DialogActions
                        sx={{
                            justifyContent: 'center',
                            width: '100%',
                            mt: 2,
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            sx={{
                                minWidth: 120,
                                borderColor: '#1C3EB5',
                                color: '#1C3EB5',
                                background: 'rgba(28,62,181,0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(28,62,181,0.18)',
                                    borderColor: '#1C3EB5',
                                    color: '#fff',
                                },
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 600,
                                fontSize: '1rem',
                                transition: 'all 0.18s',
                                boxShadow: 'none',
                                height: 48,
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStart}
                            variant="contained"
                            sx={{
                                minWidth: 120,
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 600,
                                fontSize: '1rem',
                                backgroundColor: '#1C3EB5',
                                color: '#fff',
                                boxShadow: 'none',
                                height: 48,
                                '&:hover': {
                                    backgroundColor: '#23336C',
                                    color: '#fff',
                                },
                            }}
                        >
                            Start
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <style jsx global>{`
                .MuiDialog-root .MuiBackdrop-root {
                    background: rgba(0, 0, 0, 0.25) !important;
                    backdrop-filter: blur(24px) saturate(180%) !important;
                    -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
                }
            `}</style>
        </Box>
    );
};

export default QuizSelectionPage;
