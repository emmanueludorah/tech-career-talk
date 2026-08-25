import "server-only";
import { Resend } from "resend";
import type { RegistrationInput } from "@/types/registration";

// This module only ever runs on the server. The `server-only` import above
// will throw a build-time error if anything tries to import it from a
// Client Component, so the API key can never leak into the browser bundle.

const resendApiKey = process.env.RESEND_API_KEY;
const organizerEmail = process.env.ORGANIZER_EMAIL;
const fromAddress = process.env.EMAIL_FROM || "Tech & Career Talk 0.1<onboarding@resend.dev>";

interface SendRegistrationEmailArgs {
  registration: RegistrationInput;
  registrationId: string;
  createdAt: Date;
  pdfBuffer: Buffer;
}

export async function sendRegistrationEmail({
  registration,
  registrationId,
  createdAt,
  pdfBuffer,
}: SendRegistrationEmailArgs) {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY environment variable is not configured.");
  }

  if (!organizerEmail) {
    throw new Error("ORGANIZER_EMAIL environment variable is not configured.");
  }

  const resend = new Resend(resendApiKey);

  const submittedAt = createdAt.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0B0F14;">
      <div style="background:#0B0F14; padding: 24px 28px; border-radius: 12px 12px 0 0;">
        <p style="color:#5EEAD4; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 6px;">New Registration</p>
        <h1 style="color:#ffffff; font-size:20px; margin:0;">Tech & Career Talk 0.1</h1>
      </div>
      <div style="border:1px solid #E2E8E4; border-top:none; padding: 24px 28px; border-radius: 0 0 12px 12px;">
        <p style="font-size:14px; line-height:1.6;">
          A new attendee has registered for the event. Full details are attached as a PDF.
        </p>
        <table style="width:100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
          <tbody>
            <tr>
              <td style="padding:8px 0; color:#5B6572; width:160px;">Full name</td>
              <td style="padding:8px 0; font-weight:600;">${escapeHtml(registration.fullName)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#5B6572;">Email</td>
              <td style="padding:8px 0;">${escapeHtml(registration.email)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#5B6572;">Career field</td>
              <td style="padding:8px 0;">${escapeHtml(registration.careerField)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#5B6572;">Experience level</td>
              <td style="padding:8px 0;">${escapeHtml(registration.experienceLevel)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#5B6572;">Registration date</td>
              <td style="padding:8px 0;">${escapeHtml(submittedAt)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#5B6572;">Registration ID</td>
              <td style="padding:8px 0; font-family: monospace; font-size:12px;">${escapeHtml(registrationId)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  const result = await resend.emails.send({
    from: fromAddress,
    to: organizerEmail,
    subject: `New Registration: ${registration.fullName} — Tech & Career Talk 0.1`,
    html,
    attachments: [
      {
        filename: `registration-${registrationId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (result.error) {
    throw new Error(`Resend email failed: ${result.error.message}`);
  }

  return result.data;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
