import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import {
    ToastContext,
    type ToastOptions,
    type ToastType,
} from "./toastContextStore";
import Toast from "../Components/Toast/Toast";

interface ActiveToast {
    id: number;
    title: string;
    message?: string;
    type?: ToastType;
    duration: number;
    isExiting: boolean;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): React.JSX.Element {
    const [toast, setToast] = useState<ActiveToast | null>(null);
    const dismissTimerRef = useRef<number | null>(null);
    const exitTimerRef = useRef<number | null>(null);

    const clearTimers = useCallback(() => {
        if (dismissTimerRef.current !== null) {
            window.clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = null;
        }
        if (exitTimerRef.current !== null) {
            window.clearTimeout(exitTimerRef.current);
            exitTimerRef.current = null;
        }
    }, []);

    const hideToast = useCallback(() => {
        clearTimers();
        setToast((current) => (current ? { ...current, isExiting: true } : null));

        exitTimerRef.current = window.setTimeout(() => {
            setToast(null);
            exitTimerRef.current = null;
        }, 300);
    }, [clearTimers]);

    const showToast = useCallback(
        (options: ToastOptions) => {
            clearTimers();

            const duration = options.duration ?? 3000;
            const newToast: ActiveToast = {
                id: Date.now(),
                title: options.title,
                message: options.message,
                type: options.type ?? "welcome",
                duration,
                isExiting: false,
            };

            setToast(newToast);

            dismissTimerRef.current = window.setTimeout(() => {
                setToast((current) => (current ? { ...current, isExiting: true } : null));

                exitTimerRef.current = window.setTimeout(() => {
                    setToast(null);
                    exitTimerRef.current = null;
                }, 300);

                dismissTimerRef.current = null;
            }, duration);
        },
        [clearTimers]
    );

    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, [clearTimers]);

    const value = useMemo(
        () => ({
            showToast,
            hideToast,
        }),
        [showToast, hideToast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toast && (
                <Toast
                    key={toast.id}
                    title={toast.title}
                    message={toast.message}
                    type={toast.type}
                    isExiting={toast.isExiting}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
}
