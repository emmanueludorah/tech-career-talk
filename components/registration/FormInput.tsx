import {
  forwardRef,
  type ForwardedRef,
  type ComponentPropsWithoutRef,
} from "react";

interface FormInputProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  id?: string;
  name?: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      required,
      hint,
      id,
      name,
      className,
      ...rest
    }: FormInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const inputId = id || name;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-paper"
        >
          {label}
          {required && (
            <span className="ml-1 text-coral" aria-hidden="true">
              *
            </span>
          )}
          {!required && (
            <span className="ml-1.5 font-mono text-[11px] font-normal text-slate">
              
            </span>
          )}
        </label>

        {hint && (
          <p id={hintId} className="mb-1.5 text-xs text-slate">
            {hint}
          </p>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-required={required}
          className={`w-full rounded-lg border bg-ink-raised px-4 py-2.5 text-sm text-paper placeholder:text-slate transition focus:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
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

FormInput.displayName = "FormInput";

export default FormInput;
