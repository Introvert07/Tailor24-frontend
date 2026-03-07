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
        color: 'rgba(212,188,148,0.4)', textDecoration: 'none', transition: 'color 0.25s' }}
      onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,151,42,0.9)'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,188,148,0.4)'}>
      {children}
    </Link>
  );
}

function ColLabel({ text }) {
  return (
    <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 5,
      color: 'rgba(201,151,42,0.45)', textTransform: 'uppercase',
      marginBottom: 24, fontWeight: 600 }}>
      {text}
    </p>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#060201', position: 'relative', overflow: 'hidden' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; }
        .ft-grid { display:grid; grid-template-columns:1.6fr 1fr 1fr 1.2fr; gap:64px; }
        @media(max-width:1024px){ .ft-grid{ grid-template-columns:1fr 1fr!important; gap:48px!important; } }
        @media(max-width:560px) { .ft-grid{ grid-template-columns:1fr!important; gap:40px!important; } }
      `}</style>

      {/* Ambient glow from bottom */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(139,26,40,0.14) 0%, transparent 60%)' }} />

      {/* Top rule */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,151,42,0.4) 25%,rgba(201,151,42,0.4) 75%,transparent)' }} />

      {/* ── Hero band ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 48px 0' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            paddingBottom: 56, borderBottom: '1px solid rgba(201,151,42,0.07)',
            flexWrap: 'wrap', gap: 36 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 20, height: 1, background: '#C9972A' }} />
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 6,
                color: 'rgba(201,151,42,0.45)', textTransform: 'uppercase' }}>Est. 2004 · Madhya Pradesh</span>
            </div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(30px,4vw,54px)',
              color: '#FFFDF5', fontWeight: 700, letterSpacing: 6, lineHeight: 1, margin: 0 }}>
              TAILOR<span style={{ color: '#C9972A' }}> 24</span>
            </h2>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, letterSpacing: 5,
              color: 'rgba(201,151,42,0.4)', fontStyle: 'italic', marginTop: 12 }}>
              Crafted for You
            </p>
          </div>

          {/* Right: tagline + CTA */}
          <div style={{ maxWidth: 460 }}>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14,
              color: 'rgba(244,232,208,0.4)', lineHeight: 1.9, fontWeight: 300, marginBottom: 28 }}>
              Traditional craft. Modern speed. Bespoke garments delivered in 24 hours —
              across three showrooms in Madhya Pradesh.
            </p>
            <Link to="/catalog"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 4, fontWeight: 600,
                textTransform: 'uppercase', color: '#060201', background: '#C9972A',
                padding: '12px 26px', textDecoration: 'none', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#D4A017'}
              onMouseLeave={e => e.currentTarget.style.background = '#C9972A'}>
              Start Your Order <FiArrowUpRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Main columns ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 48px' }}>
        <div className="ft-grid">

          {/* Col 1 — Craft + cities */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <ColLabel text="Our Craft" />
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13,
              color: 'rgba(212,188,148,0.35)', lineHeight: 1.85, fontWeight: 300, marginBottom: 28 }}>
              Master karigars with 20–35 years of classical artistry. Six embroidery traditions.
              One 24-hour promise.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CITIES.map(c => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%',
                    background: 'rgba(201,151,42,0.4)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12,
                    color: 'rgba(201,151,42,0.38)', letterSpacing: 2 }}>{c}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Col 2 — Navigate */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.07 }}>
            <ColLabel text="Navigate" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: 14 }}>
              {NAV.map(item => (
                <li key={item.label}><FooterLink to={item.to}>{item.label}</FooterLink></li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3 — Account */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.13 }}>
            <ColLabel text="Account" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ACCOUNT.map(item => (
                <li key={item.label}><FooterLink to={item.to}>{item.label}</FooterLink></li>
              ))}
            </ul>
          </motion.div>

          {/* Col 4 — Contact + Social */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.18 }}>
            <ColLabel text="Reach Us" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {[
                { Icon: FiPhone,  text: '+91 98765 43210',    href: 'tel:+919876543210' },
                { Icon: FiMail,   text: 'hello@tailor24.in',  href: 'mailto:hello@tailor24.in' },
                { Icon: FiMapPin, text: 'Bhopal · Indore · Vidisha', href: '/showrooms' },
              ].map(({ Icon, text, href }) => (
                <a key={text} href={href}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start',
                    color: 'rgba(212,188,148,0.38)', textDecoration: 'none', transition: 'color 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,151,42,0.8)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,188,148,0.38)'}>
                  <Icon size={13} style={{ marginTop: 3, flexShrink: 0, color: 'rgba(201,151,42,0.38)' }} />
                  <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13 }}>{text}</span>
                </a>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: '#', label: 'IG', icon: <FiInstagram size={14} /> },
                { href: 'https://wa.me/919876543210', label: 'WA', icon: <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, fontWeight: 600 }}>WA</span> },
              ].map(({ href, label, icon }) => (
                <motion.a key={label} href={href} whileHover={{ scale: 1.08 }}
                  style={{ width: 36, height: 36, border: '1px solid rgba(201,151,42,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(201,151,42,0.4)', textDecoration: 'none', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9972A'; e.currentTarget.style.color = '#C9972A'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,151,42,0.18)'; e.currentTarget.style.color = 'rgba(201,151,42,0.4)'; }}>
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(201,151,42,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '22px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11,
            color: 'rgba(201,151,42,0.22)', letterSpacing: 1 }}>
            © {new Date().getFullYear()} Tailor 24. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 18, height: 1, background: 'rgba(201,151,42,0.12)' }} />
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 9, color: 'rgba(201,151,42,0.18)', letterSpacing: 4 }}>✦</span>
            <div style={{ width: 18, height: 1, background: 'rgba(201,151,42,0.12)' }} />
          </div>
          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11,
            color: 'rgba(201,151,42,0.22)', letterSpacing: 1, fontStyle: 'italic' }}>
            Crafted for You · Made in India
          </p>
        </div>
      </div>
    </footer>
  );
}