import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// TODO: Replace with your user DB and email logic
async function sendResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: 'PharmShift <no-reply@yourdomain.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. <a href="${resetUrl}">Click here to reset your password</a>.</p>`
  });
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // TODO: Check if user exists and is a credentials (email/password) user
  // Generate a secure token and store it (e.g., in DB with expiry)
  const token = Math.random().toString(36).slice(2) + Date.now();
  // TODO: Save token to DB with user and expiry

  // Send email with reset link
  await sendResetEmail(email, token); // Implement this

  // Always return success for privacy
  return NextResponse.json({ success: true });
}
