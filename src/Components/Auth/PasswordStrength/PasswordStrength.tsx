import React from "react";
import type { PasswordStrengthResult } from "./usePasswordStrength";

const Check = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-3 w-3"
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
);

export default function PasswordStrength({
    rules,
    score,
    strength,
    strengthColor,
}: Omit<PasswordStrengthResult, "isValid">): React.JSX.Element {
    return (
        <div id="password-help" className="mt-3">
            <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4].map((item) => (
                        <span
                            key={item}
                            className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                            style={{
                                backgroundColor:
                                    item <= score ? strengthColor : "#f6dfe8",
                            }}
                        />
                    ))}
                </div>
                <span
                    className="w-12 text-right text-xs font-semibold"
                    style={{ color: score ? strengthColor : "#a8969c" }}
                >
                    {strength}
                </span>
            </div>

            <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {rules.map((rule) => (
                    <li
                        key={rule.label}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                            rule.ok ? "text-[#3f9d5a]" : "text-[#9c8a91]"
                        }`}
                    >
                        <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                rule.ok
                                    ? "bg-[#3f9d5a] text-white"
                                    : "border border-[#e8b8c9]"
                            }`}
                        >
                            {rule.ok && <Check />}
                        </span>
                        {rule.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
