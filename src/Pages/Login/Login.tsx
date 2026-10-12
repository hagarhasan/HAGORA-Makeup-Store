import React, { useState, useEffect } from "react";

import { Helmet } from "react-helmet-async";

import { Link, useNavigate } from "react-router-dom";

import AuthInput from "../../Components/Auth/AuthInput/AuthInput";

import AuthShadePanel, {
    SHADES,
    type Shade,
} from "../../Components/Auth/AuthShadePanel/AuthShadePanel";

import PasswordField from "../../Components/Auth/PasswordField/PasswordField";

import { loginUser, getMe } from "../../api/auth/auth";

import { useAuthContext } from "../../Context/useAuthContext";
import { useToast } from "../../Context/useToast";

type Touched = {
    email?: boolean;
    password?: boolean;
};

export default function Login(): React.JSX.Element {
    const navigate = useNavigate();

    const { login } = useAuthContext();
    const { showToast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [touched, setTouched] = useState<Touched>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const savedShadeName = localStorage.getItem("hagora-shade-name");

    const initialShade =
        SHADES.find((s) => s.name === savedShadeName) || SHADES[1];

    const [active, setActive] = useState<Shade>(initialShade);

    useEffect(() => {
        localStorage.setItem("hagora-shade-name", active.name);
    }, [active.name]);

    const emailError =
        !email
            ? "Enter your email address."
            : !/^\S+@\S+\.\S+$/.test(email)
                ? "Enter a valid email, like name@example.com."
                : "";

    const passwordError = !password
        ? "Enter your password."
        : "";

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setTouched({
            email: true,
            password: true,
        });

        setError("");

        if (emailError || passwordError) {
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser({
                email: email.trim(),
                password,
            });

            localStorage.setItem(
                "hagoraAuth",
                JSON.stringify({
                    user: null,
                    token: response.access_token,
                })
            );

            const me = await getMe();

            const loggedInUser = {
                id: me.id,
                email: me.email,
                first_name: me.first_name,
                last_name: me.last_name,
                username: me.username,
                phone: me.phone,
                city: me.city,
                address: me.address,
                profile_completed: me.profile_completed,
            };

            login(loggedInUser, response.access_token);

            if (me.profile_completed) {
                const firstName = me.first_name?.trim();
                showToast({
                    title: firstName
                        ? `Welcome back, ${firstName} 💗`
                        : "Welcome back to HAGORA 💗",
                    message: "We’re happy to have you back at HAGORA.",
                    type: "welcome",
                    duration: 3000,
                });
                navigate("/");
            } else {
                navigate("/complete-profile");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Email or password is incorrect. Try again or reset your password."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="min-h-screen bg-[linear-gradient(135deg,#fce4ec_0%,#fff0f5_50%,#f8bbd0_100%)] text-[#2b2024] lg:grid lg:grid-cols-[1.05fr_1fr]"
            style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
            }}
        >
            <Helmet>
                <title>Sign in - HAGORA</title>

                <meta
                    name="description"
                    content="Sign in to your HAGORA account"
                />

                <meta
                    name="author"
                    content="HAGORA"
                />

                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />

                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />

                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <AuthShadePanel
                active={active}
                onActiveChange={setActive}
                layout="login"
                title={<></>}
            />

            <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
                <div className="w-full max-w-[400px]">
                    <Link
                        to="/"
                        className="mb-10 inline-block text-xl font-bold tracking-[0.2em] text-[#c2185b] lg:hidden"
                    >
                        HAGORA
                    </Link>

                    <h1
                        className="text-[40px] leading-tight text-[#2b2024]"
                        style={{
                            fontFamily: "'Fraunces', serif",
                            fontWeight: 600,
                        }}
                    >
                        Welcome back
                    </h1>

                    <p className="mt-2 text-[15px] text-[#7d6a71]">
                        New here?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-[#c2185b] underline-offset-4 hover:underline"
                        >
                            Create an account
                        </Link>
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

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-5"
                    >
                        <AuthInput
                            id="email"
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            onBlur={() =>
                                setTouched((current) => ({
                                    ...current,
                                    email: true,
                                }))
                            }
                            invalid={Boolean(
                                touched.email && emailError
                            )}
                            error={emailError}
                            descriptionId="email-error"
                        />

                        <PasswordField
                            id="password"
                            label="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            onBlur={() =>
                                setTouched((current) => ({
                                    ...current,
                                    password: true,
                                }))
                            }
                            placeholder="Your password"
                            autoComplete="current-password"
                            invalid={Boolean(
                                touched.password &&
                                passwordError
                            )}
                            error={passwordError}
                            descriptionId="password-error"
                            rightAction={
                                <Link
                                    to="/forgot-password"
                                    className="text-[13px] font-semibold text-[#c2185b] underline-offset-4 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            }
                        />

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={remember}
                                onChange={(e) =>
                                    setRemember(
                                        e.target.checked
                                    )
                                }
                                className="h-4 w-4 shrink-0 cursor-pointer rounded border-[#e8b8c9] accent-[#c2185b]"
                            />

                            <label
                                htmlFor="rememberMe"
                                className="ml-3 cursor-pointer text-sm text-[#5d4c52]"
                            >
                                Keep me signed in on this device
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c2185b_0%,#880e4f_100%)] text-[15px] font-semibold text-white shadow-lg shadow-[#c2185b]/25 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c2185b]/30 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            )}

                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-10 text-xs leading-5 text-[#a8969c]">
                        By signing in, you agree to HAGORA's{" "}
                        <Link
                            to="/terms"
                            className="underline underline-offset-2 hover:text-[#c2185b]"
                        >
                            terms
                        </Link>{" "}
                        and{" "}
                        <Link
                            to="/privacy"
                            className="underline underline-offset-2 hover:text-[#c2185b]"
                        >
                            privacy policy
                        </Link>
                        .
                    </p>

                    <Link
                        to="/"
                        className="mt-4 inline-block text-[13px] font-semibold text-[#7d6a71] hover:text-[#c2185b]"
                    >
                        Back to store
                    </Link>
                </div>
            </section>
        </main>
    );
}