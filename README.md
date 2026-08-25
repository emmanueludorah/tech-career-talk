# Tech & Career Talk 0.1

![Tech & Career Talk 0.1 logo](public/Logo.png)

An event registration platform for collecting attendee details, validating submissions, storing registrations in PostgreSQL, and notifying organizers with a generated PDF summary.

## Overview

The application provides:

- A responsive event landing page and registration form
- Client-side and server-side validation with Zod
- Required WhatsApp phone number validation
- Custom career or tech field entry when `Other` is selected
- PostgreSQL persistence through Prisma
- Duplicate registration protection by email address
- PDF generation with PDFKit
- Organizer email notifications through Resend
- Basic per-IP rate limiting
- Accessible form labels, validation messages, and keyboard focus states

## Technology

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS
- React Hook Form and Zod
- Prisma and PostgreSQL
- PDFKit and Resend

## Requirements

- Node.js 18.18 or later (Node.js 20 recommended)
- PostgreSQL
- A [Resend](https://resend.com) account and API key

## Getting Started

### 1. Install dependencies

```bash
npm install
```

The `postinstall` script generates the Prisma client automatically.

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Then update `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tech_event?schema=public
RESEND_API_KEY=re_your_api_key_here
ORGANIZER_EMAIL=udorahemmanuel23@gmail.com
EMAIL_FROM="Tech & Career Talk 0.1 <onboarding@resend.dev>"
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. |
| `RESEND_API_KEY` | API key from the Resend dashboard. |
| `ORGANIZER_EMAIL` | Address that receives registration notifications. |
| `EMAIL_FROM` | Verified Resend sender address, or `onboarding@resend.dev` for testing. |

Never commit `.env` or expose server credentials to the client.

### 3. Set up the database

For a quick local or hosted schema setup:

```bash
npm run db:push
```

For tracked migrations, use:

```bash
npm run db:migrate
```

To inspect stored registrations locally:

```bash
npm run db:studio
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), or go directly to [http://localhost:3000/register](http://localhost:3000/register).

Run only one Next.js process for this project at a time. Do not run `npm run dev` and `npm start` simultaneously because both use the `.next` directory and can produce missing-chunk errors.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run db:push` | Apply the Prisma schema without creating migrations. |
| `npm run db:migrate` | Create and apply a development migration. |
| `npm run db:studio` | Open Prisma Studio. |

## Registration Flow

1. The attendee completes the registration form.
2. React Hook Form and Zod validate the fields in the browser.
3. The API route validates the request again on the server.
4. The registration is stored in PostgreSQL.
5. A one-page PDF summary is generated.
6. The organizer receives an email with the PDF attached.
7. The attendee sees an inline confirmation without a page reload.

The database write occurs before PDF and email delivery. If notification delivery fails, the registration remains saved and the API returns a success response with a warning.

## Project Structure

```text
app/
  page.tsx                 Event landing page
  register/page.tsx        Registration route
  api/register/route.ts    Validation, persistence, PDF, and email endpoint
  layout.tsx               Root layout and metadata
  globals.css              Tailwind layers and global styles
public/
  Logo.png                 Event logo displayed in the shared header

components/registration/   Registration form components
lib/
  validation.ts            Shared Zod validation schema
  prisma.ts                Prisma client singleton
  pdf.ts                   PDF generation
  email.ts                 Resend integration and email template
  rate-limit.ts            Basic in-memory rate limiter
prisma/schema.prisma       Registration database model
types/registration.ts      Shared types and option lists
```

## Production Notes

- Use a managed PostgreSQL provider for production deployments.
- Configure a verified sending domain in Resend before using a production sender address.
- The included rate limiter is in-memory and single-instance. Replace it with shared storage such as Upstash Redis for multi-instance or serverless deployments.
- Keep `DATABASE_URL`, `RESEND_API_KEY`, and email configuration in the deployment platform's secret manager.
- Run `npm run build` as part of CI or before deployment.

## License

This project is private and intended for the Tech & Career Talk 0.1 event.
