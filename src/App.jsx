import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy } from 'react';

import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { InlineLoader } from './components/ui/Atoms';

// Lazy-load pages for performance
const MainLandingPage   = lazy(() => import('./pages/MainLandingPage'));
const LoginPage         = lazy(() => import('./pages/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/RegisterPage'));
const CatalogPage       = lazy(() => import('./pages/CatalogPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const OrdersPage        = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage   = lazy(() => import('./pages/OrderDetailPage'));
const ShowroomsPage     = lazy(() => import('./pages/ShowroomsPage'));
const AdminPage         = lazy(() => import('./pages/AdminPage'));
const ProfilePage       = lazy(() => import('./pages/ProfilePage'));
const Contact           = lazy(() => import('./pages/Contact'));

const AUTH_PAGES = ['/login', '/register'];

function AppLayout() {
  const location     = useLocation();
  const isAuthPage   = AUTH_PAGES.includes(location.pathname);

  return (
    <div className="grain-overlay">
      {!isAuthPage && <Navbar />}

      <Suspense fallback={<InlineLoader />}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <Routes location={location}>
              <Route path="/"          element={<MainLandingPage />} />
              <Route path="/contact"   element={<Contact />} />
              <Route path="/login"     element={<LoginPage />} />
              <Route path="/register"  element={<RegisterPage />} />
              <Route path="/catalog"   element={<CatalogPage />} />
              <Route path="/catalog/:id" element={<ProductDetailPage />} />
              <Route path="/showrooms" element={<ShowroomsPage />} />
              <Route path="/admin"     element={<AdminPage />} />
              <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/orders"    element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="*" element={
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, background: '#FBF4E8' }}>
                  <p style={{ fontFamily: 'serif', fontSize: 96, color: '#D4BC94', lineHeight: 1 }}>404</p>
                  <p style={{ fontFamily: 'serif', fontSize: 26, color: '#8B7355', marginTop: 8, fontStyle: 'italic' }}>Page not found</p>
                  <a href="/" style={{ marginTop: 32, background: '#6B0F1A', color: '#FFFDF5', padding: '12px 28px', fontSize: 11, letterSpacing: 2, textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase' }}>
                    Go Home
                  </a>
                </div>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>

      {!isAuthPage && <Footer />}
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'sans-serif', fontSize: 13 } }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout />
    </BrowserRouter>
  );
}