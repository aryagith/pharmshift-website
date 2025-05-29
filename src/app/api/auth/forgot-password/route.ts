import { prisma } from '../../../../lib/db';
import { addMinutes } from 'date-fns';
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
    from: 'PharmShift <no-reply@pharmshift.com>',
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

  // Check if user exists and is a credentials (email/password) user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.hashedPassword) {
    // Always return success for privacy
    return NextResponse.json({ success: true });
  }

  // Generate a secure token and store it in VerificationToken
  const token = Math.random().toString(36).slice(2) + Date.now();
  const expires = addMinutes(new Date(), 60); // 1 hour expiry
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  // Send email with reset link
  await sendResetEmail(email, token);

  // Always return success for privacy
  return NextResponse.json({ success: true });
}
