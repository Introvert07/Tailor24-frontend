import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { FiUser, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { C } from '../../theme';

const NAV = [
  { label: 'Home',       to: '/#home'     },
  { label: 'About',      to: '/#about'    },
  { label: 'Collection', to: '/catalog'   },
  { label: 'Showrooms',  to: '/showrooms' },
  { label: 'Contact',    to: '/contact'   },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const { user }  = useSelector(st => st.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');
        .nav-link-item { position: relative; }
        .nav-link-item::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
          height: 1px; background: #C9972A; transform: scaleX(0);
          transform-origin: center; transition: transform 0.3s ease;
        }
        .nav-link-item:hover::after, .nav-link-item.active::after { transform: scaleX(1); }
        .icon-btn { transition: all 0.2s; }
        .icon-btn:hover { color: #C9972A !important; transform: translateY(-1px); }
      `}</style>

      {/* Ornamental top border */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 60,
        background: 'linear-gradient(90deg, transparent, #C9972A 20%, #D4A017 50%, #C9972A 80%, transparent)',
        opacity: scrolled ? 1 : 0, transition: 'opacity 0.4s' }} />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          background: scrolled
            ? 'rgba(10, 4, 2, 0.92)'
            : 'linear-gradient(to bottom, rgba(10,4,2,0.7), transparent)',
          borderBottom: scrolled ? '1px solid rgba(201,151,42,0.2)' : 'none',
          transition: 'all 0.4s ease',
          padding: scrolled ? '0' : '0',
        }}>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: scrolled ? 64 : 80, transition: 'height 0.4s' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700,
              letterSpacing: 6, color: '#FFFDF5', lineHeight: 1,
              textShadow: '0 0 40px rgba(201,151,42,0.4)' }}>
              Tailor<span style={{ color: '#C9972A' }}>24</span>
            </span>
            <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 8, letterSpacing: 5,
              color: 'rgba(201,151,42,0.7)', textTransform: 'uppercase', marginTop: 3 }}>
              Royal Attelier
            </span>
          </Link>

          {/* Center ornament + nav */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {/* Left ornament */}
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,151,42,0.4))', marginRight: 28 }} />

            {NAV.map((n, i) => (
              <NavLink key={n.label} to={n.to}
                onMouseEnter={() => setHoveredLink(i)}
                onMouseLeave={() => setHoveredLink(null)}
                className={({ isActive }) => `nav-link-item${isActive ? ' active' : ''}`}
                style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, letterSpacing: 3,
                  textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500,
                  color: hoveredLink === i ? '#C9972A' : 'rgba(255,253,245,0.85)',
                  padding: '8px 0', margin: '0 18px', transition: 'color 0.25s',
                }}>
                {n.label}
              </NavLink>
            ))}

            {/* Right ornament */}
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,151,42,0.4))', marginLeft: 28 }} />
          </div>

          {/* Actions */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {user ? (
              <>
                <Link to="/profile" className="icon-btn" style={{ color: 'rgba(255,253,245,0.7)' }}><FiUser size={17} /></Link>
                <Link to="/orders"  className="icon-btn" style={{ color: 'rgba(255,253,245,0.7)' }}><FiShoppingBag size={17} /></Link>
                <div style={{ width: 1, height: 16, background: 'rgba(201,151,42,0.3)' }} />
                <button onClick={handleLogout} className="icon-btn"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,253,245,0.5)' }}>
                  <FiLogOut size={16} />
                </button>
              </>
            ) : (
              <Link to="/login" style={{
                fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 3,
                textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600,
                color: '#0A0402', background: '#C9972A',
                padding: '9px 22px', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.target.style.background = '#D4A017'; e.target.style.letterSpacing = '4px'; }}
                onMouseLeave={e => { e.target.style.background = '#C9972A'; e.target.style.letterSpacing = '3px'; }}>
                Enter
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setOpen(o => !o)} className="md:hidden"
            style={{ background: 'none', border: '1px solid rgba(201,151,42,0.3)', cursor: 'pointer',
              width: 38, height: 38, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 5, padding: 8 }}>
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
              style={{ display: 'block', width: 18, height: 1, background: '#C9972A', transformOrigin: 'center' }} />
            <motion.span animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
              style={{ display: 'block', width: 12, height: 1, background: 'rgba(201,151,42,0.6)', alignSelf: 'flex-start', marginLeft: 3 }} />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
              style={{ display: 'block', width: 18, height: 1, background: '#C9972A', transformOrigin: 'center' }} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(10,4,2,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }} />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 280, zIndex: 45,
                background: '#0A0402', borderLeft: '1px solid rgba(201,151,42,0.2)',
                padding: '88px 36px 40px', display: 'flex', flexDirection: 'column' }}>

              {/* Ornamental corner */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60,
                borderRight: '1px solid rgba(201,151,42,0.15)', borderBottom: '1px solid rgba(201,151,42,0.15)' }} />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {NAV.map((n, i) => (
                  <motion.div key={n.label}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}>
                    <NavLink to={n.to} style={({ isActive }) => ({
                      fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: 4,
                      textTransform: 'uppercase', textDecoration: 'none',
                      color: isActive ? '#C9972A' : 'rgba(255,253,245,0.75)',
                      display: 'block', padding: '14px 0',
                      borderBottom: '1px solid rgba(201,151,42,0.08)',
                    })}>
                      {n.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ display: 'flex', gap: 16, paddingTop: 24, borderTop: '1px solid rgba(201,151,42,0.15)' }}>
                {user ? (
                  <>
                    <Link to="/profile" style={{ color: 'rgba(201,151,42,0.7)' }}><FiUser size={18} /></Link>
                    <Link to="/orders"  style={{ color: 'rgba(201,151,42,0.7)' }}><FiShoppingBag size={18} /></Link>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,253,245,0.4)', marginLeft: 'auto' }}>
                      <FiLogOut size={17} />
                    </button>
                  </>
                ) : (
                  <Link to="/login" style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 3,
                    textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600,
                    color: '#0A0402', background: '#C9972A', padding: '10px 24px' }}>
                    Sign In
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}