import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../../Context/useAuthContext";
import { updateBasicProfile, updateProfile } from "../../../api/users/users";
import { getGovernorates } from "../../../api/orders/orders";
import type { User } from "../../../types/user";
import "./MyProfile.css";
import { useEffect } from "react";

type FieldKey =
    | "first_name"
    | "last_name"
    | "email"
    | "phone"
    | "governorate"
    | "address";

type Feedback = { key: FieldKey; type: "success" | "error"; text: string } | null;

type GovernorateOption = { value: string; label: string };

function isProfileComplete(u: User): boolean {
    return Boolean(u.username && u.phone && u.governorate && u.city && u.address);
}

/** Returns an error message, or "" when the value is valid. */
function validate(key: FieldKey, value: string): string {
    switch (key) {
        case "first_name":
            return value.length < 2 ? "Enter your first name." : "";
        case "last_name":
            return value.length < 2 ? "Enter your last name." : "";
        case "email":
            return /^\S+@\S+\.\S+$/.test(value)
                ? ""
                : "Enter a valid email, like name@example.com.";
        case "phone":
            return /^01[0125]\d{8}$/.test(value)
                ? ""
                : "Enter a valid Egyptian mobile number (e.g. 01012345678).";
        case "governorate":
            return value ? "" : "Select your governorate.";
        case "address":
            return value.length < 5 ? "Enter your full delivery address." : "";
    }
}

interface FieldRowProps {
    label: string;
    value: string;
    editing: boolean;
    saving: boolean;
    locked: boolean; // another field is being edited / saved
    error?: string;
    success?: string;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    children: React.ReactNode; // the input shown while editing
}

function FieldRow({
    label,
    value,
    editing,
    saving,
    locked,
    error,
    success,
    onEdit,
    onCancel,
    onSave,
    children,
}: FieldRowProps) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSave();
    }

    return (
        <div className={`profile-row${editing ? " is-editing" : ""}`}>
            {editing ? (
                <form
                    className="profile-row-form"
                    onSubmit={handleSubmit}
                    onKeyDown={(event) => {
                        if (event.key === "Escape" && !saving) onCancel();
                    }}
                    noValidate
                >
                    <label className="profile-row-label">{label}</label>
                    {children}
                    {error && (
                        <p className="profile-message error" role="alert">
                            {error}
                        </p>
                    )}
                    <div className="profile-actions">
                        <button
                            type="button"
                            className="profile-cancel-button"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="profile-save-button" disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="profile-row-text">
                        <span className="profile-row-label">{label}</span>
                        <strong className={value ? "" : "is-empty"}>{value || "Not provided"}</strong>
                        {success && (
                            <p className="profile-message success" role="status">
                                {success}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        className="profile-edit-button"
                        onClick={onEdit}
                        disabled={locked}
                        aria-label={`Edit ${label.toLowerCase()}`}
                    >
                        <FontAwesomeIcon icon={faPen} aria-hidden="true" />
                        <span>Edit</span>
                    </button>
                </>
            )}
        </div>
    );
}

export default function MyProfile(): React.JSX.Element {
    const { user, updateUser } = useAuthContext();

    const [governorateOptions, setGovernorateOptions] = useState<GovernorateOption[]>([]);
    const [editing, setEditing] = useState<FieldKey | null>(null);
    const [draft, setDraft] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState<Feedback>(null);

    useEffect(() => {
        let cancelled = false;

        getGovernorates()
            .then((response) => {
                if (cancelled) return;
                setGovernorateOptions(
                    response.governorates.map((item) => ({
                        value: item.code,
                        label: `${item.name_en} (${item.name_ar})`,
                    })),
                );
            })
            .catch(() => {
                /* The select falls back to the stored value. */
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const fullName =
        [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Your Name";

    const initials =
        fullName
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("") || "U";

    function currentValue(key: FieldKey): string {
        return (user?.[key] as string | undefined | null) ?? "";
    }

    function governorateLabel(code: string): string {
        return governorateOptions.find((item) => item.value === code)?.label ?? code;
    }

    function startEditing(key: FieldKey) {
        setEditing(key);
        setDraft(currentValue(key));
        setError("");
        setFeedback(null);
    }

    function cancelEditing() {
        setEditing(null);
        setError("");
    }

    async function save() {
        if (!user || !editing) return;

        const key = editing;
        const value = draft.trim();

        const problem = validate(key, value);
        if (problem) {
            setError(problem);
            return;
        }

        if (value === currentValue(key)) {
            setEditing(null);
            return;
        }

        setSaving(true);
        setError("");

        try {
            let nextUser: User = { ...user };

            if (key === "first_name" || key === "last_name" || key === "email") {
                // The basic-profile endpoint takes all three together.
                const response = await updateBasicProfile({
                    first_name: key === "first_name" ? value : (user.first_name ?? ""),
                    last_name: key === "last_name" ? value : (user.last_name ?? ""),
                    email: key === "email" ? value : user.email,
                });
                nextUser = { ...nextUser, ...response.user };
            } else if (key === "phone") {
                const response = await updateProfile({ phone: value });
                nextUser = { ...nextUser, ...response.user };
            } else if (key === "governorate") {
                // Shipping is priced by governorate, so it is also stored as the city.
                const response = await updateProfile({
                    governorate: value,
                    city: value,
                    address: user.address ?? "",
                });
                nextUser = { ...nextUser, ...response.user };
            } else {
                const response = await updateProfile({
                    governorate: user.governorate ?? "",
                    city: user.governorate ?? "",
                    address: value,
                });
                nextUser = { ...nextUser, ...response.user };
            }

            nextUser.profile_completed = isProfileComplete(nextUser);
            updateUser(nextUser);

            setEditing(null);
            setFeedback({ key, type: "success", text: "Saved." });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save your changes.");
        } finally {
            setSaving(false);
        }
    }

    // Shared props for every row.
    function rowProps(key: FieldKey, label: string, display: string) {
        return {
            label,
            value: display,
            editing: editing === key,
            saving,
            locked: editing !== null || saving,
            error: editing === key ? error : "",
            success: feedback?.key === key && feedback.type === "success" ? feedback.text : "",
            onEdit: () => startEditing(key),
            onCancel: cancelEditing,
            onSave: save,
        };
    }

    const governorateMissingFromOptions =
        draft && !governorateOptions.some((item) => item.value === draft);

    return (
        <div className="my-profile">
            <div className="profile-page-heading">
                <div>
                    <p className="profile-eyebrow">ACCOUNT INFORMATION</p>
                    <h2>My Profile</h2>
                    <p className="profile-description">
                        Press Edit next to anything you want to change.
                    </p>
                </div>

                <span className="profile-status">
                    <span className="profile-status-dot" />
                    Customer Account
                </span>
            </div>

            <section className="profile-card">
                <div className="profile-card-heading">
                    <div className="profile-avatar">{initials}</div>

                    <div className="profile-user-summary">
                        <h3>{fullName}</h3>
                        <p>{user?.email}</p>
                        <span>{user?.username ? `@${user.username}` : "Customer"}</span>
                    </div>
                </div>
            </section>

            <section className="profile-card">
                <div className="profile-section-heading">
                    <h3>Personal Information</h3>
                    <p>
                        To change your username, password or notifications, go to{" "}
                        <Link to="/dashboard/settings">Settings</Link>.
                    </p>
                </div>

                <div className="profile-rows">
                    <FieldRow {...rowProps("first_name", "First name", currentValue("first_name"))}>
                        <input
                            className="profile-input"
                            type="text"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="First name"
                            autoComplete="given-name"
                            autoFocus
                        />
                    </FieldRow>

                    <FieldRow {...rowProps("last_name", "Last name", currentValue("last_name"))}>
                        <input
                            className="profile-input"
                            type="text"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="Last name"
                            autoComplete="family-name"
                            autoFocus
                        />
                    </FieldRow>

                    <FieldRow {...rowProps("email", "Email address", currentValue("email"))}>
                        <input
                            className="profile-input"
                            type="email"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="name@example.com"
                            autoComplete="email"
                            autoFocus
                        />
                    </FieldRow>

                    <FieldRow {...rowProps("phone", "Phone number", currentValue("phone"))}>
                        <input
                            className="profile-input"
                            type="tel"
                            inputMode="numeric"
                            value={draft}
                            onChange={(event) =>
                                setDraft(event.target.value.replace(/\D/g, "").slice(0, 11))
                            }
                            placeholder="01xxxxxxxxx"
                            autoComplete="tel"
                            autoFocus
                        />
                    </FieldRow>
                </div>
            </section>

            <section className="profile-card">
                <div className="profile-section-heading">
                    <h3>Delivery Information</h3>
                    <p>Shipping cost is calculated by your governorate.</p>
                </div>

                <div className="profile-rows">
                    <FieldRow
                        {...rowProps(
                            "governorate",
                            "Governorate",
                            governorateLabel(currentValue("governorate")),
                        )}
                    >
                        <select
                            className="profile-input"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            autoFocus
                        >
                            <option value="">Select your governorate</option>
                            {governorateMissingFromOptions && <option value={draft}>{draft}</option>}
                            {governorateOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </FieldRow>

                    <FieldRow {...rowProps("address", "Street address", currentValue("address"))}>
                        <textarea
                            className="profile-input"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="Street, building, apartment"
                            autoComplete="street-address"
                            rows={3}
                            autoFocus
                        />
                    </FieldRow>
                </div>
            </section>
        </div>
    );
}