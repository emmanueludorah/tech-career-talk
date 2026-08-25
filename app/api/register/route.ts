import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { registrationSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { generateRegistrationPdf } from "@/lib/pdf";
import { sendRegistrationEmail } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";

// PDF generation and Resend's SDK both require the Node.js runtime
// (they are not compatible with the Edge runtime).
export const runtime = "nodejs";

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a minute." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    // Never trust client-side validation alone — re-validate on the server.
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please correct the highlighted fields.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const careerField =
      data.careerField === "Other" ? data.otherCareerField! : data.careerField;
    const referralSource =
      data.referralSource === "Other"
        ? data.otherReferralSource!
        : data.referralSource;

    // Persist first. If this throws on the unique email constraint, we
    // return a clean 409 before ever generating a PDF or sending an email.
    let saved;
    try {
      saved = await prisma.registration.create({
        data: {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          phone: data.phone || null,
          location: data.location,
          careerField,
          experienceLevel: data.experienceLevel,
          learningExpectation: data.learningExpectation,
          referralSource,
          joinCommunity: data.joinCommunity === "Yes",
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "This email address has already been registered." },
          { status: 409 }
        );
      }
      throw err;
    }

    // Generate the PDF and email the organizer. If either step fails, the
    // registration is already safely stored in the database, so we log the
    // failure server-side and still tell the attendee their spot is secured
    // rather than exposing internal error details or losing their record.
    try {
      const registration = { ...data, careerField, referralSource };
      const pdfBuffer = await generateRegistrationPdf({
        registration,
        registrationId: saved.id,
        createdAt: saved.createdAt,
      });

      await sendRegistrationEmail({
        registration,
        registrationId: saved.id,
        createdAt: saved.createdAt,
        pdfBuffer,
      });
    } catch (notifyErr) {
      console.error("[register] PDF/email step failed:", notifyErr);
      return NextResponse.json(
        {
          success: true,
          warning:
            "Your registration was saved, but the confirmation email could not be sent. Please contact the event organizer.",
          registrationId: saved.id,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: true, registrationId: saved.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}
