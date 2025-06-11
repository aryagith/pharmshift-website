import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

// --- Simple in-memory rate limiter ---
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes

function isRateLimited(ip: string) {
  const now = Date.now();
  const last = rateLimitMap.get(ip) || 0;
  if (now - last < RATE_LIMIT_WINDOW) {
    return true;
  }
  rateLimitMap.set(ip, now);
  return false;
}

export async function POST(req: NextRequest) {
  // Get IP address
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
  }

  try {
    const { email, message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: email || 'no-reply@pharmshift.com',
      to: 'info@pharmshift.com',
      subject: 'PharmShift Feedback',
      text: `From: ${email || 'Anonymous'}\n\n${message}`,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Feedback email error:', e);
    return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 });
  }
}