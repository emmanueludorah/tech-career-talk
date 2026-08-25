import * as PDFKitModule from "pdfkit";
import type PDFDocumentType from "pdfkit";
import type { RegistrationInput } from "@/types/registration";

const PDFDocument = (
  (PDFKitModule as unknown as { default?: typeof PDFKitModule }).default ??
  PDFKitModule
) as unknown as new (
  options: Record<string, unknown>
) => InstanceType<typeof PDFDocumentType>;

const EVENT_NAME = "Tech & Career Talk 0.1";

const INK = "#0B0F14";
const SLATE = "#5B6572";
const SIGNAL = "#0D9488";
const LINE = "#E2E8E4";

interface PdfOptions {
  registration: RegistrationInput;
  registrationId: string;
  createdAt: Date;
}

/**
 * Renders a single-page, print-friendly PDF summarizing one attendee's
 * registration. Returns a Buffer so the caller can attach it directly to an
 * email or write it to disk.
 */
export function generateRegistrationPdf({
  registration,
  registrationId,
  createdAt,
}: PdfOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 56, bottom: 56, left: 56, right: 56 },
        info: {
          Title: "Tech Event Attendee Registration",
          Author: EVENT_NAME,
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;

      // --- Header -----------------------------------------------------
      doc
        .rect(0, 0, doc.page.width, 110)
        .fill(INK);

      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(EVENT_NAME.toUpperCase(), 56, 40, { characterSpacing: 1.5 });

      doc
        .fillColor(SIGNAL)
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("Tech Event Attendee Registration", 56, 58);

      doc.moveDown(3);
      doc.y = 140;

      // --- Meta row: registration id + date ---------------------------
      doc
        .fillColor(SLATE)
        .font("Helvetica")
        .fontSize(9)
        .text(`REGISTRATION ID  ${registrationId}`, 56, doc.y, {
          continued: false,
        });

      doc
        .fillColor(SLATE)
        .font("Helvetica")
        .fontSize(9)
        .text(
          `SUBMITTED  ${createdAt.toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}`,
          56,
          doc.y + 2
        );

      doc.moveDown(1.5);

      const drawSectionTitle = (title: string) => {
        doc.moveDown(1);
        doc
          .fillColor(INK)
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(title.toUpperCase(), { characterSpacing: 1 });
        const lineY = doc.y + 4;
        doc.moveTo(56, lineY).lineTo(56 + pageWidth, lineY).strokeColor(LINE).lineWidth(1).stroke();
        doc.moveDown(1);
      };

      const drawField = (label: string, value: string) => {
        const startY = doc.y;
        doc
          .fillColor(SLATE)
          .font("Helvetica")
          .fontSize(9)
          .text(label.toUpperCase(), 56, startY, {
            width: 160,
            characterSpacing: 0.5,
          });
        doc
          .fillColor(INK)
          .font("Helvetica")
          .fontSize(11)
          .text(value || "—", 220, startY, {
            width: pageWidth - 164,
          });
        doc.moveDown(0.9);
      };

      // --- Attendee details --------------------------------------------
      drawSectionTitle("Attendee Details");
      drawField("Full Name", registration.fullName);
      drawField("Email", registration.email);
      drawField("WhatsApp Phone Number", registration.phone || "Not provided");
      drawField("Location / Country", registration.location);

      drawSectionTitle("Background");
      drawField("Career / Tech Field", registration.careerField);
      drawField("Experience Level", registration.experienceLevel);

      drawSectionTitle("Event Interests");
      drawField("What They Hope To Learn", registration.learningExpectation);
      drawField("How They Heard About The Event", registration.referralSource);
      drawField("Wants To Join The Community", registration.joinCommunity);

      // --- Footer ---------------------------------------------------
      const footerY = doc.page.height - 60;
      doc
        .moveTo(56, footerY)
        .lineTo(56 + pageWidth, footerY)
        .strokeColor(LINE)
        .lineWidth(1)
        .stroke();

      doc
        .fillColor(SLATE)
        .font("Helvetica")
        .fontSize(8)
        .text(
          `Generated automatically by the ${EVENT_NAME} registration system.`,
          56,
          footerY + 10
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
