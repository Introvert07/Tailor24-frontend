import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import the new combined landing page
import MainLandingPage   from './pages/MainLandingPage';

// Other imports
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import CatalogPage       from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage         from './pages/OrdersPage';
import OrderDetailPage   from './pages/OrderDetailPage';
import ShowroomsPage     from './pages/ShowroomsPage';
import AdminPage         from './pages/AdminPage';
import ProfilePage       from './pages/ProfilePage';
import Contact           from './pages/Contact'; // Imported correctly

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
            
            {/* ── Public pages ── */}
            <Route path="/" element={<MainLandingPage />} />
            
            {/* ── Added Contact Route ── */}
            <Route path="/contact" element={<Contact />} />

            {/* ── Auth pages ── */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Catalog ── */}
            <Route path="/catalog"     element={<CatalogPage />} />
            <Route path="/catalog/:id" element={<ProductDetailPage />} />

            {/* ── Showrooms & Admin ── */}
            <Route path="/showrooms" element={<ShowroomsPage />} />
            <Route path="/admin"     element={<AdminPage />} />

            {/* ── Protected routes ── */}
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><OrdersPage /></ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
            } />

            {/* ── 404 ── */}
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

      <Toaster position="bottom-right" reverseOrder={false} />
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