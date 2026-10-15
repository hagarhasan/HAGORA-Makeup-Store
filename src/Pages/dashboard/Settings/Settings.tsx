import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faEyeSlash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../../Context/useAuthContext";
import { useTheme } from "../../../Context/useTheme";
import {
    getNotificationPreferences,
    updateNotificationPreferences,
    updateProfile,
    type NotificationPreferences,
} from "../../../api/users/users";
import { changePassword } from "../../../api/auth/auth";
import "./Settings.css";

function formatDate(value?: string | Date | null): string {
    if (!value) return "";

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

/* ---------- Password rules & strength ---------- */

const PASSWORD_RULES = [
    { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { id: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { id: "number", label: "One number", test: (p: string) => /\d/.test(p) },
    {
        id: "special",
        label: "One special character",
        test: (p: string) => /[!@#$%^&*(),.?":{}|<>_+=[\]\\/'`;~-]/.test(p),
    },
];

function getStrength(password: string): { level: 0 | 1 | 2 | 3 | 4; label: string } {
    if (!password) return { level: 0, label: "" };

    const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length;

    if (passed <= 2) return { level: 1, label: "Weak" };
    if (passed <= 4) return { level: 2, label: "Fair" };
    if (password.length < 12) return { level: 3, label: "Good" };
    return { level: 4, label: "Strong" };
}

/* ---------- Small password input with show/hide ---------- */

interface PasswordInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    autoComplete: string;
    autoFocus?: boolean;
}

function PasswordInput({ id, label, value, onChange, autoComplete, autoFocus }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="settings-field">
            <label htmlFor={id}>{label}</label>
            <div className="settings-password-wrap">
                <input
                    id={id}
                    className="settings-input"
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                />
                <button
                    type="button"
                    className="settings-eye-button"
                    onClick={() => setVisible((current) => !current)}
                    aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                >
                    <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

/*
 * Who edits what:
 *   My Profile -> name, email, phone, governorate, address
 *   Settings   -> username, appearance, notifications, password
 */
export default function Settings(): React.JSX.Element {
    const { user, updateUser } = useAuthContext();
    const { theme, setTheme } = useTheme();

    // Username
    const [editingUsername, setEditingUsername] = useState(false);
    const [username, setUsername] = useState(user?.username ?? "");
    const [savingUsername, setSavingUsername] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");
    const [usernameError, setUsernameError] = useState("");

    // Notifications
    const [notifications, setNotifications] = useState<NotificationPreferences>({
        orderUpdates: true,
        promotions: false,
        newsletter: false,
    });
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    // Password
    const [editingPassword, setEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        let cancelled = false;

        getNotificationPreferences()
            .then((response) => {
                if (!cancelled) setNotifications(response.preferences);
            })
            .catch(() => {
                if (!cancelled) setStatusMessage("Unable to load notification preferences.");
            })
            .finally(() => {
                if (!cancelled) setLoadingNotifications(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Plain variable so the memo's dependency matches what the compiler infers.
    const usernameChangedAt = user?.username_changed_at ?? null;

    const usernameLock = useMemo(() => {
        if (!usernameChangedAt) {
            return { locked: false, unlockDate: null as Date | null };
        }

        const unlockDate = new Date(usernameChangedAt);
        unlockDate.setDate(unlockDate.getDate() + 60);

        return { locked: new Date() < unlockDate, unlockDate };
    }, [usernameChangedAt]);

    /* ---------- Username ---------- */

    function startEditingUsername() {
        setUsername(user?.username ?? "");
        setUsernameError("");
        setUsernameMessage("");
        setEditingUsername(true);
    }

    function cancelEditingUsername() {
        setEditingUsername(false);
        setUsernameError("");
    }

    async function handleUsernameSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user) return;

        const trimmed = username.trim();
        setUsernameError("");

        if (!/^[a-z0-9._-]{3,30}$/i.test(trimmed)) {
            setUsernameError(
                "Username must be 3–30 characters: letters, numbers, dots, underscores, and hyphens.",
            );
            return;
        }

        if (trimmed.toLowerCase() === (user.username ?? "").toLowerCase()) {
            setEditingUsername(false);
            return;
        }

        setSavingUsername(true);

        try {
            const response = await updateProfile({ username: trimmed });

            updateUser({
                ...user,
                ...response.user,
                // The API response doesn't include the lock date, so set it
                // locally to show the 60-day lock immediately.
                username_changed_at: new Date().toISOString(),
            });
            setEditingUsername(false);
            setUsernameMessage("Username updated successfully.");
        } catch (error) {
            setUsernameError(
                error instanceof Error
                    ? error.message
                    : "Unable to update your username right now.",
            );
        } finally {
            setSavingUsername(false);
        }
    }

    /* ---------- Notifications ---------- */

    async function handleNotificationChange(
        key: keyof NotificationPreferences,
        checked: boolean,
    ) {
        const previous = notifications;
        const updated = { ...notifications, [key]: checked };

        setNotifications(updated);
        setStatusMessage("");

        try {
            await updateNotificationPreferences(updated);
            setStatusMessage("Notification preferences saved.");
        } catch (error) {
            setNotifications(previous);
            setStatusMessage(
                error instanceof Error ? error.message : "Unable to save preferences.",
            );
        }
    }

    /* ---------- Password ---------- */

    const strength = getStrength(newPassword);
    const allRulesPassed = PASSWORD_RULES.every((rule) => rule.test(newPassword));
    const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;
    const canSavePassword =
        currentPassword !== "" && allRulesPassed && passwordsMatch && !savingPassword;

    function resetPasswordForm() {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
    }

    function startEditingPassword() {
        resetPasswordForm();
        setPasswordMessage("");
        setEditingPassword(true);
    }

    function cancelEditingPassword() {
        resetPasswordForm();
        setEditingPassword(false);
    }

    async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordError("");

        if (!canSavePassword) return;

        if (newPassword === currentPassword) {
            setPasswordError("Your new password must be different from the current one.");
            return;
        }

        setSavingPassword(true);

        try {
            const response = await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            });
            resetPasswordForm();
            setEditingPassword(false);
            setPasswordMessage(response.message || "Password updated successfully.");
        } catch (error) {
            setPasswordError(
                error instanceof Error ? error.message : "Unable to change your password.",
            );
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div className="settings-page">
            <div className="settings-heading">
                <p className="settings-eyebrow">PREFERENCES & SECURITY</p>
                <h2>Settings</h2>
                <p>Press Edit next to anything you want to change.</p>
            </div>

            {/* ---------- Account (read-only) ---------- */}
            <section className="settings-card">
                <div className="settings-section-heading">
                    <h3>Account Information</h3>
                    <p>These details are edited from My Profile.</p>
                </div>

                <div className="settings-rows">
                    <div className="settings-row">
                        <div className="settings-row-text">
                            <span className="settings-row-label">Full name</span>
                            <strong>
                                {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
                                    "Not provided"}
                            </strong>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-row-text">
                            <span className="settings-row-label">Email address</span>
                            <strong>{user?.email ?? "Not available"}</strong>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-row-text">
                            <span className="settings-row-label">Phone number</span>
                            <strong>{user?.phone || "Not provided"}</strong>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="settings-row-text">
                            <span className="settings-row-label">Delivery address</span>
                            <strong>{user?.address || "Not provided"}</strong>
                        </div>
                    </div>
                </div>

                <Link to="/dashboard/profile" className="settings-link-button">
                    Edit in My Profile
                </Link>
            </section>

            {/* ---------- Sign-in details ---------- */}
            <section className="settings-card">
                <div className="settings-section-heading">
                    <h3>Sign-in Details</h3>
                    <p>Your username and password.</p>
                </div>

                <div className="settings-rows">
                    {/* Username */}
                    <div className={`settings-row${editingUsername ? " is-editing" : ""}`}>
                        {editingUsername ? (
                            <form
                                className="settings-row-form"
                                onSubmit={handleUsernameSave}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape" && !savingUsername) {
                                        cancelEditingUsername();
                                    }
                                }}
                                noValidate
                            >
                                <div className="settings-field">
                                    <label htmlFor="settings-username">Username</label>
                                    <input
                                        id="settings-username"
                                        className="settings-input"
                                        value={username}
                                        onChange={(event) => {
                                            setUsername(event.target.value);
                                            setUsernameError("");
                                        }}
                                        placeholder="your_username"
                                        autoComplete="username"
                                        autoFocus
                                    />
                                </div>

                                <p className="settings-hint">
                                    You can change your username once every 60 days.
                                </p>

                                {usernameError && (
                                    <p className="settings-message error" role="alert">
                                        {usernameError}
                                    </p>
                                )}

                                <div className="settings-actions">
                                    <button
                                        type="button"
                                        className="settings-cancel-button"
                                        onClick={cancelEditingUsername}
                                        disabled={savingUsername}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="settings-save-button"
                                        disabled={savingUsername}
                                    >
                                        {savingUsername ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="settings-row-text">
                                    <span className="settings-row-label">Username</span>
                                    <strong>{user?.username ? `@${user.username}` : "Not set"}</strong>

                                    {usernameLock.locked && usernameLock.unlockDate && (
                                        <p className="settings-hint">
                                            You can change it again on {formatDate(usernameLock.unlockDate)}.
                                        </p>
                                    )}

                                    {usernameMessage && (
                                        <p className="settings-message success" role="status">
                                            {usernameMessage}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="settings-edit-button"
                                    onClick={startEditingUsername}
                                    disabled={usernameLock.locked || editingPassword}
                                    aria-label="Edit username"
                                >
                                    <FontAwesomeIcon icon={faPen} aria-hidden="true" />
                                    <span>Edit</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Password */}
                    <div className={`settings-row${editingPassword ? " is-editing" : ""}`}>
                        {editingPassword ? (
                            <form
                                className="settings-row-form"
                                onSubmit={handlePasswordChange}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape" && !savingPassword) {
                                        cancelEditingPassword();
                                    }
                                }}
                                noValidate
                            >
                                <PasswordInput
                                    id="settings-current-password"
                                    label="Current password"
                                    value={currentPassword}
                                    onChange={(value) => {
                                        setCurrentPassword(value);
                                        setPasswordError("");
                                    }}
                                    autoComplete="current-password"
                                    autoFocus
                                />

                                <PasswordInput
                                    id="settings-new-password"
                                    label="New password"
                                    value={newPassword}
                                    onChange={(value) => {
                                        setNewPassword(value);
                                        setPasswordError("");
                                    }}
                                    autoComplete="new-password"
                                />

                                {/* Strength meter */}
                                {newPassword && (
                                    <div className="settings-strength" aria-live="polite">
                                        <div className={`settings-strength-bars level-${strength.level}`}>
                                            <span />
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                        <strong className={`settings-strength-label level-${strength.level}`}>
                                            {strength.label}
                                        </strong>
                                    </div>
                                )}

                                {/* Requirements checklist */}
                                <ul className="settings-rules">
                                    {PASSWORD_RULES.map((rule) => {
                                        const ok = rule.test(newPassword);
                                        return (
                                            <li key={rule.id} className={ok ? "ok" : ""}>
                                                <span className="settings-rule-icon" aria-hidden="true">
                                                    {ok && <FontAwesomeIcon icon={faCheck} />}
                                                </span>
                                                {rule.label}
                                            </li>
                                        );
                                    })}
                                </ul>

                                <PasswordInput
                                    id="settings-confirm-password"
                                    label="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(value) => {
                                        setConfirmPassword(value);
                                        setPasswordError("");
                                    }}
                                    autoComplete="new-password"
                                />

                                {confirmPassword && (
                                    <p
                                        className={`settings-message ${passwordsMatch ? "success" : "error"}`}
                                        role="status"
                                    >
                                        {passwordsMatch ? "Passwords match." : "Passwords do not match."}
                                    </p>
                                )}

                                {passwordError && (
                                    <p className="settings-message error" role="alert">
                                        {passwordError}
                                    </p>
                                )}

                                <div className="settings-actions">
                                    <button
                                        type="button"
                                        className="settings-cancel-button"
                                        onClick={cancelEditingPassword}
                                        disabled={savingPassword}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="settings-save-button"
                                        disabled={!canSavePassword}
                                    >
                                        {savingPassword ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="settings-row-text">
                                    <span className="settings-row-label">Password</span>
                                    <strong className="settings-dots">••••••••••</strong>

                                    {passwordMessage && (
                                        <p className="settings-message success" role="status">
                                            {passwordMessage}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="settings-edit-button"
                                    onClick={startEditingPassword}
                                    disabled={editingUsername}
                                    aria-label="Edit password"
                                >
                                    <FontAwesomeIcon icon={faPen} aria-hidden="true" />
                                    <span>Edit</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ---------- Notifications ---------- */}
            <section className="settings-card">
                <div className="settings-section-heading">
                    <h3>Notifications</h3>
                    <p>Changes are saved automatically.</p>
                </div>

                <div className="settings-options">
                    <label className="settings-option">
                        <span>
                            <strong>Order updates</strong>
                            <small>Updates about your purchases.</small>
                        </span>
                        <input
                            type="checkbox"
                            checked={notifications.orderUpdates}
                            disabled={loadingNotifications}
                            onChange={(event) =>
                                handleNotificationChange("orderUpdates", event.target.checked)
                            }
                        />
                    </label>

                    <label className="settings-option">
                        <span>
                            <strong>Promotions and offers</strong>
                            <small>Special offers and discounts.</small>
                        </span>
                        <input
                            type="checkbox"
                            checked={notifications.promotions}
                            disabled={loadingNotifications}
                            onChange={(event) =>
                                handleNotificationChange("promotions", event.target.checked)
                            }
                        />
                    </label>

                    <label className="settings-option">
                        <span>
                            <strong>Newsletter</strong>
                            <small>News about products and updates.</small>
                        </span>
                        <input
                            type="checkbox"
                            checked={notifications.newsletter}
                            disabled={loadingNotifications}
                            onChange={(event) =>
                                handleNotificationChange("newsletter", event.target.checked)
                            }
                        />
                    </label>
                </div>

                {statusMessage && (
                    <p className="settings-message success" role="status">
                        {statusMessage}
                    </p>
                )}
            </section>

            {/* ---------- Appearance / Theme ---------- */}
            <section className="settings-card">
                <div className="settings-section-heading">
                    <h3>Appearance</h3>
                    <p>Choose your preferred theme for the store and dashboard.</p>
                </div>

                <div className="settings-theme-grid">
                    <button
                        type="button"
                        className={`settings-theme-option ${theme === "light" ? "is-selected" : ""}`}
                        onClick={() => setTheme("light")}
                        aria-pressed={theme === "light"}
                    >
                        <div className="settings-theme-card-header">
                            <span className="settings-theme-icon light-icon" aria-hidden="true">☀️</span>
                            <div className="settings-theme-labels">
                                <strong>Light Mode</strong>
                                <small>Clean and bright with soft rose accents</small>
                            </div>
                            <span className="settings-theme-radio" aria-hidden="true">
                                {theme === "light" && <FontAwesomeIcon icon={faCheck} />}
                            </span>
                        </div>
                        <div className="settings-theme-mini-preview light">
                            <div className="mini-nav"></div>
                            <div className="mini-body">
                                <div className="mini-sidebar"></div>
                                <div className="mini-content">
                                    <div className="mini-bar"></div>
                                    <div className="mini-boxes">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        className={`settings-theme-option ${theme === "dark" ? "is-selected" : ""}`}
                        onClick={() => setTheme("dark")}
                        aria-pressed={theme === "dark"}
                    >
                        <div className="settings-theme-card-header">
                            <span className="settings-theme-icon dark-icon" aria-hidden="true">🌙</span>
                            <div className="settings-theme-labels">
                                <strong>Dark Mode</strong>
                                <small>Velvet plum & dark rose, easy on the eyes</small>
                            </div>
                            <span className="settings-theme-radio" aria-hidden="true">
                                {theme === "dark" && <FontAwesomeIcon icon={faCheck} />}
                            </span>
                        </div>
                        <div className="settings-theme-mini-preview dark">
                            <div className="mini-nav"></div>
                            <div className="mini-body">
                                <div className="mini-sidebar"></div>
                                <div className="mini-content">
                                    <div className="mini-bar"></div>
                                    <div className="mini-boxes">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );
}