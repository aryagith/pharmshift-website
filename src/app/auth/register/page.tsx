'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;
    const name = form.get("name") as string;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Registration failed");
      return;
    }

    // ✅ Now sign in the user via NextAuth
    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginRes?.error) {
      setError("Registered but failed to log in.");
    } else {
      router.push("/");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#111',
          borderRadius: 3,
          padding: 4,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <Typography variant="h5" sx={{ color: '#fff', mb: 3, textAlign: 'center' }}>
          Register
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            name="name"
            placeholder="Name"
            variant="filled"
            fullWidth
            required
            sx={{ mb: 2, input: { color: '#fff' }, backgroundColor: '#222', borderRadius: 1 }}
          />
          <TextField
            name="email"
            placeholder="Email"
            type="email"
            variant="filled"
            fullWidth
            required
            sx={{ mb: 2, input: { color: '#fff' }, backgroundColor: '#222', borderRadius: 1 }}
          />
          <TextField
            name="password"
            placeholder="Password"
            type="password"
            variant="filled"
            fullWidth
            required
            sx={{ mb: 2, input: { color: '#fff' }, backgroundColor: '#222', borderRadius: 1 }}
          />
          <TextField
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            variant="filled"
            fullWidth
            required
            sx={{ mb: 3, input: { color: '#fff' }, backgroundColor: '#222', borderRadius: 1 }}
          />

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#1B4CD7',
              color: '#fff',
              fontWeight: 500,
              borderRadius: 2,
              py: 1.25,
              mb: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#163db0',
              },
            }}
          >
            Register
          </Button>
        </form>

        <Divider sx={{ my: 2, borderColor: '#333' }} />
        <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center' }}>
          Already have an account?{' '}
          <span
            onClick={() => router.push('/auth/signin')}
            style={{ color: '#1B4CD7', cursor: 'pointer' }}
          >
            Sign in
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
