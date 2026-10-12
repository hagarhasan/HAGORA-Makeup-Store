import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client/client";

export default function ForgotPassword(): React.JSX.Element {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest<{ message: string }>(
                "/forgot-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            setMessage(response.message);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,#fce4ec_0%,#fff0f5_50%,#f8bbd0_100%)] text-[#2b2024]">
            <Helmet>
                <title>Forgot password - HAGORA</title>
                <meta
                    name="description"
                    content="Reset your HAGORA account password"
                />
            </Helmet>

            <section className="flex min-h-screen items-center justify-center px-5 py-10">
                <div className="w-full max-w-[420px]">
                    <Link
                        to="/"
                        className="logo mb-8 inline-block text-xl font-bold tracking-[0.2em] "
                    >
                        HAGORA
                    </Link>

                    <h1
                        className="text-[40px] leading-tight"
                        style={{
                            fontFamily: "'Fraunces', serif",
                            fontWeight: 600,
                        }}
                    >
                        Forgot your password?
                    </h1>

                    <p className="mt-2 text-[15px] text-[#7d6a71]">
                        Enter your email and we'll help you reset your
                        password.
                    </p>

                    {message && (
                        <div className="mt-6 rounded-xl border border-[#b8d9bd] bg-[#f0faf2] px-4 py-3 text-sm text-[#357a3f]">
                            {message}
                        </div>
                    )}

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
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="name@example.com"
                                autoComplete="email"
                                className="h-12 w-full rounded-xl border border-[#ead8df] bg-white px-4 text-[15px] outline-none transition placeholder:text-[#b9aab0] focus:border-[#c2185b] focus:ring-4 focus:ring-[#c2185b]/15"
                            />
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
                                ? "Sending..."
                                : "Send reset link"}
                        </button>
                    </form>

                    <Link
                        to="/login"
                        className="mt-8 inline-block text-sm font-semibold text-[#c2185b] hover:underline"
                    >
                        Back to sign in
                    </Link>
                </div>
            </section>
        </main>
    );
}