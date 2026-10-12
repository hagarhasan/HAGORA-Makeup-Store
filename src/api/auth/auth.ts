
import { apiRequest } from "../client/client";

export type RegisterData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

export type LoginData = {
    email: string;
    password: string;
};

export type AuthResponse = {
    message: string;
    access_token: string;
    token_type: string;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
};

export async function registerUser(
    data: RegisterData
): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function loginUser(
    data: LoginData
): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export type MeResponse = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    phone: string | null;
    governorate: string | null;
    city: string | null;
    address: string | null;
    profile_completed: boolean;
};

export async function getMe(): Promise<MeResponse> {
    return apiRequest<MeResponse>("/me");
}
export type ResetPasswordData = {
    token: string;
    new_password: string;
};

export async function resetPassword(
    data: ResetPasswordData
): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export type ChangePasswordData = {
    current_password: string;
    new_password: string;
};

export async function changePassword(
    data: ChangePasswordData
): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/me/password", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}
