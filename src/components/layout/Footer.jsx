import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInstagram, FiPhone, FiMail, FiMapPin, FiArrowUpRight } from 'react-icons/fi';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');`;

const NAV = [
  { label: 'Collection', to: '/catalog'   },
  { label: 'About',      to: '/about'     },
  { label: 'Showrooms',  to: '/showrooms' },
  { label: 'Contact',    to: '/contact'   },
];

const ACCOUNT = [
  { label: 'Sign In',   to: '/login'    },
  { label: 'Register',  to: '/register' },
  { label: 'My Orders', to: '/orders'   },
  { label: 'Profile',   to: '/profile'  },
];

const CITIES = ['Bhopal', 'Indore', 'Vidisha'];

function FooterLink({ to, children }) {
  return (
    <Link to={to}
      style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13,
        color: '#6B6B6B', textDecoration: 'none', transition: 'color 0.25s' }}
      onMouseEnter={e => e.currentTarget.style.color = '#9B7220'}
      onMouseLeave={e => e.currentTarget.style.color = '#6B6B6B'}>
      {children}
    </Link>
  );
}

function ColLabel({ text }) {
  return (
    <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 4,
      color: '#9B7220', textTransform: 'uppercase',
      marginBottom: 24, fontWeight: 700 }}>
      {text}
    </p>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#FCFAF7', position: 'relative', overflow: 'hidden', borderTop: '1px solid #EAE8E0' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; }
        .ft-grid { display:grid; grid-template-columns:1.6fr 1fr 1fr 1.2fr; gap:64px; }
        .hero-flex { display: flex; align-items: flex-end; justify-content: space-between; gap: 36px; }
        .bottom-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
        
        @media(max-width:1024px){ 
          .ft-grid{ grid-template-columns:1fr 1fr!important; gap:48px!important; }
          .hero-flex { align-items: flex-start; }
        }
        @media(max-width:768px) {
          .hero-flex { flex-direction: column; text-align: center; align-items: center; }
          .bottom-bar { flex-direction: column; text-align: center; }
          .hide-mobile { display: none; }
        }
        @media(max-width:560px) { 
          .ft-grid{ grid-template-columns:1fr!important; gap:40px!important; text-align: center; }
          .ft-grid > div { display: flex; flex-direction: column; align-items: center; }
          .ft-grid ul { align-items: center; }
        }
      `}</style>

      {/* Subtle Texture */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', 
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

      {/* ── Brand & CTA Band ── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 24px 0' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="hero-flex"
          style={{ paddingBottom: 60, borderBottom: '1px solid #EAE8E0' }}>

          <div className="hero-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 15 }}>
              <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 4,
                color: '#9B7220', textTransform: 'uppercase', fontWeight: 600 }}>Est. 2004 • Central India</span>
            </div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(32px, 5vw, 48px)',
              color: '#1A1A1A', fontWeight: 700, letterSpacing: 4, lineHeight: 1, margin: 0 }}>
              TAILOR<span style={{ color: '#9B7220' }}> 24</span>
            </h2>
          </div>

          <div style={{ maxWidth: 460 }}>
            <p style={{ fontFamily: 'Raleway', fontSize: 15, color: '#5C5C5C', lineHeight: 1.8, marginBottom: 25 }}>
              A legacy of artisanal tailoring meeting modern efficiency. Handcrafted excellence delivered 
              to your doorstep in just twenty-four hours.
            </p>
            <Link to="/catalog"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 12,
                fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3, fontWeight: 700,
                textTransform: 'uppercase', color: '#FFF', background: '#1A1A1A',
                padding: '18px 40px', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#9B7220'}
              onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}>
              The Catalogue <FiArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Column Grid ── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '60px 24px' }}>
        <div className="ft-grid">
          {/* Craft */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <ColLabel text="Philosophy" />
            <p style={{ fontFamily: 'Raleway', fontSize: 14, color: '#6B6B6B', lineHeight: 1.8, marginBottom: 25 }}>
              Combining the heritage of SATI Vidisha's local craft with world-class precision. 
              Our master tailors ensure perfection in every seam.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
              {CITIES.map(c => (
                <span key={c} style={{ fontFamily: 'Cinzel', fontSize: 11, color: '#9B7220', letterSpacing: 1 }}>{c.toUpperCase()}</span>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <ColLabel text="Explore" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {NAV.map(item => (
                <li key={item.label}><FooterLink to={item.to}>{item.label}</FooterLink></li>
              ))}
            </ul>
          </motion.div>

          {/* Account */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <ColLabel text="Services" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ACCOUNT.map(item => (
                <li key={item.label}><FooterLink to={item.to}>{item.label}</FooterLink></li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <ColLabel text="Concierge" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 30 }}>
              {[
                { Icon: FiPhone, text: '+91 98765 43210', href: 'tel:+919876543210' },
                { Icon: FiMail, text: 'concierge@tailor24.in', href: 'mailto:concierge@tailor24.in' },
                { Icon: FiMapPin, text: 'Find a Showroom', href: '/showrooms' },
              ].map(({ Icon, text, href }) => (
                <a key={text} href={href} style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#6B6B6B', textDecoration: 'none' }}>
                  <Icon size={14} style={{ color: '#9B7220' }} />
                  <span style={{ fontFamily: 'Raleway', fontSize: 13 }}>{text}</span>
                </a>
              ))}
            </div>
            <motion.a href="#" whileHover={{ y: -3 }}
              style={{ width: 45, height: 45, border: '1px solid #EAE8E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A', background: '#FFF' }}>
              <FiInstagram size={18} />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* ── Credits ── */}
      <div style={{ borderTop: '1px solid #EAE8E0', background: '#F5F3ED' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '30px 24px' }} className="bottom-bar">
          <p style={{ fontFamily: 'Raleway', fontSize: 11, color: '#A09E94', letterSpacing: 1 }}>
            © {new Date().getFullYear()} Tailor 24.
          </p>
          <p style={{ fontFamily: 'Raleway', fontSize: 11, color: '#A09E94', fontStyle: 'italic' }}>
            Handcrafted in Vidisha • Delivered Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}