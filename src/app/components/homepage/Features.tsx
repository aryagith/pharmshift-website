'use client';
import { Grid, Box, Typography, Container } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';

const features = [
  { label: 'Quizzes', icon: <QuizIcon fontSize="large" /> },
  { label: 'AI Chatbot', icon: <SmartToyIcon fontSize="large" /> },
  { label: 'Study Guides', icon: <BookIcon fontSize="large" /> },
  { label: 'Progress Tracker', icon: <AssessmentIcon fontSize="large" /> },
];

export default function Features() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        What is PharmShift?
      </Typography>
      <Grid container marginTop={10} spacing={4} columns={{ xs: 12, sm: 12, md: 12 }}>
        {features.map(({ label, icon }) => (
          <Grid key={label} item xs={6} sm={3}>
            <Box textAlign="center">
              {icon}
              <Typography sx={{ mt: 1 }}>{label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
