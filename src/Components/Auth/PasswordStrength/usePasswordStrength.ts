export type PasswordRule = {
    label: string;
    ok: boolean;
};

export type PasswordStrengthResult = {
    rules: PasswordRule[];
    score: number;
    strength: string;
    strengthColor: string;
    isValid: boolean;
};

export function usePasswordStrength(password: string): PasswordStrengthResult {
    const rules: PasswordRule[] = [
        {
            label: "At least 8 characters",
            ok: password.length >= 8,
        },
        {
            label: "A letter",
            ok: /[A-Za-z]/.test(password),
        },
        {
            label: "A number",
            ok: /\d/.test(password),
        },
    ];

    const score =
        rules.filter((rule) => rule.ok).length + (password.length >= 12 ? 1 : 0);

    const strength = ["", "Weak", "Fair", "Good", "Strong"][score];

    const strengthColor = ["#f0d0dc", "#d9534f", "#e8a23d", "#7bb661", "#3f9d5a"][
        score
    ];

    const isValid = rules.every((rule) => rule.ok);

    return { rules, score, strength, strengthColor, isValid };
}
