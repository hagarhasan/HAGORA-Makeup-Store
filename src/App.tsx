
import './App.css'

import { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { Offline } from 'react-detect-offline'
import axios from 'axios'

import Layout from './Components/Layout/Layout'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import Products from './Pages/Products/Products'
import ProductDetails from './Pages/ProductDetails/ProductDetails'
import NotFound from './Pages/NotFound/NotFound'
import About from './Pages/About/About'
import Contact from './Pages/Contact/Contact'
import { CartProvider } from './Context/CartContext'
import { AuthProvider } from './Context/AuthContext'
import { ToastProvider } from './Context/ToastContext'
import Search from './Pages/Search/Search'
import type { Product } from './types/product'
import { fallbackProducts } from './data/fallbackProducts'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import CompleteProfile from './Pages/CompleteProfile/CompleteProfile'
import AppRouteGuard from './Components/AppRouteGuard/AppRouteGuard'
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
import ResetPassword from './Pages/ResetPassword/ResetPassword'
import MyProfile from './Pages/dashboard/MyProfile/MyProfile'
import MyOrders from './Pages/dashboard/MyOrders/MyOrders'
import Settings from './Pages/dashboard/Settings/Settings'
import DashboardLayout from './Components/Dashboard/DashboardLayout'
import OfflinePage from './Pages/OfflinePage/OfflinePage'

const placeholderImg =
  'https://placehold.co/400x400/fce7f3/9d174d?text=HAGORA'


export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let active: boolean = true

    async function getAllProducts() {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get<Product[]>(
          'https://makeup-api.herokuapp.com/api/v1/products.json'
        )

        const sanitizedProducts = response.data.map((product) => {
          let img =
            product.api_featured_image || product.image_link

          if (img?.startsWith('//')) {
            img = `https:${img}`
          }

          if (!img || img.includes('clinique.com')) {
            img = placeholderImg
          }

          return {
            ...product,
            image_link: img,
            api_featured_image: img,
          }
        })

        if (active) {
          setProducts(
            sanitizedProducts.length > 0
              ? sanitizedProducts
              : fallbackProducts
          )

          if (sanitizedProducts.length === 0) {
            setError('Showing demo products.')
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err)

        if (active) {
          setProducts(fallbackProducts)
          setError('Showing demo products because the API is unavailable.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    getAllProducts()
    return () => {
      active = false
    }
  }, [])

  const router = createBrowserRouter([
    {
      element: <AppRouteGuard />,
      children: [
        {
          path: '/',
          element: <Layout />,
          children: [
            {
              index: true,
              element: <Home products={products} loading={loading} />,
            },
            {
              path: 'cart',
              element: <Cart loading={loading} />,
            },
            {
              path: 'products',
              element: <Products products={products} loading={loading} />,
            },
            {
              path: 'products/:id',
              element: <ProductDetails products={products} loading={loading} />,
            },
            {
              path: 'about',
              element: <About products={products} loading={loading} />,
            },
            {
              path: 'contact',
              element: <Contact />,
            },
            {
              path: 'search',
              element: <Search products={products} loading={loading} />,
            },
            {
              path: '*',
              element: <NotFound />,
            },
          ],
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/forgot-password',
          element: <ForgotPassword />,
        },
        {
          path: '/reset-password',
          element: <ResetPassword />,
        },
        {
          path: '/register',
          element: <Register />,
        },
        {
          path: '/complete-profile',
          element: <CompleteProfile />,
        },
        {
          path: '/dashboard',
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="profile" replace />,
            },
            {
              path: 'profile',
              element: <MyProfile />,
            },
            {
              path: 'orders',
              element: <MyOrders />,
            },
            {
              path: 'settings',
              element: <Settings />,
            },
          ],
        },
      ],
    },
  ], {
    basename: import.meta.env.BASE_URL,
  })

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          {error && (
            <div
              role="status"
              className="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg bg-pink-100 px-4 py-3 text-sm text-pink-900 shadow-lg"
            >
              {error}
            </div>
          )}

          <RouterProvider router={router} />

          <Offline>
            <OfflinePage />
          </Offline>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}
