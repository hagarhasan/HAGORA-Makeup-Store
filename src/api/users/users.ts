import { apiRequest } from "../client/client";

export type ProfileData = {
    username?: string;
    phone?: string;
    governorate?: string;
    city?: string;
    address?: string;
};

export type ProfileResponse = {
    message: string;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        username: string | null;
        phone: string | null;
        governorate: string | null;
        city: string | null;
        address: string | null;
        username_changed_at?: string | null;
        next_username_change_at?: string | null;
    };
};

export async function updateProfile(
    data: ProfileData
): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>("/me/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export type BasicProfileData = {
    first_name: string;
    last_name: string;
    email: string;
};

export type BasicProfileResponse = {
    message: string;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
};

export async function updateBasicProfile(
    data: BasicProfileData
): Promise<BasicProfileResponse> {
    return apiRequest<BasicProfileResponse>("/me/basic-profile", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export type NotificationPreferences = {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
};

export async function getNotificationPreferences(): Promise<{ preferences: NotificationPreferences }> {
    return apiRequest<{ preferences: NotificationPreferences }>("/me/notification-preferences");
}

export async function updateNotificationPreferences(
    preferences: NotificationPreferences,
): Promise<{ message: string; preferences: NotificationPreferences }> {
    return apiRequest<{ message: string; preferences: NotificationPreferences }>("/me/notification-preferences", {
        method: "PUT",
        body: JSON.stringify(preferences),
    });
}