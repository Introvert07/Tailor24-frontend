import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { FiUser, FiShoppingBag, FiLogOut, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

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
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <>
      <style>{`
        .nav-link { position: relative; font-family: 'Raleway', sans-serif; transition: all 0.3s ease; }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0; width: 100%;
          height: 1px; background: #C9972A; transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
        
        .auth-btn { 
          font-family: 'Raleway', sans-serif; font-size: 11px; font-weight: 600; 
          letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none;
          transition: all 0.3s;
        }

        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled || open ? '#0A0402' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,151,42,0.15)' : 'none',
          transition: 'all 0.4s ease'
        }}
      >
        <div style={{ 
          maxWidth: 1400, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: scrolled ? 70 : 90 
        }}>
          
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: 'none', zIndex: 110 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700, letterSpacing: 4, color: '#FFF' }}>
                Tailor<span style={{ color: '#C9972A' }}>24</span>
              </span>
              <span style={{ fontSize: 9, letterSpacing: 4, color: '#C9972A', textTransform: 'uppercase' }}>Royal Atelier</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
            {NAV.map((n) => (
              <NavLink key={n.label} to={n.to} className="nav-link"
                style={({ isActive }) => ({
                  fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none',
                  color: isActive ? '#C9972A' : 'rgba(255,255,255,0.7)', fontWeight: 500
                })}>
                {n.label}
              </NavLink>
            ))}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* User Greeting */}
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#FFF' }}>
                  <FiUser size={16} style={{ color: '#C9972A' }} />
                  <span style={{ fontFamily: 'Cinzel', fontSize: 12, letterSpacing: 1, color: '#FFF' }}>
                    {user.name || user.username}
                  </span>
                </Link>
                
                <Link to="/orders" style={{ color: 'rgba(255,255,255,0.8)', transition: '0.3s' }} onMouseEnter={e => e.target.style.color='#C9972A'} onMouseLeave={e => e.target.style.color='#FFF'}>
                  <FiShoppingBag size={18} />
                </Link>

                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/login" className="auth-btn" style={{ color: '#FFF' }}>Login</Link>
                <Link to="/signup" className="auth-btn" style={{ 
                  background: '#C9972A', color: '#000', padding: '10px 20px', borderRadius: '2px'
                }}>Sign Up</Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="mobile-only"
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: '#C9972A', cursor: 'pointer', zIndex: 110 }}
          >
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: '#0A0402', zIndex: 105, padding: '120px 40px 40px',
                display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {NAV.map((n) => (
                  <NavLink key={n.label} to={n.to} 
                    style={({ isActive }) => ({
                      fontFamily: 'Cinzel', fontSize: 20, color: isActive ? '#C9972A' : '#FFF',
                      textDecoration: 'none', letterSpacing: 2
                    })}>
                    {n.label}
                  </NavLink>
                ))}
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(201,151,42,0.1)', paddingTop: '30px' }}>
                {user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiUser color="#C9972A" />
                        <span style={{ color: '#FFF', fontFamily: 'Cinzel', letterSpacing: 1 }}>{user.name}</span>
                     </div>
                    <Link to="/profile" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Account Settings</Link>
                    <Link to="/orders" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Order History</Link>
                    <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#8B1A28', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Logout</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link to="/login" style={{ color: '#FFF', textDecoration: 'none', fontSize: 16 }}>Login</Link>
                    <Link to="/signup" style={{ color: '#C9972A', textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>Create an Account</Link>
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