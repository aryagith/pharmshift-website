// PharmShift Reviews Page - Dark Mode, App Style
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  Paper,
  Grid,
} from '@mui/material';

// Dummy data for submitted ratings
const ratings = [
  { pills: 5, date: '3/4/2025, 2:09:10 AM', comment: 'woah the website looks so good whoever coded it is a genius' },
  { pills: 3, date: '3/4/2025, 7:15:33 PM', comment: 'insanely helpful!' },
  { pills: 5, date: '3/3/2025, 7:26:18 PM', comment: 'best app ever!!' },
];

export default function ReviewsPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });

  // Handle rating submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  // Handle feedback form
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #10131a 100%)', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        {/* Leave a Rating */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, mb: 6, borderRadius: 4, background: 'rgba(10,18,38,0.85)', boxShadow: '0 8px 32px 0 rgba(28,78,216,0.10)', border: '1.5px solid rgba(44,48,54,0.26)' }}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
            Leave a Rating
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography fontWeight={500} mb={1}>
              Rating (1–5 pills):
            </Typography>
            <Stack direction="row" spacing={2} mb={2}>
              {[1, 2, 3, 4, 5].map((val) => (
                <Box
                  key={val}
                  onClick={() => setRating(val)}
                  onMouseEnter={() => setHover(val)}
                  onMouseLeave={() => setHover(0)}
                  sx={{
                    width: 44,
                    height: 22,
                    borderRadius: 999,
                    border: '2px solid',
                    borderColor: (hover || rating) >= val ? '#1B4CD7' : '#3a3a3a',
                    background: (hover || rating) >= val ? 'linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                    display: 'inline-block',
                  }}
                />
              ))}
            </Stack>
            <Typography fontWeight={500} mb={1}>
              Comment (optional):
            </Typography>
            <TextField
              multiline
              minRows={3}
              fullWidth
              variant="filled"
              value={comment}
              onChange={e => setComment(e.target.value)}
              sx={{
                mb: 3,
                input: { color: '#fff' },
                textarea: { color: '#fff' },
                background: '#181c24',
                borderRadius: 2,
                label: { color: '#aaa' },
              }}
              placeholder="Share your thoughts..."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 3,
                py: 1.5,
                fontSize: 18,
                boxShadow: '0 2px 16px #1C4ED880',
                mt: 1,
              }}
              disabled={submitted || rating === 0}
            >
              {submitted ? 'Thank you!' : 'Submit Rating'}
            </Button>
          </form>
        </Paper>

        {/* Submitted Ratings */}
        <Box mb={8}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
            Submitted Ratings
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {ratings.map((entry, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ background: '#121212', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 3, height: 180 }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} mb={1.5}>
                      {Array.from({ length: entry.pills }).map((_, i) => (
                        <Box key={i} sx={{ width: 24, height: 10, borderRadius: 999, background: '#1B4CD7' }} />
                      ))}
                    </Stack>
                    {entry.comment && (
                      <Typography variant="body2" color="#b0b0b0" mb={1}>
                        <strong>Comment:</strong> {entry.comment}
                      </Typography>
                    )}
                    <Typography variant="body2" color="#b0b0b0">
                      <strong>Date:</strong> {entry.date}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Feedback Form */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, background: 'rgba(10,18,38,0.85)', boxShadow: '0 8px 32px 0 rgba(28,78,216,0.10)', border: '1.5px solid rgba(44,48,54,0.26)' }}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
            Help Us Do Better
          </Typography>
          <Typography textAlign="center" mb={3} color="#b0b0b0">
            We value your feedback! If you&apos;d like us to reach out to you, please leave your contact information below.
          </Typography>
          <form>
            <Stack spacing={2} mb={2}>
              <TextField
                name="name"
                label="Name"
                variant="filled"
                fullWidth
                value={feedback.name}
                onChange={handleFeedbackChange}
                sx={{ input: { color: '#fff' }, background: '#181c24', borderRadius: 2, label: { color: '#aaa' } }}
                placeholder="Your name"
              />
              <TextField
                name="email"
                label="Email"
                variant="filled"
                fullWidth
                value={feedback.email}
                onChange={handleFeedbackChange}
                sx={{ input: { color: '#fff' }, background: '#181c24', borderRadius: 2, label: { color: '#aaa' } }}
                placeholder="Your email"
              />
              <TextField
                name="message"
                label="Message"
                variant="filled"
                fullWidth
                multiline
                minRows={3}
                value={feedback.message}
                onChange={handleFeedbackChange}
                sx={{ input: { color: '#fff' }, textarea: { color: '#fff' }, background: '#181c24', borderRadius: 2, label: { color: '#aaa' } }}
                placeholder="Your message"
              />
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 3,
                py: 1.5,
                fontSize: 18,
                boxShadow: '0 2px 16px #1C4ED880',
                mt: 1,
              }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
