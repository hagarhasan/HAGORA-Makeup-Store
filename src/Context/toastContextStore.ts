import { createContext } from "react";

export type ToastType = "welcome" | "register" | "success" | "info";

export type ToastOptions = {
    title: string;
    message?: string;
    type?: ToastType;
    duration?: number;
};

export type ToastContextType = {
    showToast: (options: ToastOptions) => void;
    hideToast: () => void;
};

export const ToastContext = createContext<ToastContextType>({
    showToast: () => undefined,
    hideToast: () => undefined,
});
