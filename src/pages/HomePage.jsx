import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { C } from '../theme'; 

const SLIDES = [
  {
    tag: 'New Arrival — 2025',
    title: ['The', 'Maharaja', 'Collection'],
    sub: 'Sherwanis woven with Banarasi silk & hand-embroidered zardozi',
    cta: "Explore Men's", to: '/mens',
    img: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=1200',
  },
  {
    tag: 'Royal Femininity',
    title: ["Women's", 'Splendour', 'Edit'],
    sub: 'Anarkalis & gharara sets in Chanderi silk — crafted for the modern queen',
    cta: "Shop Women's", to: '/womens',
    img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200',
  },
  {
    tag: 'Joys of Childhood',
    title: ['The', 'Junior', 'Atelier'],
    sub: 'Festive finery and bespoke comfort for life’s first milestones',
    cta: "Shop Kids", to: '/kids',
    img: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=1200',
  }
];

const TICKER_ITEMS = [
  { icon: '✦', text: 'New Stock — Chanderi & Maheshwari Collection' },
  { icon: '◈', text: 'Wedding Season — 20% Off All Sherwanis' },
  { icon: '✦', text: 'Bhopal Showroom Open 7 Days a Week' },
];

const TICKER_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function HomePage() {
  const [idx, setIdx] = useState(0);
  const { scrollY } = useScroll();
  const bgScale = useTransform(scrollY, [0, 500], [1, 1.15]);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [idx]);

  const slide = SLIDES[idx];

  return (
    <section className="page-wrapper" style={{ background: C.page }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Raleway:wght@300;400;700&display=swap');
        
        .page-wrapper {
          min-height: 100vh;
          padding-top: 100px;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* ----- DESKTOP FLEX LAYOUT (Perfectly proportioned) ----- */
        .hero-layout {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          max-width: 1200px; /* Tighter overall container */
          margin: 0 auto;
          padding: 40px 5vw;
          gap: 8vw; /* Beautiful white space between text and image */
          flex-grow: 1;
        }

        /* TEXT SECTION */
        .text-content {
          flex: 1;
          max-width: 520px; /* Constrain text width so it doesn't look stretched */
          text-align: left;
          z-index: 10;
        }

        .slide-tag {
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          letter-spacing: 6px;
          color: ${C.gold};
          font-weight: 700;
          text-transform: uppercase;
          display: block;
          margin-bottom: 24px;
        }

        .slide-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(38px, 4.5vw, 68px); 
          line-height: 1.1;
          color: ${C.ink};
          margin-bottom: 24px;
          font-weight: 400;
        }

        .slide-sub {
          font-family: 'Raleway', sans-serif;
          font-size: 16px;
          color: ${C.muted};
          line-height: 1.7;
          margin-bottom: 40px;
          font-weight: 400;
        }

        /* IMAGE SECTION */
        .img-frame-container {
          flex: 0 0 auto; /* Prevents flexbox from stretching the image */
          position: relative;
          width: 100%;
          max-width: 420px; /* CRITICAL FIX: Smaller, elegant image size */
        }

        .floating-border {
          position: absolute;
          top: 15px; left: 15px; right: -15px; bottom: -15px;
          border: 1px solid ${C.gold};
          z-index: 1;
          pointer-events: none;
        }

        .frame-accent {
          position: absolute;
          top: -8px; left: -8px;
          width: 40px; height: 40px;
          border-top: 3px solid ${C.maroon};
          border-left: 3px solid ${C.maroon};
          z-index: 5;
        }

        .img-mask {
          position: relative;
          overflow: hidden;
          z-index: 2;
          aspect-ratio: 4/5;
          box-shadow: 15px 15px 40px rgba(0,0,0,0.08);
        }

        /* BUTTON */
        .cta-btn {
          display: inline-block;
          padding: 16px 40px;
          background: ${C.maroon};
          color: white;
          text-decoration: none;
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 700;
          text-transform: uppercase;
          transition: 0.4s ease;
          border: 1px solid ${C.maroon};
        }

        .cta-btn:hover {
          background: transparent;
          color: ${C.maroon};
          transform: translateY(-3px);
        }

        /* TICKER */
        @keyframes marquee { 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }
        .mq-track { display:flex; animation:marquee 30s linear infinite; width:max-content; }

        /* ----- TABLET & MOBILE RESPONSIVE ----- */
        @media(max-width: 968px) {
          .hero-layout { 
            flex-direction: column;
            text-align: center; 
            padding: 20px 24px 60px 24px;
            gap: 40px;
          }
          
          .text-content {
            text-align: center;
            max-width: 100%;
          }

          .img-frame-container { 
            order: -1; /* Puts image above text on mobile */
            max-width: 360px; /* Slightly smaller for mobile layout */
          }
        }

        @media(max-width: 480px) {
          .page-wrapper { padding-top: 80px; }
          .hero-layout { gap: 30px; }
          .floating-border { right: -10px; bottom: -10px; }
          .img-frame-container { max-width: 280px; }
          .cta-btn { width: 100%; box-sizing: border-box; }
        }
      `}</style>

      <div className="hero-layout">
        {/* TEXT SECTION */}
        <div className="text-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="slide-tag">{slide.tag}</span>

              <h1 className="slide-title">
                {slide.title[0]} <br />
                <span style={{ color: C.maroon, fontWeight: 600, fontStyle: 'italic' }}>{slide.title[1]}</span> <br />
                {slide.title[2]}
              </h1>

              <p className="slide-sub">
                {slide.sub}
              </p>

              <Link to={slide.to} className="cta-btn">
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* IMAGE SECTION */}
        <div className="img-frame-container">
          <div className="frame-accent" />
          <div className="floating-border" />
          <div className="img-mask">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                style={{ width: '100%', height: '100%' }}
              >
                <motion.img 
                  style={{ scale: bgScale, width: '100%', height: '100%', objectFit: 'cover' }}
                  src={slide.img} 
                  alt="Collection Editorial" 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FOOTER CONTROLS & TICKER */}
      <div style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '30px' }}>
          {SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{ 
                width: i === idx ? 45 : 12, height: 3, border: 'none',
                background: i === idx ? C.maroon : `${C.border}88`, 
                transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)', cursor: 'pointer' 
              }} 
            />
          ))}
        </div>

        <div style={{ background: '#FFF', borderTop: `1px solid ${C.border}44`, padding: '16px 0' }}>
          <div className="mq-track">
            {TICKER_DOUBLED.map((item, i) => (
              <span key={i} style={{ 
                fontFamily: 'Raleway', fontSize: 11, color: C.ink, padding: '0 50px',
                letterSpacing: 2, whiteSpace: 'nowrap', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12
              }}>
                <span style={{ color: C.gold, fontSize: 14 }}>{item.icon}</span> {item.text.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}