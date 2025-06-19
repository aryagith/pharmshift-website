'use client';
import { Box, Typography, Grid, Container } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';

const features = [
  { label: 'Quiz', icon: <QuizIcon sx={{ fontSize: 48 }} /> },
  { label: 'AI Chatbot', icon: <SmartToyIcon sx={{ fontSize: 48 }} /> },
  { label: 'Study Guide', icon: <MenuBookIcon sx={{ fontSize: 48 }} /> },
  { label: 'Progress Tracker', icon: <AssessmentIcon sx={{ fontSize: 48 }} /> },
];

export default function Features() {
  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: 'center', color: 'white' }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        What is PharmShift?
      </Typography>
      <Typography variant="body1" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
        PharmShift is your all-in-one study assistant for OSCE exams,
        combining AI-driven quizzes, interactive study tools, and personalized feedback
      </Typography>

      {/* Evenly spaced icons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          gap: 4,
        }}
      >
        {features.map(({ label, icon }) => (
          <Box
            key={label}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 100,
              flex: '1 1 120px', // flex-grow, shrink, basis
            }}
          >
            {icon}
            <Typography sx={{ mt: 1 }}>{label}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
