import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'
import FloatingCart from '../FloatingCart/FloatingCart'

export default function Layout() {
    return (
        <>
            <Navbar />
            <div className="container min-vh-100" style={{ paddingTop: '88px' }}>
                <Outlet />
            </div>

            <FloatingCart />
            <Footer />
        </>
    )
}
