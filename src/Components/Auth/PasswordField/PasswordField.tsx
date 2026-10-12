import React, { useState } from "react";

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    placeholder?: string;
    autoComplete?: string;
    invalid?: boolean;
    error?: string;
    descriptionId?: string;
    rightAction?: React.ReactNode;
    children?: React.ReactNode;
}

const inputBase =
    "h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-[#2b2024] outline-none transition placeholder:text-[#b9aab0] focus:border-[#c2185b] focus:ring-4 focus:ring-[#c2185b]/15";

const Eye = ({ off = false }: { off?: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.04 12.32a1 1 0 0 1 0-.64C3.42 7.51 7.36 4.5 12 4.5s8.58 3.01 9.96 7.18a1 1 0 0 1 0 .64C20.58 16.49 16.64 19.5 12 19.5s-8.58-3.01-9.96-7.18Z" />
        <circle cx="12" cy="12" r="3" />
        {off && <path strokeLinecap="round" d="M4 4l16 16" />}
    </svg>
);

export default function PasswordField({
    id,
    label,
    value,
    onChange,
    onBlur,
    placeholder,
    autoComplete,
    invalid = false,
    error,
    descriptionId,
    rightAction,
    children,
}: PasswordFieldProps): React.JSX.Element {
    const [show, setShow] = useState(false);

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor={id} className="text-sm font-semibold">
                    {label}
                </label>
                {rightAction}
            </div>

            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    aria-invalid={invalid}
                    aria-describedby={invalid && error ? descriptionId : undefined}
                    className={`${inputBase} pr-12 ${invalid ? "border-[#d9534f]" : "border-[#f0d0dc]"}`}
                />
                <button
                    type="button"
                    onClick={() => setShow((current) => !current)}
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#9c8a91] transition hover:text-[#c2185b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2185b]"
                >
                    <Eye off={show} />
                </button>
            </div>

            {invalid && error && (
                <p id={descriptionId} className="mt-1.5 text-[13px] text-[#c0392b]">
                    {error}
                </p>
            )}

            {children}
        </div>
    );
}
