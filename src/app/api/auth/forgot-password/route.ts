import { prisma } from '../../../../lib/db';
import { addMinutes } from 'date-fns';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const MAX_ATTEMPTS = 3;
const BASE_TIMEOUT = 60 * 60 * 1000; // 1 hour in ms
const MAX_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

function getTimeoutDuration(attempts: number) {
  return Math.min(BASE_TIMEOUT * Math.pow(2, attempts - MAX_ATTEMPTS), MAX_TIMEOUT);
}

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

  // Rate limiting logic
  const now = new Date();
  let attempt = await prisma.passwordResetAttempt.findUnique({ where: { email } });
  if (attempt && attempt.timeoutUntil && attempt.timeoutUntil > now) {
    const waitMinutes = Math.ceil((attempt.timeoutUntil.getTime() - now.getTime()) / 60000);
    return NextResponse.json({ error: `Too many reset requests. Try again in ${waitMinutes} minutes.` }, { status: 429 });
  }

  if (!attempt) {
    attempt = await prisma.passwordResetAttempt.create({
      data: { email, attempts: 1, lastTried: now, timeoutUntil: null },
    });
  } else {
    // If lastTried is more than 24h ago, reset attempts
    if (now.getTime() - attempt.lastTried.getTime() > 24 * 60 * 60 * 1000) {
      attempt = await prisma.passwordResetAttempt.update({
        where: { email },
        data: { attempts: 1, lastTried: now, timeoutUntil: null },
      });
    } else {
      let newAttempts = attempt.attempts + 1;
      let timeoutUntil = null;
      if (newAttempts > MAX_ATTEMPTS) {
        const duration = getTimeoutDuration(newAttempts);
        timeoutUntil = new Date(now.getTime() + duration);
      }
      attempt = await prisma.passwordResetAttempt.update({
        where: { email },
        data: { attempts: newAttempts, lastTried: now, timeoutUntil },
      });
      if (timeoutUntil) {
        const waitMinutes = Math.ceil((timeoutUntil.getTime() - now.getTime()) / 60000);
        return NextResponse.json({ error: `Too many reset requests. Try again in ${waitMinutes} minutes.` }, { status: 429 });
      }
    }
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
