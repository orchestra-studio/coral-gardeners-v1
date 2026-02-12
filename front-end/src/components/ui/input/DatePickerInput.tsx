"use client";

import * as React from "react";
import { IconCalendar } from "@tabler/icons-react";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { format } from "date-fns";
import { Input } from "./Input";

export interface DatePickerInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  containerClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  required?: boolean;
}

const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(
  (
    {
      className,
      label,
      error,
      placeholder = "Select date",
      containerClassName,
      id,
      name,
      value,
      onChange,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Input
              ref={ref}
              type="text"
              id={id}
              name={name}
              label={label}
              error={error}
              placeholder={placeholder}
              containerClassName={containerClassName}
              className={className}
              value={value ? format(value, "PPP") : ""}
              readOnly
              disabled={disabled}
              required={required}
              startIcon={<IconCalendar className="h-5 w-5" />}
              onClick={() => !disabled && setOpen(true)}
              style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              {...props}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[100]" align="start">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePickerInput.displayName = "DatePickerInput";

export { DatePickerInput };
