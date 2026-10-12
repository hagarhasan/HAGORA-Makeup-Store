export type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    username_changed_at?: string | null;
    next_username_change_at?: string | null;
    phone: string | null;
    governorate?: string | null;
    city: string | null;
    address: string | null;
    profile_completed: boolean;
};