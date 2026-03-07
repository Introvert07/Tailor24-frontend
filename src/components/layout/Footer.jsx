import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInstagram, FiTwitter, FiPhone, FiMail, FiChevronUp, FiMapPin } from 'react-icons/fi';

/* ─── PALETTE (Consistent with Navbar) ─── */
const C = {
  parchment: '#F4E8D0',
  white:     '#FFFDF5',
  maroon:    '#8d0919',
  maroonL:   '#8B1A28',
  gold:      '#B5892E',
  goldB:     '#D4A017',
  goldL:     '#F2C84B',
  ink:       '#1A0800',
  muted:     '#7A6040',
  border:    '#D4BC94',
};

/* ─── DECORATIVE COMPONENTS ─── */
const Mark = () => (
  <svg width="40" height="40" viewBox="0 0 32 32">
    <polygon points="16,2 30,16 16,30 2,16" stroke={C.gold} strokeWidth="1.2" fill="none" />
    <circle cx="16" cy="16" r="3.5" fill={C.maroon} opacity="0.85" />
    <circle cx="16" cy="16" r="1.6" fill={C.gold} />
  </svg>
);

const ScallopBorder = () => (
  <div style={{ position:'absolute', top:0, left:0, right:0, height:7, overflow:'hidden' }}>
    <svg width="100%" height="7" viewBox="0 0 1440 7" preserveAspectRatio="none">
      {Array.from({ length: 48 }).map((_, i) => (
        <path key={i} d={`M${i * 30} 7 Q${i * 30 + 15} -2 ${i * 30 + 30} 7`}
          stroke={C.gold} strokeWidth="0.7" fill="none" opacity="0.4" />
      ))}
    </svg>
  </div>
);

const RangDot = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" className="inline-block mr-2">
    <circle cx="7" cy="7" r="5.5" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.35" />
    <circle cx="7" cy="7" r="0.8" fill={C.maroon} opacity="0.6" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden pt-24 pb-12" style={{ background: C.ink, color: C.white }}>
      {/* Decorative Elements */}
      <ScallopBorder />
      <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.3 }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* ── BRAND ATELIER ── */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8">
              <Mark />
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl tracking-wider font-bold">
                  Tailor<span style={{ color: C.goldL }}>24</span>
                </h2>
                <p style={{ fontSize: '8px', letterSpacing: '0.4em', color: C.gold }} className="uppercase">
                  Central India · Est. 1997
                </p>
              </div>
            </div>
            
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: `${C.parchment}90` }} className="text-sm leading-relaxed max-w-sm mb-8 italic font-light">
              "Legacy-grade tailoring for the modern Indian visionary. 
              Our artisans in Indore, Bhopal, and Vidisha transform pure silk 
              and heritage weaves into personal armor."
            </p>

            <div className="flex gap-4">
              {[
                { Icon: FiInstagram, link: '#' },
                { Icon: FiTwitter, link: '#' },
                { Icon: FiMail, link: 'mailto:hello@tailor24.com' }
              ].map((social, i) => (
                <a key={i} href={social.link} 
                  className="w-10 h-10 border flex items-center justify-center transition-all duration-500 hover:scale-110"
                  style={{ borderColor: `${C.gold}40`, color: C.gold }}>
                  <social.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── NAVIGATION ── */}
          <div className="lg:col-span-3">
            <div className="flex items-center mb-8">
              <RangDot />
              <h4 style={{ color: C.gold, fontSize: '10px' }} className="uppercase tracking-[0.4em] font-bold">Navigation</h4>
            </div>
            <ul className="space-y-4">
              {[
                ['Sovereign Collection', '/catalog'],
                ['The Ateliers', '/showrooms'],
                ['Bespoke Process', '/process'],
                ['Client Login', '/login']
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} 
                    className="text-xs transition-all duration-300 hover:translate-x-2 inline-block font-medium tracking-widest uppercase"
                    style={{ color: `${C.parchment}60` }}>
                    <span className="hover:text-[#F2C84B] transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CONCIERGE ── */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-8">
              <RangDot />
              <h4 style={{ color: C.gold, fontSize: '10px' }} className="uppercase tracking-[0.4em] font-bold">Concierge</h4>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FiPhone style={{ color: C.gold }} className="mt-1" size={16} />
                <div>
                  <p style={{ color: `${C.parchment}40` }} className="text-[10px] uppercase tracking-widest mb-1">Private Appointment</p>
                  <p className="text-sm font-bold tracking-widest">+91 98765 43210</p>
                </div>
              </div>

              <div className="p-6 relative group border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: `${C.gold}20` }}>
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin size={12} style={{ color: C.gold }} />
                  <p style={{ color: C.gold }} className="text-[10px] uppercase tracking-widest font-bold">Presence In</p>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg tracking-wide text-white/90 italic">
                  Indore • Bhopal • Vidisha
                </p>
                {/* Decorative corner stitch */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r transition-all duration-500 group-hover:w-full group-hover:h-full" 
                  style={{ borderColor: `${C.gold}40` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-24 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8"
          style={{ borderColor: 'rgba(181, 137, 46, 0.15)' }}>
          
          <p style={{ fontSize: '9px', letterSpacing: '0.3em', color: `${C.parchment}40` }} className="uppercase text-center md:text-left">
            © {new Date().getFullYear()} Tailor24. Engineered for Heritage. 
            <span className="block md:inline md:ml-4" style={{ color: C.maroonL }}>Made in Central India.</span>
          </p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 transition-colors group"
            style={{ fontSize: '10px', color: C.gold, letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            Back to Summit 
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FiChevronUp />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Final decorative stitch line at the very bottom */}
      <div className="h-1 w-full flex overflow-hidden opacity-20">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="h-full w-4 flex-shrink-0" style={{ borderRight: `1px solid ${C.gold}`, marginRight: '4px' }} />
        ))}
      </div>
    </footer>
  );
}