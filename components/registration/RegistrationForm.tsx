"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationFormValues } from "@/lib/validation";
import {
  CAREER_FIELDS,
  EXPERIENCE_LEVELS,
  REFERRAL_SOURCES,
  JOIN_COMMUNITY_OPTIONS,
} from "@/types/registration";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import SubmitButton from "./SubmitButton";

type SubmitState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      registrationId: string;
      joinCommunity: RegistrationFormValues["joinCommunity"];
      warning?: string;
    };

const SECTIONS = [
  { number: "01", title: "About you" },
  { number: "02", title: "Your background" },
  { number: "03", title: "Event preferences" },
] as const;

export default function RegistrationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });
  const selectedCareerField = watch("careerField");
  const selectedReferralSource = watch("referralSource");

  const onSubmit = async (values: RegistrationFormValues) => {
    setSubmitState({ status: "idle" });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitState({
          status: "error",
          message: data?.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setSubmitState({
        status: "success",
        registrationId: data.registrationId,
        joinCommunity: values.joinCommunity,
        warning: data.warning,
      });
    } catch {
      setSubmitState({
        status: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  };

  if (submitState.status === "success") {
    return (
      <SuccessScreen
        registrationId={submitState.registrationId}
        joinCommunity={submitState.joinCommunity}
        warning={submitState.warning}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
        Tech & Career Talk 0.1
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper sm:text-4xl">
        Register to attend
      </h1>
      <p className="mt-3 text-sm text-slate-light">
        Takes about two minutes. Fields marked{" "}
        <span className="text-coral" aria-hidden="true">*</span> are required.
      </p>

      {/* Progress / section indicator */}
      <ol className="mt-10 flex items-center gap-4" aria-hidden="true">
        {SECTIONS.map((s, i) => (
          <li key={s.number} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-signal">{s.number}</span>
              <span className="text-xs text-slate-light">{s.title}</span>
            </div>
            {i < SECTIONS.length - 1 && (
              <span className="h-px w-8 bg-line" />
            )}
          </li>
        ))}
      </ol>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 animate-fade-up space-y-12"
      >
        {/* Section 01 — About you */}
        <fieldset className="space-y-5">
          <legend className="mb-1 flex items-center gap-2 font-display text-lg text-paper">
            <span className="font-mono text-sm text-signal">01</span>
            About you
          </legend>

          <FormInput
            label="Full Name"
            required
            autoComplete="name"
            placeholder="Jordan Adeyemi"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <FormInput
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <FormInput
            label=" WhatsApp Phone Number"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+234 800 000 0000"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <FormInput
            label="Location / Country"
            required
            autoComplete="country-name"
            placeholder="Lagos, Nigeria"
            error={errors.location?.message}
            {...register("location")}
          />
        </fieldset>

        {/* Section 02 — Background */}
        <fieldset className="space-y-5 border-t border-line pt-10">
          <legend className="mb-1 flex items-center gap-2 font-display text-lg text-paper">
            <span className="font-mono text-sm text-signal">02</span>
            Your background
          </legend>

          <FormSelect
            label="Career / Tech Field"
            required
            options={CAREER_FIELDS}
            placeholder="Select your field"
            error={errors.careerField?.message}
            {...register("careerField")}
          />

          {selectedCareerField === "Other" && (
            <FormInput
              label="Your Career / Tech Field"
              required
              placeholder="e.g. Technical Writing"
              error={errors.otherCareerField?.message}
              {...register("otherCareerField")}
            />
          )}

          <FormSelect
            label="Experience Level"
            required
            options={EXPERIENCE_LEVELS}
            placeholder="Select your level"
            error={errors.experienceLevel?.message}
            {...register("experienceLevel")}
          />
        </fieldset>

        {/* Section 03 — Event preferences */}
        <fieldset className="space-y-5 border-t border-line pt-10">
          <legend className="mb-1 flex items-center gap-2 font-display text-lg text-paper">
            <span className="font-mono text-sm text-signal">03</span>
            Event preferences
          </legend>

          <FormTextarea
            label="What do you hope to learn?"
            required
            placeholder="Tell us what you're hoping to get out of the summit..."
            error={errors.learningExpectation?.message}
            {...register("learningExpectation")}
          />

          <FormSelect
            label="How did you hear about the event?"
            required
            options={REFERRAL_SOURCES}
            placeholder="Select an option"
            error={errors.referralSource?.message}
            {...register("referralSource")}
          />

          {selectedReferralSource === "Other" && (
            <FormInput
              label="How did you hear about the event?"
              required
              placeholder="e.g. Community newsletter"
              error={errors.otherReferralSource?.message}
              {...register("otherReferralSource")}
            />
          )}

          <FormSelect
            label="Would you like to join our tech community after the event?"
            required
            options={JOIN_COMMUNITY_OPTIONS}
            placeholder="Select an option"
            error={errors.joinCommunity?.message}
            {...register("joinCommunity")}
          />
        </fieldset>

        {submitState.status === "error" && (
          <div
            role="alert"
            className="rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral"
          >
            {submitState.message}
          </div>
        )}

        <div className="border-t border-line pt-8">
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
}

function SuccessScreen({
  registrationId,
  joinCommunity,
  warning,
}: {
  registrationId: string;
  joinCommunity: RegistrationFormValues["joinCommunity"];
  warning?: string;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center sm:px-8">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ring rounded-full bg-signal/40" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-signal text-ink">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-signal">
        Registration confirmed
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper sm:text-4xl">
        You&apos;re on the list.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-light">
        A copy of your registration has been sent to the event organizer.
        Keep an eye on your inbox for event-day details closer to the date.
      </p>

      {warning && (
        <p className="mt-6 max-w-sm rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 text-xs text-amber">
          {warning}
        </p>
      )}

      <p className="mt-8 font-mono text-[11px] text-slate">
        REGISTRATION ID&nbsp; {registrationId}
      </p>

      {joinCommunity === "Yes" && (
        <a
          href="https://chat.whatsapp.com/DBxUhHtlvpELYDmG8olo6v?s=cl&p=a&mlu=0&ilr=0"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#16a34a] px-6 py-3 font-display text-sm font-semibold text-white transition hover:bg-[#15803d]"
        >
          Join the WhatsApp community
        </a>
      )}

      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center rounded-lg bg-[#16a34a] px-6 py-3 font-display text-sm font-medium text-white transition hover:bg-[#15803d]"
      >
        Back to event page
      </Link>
    </div>
  );
}
