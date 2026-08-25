interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
  submittingLabel?: string;
}

export default function SubmitButton({
  isSubmitting,
  label = "Complete Registration",
  submittingLabel = "Submitting Registration...",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
      className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#16a34a] px-7 py-3.5 font-display text-sm font-semibold text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:bg-[#16a34a]/50 sm:w-auto"
    >
      {isSubmitting && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-hidden="true"
        />
      )}
      {isSubmitting ? submittingLabel : label}
    </button>
  );
}
