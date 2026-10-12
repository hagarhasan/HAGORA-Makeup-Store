import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'
import FloatingCart from '../FloatingCart/FloatingCart'
import FloatingSearch from '../FloatingSearch/FloatingSearch'

export default function Layout() {
    return (
        <>
            <Navbar />
            <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-8">
                <Outlet />
            </div>

            <FloatingCart />
            <FloatingSearch />
            <Footer />
        </>
    )
}
