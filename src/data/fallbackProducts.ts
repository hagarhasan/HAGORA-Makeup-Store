import blushImage from '../assets/hagora_blush.jpg'
import lipstickImage from '../assets/hagora_lipstick.jpg'
import serumImage from '../assets/hagora_serum.jpg'
import type { Product } from '../types/product'

export const fallbackProducts: Product[] = [
    {
        id: 1,
        name: 'Hydrating Serum',
        brand: 'HAGORA',
        price: 220,
        category: 'skincare',
        product_type: 'serum',
        description: 'A lightweight hydrating serum for a fresh, dewy look.',
        image_link: serumImage,
    },
    {
        id: 2,
        name: 'Velvet Lip Gloss',
        brand: 'HAGORA',
        price: 180,
        category: 'makeup',
        product_type: 'lipstick',
        description: 'Comfortable color with a soft, glossy finish.',
        image_link: lipstickImage,
    },
    {
        id: 3,
        name: 'Glow Foundation',
        brand: 'HAGORA',
        price: 320,
        category: 'makeup',
        product_type: 'foundation',
        description: 'Buildable coverage with a natural radiant finish.',
        image_link: serumImage,
    },
    {
        id: 4,
        name: 'Radiant Concealer',
        brand: 'HAGORA',
        price: 260,
        category: 'makeup',
        product_type: 'concealer',
        description: 'A smooth concealer for brightening and evening skin tone.',
        image_link: serumImage,
    },
    {
        id: 5,
        name: 'Daily Cleanser',
        brand: 'HAGORA',
        price: 210,
        category: 'skincare',
        product_type: 'cleanser',
        description: 'A gentle daily cleanser that leaves skin feeling refreshed.',
        image_link: serumImage,
    },
    {
        id: 6,
        name: 'Soft Matte Blush',
        brand: 'HAGORA',
        price: 170,
        category: 'makeup',
        product_type: 'blush',
        description: 'A blendable blush that adds a soft natural flush.',
        image_link: blushImage,
    },
]