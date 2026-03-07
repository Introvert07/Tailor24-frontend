import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

const REVIEWS = [
  {
    name: 'Arjun Mehta', city: 'New Delhi', year: '2024', rating: 5,
    occasion: 'Wedding Sherwani',
    short: 'An heirloom in the truest sense.',
    text: 'The sherwani crafted for my wedding was beyond imagination. Every guest stopped to ask where I had it made. The zardozi on the neckline alone took two artisans twelve days — and it shows in every stitch.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=85',
  },
  {
    name: 'Priya Kapoor', city: 'Mumbai', year: '2024', rating: 5,
    occasion: 'Bridal Lehenga',
    short: 'Every thread felt like it was made for me.',
    text: 'I have worn many designer lehengas, but nothing compares to what Tailor 24 created for my wedding. The fabric, the embroidery, the fit — there was not a single compromise. I felt like royalty.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=85',
  },
  {
    name: 'Vikram Singh', city: 'Jaipur', year: '2024', rating: 5,
    occasion: 'Achkan & Churidar',
    short: 'Unmatched in every way.',
    text: 'Tailor 24 turned my vision into reality. The Chanderi achkan drapes like nothing I have worn before — and the collar detailing alone took three karigars a week. I will not go anywhere else.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85',
  },
  {
    name: 'Rohit Agarwal', city: 'Lucknow', year: '2023', rating: 5,
    occasion: 'Wedding Sherwani',
    short: 'Timeless quality, across generations.',
    text: 'Three generations of my family have been patrons of this craft. The quality is timeless — it carries the weight of tradition and wears like a second skin. My grandfather would have approved.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=85',
  },
];

export default function TestimonialsPage() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = (next) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    if (!paused) {
      timerRef.current = setInterval(() => {
        setDir(1);
        setIdx(i => (i + 1) % REVIEWS.length);
      }, 6500);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx(i => (i + 1) % REVIEWS.length);
    }, 6500);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => { resetTimer(); }, [paused]);

  const r = REVIEWS[idx];

  return (
    <section
      style={{ background: '#F9F8F3', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <style>{fonts}{`
        * { box-sizing: border-box; }
        .tp-wrapper { max-width: 1300px; margin: 0 auto; padding: 100px 50px 80px; position: relative; z-index: 1; }
        .tp-inner { display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; }
        .tp-nav-btn { background: none; border: none; cursor: pointer; padding: 12px 20px; transition: all 0.3s; }
        .tp-photo-container { position: relative; height: 500px; box-shadow: 20px 20px 60px rgba(0,0,0,0.05); }
        
        @media(max-width: 1024px) {
          .tp-inner { grid-template-columns: 1fr; gap: 50px; }
          .tp-photo-container { height: 400px; max-width: 500px; margin: 0 auto; }
          .tp-nav-row { flex-direction: column; gap: 30px; align-items: center; text-align: center; }
        }
      `}</style>

      {/* Subtle Texture/Background Overlay */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.02, pointerEvents: 'none', 
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

      <div className="tp-wrapper">
        {/* LIGHT SECTION LABEL */}
        <header style={{ marginBottom: 80, textAlign: 'center' }}>
          <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 600, textTransform: 'uppercase' }}>
            Patron Chronicles
          </span>
          <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(32px, 4vw, 48px)', color: '#1A1A1A', marginTop: 15, fontWeight: 400 }}>
            Voices of <em style={{ fontStyle: 'italic', color: '#B8860B' }}>Heritage</em>
          </h2>
        </header>

        {/* MAIN SLIDE */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={idx} custom={dir}
              variants={{
                enter: (d) => ({ opacity: 0, x: d > 0 ? 50 : -50, scale: 0.98 }),
                center: { opacity: 1, x: 0, scale: 1 },
                exit: (d) => ({ opacity: 0, x: d > 0 ? -50 : 50, scale: 0.98 }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>

              <div className="tp-inner">
                {/* TEXT SIDE */}
                <div>
                  <div style={{ display: 'inline-block', background: '#F0EAD6', padding: '6px 14px', borderRadius: 2, marginBottom: 30 }}>
                    <span style={{ fontFamily: 'Raleway', fontSize: 9, letterSpacing: 3, color: '#8B1A28', textTransform: 'uppercase', fontWeight: 700 }}>{r.occasion}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 4, marginBottom: 25 }}>
                    {Array(r.rating).fill(0).map((_, i) => (
                      <span key={i} style={{ color: '#B8860B', fontSize: 14 }}>★</span>
                    ))}
                  </div>

                  <p style={{ fontFamily: 'Cinzel', fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#1A1A1A', lineHeight: 1.3, marginBottom: 35, fontStyle: 'italic' }}>
                    "{r.short}"
                  </p>

                  <p style={{ fontFamily: 'Raleway', fontSize: 16, color: '#5C5C5C', lineHeight: 1.8, fontWeight: 400, marginBottom: 40 }}>
                    {r.text}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 40, height: 1, background: '#B8860B' }} />
                    <div>
                      <h4 style={{ fontFamily: 'Cinzel', fontSize: 15, color: '#1A1A1A', letterSpacing: 2, margin: 0 }}>{r.name}</h4>
                      <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 3, color: '#B8860B', textTransform: 'uppercase', marginTop: 4 }}>
                        {r.city} • {r.year}
                      </p>
                    </div>
                  </div>
                </div>

                {/* IMAGE SIDE */}
                <div className="tp-photo-container">
                  <div style={{ position: 'absolute', inset: -1, border: '1px solid #EAE8E0', zIndex: -1 }} />
                  <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(5%) contrast(105%)' }} />
                  </div>
                  {/* Floating Year Tag */}
                  <div style={{ position: 'absolute', bottom: 20, right: -20, background: '#1A1A1A', color: '#F9F8F3', padding: '10px 20px', fontFamily: 'Cinzel', fontSize: 12 }}>
                    SINCE {r.year}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAVIGATION & CONTROLS */}
        <div className="tp-nav-row" style={{ marginTop: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EAE8E0', paddingTop: 40 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {REVIEWS.map((rv, i) => (
              <button key={i} onClick={() => go(i)} className="tp-nav-btn">
                <span style={{ fontFamily: 'Cinzel', fontSize: 10, letterSpacing: 2, color: i === idx ? '#1A1A1A' : '#A09E94', fontWeight: i === idx ? 700 : 400 }}>
                  {rv.name.split(' ')[0]}
                </span>
                {i === idx && (
                  <motion.div layoutId="nav-dot" style={{ width: '100%', height: 2, background: '#B8860B', marginTop: 4 }} />
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => go((idx - 1 + REVIEWS.length) % REVIEWS.length)}
              style={{ width: 50, height: 50, border: '1px solid #EAE8E0', background: '#FFF', cursor: 'pointer', color: '#1A1A1A' }}>←</button>
            <button onClick={() => go((idx + 1) % REVIEWS.length)}
              style={{ width: 50, height: 50, border: '1px solid #EAE8E0', background: '#FFF', cursor: 'pointer', color: '#1A1A1A' }}>→</button>
          </div>
        </div>

        {/* PROGRESS LOADER */}
        <div style={{ marginTop: 20, height: 2, background: '#EAE8E0', position: 'relative' }}>
          <motion.div
            key={idx}
            initial={{ width: '0%' }}
            animate={{ width: paused ? undefined : '100%' }}
            transition={{ duration: 6.5, ease: 'linear' }}
            style={{ height: '100%', background: '#B8860B', position: 'absolute' }}
          />
        </div>
      </div>
    </section>
  );
}