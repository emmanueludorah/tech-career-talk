import { forwardRef, type SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: readonly string[];
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, required, options, placeholder, id, className, ...rest }, ref) => {
    const selectId = id || rest.name;
    const errorId = `${selectId}-error`;

    return (
      <div>
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-paper"
        >
          {label}
          {required && (
            <span className="ml-1 text-coral" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-required={required}
            defaultValue=""
            className={`w-full appearance-none rounded-lg border bg-ink-raised px-4 py-2.5 pr-10 text-sm text-paper transition focus:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
              error ? "border-coral" : "border-line"
            } ${className || ""}`}
            {...rest}
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5.5 7.5l4.5 4.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-coral">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
