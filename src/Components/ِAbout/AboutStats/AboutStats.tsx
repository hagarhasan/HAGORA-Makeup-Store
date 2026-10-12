import React from 'react'
import AnimatedStats from '../../AnimatedStats/AnimatedStats'

import type { Product } from '../../../types/product'

export default function AboutStats({ products }: { products: Product[] }) {
    return <AnimatedStats products={products || []} variant="about" />
}