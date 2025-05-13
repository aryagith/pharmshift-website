'use client';

import { Box, Typography, Button, Container, Grid } from '@mui/material';

export default function Hero() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        pt: { xs: 10, md: 0 },
      }}
    >
      <Container>
        <Grid container justifyContent="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid xs={12} sm={10} md={6}>
            <Box sx={{ maxWidth: 570 }}>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  fontWeight: 500,
                  // fontSize: { xs: '3rem', md: '4rem' }, // 48px to 64px
                  lineHeight: 1.1,
                }}
              >
                Master Your<br />
                OSCE Exams
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  // fontSize: { xs: '1.125rem', md: '1.25rem' }, // ~18-20px
                  fontWeight: 300,
                  lineHeight: 1.6,
                  mb: 5,
                }}
              >
                AI-powered quizzes, personalized study guides, and simulated practice sessions
                for pharmacy students
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: '999px',
                  fontWeight: 375,
                  fontSize: '1.5rem',
                  px: 5,
                  py: 1.75,
                }}
              >
                Start Quiz
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
