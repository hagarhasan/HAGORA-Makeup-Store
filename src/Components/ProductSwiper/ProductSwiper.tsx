import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import Card from '../Card/Card'
import type { Product } from '../../types/product'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './ProductSwiper.css'

interface ProductSwiperProps {
    products: Product[]
    badge?: string
}

export default function ProductSwiper({ products, badge }: ProductSwiperProps) {
    const swiperRef = useRef<SwiperType | null>(null)

    if (!products || products.length === 0) return null

    return (
        <div className="product-swiper-wrapper position-relative px-md-5">
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                    576: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                className="product-swiper py-4"
            >
                {products.map(product => (
                    <SwiperSlide key={product.id} className="h-auto">
                        <Card product={product} badge={badge} />
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Custom Navigation */}
            <button 
                className="swiper-custom-prev d-none d-md-flex"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous slide"
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            <button 
                className="swiper-custom-next d-none d-md-flex"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next slide"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    )
}
