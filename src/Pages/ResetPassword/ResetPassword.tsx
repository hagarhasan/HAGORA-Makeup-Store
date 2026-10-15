import React, { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/auth/auth";
import ThemeToggle from "../../Components/ThemeToggle/ThemeToggle";

export default function ResetPassword(): React.JSX.Element {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid or missing password reset token.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await resetPassword({
                token,
                new_password: password,
            });

            setSuccess(true);
            setPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen bg-[linear-gradient(135deg,#fce4ec_0%,#fff0f5_50%,#f8bbd0_100%)] text-[#2b2024]">
            <div className="absolute right-5 top-5 z-20">
                <ThemeToggle />
            </div>
            <Helmet>
                <title>Reset password - HAGORA</title>
                <meta
                    name="description"
                    content="Set a new password for your HAGORA account"
                />
            </Helmet>

            <section className="flex min-h-screen items-center justify-center px-5 py-10">
                <div className="w-full max-w-[420px]">
                    <h1
                        className={`logo mb-8 inline-block text-4xl font-extrabold tracking-[0.2em]  ${loading ? "pointer-events-none opacity-70" : ""
                            }`}
                    >
                        HAGORA
                    </h1>

                    {success ? (
                        <>
                            <h1
                                className="text-[40px] leading-tight text-[#357a3f]"
                                style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 600,
                                }}
                            >
                                Password reset
                            </h1>
                            <p className="mt-2 text-[15px] text-[#7d6a71]">
                                Your password has been successfully reset. You can now use your new password to log in to your account.
                            </p>

                            <Link
                                to="/login"
                                className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c2185b_0%,#880e4f_100%)] text-[15px] font-semibold text-white shadow-lg shadow-[#c2185b]/25 transition hover:brightness-110"
                            >
                                Back to sign in
                            </Link>
                        </>
                    ) : (
                        <>
                            <h1
                                className="text-[40px] leading-tight"
                                style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 600,
                                }}
                            >
                                Create new password
                            </h1>

                            <p className="mt-2 text-[15px] text-[#7d6a71]">
                                Enter your new password below to regain access to your account.
                            </p>

                            {error && (
                                <div className="mt-6 rounded-xl border border-[#f0b9bf] bg-[#fff1f2] px-4 py-3 text-sm text-[#9b2c3b]">
                                    {error}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        New password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="At least 8 characters"
                                            autoComplete="new-password"
                                            className="h-12 w-full rounded-xl border border-[#ead8df] bg-white px-4 text-[15px] outline-none transition placeholder:text-[#b9aab0] focus:border-[#c2185b] focus:ring-4 focus:ring-[#c2185b]/15 pr-16"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#c2185b] hover:underline"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Confirm new password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(e.target.value)
                                            }
                                            placeholder="Must match new password"
                                            autoComplete="new-password"
                                            className="h-12 w-full rounded-xl border border-[#ead8df] bg-white px-4 text-[15px] outline-none transition placeholder:text-[#b9aab0] focus:border-[#c2185b] focus:ring-4 focus:ring-[#c2185b]/15 pr-16"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#c2185b] hover:underline"
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c2185b_0%,#880e4f_100%)] text-[15px] font-semibold text-white shadow-lg shadow-[#c2185b]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    )}

                                    {loading
                                        ? "Resetting..."
                                        : "Reset password"}
                                </button>
                            </form>

                            <Link
                                to="/login"
                                className={`mt-8 inline-block text-sm font-semibold text-[#c2185b] hover:underline ${loading ? "pointer-events-none opacity-70" : ""
                                    }`}
                            >
                                Back to sign in
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
