import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "../../Components/Auth/AuthInput/AuthInput";
import AuthShadePanel from "../../Components/Auth/AuthShadePanel/AuthShadePanel";
import { SHADES, type Shade } from "../../types/shade";
import PasswordField from "../../Components/Auth/PasswordField/PasswordField";
import PasswordStrength from "../../Components/Auth/PasswordStrength/PasswordStrength";
import { usePasswordStrength } from "../../Components/Auth/PasswordStrength/usePasswordStrength";

import { getMe, registerUser } from "../../api/auth/auth";
import { updateBasicProfile } from "../../api/users/users";
import { useAuthContext } from "../../Context/useAuthContext";
import { useToast } from "../../Context/useToast";

type Field =
    | "first_name"
    | "last_name"
    | "email"
    | "password"
    | "confirm"
    | "terms";

type Touched = Partial<Record<Field, boolean>>;

// DOM ids used for focusing the first invalid field
const FIELD_IDS: Record<Field, string> = {
    first_name: "first_name",
    last_name: "last_name",
    email: "email",
    password: "password",
    confirm: "confirm",
    terms: "termsCheckbox",
};

const PERKS = [
    "Save your favorite shades",
    "Track every order in one place",
    "Check out faster next time",
];

export default function Register(): React.JSX.Element {
    const navigate = useNavigate();

    const { login, user, updateUser, isAuthenticated, profileCompleted } =
        useAuthContext();
    const { showToast } = useToast();

    const isEditMode = isAuthenticated && !profileCompleted;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [terms, setTerms] = useState(false);

    const [touched, setTouched] = useState<Touched>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Starts true in edit mode so we never call setState synchronously in an effect
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    // Read localStorage once, not on every render
    const [active, setActive] = useState<Shade>(() => {
        try {
            const saved = localStorage.getItem("hagora-shade-name");
            return SHADES.find((s) => s.name === saved) || SHADES[1];
        } catch {
            return SHADES[1];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("hagora-shade-name", active.name);
        } catch {
            /* ignore */
        }
    }, [active.name]);

    // Load existing account information when editing.
    useEffect(() => {
        if (!isEditMode) return;

        let cancelled = false;

        async function loadUserData() {
            try {
                const profile = await getMe();
                if (cancelled) return;

                setFirstName(profile.first_name ?? "");
                setLastName(profile.last_name ?? "");
                setEmail(profile.email ?? "");
            } catch (err) {
                if (cancelled) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "Couldn't load your account information.",
                );
            } finally {
                if (!cancelled) setInitialLoading(false);
            }
        }

        void loadUserData();

        return () => {
            cancelled = true;
        };
    }, [isEditMode]);

    const { rules, score, strength, strengthColor, isValid } =
        usePasswordStrength(password);

    const errors: Record<Field, string> = {
        first_name:
            firstName.trim().length < 2 ? "Enter your first name." : "",
        last_name: lastName.trim().length < 2 ? "Enter your last name." : "",
        email: !email.trim()
            ? "Enter your email address."
            : !/^\S+@\S+\.\S+$/.test(email.trim())
                ? "Enter a valid email, like name@example.com."
                : "",
        password: isValid
            ? ""
            : "Your password doesn't meet all the requirements.",
        confirm: !confirm
            ? "Re-enter your password."
            : confirm !== password
                ? "Passwords don't match."
                : "",
        terms: terms ? "" : "Accept the terms to create your account.",
    };

    const touch = (field: Field) =>
        setTouched((current) => ({ ...current, [field]: true }));

    const showErr = (field: Field) => Boolean(touched[field] && errors[field]);

    const busy = loading || (isEditMode && initialLoading);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (busy) return;
        setError("");

        const fieldsToValidate: Field[] = isEditMode
            ? ["first_name", "last_name", "email"]
            : ["first_name", "last_name", "email", "password", "confirm", "terms"];

        const touchedFields: Touched = {};
        fieldsToValidate.forEach((field) => {
            touchedFields[field] = true;
        });
        setTouched((current) => ({ ...current, ...touchedFields }));

        const firstInvalid = fieldsToValidate.find((f) => errors[f]);
        if (firstInvalid) {
            document.getElementById(FIELD_IDS[firstInvalid])?.focus();
            return;
        }

        setLoading(true);

        try {
            if (isEditMode) {
                const response = await updateBasicProfile({
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.trim(),
                });

                if (user) {
                    updateUser({
                        ...user,
                        ...response.user,
                        profile_completed: false,
                    });
                }

                navigate("/complete-profile");
                return;
            }

            const response = await registerUser({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
                password,
            });

            if (!response.user) {
                throw new Error(
                    "Account created, but user information was not returned. Please sign in.",
                );
            }

            const registeredUser = {
                id: response.user.id,
                email: response.user.email,
                first_name: response.user.first_name,
                last_name: response.user.last_name,
                username: null,
                phone: null,
                city: null,
                address: null,
                profile_completed: false,
            };

            login(registeredUser, response.access_token);

            const userFirstName = response.user.first_name?.trim() || firstName.trim();
            const welcomeTitle = userFirstName
                ? `Welcome to HAGORA, ${userFirstName}! ✨`
                : "Welcome to HAGORA! ✨";
            const welcomeMessage = "Your beauty journey starts here.";

            const isProfileComplete = Boolean(
                registeredUser.username &&
                registeredUser.phone &&
                registeredUser.city &&
                registeredUser.address
            );

            if (isProfileComplete) {
                showToast({
                    title: welcomeTitle,
                    message: welcomeMessage,
                    type: "register",
                    duration: 3000,
                });
                navigate("/");
            } else {
                navigate("/complete-profile");
            }
        } catch (err) {
            setError(
                err instanceof Error && err.message
                    ? err.message
                    : isEditMode
                        ? "We couldn't update your account. Please try again."
                        : "We couldn't create your account. Check your details and try again.",
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="min-h-screen bg-[linear-gradient(135deg,#fce4ec_0%,#fff0f5_50%,#f8bbd0_100%)] text-[#2b2024] lg:grid lg:grid-cols-[1fr_1.05fr]"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
            <Helmet>
                <title>
                    {isEditMode ? "Edit account - HAGORA" : "Create account - HAGORA"}
                </title>
                <meta
                    name="description"
                    content={
                        isEditMode
                            ? "Edit your HAGORA account information"
                            : "Create your HAGORA account"
                    }
                />
                <meta name="author" content="HAGORA" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <AuthShadePanel
                active={active}
                onActiveChange={setActive}
                layout="register"
                title={
                    <>
                        Find the shade
                        <br />
                        that's yours.
                    </>
                }
                perks={PERKS}
                subtitle={
                    <p className="mb-3 text-sm font-medium text-white/85">
                        Now showing: <span className="font-bold">{active.name}</span>
                    </p>
                }
            />

            <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
                <div className="w-full max-w-[420px]">
                    <Link
                        to="/"
                        className="mb-8 inline-block text-xl font-bold tracking-[0.2em] text-[#c2185b] lg:hidden"
                    >
                        HAGORA
                    </Link>

                    <h1
                        className="text-[34px] leading-tight sm:text-[40px]"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                    >
                        {isEditMode ? "Edit your account" : "Create your account"}
                    </h1>

                    <p className="mt-2 text-[15px] text-[#7d6a71]">
                        {isEditMode ? (
                            "Update your basic account information."
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-[#c2185b] underline-offset-4 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </p>

                    <div aria-live="polite">
                        {error && (
                            <div
                                role="alert"
                                className="mt-6 rounded-xl border border-[#f0b9bf] bg-[#fff1f2] px-4 py-3 text-sm text-[#9b2c3b]"
                            >
                                {error}
                            </div>
                        )}
                    </div>

                    {isEditMode && initialLoading ? (
                        <div
                            className="mt-8 space-y-5"
                            aria-busy="true"
                            aria-label="Loading your account information"
                        >
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {[0, 1].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-3 w-20 animate-pulse rounded bg-[#c2185b]/10" />
                                        <div className="h-12 w-full animate-pulse rounded-xl bg-[#c2185b]/10" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-28 animate-pulse rounded bg-[#c2185b]/10" />
                                <div className="h-12 w-full animate-pulse rounded-xl bg-[#c2185b]/10" />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="mt-8">
                            <fieldset disabled={busy} className="space-y-5">
                                <legend className="sr-only">
                                    {isEditMode ? "Account information" : "Create account"}
                                </legend>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <AuthInput
                                        id="first_name"
                                        label="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onBlur={() => touch("first_name")}
                                        placeholder="Your first name"
                                        autoComplete="given-name"
                                        invalid={showErr("first_name")}
                                        error={errors.first_name}
                                        descriptionId="first-name-error"
                                    />

                                    <AuthInput
                                        id="last_name"
                                        label="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onBlur={() => touch("last_name")}
                                        placeholder="Your last name"
                                        autoComplete="family-name"
                                        invalid={showErr("last_name")}
                                        error={errors.last_name}
                                        descriptionId="last-name-error"
                                    />
                                </div>

                                <AuthInput
                                    id="email"
                                    label="Email address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => touch("email")}
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    inputMode="email"
                                    invalid={showErr("email")}
                                    error={errors.email}
                                    descriptionId="email-error"
                                />

                                {!isEditMode && (
                                    <>
                                        <PasswordField
                                            id="password"
                                            label="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => touch("password")}
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            invalid={showErr("password")}
                                            error={errors.password}
                                            descriptionId="password-error"
                                        >
                                            <PasswordStrength
                                                rules={rules}
                                                score={score}
                                                strength={strength}
                                                strengthColor={strengthColor}
                                            />
                                        </PasswordField>

                                        <PasswordField
                                            id="confirm"
                                            label="Confirm password"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            onBlur={() => touch("confirm")}
                                            placeholder="Re-enter your password"
                                            autoComplete="new-password"
                                            invalid={showErr("confirm")}
                                            error={errors.confirm}
                                            descriptionId="confirm-error"
                                        />

                                        <div>
                                            <div className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    id="termsCheckbox"
                                                    checked={terms}
                                                    onChange={(e) => {
                                                        setTerms(e.target.checked);
                                                        touch("terms");
                                                    }}
                                                    aria-invalid={showErr("terms")}
                                                    aria-describedby={
                                                        showErr("terms") ? "terms-error" : undefined
                                                    }
                                                    className="mt-[2px] h-4 w-4 shrink-0 cursor-pointer rounded border-[#e8b8c9] accent-[#c2185b] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c2185b]/30"
                                                />
                                                <label
                                                    htmlFor="termsCheckbox"
                                                    className="ml-3 cursor-pointer text-sm leading-5 text-[#5d4c52]"
                                                >
                                                    I agree to HAGORA's{" "}
                                                    <Link
                                                        to="/terms"
                                                        className="font-semibold text-[#c2185b] underline-offset-2 hover:underline"
                                                    >
                                                        terms
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link
                                                        to="/privacy"
                                                        className="font-semibold text-[#c2185b] underline-offset-2 hover:underline"
                                                    >
                                                        privacy policy
                                                    </Link>
                                                    .
                                                </label>
                                            </div>

                                            {showErr("terms") && (
                                                <p
                                                    id="terms-error"
                                                    className="mt-1.5 text-[13px] text-[#c0392b]"
                                                >
                                                    {errors.terms}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={busy}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c2185b_0%,#880e4f_100%)] text-[15px] font-semibold text-white shadow-lg shadow-[#c2185b]/25 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c2185b]/30 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    )}
                                    {loading
                                        ? "Please wait..."
                                        : isEditMode
                                            ? "Save changes"
                                            : "Create account"}
                                </button>

                                {isEditMode && (
                                    <p className="text-center text-sm text-[#7d6a71]">
                                        <button
                                            type="button"
                                            onClick={() => navigate("/complete-profile")}
                                            className="font-semibold text-[#c2185b] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2185b]/40"
                                        >
                                            ← Back to complete profile
                                        </button>
                                    </p>
                                )}
                            </fieldset>
                        </form>
                    )}

                    <Link
                        to="/"
                        className="mt-10 inline-block text-[13px] font-semibold text-[#7d6a71] hover:text-[#c2185b]"
                    >
                        Back to store
                    </Link>
                </div>
            </section>
        </main>
    );
}