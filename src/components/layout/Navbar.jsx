import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { C } from '../../theme'; 

// Updated NAV array pointing to the new dedicated category routes
const NAV = [
  { label: "Men's", to: '/mens' },
  { label: "Women's", to: '/womens' },
  { label: "Kids", to: '/kids' },
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
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
  }, [open]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <>
      <style>{`
        .nav-link { 
          position: relative; 
          font-family: 'Raleway', sans-serif; 
          transition: all 0.4s ease; 
          font-size: 10px; 
          letter-spacing: 2.5px; 
          text-transform: uppercase; 
          text-decoration: none;
          font-weight: 700;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0; width: 0;
          height: 1.5px; background: ${C.gold};
          transition: all 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        
        .mobile-nav-link {
          font-family: 'Cinzel', serif;
          font-size: clamp(24px, 6vw, 32px);
          text-decoration: none;
          letter-spacing: 4px;
          color: ${C.ink};
          transition: color 0.3s;
        }

        @media (max-width: 1100px) { .desktop-only { display: none !important; } }
        @media (min-width: 1101px) { .mobile-only { display: none !important; } }
      `}</style>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
          background: scrolled || open ? `${C.page}` : 'transparent',
          borderBottom: scrolled ? `1px solid ${C.border}66` : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        }}
      >
        <div style={{ 
          maxWidth: 1600, margin: '0 auto', padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: scrolled ? 70 : 95 
        }}>
          
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: 'none', zIndex: 1200 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ 
                fontFamily: 'Cinzel, serif', fontSize: scrolled ? 18 : 22, fontWeight: 700, 
                letterSpacing: 4, color: C.ink, transition: '0.3s' 
              }}>
                TAILOR<span style={{ color: C.gold }}>24</span>
              </span>
              <span style={{ fontSize: 7, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', marginTop: -2 }}>The Atelier</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
            {NAV.map((n) => (
              <NavLink key={n.label} to={n.to} className="nav-link"
                style={({ isActive }) => ({
                  color: isActive ? C.ink : `${C.ink}99`,
                })}>
                {n.label}
              </NavLink>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              {user ? (
                <>
                  <Link to="/profile" style={{ color: C.ink }}><FiUser size={18} /></Link>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: C.ink, cursor: 'pointer' }}>
                    <FiLogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" style={{ color: C.ink }}>Login</Link>
                  <Link to="/register" style={{ 
                    background: C.ink, color: C.page, padding: '10px 24px', 
                    fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}>Join</Link>
                </>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button 
              className="mobile-only"
              onClick={() => setOpen(!open)}
              style={{ background: 'none', border: 'none', color: C.ink, cursor: 'pointer', zIndex: 1200, padding: 5 }}
            >
              {open ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
                background: C.page, zIndex: 1150, padding: '120px 40px 60px',
                display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ position: 'absolute', top: '20%', right: '-10%', fontSize: '15vh', fontFamily: 'Cinzel', color: `${C.gold}11`, pointerEvents: 'none', writingMode: 'vertical-rl' }}>
                ATELIER
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {NAV.map((n, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={n.label}
                  >
                    <NavLink to={n.to} className="mobile-nav-link"
                      style={({ isActive }) => ({ color: isActive ? C.gold : C.ink })}>
                      {n.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', borderTop: `1px solid ${C.border}66`, paddingTop: '40px' }}>
                {user ? (
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link to="/profile" style={{ fontFamily: 'Raleway', fontSize: 16, fontWeight: 700, color: C.ink, textDecoration: 'none' }}>MY PROFILE</Link>
                      <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: C.gold, fontFamily: 'Raleway', fontWeight: 700 }}>LOGOUT</button>
                   </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Link to="/login" style={{ fontFamily: 'Raleway', fontSize: 18, fontWeight: 700, color: C.ink, textDecoration: 'none', letterSpacing: 2 }}>LOGIN</Link>
                    <Link to="/register" style={{ fontFamily: 'Raleway', fontSize: 18, fontWeight: 700, color: C.gold, textDecoration: 'none', letterSpacing: 2 }}>CREATE ACCOUNT</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}