export interface Product {
    id: number
    name: string
    price: string | number | null
    brand?: string | null
    category?: string | null
    api_featured_image?: string | null
    image_link?: string | null
    product_type?: string | null
    description?: string | null
    product_link?: string | null
    website_link?: string | null
    rating?: number | null
    tag_list?: string[]
}

export interface CartItem extends Product {
    quantity: number
}