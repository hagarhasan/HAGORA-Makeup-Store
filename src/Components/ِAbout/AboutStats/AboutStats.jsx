import React from 'react'
import AnimatedStats from '../../AnimatedStats/AnimatedStats'

export default function AboutStats({ products }) {
    return <AnimatedStats products={products || []} variant="about" />
}