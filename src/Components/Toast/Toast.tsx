import React from "react";
import type { ToastType } from "../../Context/toastContextStore";
import "./Toast.css";

interface ToastProps {
    title: string;
    message?: string;
    type?: ToastType;
    isExiting?: boolean;
    onClose: () => void;
}

export default function Toast({
    title,
    message,
    type = "welcome",
    isExiting = false,
    onClose,
}: ToastProps): React.JSX.Element {
    const icon = type === "register" ? "✨" : type === "welcome" ? "💗" : "✨";

    return (
        <div className="hagora-toast-container" role="region" aria-label="Notifications">
            <div
                className={`hagora-toast ${isExiting ? "exiting" : ""}`}
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                <div className="hagora-toast-icon-wrap" aria-hidden="true">
                    <span>{icon}</span>
                </div>

                <div className="hagora-toast-body">
                    <p className="hagora-toast-title">{title}</p>
                    {message && <p className="hagora-toast-message">{message}</p>}
                </div>

                <button
                    type="button"
                    className="hagora-toast-close"
                    onClick={onClose}
                    aria-label="Dismiss notification"
                >
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
