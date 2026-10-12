const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

type SavedAuth = {
    user: unknown;
    token: string | null;
};

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const savedAuth = localStorage.getItem("hagoraAuth");

    let token: string | null = null;

    if (savedAuth) {
        try {
            const parsed = JSON.parse(savedAuth) as SavedAuth;
            token = parsed.token;
        } catch {
            token = null;
        }
    }

    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const data: { detail?: string } | null = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        if (response.status === 401 && token) {
            localStorage.removeItem("hagoraAuth");
            window.dispatchEvent(new Event("hagora:unauthorized"));
        }

        throw new Error(
            data?.detail || "Something went wrong"
        );
    }

    return data as T;
}