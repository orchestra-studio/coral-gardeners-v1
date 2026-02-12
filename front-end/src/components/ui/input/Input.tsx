import * as React from "react";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff, IconRefresh } from "@tabler/icons-react";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  getInputBaseStyles,
  getInputContainerStyles,
  getInputLabelStyles,
  getInputErrorStyles,
} from "./inputStyles";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
  // Password generation options
  showPasswordGenerator?: boolean;
  onPasswordGenerate?: (password: string) => void;
  confirmationFieldName?: string;
  setValue?: (name: string, value: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      startIcon,
      endIcon,
      containerClassName,
      id,
      showPasswordGenerator = false,
      onPasswordGenerate,
      confirmationFieldName,
      setValue,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    // Handle password visibility toggle
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordField = type === "password";
    const actualType = isPasswordField
      ? showPassword
        ? "text"
        : "password"
      : type;

    // Password generation function
    const generatePassword = () => {
      // Generate password following schema: Abcde@123 (1 uppercase + 4 lowercase letters + @ + 3 numbers)
      const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
      const numbers = "0123456789";

      let password = "";

      // Generate 1 random uppercase letter (first character)
      password +=
        uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];

      // Generate 4 random lowercase letters
      for (let i = 0; i < 4; i++) {
        password +=
          lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
      }

      // Add @ symbol
      password += "@";

      // Generate 3 random numbers
      for (let i = 0; i < 3; i++) {
        password += numbers[Math.floor(Math.random() * numbers.length)];
      }

      return password;
    };

    const handlePasswordGeneration = () => {
      const password = generatePassword();

      // Show the generated password by toggling visibility
      setShowPassword(true);

      // Call the external callback if provided
      if (onPasswordGenerate) {
        onPasswordGenerate(password);
      }

      // Set the password value using setValue if provided
      if (setValue && props.name) {
        setValue(props.name, password);

        // Auto-set confirmation field if specified
        if (confirmationFieldName) {
          setValue(confirmationFieldName, password);
        }
      }
    };

    // Create icons for password field
    const passwordIcons = isPasswordField ? (
      <div className="flex items-center gap-2">
        {showPasswordGenerator && (
          <button
            type="button"
            onClick={handlePasswordGeneration}
            className="text-[var(--text-muted)] hover:text-[var(--primaryColor)] transition-colors"
            aria-label="Generate password"
            title="Generate random password"
          >
            <IconRefresh className="h-5 w-5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <IconEyeOff className="h-5 w-5" />
          ) : (
            <IconEye className="h-5 w-5" />
          )}
        </button>
      </div>
    ) : (
      endIcon
    );

    return (
      <div className={getInputContainerStyles(containerClassName)}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className={getInputLabelStyles()}
          >
            {label}
          </LabelPrimitive.Root>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {startIcon}
            </div>
          )}

          <input
            type={actualType}
            id={inputId}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            aria-required={props.required ? "true" : undefined}
            className={cn(
              getInputBaseStyles(error, {
                start: !!startIcon,
                end: !!(endIcon || isPasswordField),
              }),
              // Extra padding for generate + eye icons in password field
              showPasswordGenerator && isPasswordField && "pe-16",
              className
            )}
            ref={ref}
            {...props}
          />

          {passwordIcons && (
            <div className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {passwordIcons}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className={getInputErrorStyles()}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
