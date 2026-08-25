export const CAREER_FIELDS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "UI/UX Design",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Artificial Intelligence",
  "Graphics Design",
  "Product Management",
  "Other",
] as const;

export const EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
] as const;

export const REFERRAL_SOURCES = [
  "WhatsApp",
  "Facebook",
  "Telegram",
  "Instagram",
  "LinkedIn",
  "Friend/Referral",
  "School",
  "Website",
  "Other",
] as const;

export const JOIN_COMMUNITY_OPTIONS = ["Yes", "No"] as const;

export type CareerField = (typeof CAREER_FIELDS)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type ReferralSource = (typeof REFERRAL_SOURCES)[number];
export type JoinCommunityOption = (typeof JOIN_COMMUNITY_OPTIONS)[number];

export interface RegistrationInput {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  careerField: string;
  otherCareerField?: string;
  experienceLevel: ExperienceLevel;
  learningExpectation: string;
  referralSource: string;
  otherReferralSource?: string;
  joinCommunity: JoinCommunityOption;
}

export interface RegistrationRecord extends Omit<RegistrationInput, "joinCommunity"> {
  id: string;
  joinCommunity: boolean;
  createdAt: string;
}
