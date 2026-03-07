import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { C } from '../theme'; 

const SLIDES = [
  {
    tag: 'New Arrival — 2025',
    title: ['The', 'Maharaja', 'Collection'],
    sub: 'Sherwanis woven with Banarasi silk & hand-embroidered zardozi',
    cta: "Explore Men's", to: '/catalog?cat=men',
    img: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=1200',
  },
  {
    tag: 'Royal Femininity',
    title: ["Women's", 'Splendour', 'Edit'],
    sub: 'Anarkalis & gharara sets in Chanderi silk — crafted for the modern queen',
    cta: "Shop Women's", to: '/catalog?cat=women',
    img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200',
  },
  {
    tag: 'Exclusively Crafted',
    title: ['Bridal', 'Lehengas', ''],
    sub: 'Timeless silhouettes for the most sacred of ceremonies',
    cta: 'View Bridal', to: '/catalog?cat=bridal',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?auto=format&fit=crop&q=80&w=1200',
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
  const bgScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [idx]);

  const slide = SLIDES[idx];

  return (
    <section style={{ minHeight: '100vh', background: C.page, paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Raleway:wght@300;400;700&display=swap');
        
        .hero-container {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 5%;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .cta-btn {
          position: relative;
          padding: 16px 40px;
          background: ${C.maroon};
          color: white;
          text-decoration: none;
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.4s ease;
          border: 1px solid ${C.maroon};
        }

        .cta-btn:hover {
          background: transparent;
          color: ${C.maroon};
          box-shadow: 0 10px 20px rgba(107, 15, 26, 0.1);
        }

        @keyframes marquee { 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }
        .mq-track { display:flex; animation:marquee 35s linear infinite; width:max-content; }

        @media(max-width: 1024px) {
          .hero-container { flex-direction: column; padding: 40px 24px; text-align: center; }
          .img-wrapper { width: 100% !important; height: 400px !important; margin-top: 40px; }
          .text-content { padding-right: 0 !important; }
        }
      `}</style>

      <div className="hero-container">
        {/* TEXT SECTION */}
        <div className="text-content" style={{ flex: 1.2, paddingRight: '5%', zIndex: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={{ 
                fontFamily: 'Raleway', fontSize: 10, letterSpacing: 6, 
                color: C.gold, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 20 
              }}>
                {slide.tag}
              </span>

              <h1 style={{ 
                fontFamily: 'Cinzel', fontSize: 'clamp(38px, 5vw, 72px)', 
                lineHeight: 1.1, color: C.ink, marginBottom: 24, fontWeight: 400
              }}>
                {slide.title[0]} <br />
                <span style={{ color: C.maroon, fontWeight: 600 }}>{slide.title[1]}</span> <br />
                {slide.title[2]}
              </h1>

              <p style={{ 
                fontFamily: 'Raleway', fontSize: 'clamp(14px, 2vw, 18px)', color: C.muted, 
                maxWidth: 480, lineHeight: 1.8, marginBottom: 45, fontWeight: 300,
                marginInline: window.innerWidth < 1024 ? 'auto' : '0'
              }}>
                {slide.sub}
              </p>

              <Link to={slide.to} className="cta-btn">
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* IMAGE SECTION */}
        <div className="img-wrapper" style={{ 
          flex: 0.8, height: '70vh', position: 'relative', overflow: 'hidden',
          borderRadius: '4px', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' 
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{ width: '100%', height: '100%' }}
            >
              <motion.img 
                style={{ scale: bgScale, width: '100%', height: '100%', objectFit: 'cover' }}
                src={slide.img} 
                alt="Editorial Collection" 
              />
              <div style={{ 
                position: 'absolute', inset: 0, 
                background: `linear-gradient(20deg, ${C.page}33, transparent)` 
              }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER AREA: NAV & TICKER */}
      <div style={{ padding: '40px 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '30px' }}>
          {SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIdx(i)}
              style={{ 
                width: i === idx ? 40 : 8, height: 2, border: 'none',
                background: i === idx ? C.maroon : C.border, 
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer' 
              }} 
            />
          ))}
        </div>

        <div style={{ 
          background: '#FFF', borderTop: `1px solid ${C.border}55`, padding: '18px 0',
          boxShadow: '0 -5px 20px rgba(0,0,0,0.02)'
        }}>
          <div className="mq-track">
            {TICKER_DOUBLED.map((item, i) => (
              <span key={i} style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 15,
                fontFamily: 'Raleway', fontSize: 11, color: C.ink, padding: '0 60px',
                letterSpacing: 2, whiteSpace: 'nowrap', fontWeight: 600
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