import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`;

const CATS = [
  { l: 'Men', q: 'men', num: '120+', symbol: 'I', s: 'Sherwanis & Achkans', desc: 'Classic ivory to deep maroon — silhouettes crafted for the modern groom.', img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=1400&q=90' },
  { l: 'Women', q: 'women', num: '85+', symbol: 'II', s: 'Anarkalis & Gharara', desc: 'Grace in Chanderi silk — flowing layers that move like music.', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=90' },
  { l: 'Bridal', q: 'bridal', num: '60+', symbol: 'III', s: 'Bespoke Lehengas', desc: 'Finest Zardozi & Mukaish — each piece a lifelong heirloom.', img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=1400&q=90' },
  { l: 'Girls', q: 'girls', num: '55+', symbol: 'IV', s: 'Festive Wear', desc: 'Pastels & golden gota — enchanting ensembles for little ones.', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1400&q=90' },
  { l: 'Kids', q: 'kids', num: '40+', symbol: 'V', s: 'Mini Royals', desc: 'Heirloom quality kurtas crafted with total devotion.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90' },
];

const DURATION = 5000;

export default function VarietyPage() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const touchStart = useRef(null);

  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = winWidth < 768;
  const isTablet = winWidth >= 768 && winWidth < 1024;

  const go = useCallback((idx) => {
    setDir(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => go((active + 1) % CATS.length), [go, active]);
  const prev = useCallback(() => go((active - 1 + CATS.length) % CATS.length), [go, active]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, DURATION);
    return () => clearInterval(timer);
  }, [next, paused]);

  const handleTouchStart = (e) => (touchStart.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  const cat = CATS[active];

  return (
    <section style={{ background: '#F9F8F3', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style>{fonts}{`
        .vp-slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .vp-nav-pill { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 12px 0; width: 100%; }
        .np-label { font-family: 'Raleway'; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #1A1A1A; opacity: 0.4; transition: 0.3s; }
        .np-label.active { opacity: 1; color: #B8860B; font-weight: 600; }
        .np-dot { width: 20px; height: 1px; background: #D4CFC4; transition: 0.4s; }
        .np-dot.active { width: 40px; background: #B8860B; }
        .vp-cta { font-family: 'Raleway'; font-size: 11px; letter-spacing: 2px; color: #1A1A1A; background: #FFF; padding: 14px 24px; text-decoration: none; text-transform: uppercase; border-radius: 2px; transition: 0.3s; }
        .vp-arrow { width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: #FFF; cursor: pointer; backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .vp-arrow:hover { background: #B8860B; border-color: #B8860B; }
        @media (max-width: 767px) {
          .vp-arrow { width: 40px; height: 40px; }
          .vp-cta { padding: 12px 18px; font-size: 10px; }
        }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '20px 20px 40px' : '40px' }}>
        
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: isMobile ? 30 : 50, flexDirection: isMobile ? 'column' : 'row', gap: 20 }}>
          <div>
            <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 4, color: '#B8860B', fontWeight: 600, textTransform: 'uppercase' }}>Royal Collections</span>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(32px, 5vw, 52px)', color: '#1A1A1A', margin: '8px 0 0', fontWeight: 400 }}>
              The <em style={{ fontStyle: 'italic', color: '#B8860B' }}>Variety</em>
            </h2>
          </div>
          <Link to="/catalog" style={{ fontFamily: 'Raleway', fontSize: 11, color: '#1A1A1A', textDecoration: 'none', borderBottom: '1px solid #B8860B', paddingBottom: 5, letterSpacing: 2 }}>
            EXPLORE ALL
          </Link>
        </header>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 30 : 40, alignItems: 'stretch' }}>
          
          {/* Main Slider Area */}
          <div 
            style={{ position: 'relative', flex: 1, height: isMobile ? '110vw' : '75vh', borderRadius: 4, overflow: 'hidden', cursor: 'grab' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={active}
                src={cat.img}
                alt={cat.l}
                className="vp-slide-img"
                initial={{ x: dir * 100 + '%', opacity: 0.8 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -dir * 100 + '%', opacity: 0.8 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              />
            </AnimatePresence>

            {/* Overlays */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', pointerEvents: 'none' }} />

            {/* Content Over Image */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: isMobile ? '30px' : '50px' }}>
              <motion.div key={active + 'meta'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <p style={{ fontFamily: 'Cinzel', color: '#B8860B', fontSize: 13, letterSpacing: 3, marginBottom: 10 }}>{cat.num} PIECES</p>
                <h3 style={{ fontFamily: 'Cinzel', color: '#FFF', fontSize: 'clamp(34px, 4vw, 58px)', margin: '0 0 10px', fontWeight: 400 }}>{cat.l}</h3>
                <p style={{ fontFamily: 'Raleway', color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 13 : 15, lineHeight: 1.6, maxWidth: 450, marginBottom: 30 }}>{cat.desc}</p>
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <Link to={`/catalog?q=${cat.q}`} className="vp-cta">View Collection</Link>
                <button onClick={prev} className="vp-arrow" aria-label="Prev">←</button>
                <button onClick={next} className="vp-arrow" aria-label="Next">→</button>
              </div>
            </div>

            {/* Auto-play Progress Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)' }}>
              <motion.div 
                key={active + (paused ? 'p' : 'r')}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DURATION / 1000, ease: "linear" }}
                style={{ height: '100%', background: '#B8860B', transformOrigin: '0%' }}
              />
            </div>
          </div>

          {/* Desktop/Tablet Sidebar Navigation */}
          {!isMobile && (
            <nav style={{ minWidth: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <p style={{ fontFamily: 'Raleway', fontSize: 9, letterSpacing: 4, color: '#A09E94', textTransform: 'uppercase', marginBottom: 20 }}>Categories</p>
               {CATS.map((item, i) => (
                 <button key={i} className="vp-nav-pill" onClick={() => go(i)}>
                    <div className={`np-dot ${active === i ? 'active' : ''}`} />
                    <span className={`np-label ${active === i ? 'active' : ''}`}>{item.l}</span>
                 </button>
               ))}
               <div style={{ marginTop: 30, fontFamily: 'Cinzel', color: '#1A1A1A', fontSize: 18 }}>
                  <span style={{ color: '#B8860B' }}>0{active + 1}</span>
                  <span style={{ opacity: 0.2 }}> / 05</span>
               </div>
            </nav>
          )}

          {/* Mobile Dot Nav (Alternative) */}
          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              {CATS.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => go(i)}
                  style={{ width: active === i ? 30 : 8, height: 2, background: active === i ? '#B8860B' : '#D4CFC4', border: 'none', transition: '0.3s' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}