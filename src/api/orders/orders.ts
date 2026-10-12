import { apiRequest } from "../client/client";

export type Governorate = {
    code: string;
    name_en: string;
    name_ar: string;
    shipping_rate: number;
};

export type GovernoratesResponse = {
    governorates: Governorate[];
    shipping_rates: Record<string, number>;
};

export type OrderItemRequest = {
    product_id: number;
    quantity: number;
};

export type OrderCreatePayload = {
    idempotency_key?: string | null;
    first_name: string;
    last_name: string;
    phone: string;
    governorate_code: string;
    city: string;
    address: string;
    items: OrderItemRequest[];
    discount_code?: string | null;
};

export type OrderItem = {
    id: number;
    product_id: number;
    product_name: string;
    brand: string | null;
    product_image: string | null;
    unit_price: number;
    quantity: number;
    line_total: number;
};

export type OrderRecord = {
    id: number;
    order_number: string;
    status: string;
    payment_method: string;
    payment_status: string;
    subtotal: number;
    discount_code: string | null;
    discount_amount: number;
    shipping_cost: number;
    total: number;
    currency: string;
    first_name: string;
    last_name: string;
    phone: string;
    governorate: string | null;
    city: string;
    address: string;
    created_at: string | null;
    updated_at: string | null;
    items: OrderItem[];
};

export type OrderResponse = {
    message: string;
    order: OrderRecord;
};

export type OrdersResponse = {
    orders: OrderRecord[];
};

let governoratesRequest: Promise<GovernoratesResponse> | null = null;

export function getGovernorates(): Promise<GovernoratesResponse> {
    if (!governoratesRequest) {
        governoratesRequest = apiRequest<GovernoratesResponse>("/governorates").catch((error: unknown) => {
            governoratesRequest = null;
            throw error;
        });
    }

    return governoratesRequest;
}

export async function createOrder(payload: OrderCreatePayload): Promise<OrderResponse> {
    return apiRequest<OrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getOrders(): Promise<OrdersResponse> {
    return apiRequest<OrdersResponse>("/orders");
}
