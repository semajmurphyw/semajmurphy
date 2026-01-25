import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// Route segment config - ensures this route is properly deployed on Vercel
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Simple in-memory rate limiting store
// Note: This works per serverless function instance. For production at scale, consider using Vercel KV or Upstash Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute per IP

function getClientIP(request: NextRequest): string {
  // Try various headers that Vercel/proxies set
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up old entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    // New or expired record
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { 
      allowed: false, 
      resetIn: Math.ceil((record.resetTime - now) / 1000) 
    };
  }

  record.count++;
  return { allowed: true };
}

function validateSpamContent(text: string): boolean {
  // Check for common spam patterns
  const spamPatterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:bit\.ly|tinyurl|t\.co|goo\.gl|short\.link)/i, // URL shorteners
    /(?:buy|sell|cheap|discount|click here|act now|limited time)/i, // Common spam phrases
    /(?:casino|poker|viagra|cialis|pharmacy)/i, // Common spam topics
  ];

  return spamPatterns.some(pattern => pattern.test(text));
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many requests. Please try again in ${rateLimit.resetIn} seconds.` 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
          }
        }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, honeypot } = body;

    // Honeypot check - if this field is filled, it's a bot
    if (honeypot) {
      // Silently reject - don't let bots know they were caught
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic length validation to prevent abuse
    if (name.length > 200 || email.length > 200 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: 'One or more fields exceed maximum length' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Spam content detection
    const combinedText = `${name} ${subject} ${message}`.toLowerCase();
    if (validateSpamContent(combinedText)) {
      // Silently reject spam
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }

    // Check for API key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Initialize Resend client (lazy initialization to avoid build-time errors)
    const resend = new Resend(apiKey);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // You'll need to verify a domain with Resend to use a custom from address
      to: ['semajmurphyw@gmail.com'],
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
