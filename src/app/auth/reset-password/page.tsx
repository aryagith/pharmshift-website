'use client';

import { useState, Suspense, useEffect } from 'react'; // Added Suspense and useEffect
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'; // Added CircularProgress

// This component will contain the original logic of your page
function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // To control form visibility after token check

  useEffect(() => {
    if (token) {
      setShowForm(true); // Token exists, allow form to render
    } else {
      setError('Invalid or missing token.'); // Set error if token is missing
      setShowForm(false); // Do not show form if token is missing
    }
  }, [token]); // Rerun effect if token changes (e.g., on client-side navigation)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', { // This calls your API route from the other file
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/auth/signin'), 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch {
      setError('Failed to reset password');
    }
    setLoading(false);
  };

  // If token is explicitly missing after check, show error (don't wait for form to try rendering)
  if (!showForm && error) { // Check error specifically for the token missing case
    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, background: '#111', borderRadius: 2, textAlign: 'center' }}>
            <Alert severity="error">{error}</Alert>
        </Box>
    );
  }

  // Only render the form if the token check has passed (showForm is true)
  // This also implicitly handles the case where token might be null initially during SSR/SSG
  // before useSearchParams runs, by not rendering the form yet.
  if (!showForm) {
    // This case should ideally not be hit if Suspense fallback is active,
    // but as a safeguard or if token is truly invalid from the start.
    // The Suspense fallback will handle the "loading" state for useSearchParams.
    return null; // Or a more specific "Invalid link" message if token was checked and found null/empty
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, background: '#111', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: '#fff', mb: 2, textAlign: 'center' }}>Reset Password</Typography>
      <form onSubmit={handleReset}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          variant="filled"
          sx={{ mb: 2, input: { color: '#fff' }, '.MuiFilledInput-root': { background: '#222', borderRadius: 1 }, label: { color: '#aaa' } }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          variant="filled"
          sx={{ mb: 2, input: { color: '#fff' }, '.MuiFilledInput-root': { background: '#222', borderRadius: 1 }, label: { color: '#aaa' } }}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Password reset! Redirecting...</Alert>}
        <Button type="submit" variant="contained" fullWidth disabled={loading || success} sx={{ background: '#1C4CD8', color: '#fff', '&:hover': { background: '#173BAF' } }}>
          {loading ? <CircularProgress size={24} sx={{color: 'white'}} /> : 'Reset Password'}
        </Button>
      </form>
    </Box>
  );
}

// This is the actual default export for the page route
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      // Basic fallback UI, can be customized
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#111' /* Match your page background */ 
      }}>
        <CircularProgress sx={{color: '#fff'}} /> 
      </Box>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
}