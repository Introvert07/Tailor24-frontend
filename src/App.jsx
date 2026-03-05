import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import CatalogPage     from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage      from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ShowroomsPage   from './pages/ShowroomsPage';

// Pages that hide the Navbar/Footer (auth pages)
const FULLSCREEN_PAGES = ['/login', '/register'];

function AppLayout() {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_PAGES.includes(location.pathname);

  return (
    <div className="grain-overlay">
      {!isFullscreen && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/"         element={<HomePage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/catalog"  element={<CatalogPage />} />
            <Route path="/catalog/:id" element={<ProductDetailPage />} />
            <Route path="/showrooms" element={<ShowroomsPage />} />

            {/* Protected routes */}
            <Route path="/orders" element={
              <ProtectedRoute><OrdersPage /></ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <p className="font-display text-8xl text-cream-300">404</p>
                <p className="font-display text-3xl text-charcoal/40 mt-2 italic">Page not found</p>
                <a href="/" className="btn-primary mt-8 text-sm inline-block">Go Home</a>
              </div>
            } />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!isFullscreen && <Footer />}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            borderRadius: 0,
            border: '1px solid #F3E9D2',
            background: '#FDFAF5',
            color: '#1C1917',
          },
          success: { iconTheme: { primary: '#8B1A35', secondary: '#FDFAF5' } },
          error:   { iconTheme: { primary: '#dc3d58', secondary: '#FDFAF5' } },
        }}
      />
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
