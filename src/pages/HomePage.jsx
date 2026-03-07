import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const SLIDES = [
  {
    tag: 'New Arrival — 2025',
    title: ['The', 'Maharaja', 'Collection'],
    sub: 'Sherwanis woven with Banarasi silk & hand-embroidered zardozi',
    cta: "Explore Men's", to: '/catalog?cat=men',
    accent: '#8B1A28',
    category: 'Men',
    img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=800&q=80',
    imgLabel: 'Maharaja Sherwani',
  },
  {
    tag: 'Royal Femininity',
    title: ["Women's", 'Splendour', 'Edit'],
    sub: 'Anarkalis & gharara sets in Chanderi silk — crafted for the modern queen',
    cta: "Shop Women's", to: '/catalog?cat=women',
    accent: '#6B2D5E',
    category: 'Women',
    img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
    imgLabel: "Women's Anarkali",
  },
  {
    tag: 'Exclusively Crafted',
    title: ['Bridal', 'Lehengas', ''],
    sub: 'Timeless silhouettes for the most sacred of ceremonies',
    cta: 'View Bridal', to: '/catalog?cat=bridal',
    accent: '#1A3A5C',
    category: 'Bridal',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=800&q=80',
    imgLabel: 'Bridal Lehenga',
  },
  {
    tag: 'Little Royals',
    title: ["Girls'", 'Festive', 'Collection'],
    sub: 'Lehengas & salwar sets in soft pastels — for your little princess',
    cta: "Shop Girls'", to: '/catalog?cat=girls',
    accent: '#5C3A1A',
    category: 'Girls',
    img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    imgLabel: 'Girls Lehenga',
  },
  {
    tag: 'Mini Maharajas',
    title: ["Kids'", 'Royal', 'Wear'],
    sub: 'Sherwanis & kurta sets for the youngest members of the royal family',
    cta: "Shop Kids'", to: '/catalog?cat=kids',
    accent: '#1A4A2E',
    category: 'Kids',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    imgLabel: 'Kids Sherwani',
  },
];

const TICKER_ITEMS = [
  { icon: '✦', text: 'New Stock — Chanderi & Maheshwari Collection Now In' },
  { icon: '◈', text: 'Wedding Season — 20% Off All Sherwanis' },
  { icon: '✦', text: 'Girls\' Festive Edit — New Lehengas Starting ₹2,999' },
  { icon: '◈', text: 'Bhopal Showroom Open 7 Days a Week' },
  { icon: '✦', text: 'Free Alteration on Orders Above ₹15,000' },
  { icon: '◈', text: 'Women\'s Anarkali Collection — Limited Pieces Available' },
  { icon: '✦', text: 'Kids\' Sherwani Sets Now Available in All Sizes' },
  { icon: '◈', text: 'Bridal Lehenga Booking Open — Book 3 Months Ahead' },
  { icon: '✦', text: 'New in Vidisha — Heritage Handloom Sherwani Line' },
  { icon: '◈', text: 'Summer Clearance — Up to 30% Off Select Pieces' },
];

const TICKER_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS];

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');`;

export default function HomePage() {
  const [idx, setIdx]     = useState(0);
  const [paused, setPaused] = useState(false);
  const { scrollY }       = useScroll();
  const bgY  = useTransform(scrollY, [0, 600], [0, 110]);
  const txtY = useTransform(scrollY, [0, 600], [0, 50]);

  const goTo = useCallback((i) => setIdx(i), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, [paused, idx]);

  const slide = SLIDES[idx];

  return (
    <section style={{ minHeight: '100vh', background: '#060201', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <style>{fonts}{`
        .hero-btn-p { transition: all 0.35s ease; }
        .hero-btn-p:hover { background: #D4A017 !important; letter-spacing: 5px !important; }
        .hero-btn-g:hover { background: rgba(201,151,42,0.1) !important; }
        .cat-dot { transition: all 0.3s ease; cursor: pointer; }
        
        @keyframes marquee { 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }
        .mq-track { display:flex; animation:marquee 44s linear infinite; width:max-content; }
        
        @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.35; } }
        
        /* RESPONSIVE OVERRIDES */
        .hero-grid { display: grid; grid-template-columns: 1fr 400px; gap: 56px; align-items: center; width: 100%; max-width: 1280px; margin: 0 auto; padding: 100px 48px 96px; }
        
        @media(max-width:1100px) {
          .hero-grid { grid-template-columns: 1fr 340px; gap: 32px; padding: 80px 32px; }
        }

        @media(max-width:900px) {
          .hero-grid { grid-template-columns: 1fr!important; text-align: center; padding: 120px 24px 140px; }
          .img-col { display: none !important; }
          .txt-container { display: flex; flex-direction: column; align-items: center; }
          .sub-text { margin-left: auto; margin-right: auto; }
          .cta-group { justify-content: center; }
          .side-progress { display: none !important; }
        }

        @media(max-width:600px) {
          .cat-nav { bottom: 85px !important; width: 90% !important; overflow-x: auto; padding-bottom: 10px; }
          .cat-nav::-webkit-scrollbar { display: none; }
          .tag-line { gap: 8px !important; }
          .tag-line div { width: 16px !important; }
        }
      `}</style>

      {/* ── Parallax radial glow ── */}
      <motion.div style={{ y: bgY, position: 'absolute', inset: '-20%', zIndex: 0, pointerEvents: 'none' }}>
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            style={{ position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse 75% 75% at 30% 40%, ${slide.accent}65 0%, transparent 68%)` }} />
        </AnimatePresence>
      </motion.div>

      {/* ── Hero: text + image ── */}
      <motion.div style={{ y: txtY, flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div className="hero-grid">

          {/* LEFT — text */}
          <div className="txt-container">
            <AnimatePresence mode="wait">
              <motion.div key={`tag-${idx}`} className="tag-line"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
                <div style={{ width: 28, height: 1, background: '#C9972A' }} />
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 5,
                  color: '#C9972A', textTransform: 'uppercase', fontWeight: 500 }}>
                  {slide.tag}
                </span>
                <div style={{ width: 28, height: 1, background: '#C9972A' }} />
              </motion.div>
            </AnimatePresence>

            <div style={{ overflow: 'hidden', marginBottom: 22 }}>
              <AnimatePresence mode="wait">
                <motion.div key={`title-${idx}`} style={{ display: 'flex', flexDirection: 'column' }}>
                  {slide.title.filter(Boolean).map((word, i) => (
                    <motion.span key={`${word}-${i}`}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-20%', opacity: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                      style={{ fontFamily: 'Cinzel, serif', display: 'block',
                        fontSize: 'clamp(42px, 8vw, 90px)', lineHeight: 1.05,
                        color: i === 1 ? '#C9972A' : '#FFFDF5',
                        fontWeight: i === 1 ? 600 : 400,
                        letterSpacing: i === 1 ? 3 : 7 }}>
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p key={`sub-${idx}`} className="sub-text"
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.26 }}
                style={{ fontFamily: 'Raleway, sans-serif', fontSize: 15, color: 'rgba(244,232,208,0.58)',
                  maxWidth: 370, lineHeight: 1.9, marginBottom: 38, fontStyle: 'italic', fontWeight: 300 }}>
                {slide.sub}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={`cta-${idx}`} className="cta-group"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.34 }}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to={slide.to} className="hero-btn-p"
                  style={{ background: '#C9972A', color: '#060201', padding: '14px 38px',
                    fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 4,
                    fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
                  {slide.cta}
                </Link>
                <Link to="/showrooms" className="hero-btn-g"
                  style={{ border: '1px solid rgba(201,151,42,0.3)', color: 'rgba(244,232,208,0.72)',
                    padding: '14px 28px', fontFamily: 'Raleway, sans-serif', fontSize: 10,
                    letterSpacing: 4, fontWeight: 400, textTransform: 'uppercase', textDecoration: 'none' }}>
                  Visit Showroom
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — image (Hidden on mobile) */}
          <div className="img-col" style={{ position: 'relative', height: 500 }}>
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,151,42,0.18)', zIndex: 3 }} />
            <AnimatePresence mode="wait">
              <motion.div key={`img-${idx}`}
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <img src={slide.img} alt={slide.imgLabel}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Category nav pills ── */}
      <div className="cat-nav"
        style={{ position: 'absolute', bottom: 72, left: '50%', transform: 'translateX(-50%)',
          zIndex: 3, display: 'flex', gap: 12, alignItems: 'center' }}>
        {SLIDES.map((s, i) => (
          <button key={s.category} onClick={() => goTo(i)} className="cat-dot"
            style={{ background: 'none', border: 'none', padding: '8px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              opacity: i === idx ? 1 : 0.4 }}>
            <motion.div
              animate={{ width: i === idx ? 40 : 12, background: i === idx ? '#C9972A' : 'rgba(201,151,42,0.5)' }}
              style={{ height: 2 }} />
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 8, letterSpacing: 3,
              color: i === idx ? '#C9972A' : '#FFFDF5', textTransform: 'uppercase' }}>
              {s.category}
            </span>
          </button>
        ))}
      </div>

      {/* ── Right edge progress (Hidden on mobile) ── */}
      <div className="side-progress" style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
        zIndex: 3, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <motion.div animate={{ height: i === idx ? 40 : 8, background: i === idx ? '#C9972A' : 'rgba(201,151,42,0.2)' }}
              style={{ width: 2 }} />
          </button>
        ))}
      </div>

      {/* ══ MARQUEE TICKER ══ */}
      <div style={{ position: 'relative', zIndex: 2, background: 'rgba(6,2,1,0.9)', borderTop: '1px solid rgba(201,151,42,0.1)' }}>
        <div style={{ padding: '14px 0', overflow: 'hidden' }}>
          <div className="mq-track">
            {TICKER_DOUBLED.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12,
                fontFamily: 'Raleway, sans-serif', fontSize: 11, color: 'rgba(244,232,208,0.6)', padding: '0 40px' }}>
                <span style={{ color: '#C9972A' }}>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}