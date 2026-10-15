import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../Components/Auth/AuthInput/AuthInput";
import AuthSelect from "../../Components/Auth/AuthSelect/AuthSelect";
import AuthShadePanel from "../../Components/Auth/AuthShadePanel/AuthShadePanel";
import { SHADES, type Shade } from "../../types/shade";
import { updateProfile } from "../../api/users/users";
import { useAuthContext } from "../../Context/useAuthContext";
import { useToast } from "../../Context/useToast";
import ThemeToggle from "../../Components/ThemeToggle/ThemeToggle";
import { getMe } from "../../api/auth/auth";
import { getGovernorates } from "../../api/orders/orders";

type Field = "username" | "phone" | "governorate" | "address";
type Touched = Partial<Record<Field, boolean>>;

const FIELD_ORDER: Field[] = ["username", "phone", "governorate", "address"];

function SectionTitle({ step, children }: { step: number; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c2185b]/10 text-sm font-bold text-[#c2185b]">
                {step}
            </span>
            <h2 className="text-[15px] font-semibold uppercase tracking-wide text-[#5b4a51]">
                {children}
            </h2>
        </div>
    );
}

export default function CompleteProfile(): React.JSX.Element {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthContext();
    const { showToast } = useToast();

    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [governorate, setGovernorate] = useState("");
    const [address, setAddress] = useState("");
    const [governorateOptions, setGovernorateOptions] = useState<
        { value: string; label: string }[]
    >([]);

    const [touched, setTouched] = useState<Touched>({});
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [govError, setGovError] = useState(false);

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

    useEffect(() => {
        let cancelled = false;

        async function checkProfile() {
            try {
                const me = await getMe();
                if (cancelled) return;

                if (me.profile_completed) {
                    // Sync the context with the backend BEFORE leaving. If the
                    // locally stored user is stale, a route guard would see
                    // profileCompleted === false and bounce us straight back
                    // here, which loops and spams GET /me.
                    updateUser({ ...me, profile_completed: true });
                    navigate("/");
                    return;
                }

                setUsername(me.username ?? "");
                setPhone(me.phone ?? "");
                setGovernorate(me.governorate ?? "");
                setAddress(me.address ?? "");
                setInitializing(false);
            } catch {
                if (!cancelled) navigate("/login");
            }
        }

        void checkProfile();
        return () => {
            cancelled = true;
        };
        // updateUser is intentionally omitted: this must run once on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const fetchGovernorateOptions = async () => {
        const response = await getGovernorates();
        return response.governorates.map((item) => ({
            value: item.code,
            label: `${item.name_en} (${item.name_ar})`,
        }));
    };

    useEffect(() => {
        let cancelled = false;

        fetchGovernorateOptions()
            .then((options) => {
                if (!cancelled) setGovernorateOptions(options);
            })
            .catch(() => {
                if (!cancelled) setGovError(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const retryGovernorates = () => {
        setGovError(false);
        fetchGovernorateOptions()
            .then(setGovernorateOptions)
            .catch(() => setGovError(true));
    };

    const errors: Record<Field, string> = {
        username:
            username.trim().length < 3
                ? "Username must be at least 3 characters."
                : !/^[a-zA-Z0-9_.]+$/.test(username.trim())
                    ? "Use only letters, numbers, dots and underscores."
                    : "",

        phone: !phone
            ? "Enter your phone number."
            : !/^01[0125]\d{8}$/.test(phone)
                ? "Enter a valid Egyptian mobile number (e.g. 01012345678)."
                : "",

        governorate: !governorate ? "Select your governorate." : "",
        address:
            address.trim().length < 5
                ? "Enter your full delivery address."
                : "",
    };

    const completedCount = useMemo(
        () => FIELD_ORDER.filter((f) => !errors[f]).length,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [username, phone, governorate, address],
    );
    const progress = (completedCount / FIELD_ORDER.length) * 100;

    const touch = (field: Field) =>
        setTouched((current) => ({ ...current, [field]: true }));

    const showErr = (field: Field) => Boolean(touched[field] && errors[field]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        setTouched({
            username: true,
            phone: true,
            governorate: true,
            address: true,
        });
        setError("");

        const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
        if (firstInvalid) {
            document.getElementById(firstInvalid)?.focus();
            return;
        }

        setLoading(true);

        try {
            const response = await updateProfile({
                username: username.trim(),
                phone: phone.trim(),
                governorate: governorate.trim(),
                city: governorate.trim(),
                address: address.trim(),
            });

            updateUser({
                ...response.user,
                first_name: user?.first_name ?? "",
                last_name: user?.last_name ?? "",
                governorate: response.user.governorate ?? governorate.trim(),
                profile_completed: true,
            });

            const userFirstName =
                user?.first_name?.trim() || response.user.first_name?.trim() || "";
            showToast({
                title: userFirstName
                    ? `Welcome to HAGORA, ${userFirstName}! ✨`
                    : "Welcome to HAGORA! ✨",
                message: "Your beauty journey starts here.",
                type: "register",
                duration: 3000,
            });

            navigate("/");
        } catch (err) {
            setError(
                err instanceof Error && err.message
                    ? err.message
                    : "We couldn't save your profile. Check your details and try again.",
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="relative min-h-screen bg-[linear-gradient(135deg,#fce4ec_0%,#fff0f5_50%,#f8bbd0_100%)] text-[#2b2024] lg:grid lg:grid-cols-[1fr_1.05fr]"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
            <div className="absolute right-5 top-5 z-20">
                <ThemeToggle />
            </div>
            <Helmet>
                <title>Complete Profile - HAGORA</title>
                <meta name="description" content="Complete your HAGORA profile" />
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
                        Almost
                        <br />
                        there.
                    </>
                }
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
                        className="mb-6 inline-block text-xl font-bold tracking-[0.2em] text-[#c2185b] lg:hidden"
                    >
                        HAGORA
                    </Link>

                    <h1
                        className="text-[34px] leading-tight sm:text-[38px]"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                    >
                        Complete your profile
                    </h1>

                    <p className="mt-2 text-[15px] text-[#7d6a71]">
                        Just a few details and you're ready to shop.
                    </p>

                    {/* Progress */}
                    <div className="mt-5">
                        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#7d6a71]">
                            <span>Profile completion</span>
                            <span>
                                {completedCount}/{FIELD_ORDER.length}
                            </span>
                        </div>
                        <div
                            className="h-1.5 w-full overflow-hidden rounded-full bg-[#c2185b]/10"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(progress)}
                            aria-label="Profile completion"
                        >
                            <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,#c2185b,#880e4f)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

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

                    {initializing ? (
                        <div className="mt-8 space-y-5" aria-busy="true" aria-label="Loading your profile">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 w-24 animate-pulse rounded bg-[#c2185b]/10" />
                                    <div className="h-12 w-full animate-pulse rounded-xl bg-[#c2185b]/10" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                            {/* Section 1: Account */}
                            <fieldset className="space-y-4" disabled={loading}>
                                <legend className="sr-only">Account details</legend>
                                <SectionTitle step={1}>Contact</SectionTitle>

                                <AuthInput
                                    id="username"
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={() => touch("username")}
                                    placeholder="e.g. abdelrahman_k"
                                    autoComplete="username"
                                    invalid={showErr("username")}
                                    error={errors.username}
                                    descriptionId="username-error"
                                />

                                <AuthInput
                                    id="phone"
                                    label="Phone number"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                                    }
                                    onBlur={() => touch("phone")}
                                    placeholder="01xxxxxxxxx"
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    invalid={showErr("phone")}
                                    error={errors.phone}
                                    descriptionId="phone-error"
                                />
                            </fieldset>

                            {/* Section 2: Delivery */}
                            <fieldset className="space-y-4" disabled={loading}>
                                <legend className="sr-only">Delivery address</legend>
                                <SectionTitle step={2}>Delivery</SectionTitle>

                                <AuthSelect
                                    id="governorate"
                                    label="Governorate"
                                    value={governorate}
                                    onChange={(e) => setGovernorate(e.target.value)}
                                    onBlur={() => touch("governorate")}
                                    invalid={showErr("governorate")}
                                    error={errors.governorate}
                                    descriptionId="governorate-error"
                                    placeholder="Select your governorate"
                                    options={governorateOptions}
                                />

                                {govError && (
                                    <p className="text-sm text-[#9b2c3b]" role="alert">
                                        Couldn't load governorates.{" "}
                                        <button
                                            type="button"
                                            onClick={retryGovernorates}
                                            className="font-semibold underline underline-offset-2"
                                        >
                                            Try again
                                        </button>
                                    </p>
                                )}

                                <AuthInput
                                    id="address"
                                    label="Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onBlur={() => touch("address")}
                                    placeholder="Street, building, apartment"
                                    autoComplete="street-address"
                                    invalid={showErr("address")}
                                    error={errors.address}
                                    descriptionId="address-error"
                                />
                            </fieldset>

                            <div className="space-y-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c2185b_0%,#880e4f_100%)] text-[15px] font-semibold text-white shadow-lg shadow-[#c2185b]/25 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c2185b]/30 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    )}
                                    {loading ? "Saving..." : "Save & continue"}
                                </button>

                                <p className="text-center text-sm text-[#7d6a71]">
                                    Need to change your name or email?{" "}
                                    <button
                                        type="button"
                                        onClick={() => navigate("/register")}
                                        className="font-semibold text-[#c2185b] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2185b]/40"
                                    >
                                        Edit account information
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}