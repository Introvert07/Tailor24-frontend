import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { FiUser, FiShoppingBag, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { C } from '../../theme'; // Importing your Unified Royal Palette

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Collection', to: '/catalog' },
  { label: 'Showrooms', to: '/showrooms' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useSelector(st => st.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <>
      <style>{`
        .nav-link { 
          position: relative; 
          font-family: 'Raleway', sans-serif; 
          transition: all 0.4s ease; 
          font-size: 10px; 
          letter-spacing: 3px; 
          text-transform: uppercase; 
          text-decoration: none;
          font-weight: 700;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 50%; width: 0;
          height: 1px; background: ${C.gold};
          transition: all 0.3s ease; transform: translateX(-50%);
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        
        .auth-btn-light { 
          font-family: 'Raleway', sans-serif; font-size: 10px; font-weight: 700; 
          letter-spacing: 2px; text-transform: uppercase; text-decoration: none;
          color: ${C.ink}; transition: opacity 0.3s;
        }

        @media (max-width: 900px) { .desktop-only { display: none !important; } }
        @media (min-width: 901px) { .mobile-only { display: none !important; } }
      `}</style>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: scrolled ? `${C.page}E6` : 'transparent', // Translucent on scroll
          backdropFilter: scrolled ? 'blur(15px)' : 'none',
          borderBottom: scrolled ? `1px solid ${C.border}44` : '1px solid transparent',
          transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
        }}
      >
        <div style={{ 
          maxWidth: 1400, margin: '0 auto', padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: scrolled ? 70 : 100 
        }}>
          
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: 'none', zIndex: 1100 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ 
                fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 600, 
                letterSpacing: 6, color: C.ink, transition: '0.3s' 
              }}>
                TAILOR<span style={{ color: C.gold }}>24</span>
              </span>
              <div style={{ width: 40, height: 1, background: C.gold, margin: '4px 0' }} />
              <span style={{ fontSize: 8, letterSpacing: 4, color: C.muted, textTransform: 'uppercase' }}>Atelier</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '45px' }}>
            {NAV.map((n) => (
              <NavLink key={n.label} to={n.to} className="nav-link"
                style={({ isActive }) => ({
                  color: isActive ? C.gold : C.ink,
                  opacity: isActive ? 1 : 0.6
                })}>
                {n.label}
              </NavLink>
            ))}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                  <FiUser size={16} style={{ color: C.gold }} />
                  <span style={{ fontFamily: 'Raleway', fontSize: 11, letterSpacing: 1, color: C.ink, fontWeight: 600 }}>
                    {user.name?.split(' ')[0].toUpperCase()}
                  </span>
                </Link>
                
                <Link to="/cart" style={{ color: C.ink, position: 'relative' }}>
                  <FiShoppingBag size={18} />
                </Link>

                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}>
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <Link to="/login" className="auth-btn-light">Login</Link>
                <Link to="/signup" style={{ 
                  background: C.maroon, color: C.white, padding: '12px 28px', 
                  fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                  textDecoration: 'none', transition: '0.3s'
                }}>Join</Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="mobile-only"
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: C.ink, cursor: 'pointer', zIndex: 1100 }}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* MOBILE DRAWER (Light Mode) */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
                background: C.page, zIndex: 1050, padding: '120px 40px',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', textAlign: 'center' }}>
                {NAV.map((n) => (
                  <NavLink key={n.label} to={n.to} 
                    style={({ isActive }) => ({
                      fontFamily: 'Cinzel', fontSize: 24, color: isActive ? C.gold : C.ink,
                      textDecoration: 'none', letterSpacing: 4
                    })}>
                    {n.label}
                  </NavLink>
                ))}
              </div>

              <div style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
                {user ? (
                   <button onClick={handleLogout} style={{ background: 'none', border: `1px solid ${C.border}`, padding: '15px 40px', color: C.maroon, fontFamily: 'Raleway', fontWeight: 700, letterSpacing: 2 }}>LOGOUT</button>
                ) : (
                  <Link to="/signup" style={{ color: C.maroon, textDecoration: 'none', fontFamily: 'Raleway', fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>CREATE AN ACCOUNT</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}