'use client';

import {
    Box,
    Typography,
    Card,
    Button,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import React from 'react';

const jobs = [
    {
        role: 'Senior Pharmacy Platform Engineer',
        tag: 'Full-time',
        icon: <WorkOutlineIcon />,
        description:
            'Lead the development of our pharmacy data management platform, building scalable features that connect thousands of pharmacists with opportunities.',
    },
    {
        role: 'Healthcare Product Designer',
        tag: 'Full-time',
        icon: <WorkOutlineIcon />,
        description:
            'Design intuitive experiences for pharmacists and pharmacy managers, shaping the future of healthcare workforce solutions.',
    },
    {
        role: 'Pharmacy Success Manager',
        tag: 'Full-time',
        icon: <WorkOutlineIcon />,
        description:
            'Build relationships with pharmacy partners, ensuring they get maximum value from the PharmShift platform and pharmacy retention.',
    },
    {
        role: 'Data Analytics Engineer',
        tag: 'Full-time',
        icon: <WorkOutlineIcon />,
        description:
            'Transform healthcare workflows into actionable insights, building analytics infrastructure that powers smart matching algorithms.',
    },
];

export default function CareerPage() {
    return (
        <Box sx={{ textAlign: 'center', pt: 8, pb: 12 }}>
            <Typography
                variant="h4"
                fontWeight={600}
                fontSize={{ xs: '2.5rem', md: '3.5rem' }}
                gutterBottom
            >
                Career <span style={{ color: '#4F8AF1' }}>Opportunities</span>
            </Typography>

            <Typography
                variant="subtitle1"
                fontSize={'1.25rem'}
                sx={{
                    textAlign: 'center',
                    maxWidth: 700,
                    mx: 'auto',
                    mb: 6,
                    background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500,
                }}
            >
                Because innovation thrives when our team thrives together. To support our highly talented team, PharmShift promotes growth, development, and happiness across both work and personal life.
            </Typography>

            <Button
                variant="contained"
                endIcon={<ArrowForwardIosIcon />}
                sx={{
                    px: 4,
                    py: 1.3,
                    fontSize: '1rem',
                    borderRadius: 2,
                    fontWeight: 600,
                    background: '#1C3EB5',
                    '&:hover': { background: '#23336C' },
                }}
            >
                View Open Roles
            </Button>

            <Box mt={10} maxWidth={900} mx="auto">
                <Typography
                    variant="body2"
                    sx={{ color: '#bbb', mb: 1, textAlign: 'right' }}
                >
                    Number of Active Listings: {jobs.length}
                </Typography>

                {jobs.map((job) => (
                    <Card
                        key={job.role}
                        sx={{
                            mb: 4,
                            background: 'rgba(18,18,18,0.9)',
                            borderRadius: 3,
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'white',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            px: 3,
                            py: 3,
                            transition: '0.25s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                            '&:hover': {
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
                                transform: 'translateY(-4px)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            {React.cloneElement(job.icon, {
                                sx: { fontSize: 32, color: 'primary.main', mt: 0.5 },
                            })}

                            <Box>
                                <Typography fontWeight={600} fontSize="1.25rem">
                                    {job.role}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        bgcolor: '#1C3EB5',
                                        px: 1.4,
                                        py: 0.5,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                        display: 'inline-block',
                                        mt: 1,
                                    }}
                                >
                                    Full-time
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8, mt: 2, maxWidth: 550 }}
                                >
                                    {job.description}
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIosIcon />}
                            sx={{
                                borderColor: '#1C3EB5',
                                color: '#1C3EB5',
                                '&:hover': {
                                    bgcolor: 'rgba(28,62,181,0.12)',
                                    borderColor: '#1C3EB5',
                                    color: '#fff',
                                },
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                fontWeight: 600,
                            }}
                        >
                            View Job
                        </Button>
                    </Card>
                ))}
            </Box>

            <Box
                mt={10}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    textAlign: 'center',
                    maxWidth: 700,
                    mx: 'auto',
                    bgcolor: 'rgba(18,18,18,0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Don’t see the right position?
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.85 }} mb={2}>
                    We're always looking for talented individuals to join our team.
                </Typography>
                <Typography
                    sx={{
                        fontWeight: 500,
                        color: '#4F8AF1',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
                >
                    careers@pharmshift.com
                </Typography>
            </Box>
        </Box>
    );
}
