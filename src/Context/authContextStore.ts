import { createContext } from "react";
import type { User } from "../types/user";

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    profileCompleted: boolean;
    login: (user: User, token: string) => void;
    updateUser: (user: User) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    profileCompleted: false,
    login: () => undefined,
    updateUser: () => undefined,
    logout: () => undefined,
});