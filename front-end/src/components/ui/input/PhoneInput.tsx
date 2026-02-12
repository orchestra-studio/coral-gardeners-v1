import * as React from "react";
import PhoneInputOriginal, {
  Country,
  DefaultInputComponentProps,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import { getInputLabelStyles, getInputErrorStyles } from "./inputStyles";

export interface PhoneInputProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  defaultCountry?: Country;
  className?: string;
  containerClassName?: string;
  id?: string;
}

const CustomPhoneInput = React.forwardRef<
  HTMLInputElement,
  DefaultInputComponentProps
>(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={cn(
        "flex h-10 w-full border-none bg-transparent",
        "text-[var(--text)] placeholder:text-[var(--text-muted)]",
        "text-sm px-3 py-2 focus:outline-none focus:ring-0 focus:border-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
});

CustomPhoneInput.displayName = "CustomPhoneInput";

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  error,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  defaultCountry = "US",
  className,
  containerClassName,
  id,
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  const handleChange = (val?: string) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className={getInputLabelStyles()}>
          {label}
          {required && <span className="text-[var(--errorColor)] ms-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          dir="ltr"
          className={cn(
            "phone-input-container relative flex h-10 w-full items-stretch rounded-md border",
            // Use same border and background as Input component
            "bg-[var(--input-bg)]",
            "border-[var(--input-border)]/30",
            "overflow-hidden focus-within:border-[var(--primaryColor)] focus-within:ring-[var(--primaryColor)]",
            // Error state matching Input component
            error && [
              "border-[var(--errorColor)]",
              "focus-within:ring-1 focus-within:ring-[var(--errorColor)]",
              "[&_.PhoneInputCountry]:border-[var(--errorColor)]",
            ],
            // Country selector styles
            "[&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:justify-center",
            "[&_.PhoneInputCountry]:border-e [&_.PhoneInputCountry]:border-[var(--input-border)]/30",
            "[&_.PhoneInputCountry]:min-w-[4rem] [&_.PhoneInputCountry]:h-full",
            "[&_.PhoneInputCountry]:me-0!",
            // Disabled state matching Input component
            disabled && [
              "cursor-not-allowed",
              "opacity-50",
              "bg-[var(--surface-hover)]",
              "[&_.PhoneInputCountrySelect]:cursor-not-allowed",
              "[&_.PhoneInputCountry]:bg-[var(--surface-hover)]",
              "[&_.PhoneInput>input]:cursor-not-allowed",
            ],
            className
          )}
        >
          <PhoneInputOriginal
            inputComponent={CustomPhoneInput}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            defaultCountry={defaultCountry}
            className="PhoneInput"
            aria-invalid={!!error}
            {...props}
          />
        </div>
      </div>

      {error && <p className={getInputErrorStyles()}>{error}</p>}
    </div>
  );
};

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
