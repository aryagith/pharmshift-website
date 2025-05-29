"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch('/api/auth/reset-password', {
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

  if (!token) {
    return <Alert severity="error">Invalid or missing token.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, background: '#111', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>Reset Password</Typography>
      <form onSubmit={handleReset}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          variant="filled"
          sx={{ mb: 2, input: { color: '#fff' }, background: '#222', borderRadius: 1 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          variant="filled"
          sx={{ mb: 2, input: { color: '#fff' }, background: '#222', borderRadius: 1 }}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Password reset! Redirecting...</Alert>}
        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ background: '#1C4CD8', color: '#fff' }}>
          Reset Password
        </Button>
      </form>
    </Box>
  );
}
