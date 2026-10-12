import React from "react";

interface AuthSelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: () => void;
    invalid?: boolean;
    error?: string;
    descriptionId?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const inputBase =
    "h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-[#2b2024] outline-none transition placeholder:text-[#b9aab0] focus:border-[#c2185b] focus:ring-4 focus:ring-[#c2185b]/15";

export default function AuthSelect({
    id,
    label,
    value,
    onChange,
    onBlur,
    invalid = false,
    error,
    descriptionId,
    options,
    placeholder,
}: AuthSelectProps): React.JSX.Element {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-semibold">
                {label}
            </label>

            <select
                id={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={invalid}
                aria-describedby={invalid && error ? descriptionId : undefined}
                className={`${inputBase} ${
                    invalid ? "border-[#d9534f]" : "border-[#f0d0dc]"
                } ${!value ? "text-[#b9aab0]" : "text-[#2b2024]"}`}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="text-[#2b2024]"
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {invalid && error && (
                <p id={descriptionId} className="mt-1.5 text-[13px] text-[#c0392b]">
                    {error}
                </p>
            )}
        </div>
    );
}
