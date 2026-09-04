import type { ReactNode } from "react";

type ToggleOption<T extends string> = {
  label: ReactNode;
  value: T;
};

type Props<T extends string> = {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export const ToggleGroup = <T extends string>({
  value,
  options,
  onChange,
  disabled,
  ariaLabel,
}: Props<T>) => {
  return (
    <div
      className={`hb-toggle-group${disabled ? " is-disabled" : ""}`}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            className={`hb-toggle-item${isActive ? " is-active" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
