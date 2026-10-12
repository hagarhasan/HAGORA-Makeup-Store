import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { AuthContext } from "./authContextStore";
import type { User } from "../types/user";

type SavedAuth = {
    user: User | null;
    token: string | null;
};

type AuthProviderProps = {
    children: ReactNode;
};

const STORAGE_KEY = "hagoraAuth";

// Read + parse localStorage once (previously it was read and parsed twice).
function readSavedAuth(): SavedAuth {
    if (typeof window === "undefined") {
        return { user: null, token: null };
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { user: null, token: null };

        const parsed = JSON.parse(raw) as Partial<SavedAuth>;
        return {
            user: parsed.user ?? null,
            token: parsed.token ?? null,
        };
    } catch {
        return { user: null, token: null };
    }
}

export function AuthProvider({
    children,
}: AuthProviderProps): React.JSX.Element {
    const [initialAuth] = useState(readSavedAuth);

    const [user, setUser] = useState<User | null>(initialAuth.user);
    const [token, setToken] = useState<string | null>(initialAuth.token);

    const isAuthenticated = Boolean(user && token);

    const profileCompleted = Boolean(
        user?.username &&
        user?.phone &&
        user?.governorate &&
        user?.city &&
        user?.address
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            if (user && token) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ user, token } satisfies SavedAuth)
                );
                return;
            }

            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* storage unavailable (private mode, quota) */
        }
    }, [user, token]);

    // Clear the session on 401 and keep multiple tabs in sync.
    useEffect(() => {
        function clearInvalidSession() {
            setUser(null);
            setToken(null);
        }

        function syncSession(event: StorageEvent) {
            if (event.key !== STORAGE_KEY) return;

            if (!event.newValue) {
                clearInvalidSession();
                return;
            }

            try {
                const savedAuth = JSON.parse(event.newValue) as SavedAuth;
                setUser(savedAuth.user ?? null);
                setToken(savedAuth.token ?? null);
            } catch {
                clearInvalidSession();
            }
        }

        window.addEventListener("hagora:unauthorized", clearInvalidSession);
        window.addEventListener("storage", syncSession);

        return () => {
            window.removeEventListener("hagora:unauthorized", clearInvalidSession);
            window.removeEventListener("storage", syncSession);
        };
    }, []);

    const login = useCallback((nextUser: User, nextToken: string) => {
        setUser(nextUser);
        setToken(nextToken);

        // Written immediately (not only in the effect above) on purpose:
        // the API layer reads the token from localStorage, and the next
        // request can fire before the effect runs.
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ user: nextUser, token: nextToken })
            );
        } catch {
            /* ignore */
        }
    }, []);

    const updateUser = useCallback((nextUser: User) => {
        setUser((current) => {
            if (!current) {
                return nextUser;
            }

            return {
                ...current,
                ...nextUser,
                id: nextUser.id ?? current.id,
            };
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    // Stable context value: consumers only re-render when something
    // they read actually changes.
    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated,
            profileCompleted,
            login,
            updateUser,
            logout,
        }),
        [user, token, isAuthenticated, profileCompleted, login, updateUser, logout]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}