import { NextResponse } from "next/server";

/**
 * Contact form handler. Validates input and dispatches an email via the
 * configured provider. If no provider is set (CONTACT_PROVIDER unset), it logs
 * the submission server-side and returns success — so the form works locally
 * out of the box and you can wire up a real provider later via env.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const provider = process.env.CONTACT_PROVIDER;

  try {
    if (provider === "resend" && process.env.RESEND_API_KEY) {
      await sendViaResend({ name, email, subject, message });
    } else {
      // No provider configured — log and succeed so the UX still works.
      console.info("[contact] New submission (no email provider configured):", {
        name,
        email,
        subject,
        message,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

/** Minimal Resend integration via fetch (no SDK dependency). */
async function sendViaResend(data: Required<Pick<ContactPayload, "name" | "email" | "message">> & { subject?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "portfolio@example.com",
      to: process.env.CONTACT_TO_EMAIL,
      reply_to: data.email,
      subject: data.subject || `New message from ${data.name}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}`);
  }
}
