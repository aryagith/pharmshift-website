// PharmShift Reviews Page - Dark Mode, App Style
'use client';

import { useEffect, useState } from 'react';
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
import SubmittedRatings from '../components/HomePage/SubmittedRatings';
import ProtectedByLogin from '../components/ProtectedByLogin';
import { useSession } from 'next-auth/react';

export default function ReviewsPage() {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showName, setShowName] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [feedback, setFeedback] = useState({ email: '', message: '' });
  const [loading, setLoading] = useState(true);
  // Use a type for dbRatings to avoid TS errors
  type Review = { userId?: string } & Record<string, any>;
  const [dbRatings, setDbRatings] = useState<Review[]>([]);
  const userId = session?.user?.id;
  const alreadyReviewed = userId && dbRatings.some(r => r.userId === userId);
  // Track if we're editing an existing review
  const [editingReview, setEditingReview] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const db = await res.json();
          setDbRatings(db);
        }
      } catch { }
      setLoading(false);
    })();
  }, [session, submitted]);

  // Find the user's previous review for editing
  const userReview = userId ? dbRatings.find(r => r.userId === userId) : undefined;

  // Handle rating submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isLoggedIn = !!session;
    if (!isLoggedIn) {
      setShowLogin(true);
      setTimeout(() => setShowLogin(false), 3000);
      setSubmitted(false);
      return;
    }
    if (alreadyReviewed && !editingReview) {
      alert('You have already submitted a review.');
      return;
    }
    setSubmitted(true);
    try {
      if (editingReview && userReview) {
        // Update review
        await fetch('/api/reviews', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            rating,
            comment,
            name: showName ? (session?.user?.name || 'Anonymous') : 'Anonymous',
          }),
        });
        setEditingReview(false);
      } else {
        // Create new review
        await fetch('/api/reviews/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating,
            comment,
            anonymous: !showName
          }),
        });
      }
      setComment('');
      setRating(0);
      // Refetch reviews and force UI update
      const reviewsRes = await fetch('/api/reviews');
      if (reviewsRes.ok) {
        const db = await reviewsRes.json();
        setDbRatings(db);
      }
    } catch { }
    setTimeout(() => setSubmitted(false), 2000);
  };

  // Handle feedback form
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      if (res.ok) {
        setFeedbackSent(true);
      } else {
        const data = await res.json();
        setFeedbackError(data.error || 'Failed to send feedback');
      }
    } catch {
      setFeedbackError('Failed to send feedback');
    }
  };

  const handleChangeReview = async () => {
    if (!userReview) return;
    // Pre-fill form with old values
    setRating(userReview.pills || 0);
    setComment(userReview.comment || '');
    setShowName(userReview.name !== 'Anonymous');
    setEditingReview(true);
    setSubmitted(false);
  };

  return (
    <ProtectedByLogin>
    <Box sx={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #10131a 100%)', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        {/* Leave a Rating */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, mb: 6, borderRadius: 4, background: 'rgba(10,18,38,0.85)', boxShadow: '0 8px 32px 0 rgba(28,78,216,0.10)', border: '1.5px solid rgba(44,48,54,0.26)' }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="#b0b0b0">Loading...</Typography>
            </Box>
          ) : (alreadyReviewed && !editingReview) ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="h5" color="#1C4ED8" fontWeight={700} mb={2}>
                Thanks for leaving a review!
              </Typography>
              <Typography color="#b0b0b0">
                We appreciate your feedback and support.
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 3, borderColor: '#1C4ED8', color: '#1C4ED8', fontWeight: 600 }}
                onClick={handleChangeReview}
              >
                Change Your Review
              </Button>
            </Box>
          ) : (
            <>
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
                  onChange={e => {
                    if (e.target.value.length <= 300) setComment(e.target.value);
                  }}
                  sx={{
                    mb: 1,
                    input: { color: '#fff' },
                    textarea: { color: '#fff' },
                    background: '#181c24',
                    borderRadius: 2,
                    label: { color: '#aaa' },
                  }}
                  placeholder="Share your thoughts... (max 300 characters)"
                  helperText={`${comment.length}/300 characters`}
                  FormHelperTextProps={{ sx: { color: comment.length === 300 ? 'error.main' : '#aaa' } }}
                />
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      component="button"
                      type="button"
                      aria-pressed={!showName}
                      onClick={() => setShowName((v) => !v)}
                      sx={{
                        width: 48,
                        height: 28,
                        borderRadius: 16,
                        border: 0,
                        background: showName ? '#222' : '#1C4ED8',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        outline: 'none',
                        p: 0,
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          left: showName ? 2 : 24,
                          top: 3,
                          boxShadow: '0 1px 4px #1C4ED880',
                          transition: 'left 0.2s',
                        }}
                      />
                    </Box>
                    <span style={{ color: '#fff', fontSize: 16, userSelect: 'none' }}>
                      {showName ? (
                        <>
                          <span style={{ fontWeight: 600, color: '#1C4ED8' }}>Posting as: {session?.user?.name || 'Your Name'}</span>
                          <span style={{ marginLeft: 8, color: '#aaa' }}>(Toggle to post as Anonymous)</span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontWeight: 600, color: '#1C4ED8' }}>Posting as: Anonymous</span>
                          <span style={{ marginLeft: 8, color: '#aaa' }}>(Toggle to show your name)</span>
                        </>
                      )}
                    </span>
                  </Stack>
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
                    disabled={submitted || rating === 0 || comment.length > 300}
                  >
                    {submitted ? 'Thank you!' : 'Submit Rating'}
                  </Button>
                  {showLogin && <ProtectedByLogin />}
              </form>
            </>
          )}
        </Paper>

        {/* Submitted Ratings */}
        <SubmittedRatings />

        {/* Feedback Form */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, background: 'rgba(10,18,38,0.85)', boxShadow: '0 8px 32px 0 rgba(28,78,216,0.10)', border: '1.5px solid rgba(44,48,54,0.26)' }}>
          {feedbackSent ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="h5" color='#1C4ED8' fontWeight={700} mb={2}>
                Thanks for your feedback!
              </Typography>
              <Typography color="#b0b0b0">
                We appreciate your input and will review it soon.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
                Help Us Do Better
              </Typography>
              <Typography textAlign="center" mb={3} color="#b0b0b0">
                We value your feedback! If you&apos;d like us to reach out to you, please leave your contact information below.
              </Typography>
              <form onSubmit={handleFeedbackSubmit}>
                <Stack spacing={2} mb={2}>
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
                {feedbackError && (
                  <Typography color="error" mb={2}>{feedbackError}</Typography>
                )}
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
            </>
          )}
        </Paper>
      </Container>
    </Box>
    </ProtectedByLogin>
  );
}
