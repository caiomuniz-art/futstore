import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ToastProvider } from './context/ToastContext'
import { AboutPage } from './pages/AboutPage'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { OffersPage } from './pages/OffersPage'
import { OrderPage } from './pages/OrderPage'
import { ProductPage } from './pages/ProductPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename === '/' ? undefined : basename}>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <ToastProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/chuteiras" element={<CatalogPage />} />
                  <Route path="/ofertas" element={<OffersPage />} />
                  <Route path="/sobre" element={<AboutPage />} />
                  <Route path="/produto/:id" element={<ProductPage />} />
                  <Route path="/carrinho" element={<CartPage />} />
                  <Route path="/favoritos" element={<FavoritesPage />} />
                  <Route path="/entrar" element={<LoginPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/pedido/:id" element={<OrderPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </ToastProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
