import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import Products from './Pages/Products/Products'
import ProductDetails from './Pages/ProductDetails/ProductDetails'
import NotFound from './Pages/NotFound/NotFound'
import About from './Pages/About/About'
import Contact from './Pages/Contact/Contact'
import axios from 'axios'
import { useEffect, useState } from 'react'

import placeholderImg from './assets/placeholder.svg'
import { CartProvider } from './Context/CartContext'
import Search from './Pages/Search/Search'

export default function App() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    axios.get(
      'https://makeup-api.herokuapp.com/api/v1/products.json',
      { signal: controller.signal }
    )
      .then(response => {
        const sanitizedProducts = response.data.map(product => {
          let img = product.api_featured_image || product.image_link
          if (img && img.startsWith('//')) {
            img = `https:${img}`
          }

          if (!img || img.includes('clinique.com')) {
            img = placeholderImg
          }

          return {
            ...product,
            image_link: img,
            api_featured_image: img
          }
        })

        setProducts(sanitizedProducts)
      })
      .catch(error => {
        if (axios.isCancel(error)) return

        console.error(error)
        setError('Unable to load the beauty collection right now. Please try again.')
        setProducts([])
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-card">
          <div className="app-loading-spinner" aria-label="Loading" />
          <h2>HAGORA</h2>
          <p>Loading beauty collection...</p>
        </div>
      </div>
    )
  }

  const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [

        {
          index: true,
          element: <Home products={products} loading={loading} />
        },

        {
          path: '/cart',
          element: <Cart />
        },

        {
          path: '/products',
          element: <Products products={products} loading={loading} />
        },

        {
          path: 'products/:id',
          element: <ProductDetails products={products} loading={loading} />
        },

        {
          path: '/about',
          element: <About products={products} loading={loading} />
        },
        {
          path: '/contact',
          element: <Contact />
        },
        { path: "/search", element: <Search products={products} loading={loading} /> },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ], { basename: routerBasename })

  return (
    <CartProvider>
      <RouterProvider router={router} />
      {error && (
        <div className="app-error-banner">
          <span>{error}</span>
        </div>
      )}
    </CartProvider>
  )
}