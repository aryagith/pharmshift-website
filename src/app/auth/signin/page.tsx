'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Button,
  Box,
  TextField,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (errorParam === 'Use Google login') {
      signIn('google', { callbackUrl: '/' });
    }
  }, [errorParam]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setFormError(false);

    if (!email || !password || !isValidEmail(email)) {
      setFormError(true);
      return;
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setAuthError(res.error);
    } else {
      router.push('/');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#111',
          borderRadius: 3,
          padding: 4,
          width: '100%',
          maxWidth: 400,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <Typography variant="h5" sx={{ color: '#fff', mb: 3, textAlign: 'center' }}>
          Login
        </Typography>

        {/* Google Sign In */}
        <Button
          variant="outlined"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          fullWidth
          sx={{
            mb: 2,
            color: '#1C4CD8',
            borderColor: '#1C4CD8',
            textTransform: 'none',
            fontWeight: 400,
            '&:hover': {
              backgroundColor: 'rgba(28,76,216,0.1)',
              borderColor: '#1C4CD8',
            },
          }}
          startIcon={
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
          }
        >
          Continue with Google
        </Button>

        <Divider sx={{ my: 2, borderColor: '#333' }}>or</Divider>

        <form onSubmit={handleLogin}>
          <TextField
            placeholder="Email"
            type="email"
            variant="filled"
            fullWidth
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            error={formError && (!email || !isValidEmail(email))}
            helperText={
              formError && !email
                ? 'Email is required'
                : formError && !isValidEmail(email)
                ? 'Enter a valid email'
                : ''
            }
            sx={{
              mb: 2,
              input: { color: '#fff' },
              backgroundColor: '#222',
              borderRadius: 1,
            }}
          />

          <TextField
            placeholder="Password"
            type="password"
            variant="filled"
            fullWidth
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            error={formError && !password}
            helperText={formError && !password ? 'Password is required' : ''}
            sx={{
              mb: 3,
              input: { color: '#fff' },
              backgroundColor: '#222',
              borderRadius: 1,
            }}
          />

          {authError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
              {authError}
            </Alert>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#1C4CD8',
              color: '#fff',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 2,
              py: 1.25,
              mb: 2,
              '&:hover': {
                backgroundColor: '#173cb0',
              },
            }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#aaa', mb: 1 }}>
          Forgot Password?
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#aaa' }}>
          Don’t have an account?{' '}
          <span
            style={{ color: '#3b82f6', cursor: 'pointer' }}
            onClick={() => router.push('/auth/register')}
          >
            Sign Up
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
