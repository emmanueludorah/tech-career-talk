import { forwardRef, type TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, hint, id, className, ...rest }, ref) => {
    const textareaId = id || rest.name;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div>
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-paper"
        >
          {label}
          {required && (
            <span className="ml-1 text-coral" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {hint && (
          <p id={hintId} className="mb-1.5 text-xs text-slate">
            {hint}
          </p>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-required={required}
          className={`w-full resize-y rounded-lg border bg-ink-raised px-4 py-2.5 text-sm text-paper placeholder:text-slate transition focus:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
            error ? "border-coral" : "border-line"
          } ${className || ""}`}
          {...rest}
        />

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-coral">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
