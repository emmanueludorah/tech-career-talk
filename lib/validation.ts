import { z } from "zod";
import {
  CAREER_FIELDS,
  EXPERIENCE_LEVELS,
  REFERRAL_SOURCES,
  JOIN_COMMUNITY_OPTIONS,
} from "@/types/registration";

// A permissive but real phone check: digits, spaces, parens, dashes, optional leading +.
const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;

export const registrationSchema = z
  .object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .min(2, "Full name looks too short.")
    .max(100, "Full name is too long."),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),

  phone: z
    .string()
    .trim()
    .min(1, "WhatsApp phone number is required.")
    .refine((val) => phoneRegex.test(val), {
      message: "Enter a valid WhatsApp phone number.",
    }),

  location: z
    .string()
    .trim()
    .min(1, "Location or country is required.")
    .max(100, "Location is too long."),

    careerField: z.enum(CAREER_FIELDS, {
      errorMap: () => ({ message: "Select your career or tech field." }),
    }),

    otherCareerField: z.string().trim().max(100, "Career field is too long.").optional(),

  experienceLevel: z.enum(EXPERIENCE_LEVELS, {
    errorMap: () => ({ message: "Select your experience level." }),
  }),

  learningExpectation: z
    .string()
    .trim()
    .min(1, "Tell us what you hope to learn.")
    .min(10, "A few more details would help us tailor the event (10+ characters).")
    .max(1000, "Please keep this under 1000 characters."),

  referralSource: z.enum(REFERRAL_SOURCES, {
    errorMap: () => ({ message: "Let us know how you heard about the event." }),
  }),

  otherReferralSource: z
    .string()
    .trim()
    .max(100, "Referral source is too long.")
    .optional(),

    joinCommunity: z.enum(JOIN_COMMUNITY_OPTIONS, {
      errorMap: () => ({ message: "Select Yes or No." }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.careerField === "Other" && !data.otherCareerField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherCareerField"],
        message: "Please enter your career or tech field.",
      });
    }

    if (data.referralSource === "Other" && !data.otherReferralSource) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherReferralSource"],
        message: "Please enter how you heard about the event.",
      });
    }
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
