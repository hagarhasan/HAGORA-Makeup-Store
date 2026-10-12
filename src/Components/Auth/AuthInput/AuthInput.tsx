import React from "react";

interface AuthInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    invalid?: boolean;
    error?: string;
    descriptionId?: string;
    className?: string;
}

const inputBase =
    "h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-[#2b2024] outline-none transition placeholder:text-[#b9aab0] focus:border-[#c2185b] focus:ring-4 focus:ring-[#c2185b]/15";

export default function AuthInput({
    id,
    label,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    autoComplete,
    inputMode,
    invalid = false,
    error,
    descriptionId,
    className = "",
}: AuthInputProps): React.JSX.Element {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-semibold">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                autoComplete={autoComplete}
                inputMode={inputMode}
                aria-invalid={invalid}
                aria-describedby={invalid && error ? descriptionId : undefined}
                className={`${inputBase} ${invalid ? "border-[#d9534f]" : "border-[#f0d0dc]"} ${className}`}
            />
            {invalid && error && (
                <p id={descriptionId} className="mt-1.5 text-[13px] text-[#c0392b]">
                    {error}
                </p>
            )}
        </div>
    );
}
