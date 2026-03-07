import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const SLIDES = [
  {
    tag: 'New Arrival — 2025',
    title: ['The', 'Maharaja', 'Collection'],
    sub: 'Sherwanis woven with Banarasi silk & hand-embroidered zardozi',
    cta: 'Explore Men\'s', to: '/catalog?cat=men',
    accent: '#8B1A28',
    category: 'Men',
    img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=800&q=80',
    imgLabel: 'Maharaja Sherwani',
  },
  {
    tag: 'Royal Femininity',
    title: ['Women\'s', 'Splendour', 'Edit'],
    sub: 'Anarkalis & gharara sets in Chanderi silk — crafted for the modern queen',
    cta: 'Shop Women\'s', to: '/catalog?cat=women',
    accent: '#6B2D5E',
    category: 'Women',
    img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
    imgLabel: 'Women\'s Anarkali',
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
    title: ['Girls\'', 'Festive', 'Collection'],
    sub: 'Lehengas & salwar sets in soft pastels — for your little princess',
    cta: 'Shop Girls\'', to: '/catalog?cat=girls',
    accent: '#5C3A1A',
    category: 'Girls',
    img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    imgLabel: 'Girls Lehenga',
  },
  {
    tag: 'Mini Maharajas',
    title: ['Kids\'', 'Royal', 'Wear'],
    sub: 'Sherwanis & kurta sets for the youngest members of the royal family',
    cta: 'Shop Kids\'', to: '/catalog?cat=kids',
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
  }, [paused]);

  const slide = SLIDES[idx];

  return (
    <section style={{ minHeight: '100vh', background: '#060201', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <style>{fonts}{`
        .hero-btn-p { transition: all 0.35s ease; }
        .hero-btn-p:hover { background: #D4A017 !important; letter-spacing: 5px !important; }
        .hero-btn-g:hover { background: rgba(201,151,42,0.1) !important; }
        .cat-dot { transition: all 0.3s ease; cursor: pointer; }
        .cat-dot:hover { opacity: 1 !important; }
        @keyframes marquee { 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }
        .mq-track { display:flex; animation:marquee 44s linear infinite; width:max-content; }
        .mq-track:hover { animation-play-state:paused; }
        @keyframes imgReveal { from{ clip-path:inset(0 100% 0 0); } to{ clip-path:inset(0 0 0 0); } }
        .img-reveal { animation: imgReveal 0.85s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.35; } }
        @media(max-width:900px){ .hero-grid{ grid-template-columns:1fr!important; } .img-col{ display:none!important; } }
        @media(max-width:600px){ .cat-nav{ bottom:60px!important; gap:8px!important; } }
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
        {/* Grain texture */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.055,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      </motion.div>

      {/* ── Geometric ornaments ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(201,151,42,0.1) 25%, rgba(201,151,42,0.1) 75%, transparent)' }} />
        <div style={{ position: 'absolute', top: 90, right: 44, width: 52, height: 52,
          borderTop: '1px solid rgba(201,151,42,0.28)', borderRight: '1px solid rgba(201,151,42,0.28)' }} />
        <div style={{ position: 'absolute', bottom: 108, left: 44, width: 52, height: 52,
          borderBottom: '1px solid rgba(201,151,42,0.28)', borderLeft: '1px solid rgba(201,151,42,0.28)' }} />
      </div>

      {/* ── Hero: text + image ── */}
      <motion.div style={{ y: txtY, flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div className="hero-grid"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 48px 96px', width: '100%',
            display: 'grid', gridTemplateColumns: '1fr 400px', gap: 56, alignItems: 'center' }}>

          {/* LEFT — text */}
          <div>
            {/* Tag line */}
            <AnimatePresence mode="wait">
              <motion.div key={`tag-${idx}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
                <div style={{ width: 28, height: 1, background: '#C9972A' }} />
                <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 5,
                  color: '#C9972A', textTransform: 'uppercase', fontWeight: 500 }}>
                  {slide.tag}
                </span>
                <div style={{ width: 28, height: 1, background: '#C9972A' }} />
              </motion.div>
            </AnimatePresence>

            {/* Title — word-by-word slide up */}
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
                        fontSize: 'clamp(38px, 6.5vw, 90px)', lineHeight: 1.05,
                        color: i === 1 ? '#C9972A' : '#FFFDF5',
                        fontWeight: i === 1 ? 600 : 400,
                        letterSpacing: i === 1 ? 3 : 7 }}>
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p key={`sub-${idx}`}
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.26 }}
                style={{ fontFamily: 'Raleway, sans-serif', fontSize: 15, color: 'rgba(244,232,208,0.58)',
                  maxWidth: 370, lineHeight: 1.9, marginBottom: 38, fontStyle: 'italic', fontWeight: 300 }}>
                {slide.sub}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <AnimatePresence mode="wait">
              <motion.div key={`cta-${idx}`}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.34 }}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to={slide.to} className="hero-btn-p"
                  style={{ background: '#C9972A', color: '#060201', padding: '13px 34px',
                    fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 4,
                    fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
                  {slide.cta}
                </Link>
                <Link to="/showrooms" className="hero-btn-g"
                  style={{ border: '1px solid rgba(201,151,42,0.3)', color: 'rgba(244,232,208,0.72)',
                    padding: '13px 28px', fontFamily: 'Raleway, sans-serif', fontSize: 10,
                    letterSpacing: 4, fontWeight: 400, textTransform: 'uppercase', textDecoration: 'none' }}>
                  Visit Showroom
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — image */}
          <div className="img-col" style={{ position: 'relative', height: 500 }}>
            {/* Double frame */}
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,151,42,0.18)', zIndex: 3, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(201,151,42,0.09)', zIndex: 3, pointerEvents: 'none' }} />

            <AnimatePresence mode="wait">
              <motion.div key={`img-${idx}`} className="img-reveal"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
                <img src={slide.img} alt={slide.imgLabel}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center',
                    filter: 'sepia(12%) brightness(0.86) contrast(1.06)' }} />
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(6,2,1,0.45) 0%, transparent 55%), linear-gradient(to top, rgba(6,2,1,0.55) 0%, transparent 45%)' }} />
              </motion.div>
            </AnimatePresence>

            {/* Category label — top left */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 4,
              background: 'rgba(6,2,1,0.65)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(201,151,42,0.25)', padding: '5px 14px' }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: 9, letterSpacing: 4,
                color: '#C9972A', textTransform: 'uppercase' }}>{slide.category}</span>
            </div>

            {/* Counter — top right */}
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 4,
              fontFamily: 'Cinzel, serif', fontSize: 10, color: 'rgba(201,151,42,0.45)', letterSpacing: 2 }}>
              0{idx + 1}<span style={{ opacity: 0.4 }}> / 0{SLIDES.length}</span>
            </div>

            {/* Image label — bottom */}
            <div style={{ position: 'absolute', bottom: 18, left: 20, zIndex: 4,
              display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 1, background: '#C9972A' }} />
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 4,
                color: 'rgba(201,151,42,0.65)', textTransform: 'uppercase' }}>{slide.imgLabel}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Category nav pills ── */}
      <div className="cat-nav"
        style={{ position: 'absolute', bottom: 72, left: '50%', transform: 'translateX(-50%)',
          zIndex: 3, display: 'flex', gap: 12, alignItems: 'center' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
        {SLIDES.map((s, i) => (
          <button key={s.category} onClick={() => goTo(i)} className="cat-dot"
            style={{ background: 'none', border: 'none', padding: '6px 4px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              opacity: i === idx ? 1 : 0.4 }}>
            <motion.div
              animate={{ width: i === idx ? 36 : 16, background: i === idx ? '#C9972A' : 'rgba(201,151,42,0.5)' }}
              transition={{ duration: 0.3 }}
              style={{ height: 1 }} />
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 8, letterSpacing: 3,
              color: i === idx ? '#C9972A' : 'rgba(255,253,245,0.5)', textTransform: 'uppercase',
              transition: 'color 0.3s', whiteSpace: 'nowrap' }}>
              {s.category}
            </span>
          </button>
        ))}
      </div>

      {/* ── Right edge progress bars ── */}
      <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
        zIndex: 3, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3 }}>
            <motion.div
              animate={{ height: i === idx ? 34 : 7, background: i === idx ? '#C9972A' : 'rgba(201,151,42,0.22)' }}
              transition={{ duration: 0.3 }}
              style={{ width: 1 }} />
          </button>
        ))}
      </div>

      {/* ══ MARQUEE TICKER ══ */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{ position: 'relative', zIndex: 2, overflow: 'hidden',
          borderTop: '1px solid rgba(201,151,42,0.12)',
          background: 'rgba(6,2,1,0.78)', backdropFilter: 'blur(14px)' }}>

        <div style={{ height: 1, position: 'absolute', top: 0, left: 0, right: 0,
          background: 'linear-gradient(90deg, transparent, rgba(201,151,42,0.45) 25%, rgba(201,151,42,0.45) 75%, transparent)' }} />

        <div style={{ padding: '13px 0', display: 'flex', alignItems: 'center', position: 'relative' }}>
          {/* Live badge */}
          <div style={{ flexShrink: 0, padding: '0 18px', borderRight: '1px solid rgba(201,151,42,0.18)',
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9972A', flexShrink: 0,
              boxShadow: '0 0 8px rgba(201,151,42,0.8)', animation: 'pulse 2s ease-in-out infinite', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 8, letterSpacing: 4,
              color: '#C9972A', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Live Offers
            </span>
          </div>

          {/* Scroll track */}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="mq-track">
              {TICKER_DOUBLED.map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: 'Raleway, sans-serif', fontSize: 12, fontWeight: 400,
                  color: 'rgba(244,232,208,0.72)', whiteSpace: 'nowrap', padding: '0 32px' }}>
                  <span style={{ color: '#C9972A', fontSize: 10, flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Edge fade masks */}
          <div style={{ position: 'absolute', left: 110, top: 0, bottom: 0, width: 56, pointerEvents: 'none',
            background: 'linear-gradient(to right, rgba(6,2,1,0.78), transparent)' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 56, pointerEvents: 'none',
            background: 'linear-gradient(to left, rgba(6,2,1,0.78), transparent)' }} />
        </div>
      </motion.div>
    </section>
  );
}