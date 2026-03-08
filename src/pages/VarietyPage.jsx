import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`;

const CATS = [
  {
    l: 'Men', q: 'men', num: '120+', symbol: 'I',
    s: 'Sherwanis & Achkans',
    desc: 'Classic ivory to deep maroon — silhouettes crafted for the modern groom who honours tradition.',
    img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=1400&q=90',
  },
  {
    l: 'Women', q: 'women', num: '85+', symbol: 'II',
    s: 'Anarkalis & Gharara',
    desc: 'Grace in Chanderi silk — flowing layers that move like music through every celebration.',
    img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=90',
  },
  {
    l: 'Bridal', q: 'bridal', num: '60+', symbol: 'III',
    s: 'Bespoke Lehengas',
    desc: 'Finest Zardozi & Mukaish — each piece a lifelong heirloom, made for your most sacred moment.',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=1400&q=90',
  },
  {
    l: 'Girls', q: 'girls', num: '55+', symbol: 'IV',
    s: 'Festive Wear',
    desc: 'Pastels & golden gota — enchanting ensembles that let little ones shine at every occasion.',
    img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1400&q=90',
  },
  {
    l: 'Kids', q: 'kids', num: '40+', symbol: 'V',
    s: 'Mini Royals',
    desc: 'Heirloom quality kurtas — crafted with the same devotion as our finest adult collections.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90',
  },
];

const DURATION = 5000;

export default function VarietyPage() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const go = useCallback((idx) => {
    setDir(idx > active ? 1 : -1);
    setActive(idx);
    setProgress(0);
  }, [active]);

  const next = useCallback(() => go((active + 1) % CATS.length), [go, active]);

  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / DURATION, 1));
      if (elapsed >= DURATION) next();
    }, 16);
    return () => clearInterval(tick);
  }, [next, paused, active]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0
        ? go((active + 1) % CATS.length)
        : go((active - 1 + CATS.length) % CATS.length);
    }
    setTouchStart(null);
  };

  const cat = CATS[active];
  const isSmall = isMobile || isTablet;

  return (
    <section style={{ background: '#F9F8F3', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; }

        .vp-slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform, opacity;
        }

        .vp-nav-pill {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .vp-nav-pill:hover .np-label { opacity: 1; transform: translateX(0); }

        .np-label {
          font-family: 'Raleway', sans-serif;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1A1A1A;
          opacity: 0.35;
          transition: opacity 0.3s, transform 0.3s;
          transform: translateX(-4px);
          white-space: nowrap;
        }
        .np-label.active { opacity: 1; color: #B8860B; transform: translateX(0); }

        .np-dot {
          width: 24px;
          height: 1px;
          background: #D4D0C8;
          flex-shrink: 0;
          transition: width 0.4s, background 0.3s;
        }
        .np-dot.active { width: 40px; background: #B8860B; }

        /* Horizontal dot nav for mobile */
        .vp-dot-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .vp-dot-h {
          width: 20px;
          height: 1.5px;
          background: rgba(255,255,255,0.3);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: width 0.4s, background 0.3s;
        }
        .vp-dot-h.active { width: 36px; background: #B8860B; }

        .vp-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.08);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          backdrop-filter: blur(8px);
          transition: background 0.3s, border-color 0.3s;
          flex-shrink: 0;
        }
        .vp-arrow:hover { background: rgba(184,134,11,0.5); border-color: #B8860B; }

        .vp-cta {
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          color: #1A1A1A;
          background: #F9F8F3;
          padding: 13px 24px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 0.3s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .vp-cta:hover { background: #E8E4D8; }

        @media (max-width: 639px) {
          .vp-cta { font-size: 10px; letter-spacing: 2px; padding: 11px 18px; }
          .vp-arrow { width: 38px; height: 38px; }
        }
      `}</style>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: isMobile ? '40px 20px 60px' : isTablet ? '50px 32px 70px' : '60px clamp(20px, 5vw, 60px) 80px' }}>

        {/* HEADER */}
        <header style={{
          marginBottom: isMobile ? 28 : 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 14 : 20,
        }}>
          <div>
            <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 600, textTransform: 'uppercase' }}>
              The Collections
            </span>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: isMobile ? 28 : isTablet ? 36 : 'clamp(28px, 4vw, 48px)', color: '#1A1A1A', marginTop: 10, fontWeight: 400 }}>
              Curated <em style={{ fontStyle: 'italic', color: '#B8860B' }}>Variety</em>
            </h2>
          </div>
          <Link to="/catalog" style={{ fontFamily: 'Raleway', fontSize: 11, color: '#1A1A1A', textDecoration: 'none', borderBottom: '1px solid #B8860B', paddingBottom: 4, letterSpacing: 2 }}>
            VIEW ALL COLLECTIONS
          </Link>
        </header>

        {/* MAIN LAYOUT */}
        <div style={{ display: 'flex', gap: isSmall ? 0 : 32, alignItems: 'stretch', flexDirection: 'row' }}>

          {/* SLIDER */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              height: isMobile ? '70vw' : isTablet ? '60vw' : '88vh',
              minHeight: isMobile ? 320 : isTablet ? 420 : 560,
              maxHeight: isMobile ? 520 : isTablet ? 620 : 'none',
              overflow: 'hidden',
              borderRadius: 4,
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Images */}
            <AnimatePresence initial={false} custom={dir}>
              <motion.img
                key={cat.img}
                src={cat.img}
                alt={cat.l}
                className="vp-slide-img"
                custom={dir}
                initial={{ x: dir * 60, opacity: 0, scale: 1.04 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: dir * -60, opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>

            {/* Gradients */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,5,0.88) 0%, rgba(10,8,5,0.2) 55%, transparent 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,8,5,0.25) 0%, transparent 55%)', pointerEvents: 'none' }} />

            {/* Roman numeral watermark — hide on mobile to save space */}
            {!isMobile && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={cat.symbol}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.07, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: 'absolute', top: 24, right: isTablet ? 24 : 40,
                    fontFamily: 'Cinzel', fontSize: isTablet ? 80 : 120, fontWeight: 700,
                    color: '#F9F8F3', lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
                  }}
                >
                  {cat.symbol}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Bottom text block */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: isMobile ? '0 20px 52px' : isTablet ? '0 28px 48px' : '0 44px 52px',
            }}>

              {/* Piece count */}
              <AnimatePresence mode="wait">
                <motion.div key={cat.num + 'n'}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45 }}
                  style={{ fontFamily: 'Cinzel', fontSize: isMobile ? 11 : 13, color: '#B8860B', letterSpacing: 3, marginBottom: 8 }}
                >
                  {cat.num} Pieces
                </motion.div>
              </AnimatePresence>

              {/* Title */}
              <AnimatePresence mode="wait">
                <motion.h3 key={cat.l}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: 'Cinzel',
                    fontSize: isMobile ? 30 : isTablet ? 40 : 'clamp(36px, 5vw, 62px)',
                    color: '#F9F8F3', margin: '0 0 6px', fontWeight: 400, lineHeight: 1.1,
                  }}
                >
                  {cat.l}
                </motion.h3>
              </AnimatePresence>

              {/* Sub-label */}
              <AnimatePresence mode="wait">
                <motion.p key={cat.s}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  style={{ fontFamily: 'Raleway', fontSize: isMobile ? 9 : 11, letterSpacing: isMobile ? 2 : 3, textTransform: 'uppercase', color: '#F9F8F3', margin: '0 0 12px' }}
                >
                  {cat.s}
                </motion.p>
              </AnimatePresence>

              {/* Desc — hide on very small screens */}
              {!isMobile && (
                <AnimatePresence mode="wait">
                  <motion.p key={cat.desc}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.85, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, delay: 0.18 }}
                    style={{ fontFamily: 'Raleway', fontSize: isTablet ? 13 : 14, color: '#F9F8F3', margin: '0 0 24px', lineHeight: 1.7, maxWidth: 400 }}
                  >
                    {cat.desc}
                  </motion.p>
                </AnimatePresence>
              )}

              {/* CTA + arrows */}
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14, flexWrap: 'nowrap' }}>
                <Link to={`/catalog?cat=${cat.q}`} className="vp-cta">
                  Explore {cat.l}
                </Link>
                <button className="vp-arrow" onClick={() => go((active - 1 + CATS.length) % CATS.length)} aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button className="vp-arrow" onClick={() => go((active + 1) % CATS.length)} aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>

                {/* Counter — visible on mobile in CTA row */}
                {isMobile && (
                  <span style={{ fontFamily: 'Cinzel', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }}>
                    <span style={{ color: '#B8860B' }}>0{active + 1}</span>
                    <span> / 0{CATS.length}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Mobile horizontal dot nav (above CTA, between gradient and text) */}
            {isMobile && (
              <div className="vp-dot-nav" style={{ position: 'absolute', bottom: 16, left: 0, right: 0 }}>
                {CATS.map((_, i) => (
                  <button
                    key={i}
                    className={`vp-dot-h${active === i ? ' active' : ''}`}
                    onClick={() => go(i)}
                    aria-label={`Go to ${CATS[i].l}`}
                  />
                ))}
              </div>
            )}

            {/* Progress bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                key={active}
                style={{ height: '100%', background: '#B8860B', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? progress : 1 }}
                transition={paused ? { duration: 0 } : { duration: DURATION / 1000, ease: 'linear' }}
              />
            </div>
          </div>

          {/* VERTICAL SIDE NAV — tablet and desktop only */}
          {!isMobile && (
            <nav style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              gap: 2, paddingLeft: 8,
              minWidth: isTablet ? 110 : 140,
            }}>
              <div style={{ fontFamily: 'Raleway', fontSize: 9, letterSpacing: 4, color: '#A09E94', textTransform: 'uppercase', marginBottom: 18 }}>
                Categories
              </div>
              {CATS.map((c, i) => (
                <button key={c.l} className="vp-nav-pill" onClick={() => go(i)}>
                  <span className={`np-dot${active === i ? ' active' : ''}`} />
                  <span className={`np-label${active === i ? ' active' : ''}`}>{c.l}</span>
                </button>
              ))}
              <div style={{ marginTop: 22, fontFamily: 'Cinzel', fontSize: 13, color: '#1A1A1A' }}>
                <span style={{ color: '#B8860B' }}>0{active + 1}</span>
                <span style={{ opacity: 0.2 }}> / 0{CATS.length}</span>
              </div>
            </nav>
          )}
        </div>

        {/* FOOTER */}
        <footer style={{ marginTop: isMobile ? 32 : 48, textAlign: 'center' }}>
          <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 4, color: '#A09E94', textTransform: 'uppercase' }}>
            Hand-stitched in Vidisha • Delivered Worldwide
          </p>
        </footer>
      </div>
    </section>
  );
}