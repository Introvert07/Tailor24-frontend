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
      }, 7500);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [idx, paused]);

  const r = REVIEWS[idx];

  return (
    <section
      style={{ background: '#FAF9F6', position: 'relative', overflow: 'hidden', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      
      <style>{fonts}{`
        .tp-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: clamp(40px, 8vw, 100px) 24px; }
        .tp-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: clamp(40px, 6vw, 100px); align-items: center; }
        
        .tp-img-box { position: relative; aspect-ratio: 4/5; width: 100%; background: #EEE; overflow: hidden; box-shadow: 30px 30px 80px rgba(0,0,0,0.08); }
        .tp-img-box img { width: 100%; height: 100%; object-fit: cover; }

        .nav-dots { display: flex; gap: 12px; }
        .nav-dot { width: 8px; height: 8px; border-radius: 50%; background: #D1CEC2; border: none; cursor: pointer; padding: 0; transition: all 0.3s; }
        .nav-dot.active { background: #8B1A28; width: 24px; border-radius: 4px; }

        @media (max-width: 1024px) {
          .tp-grid { grid-template-columns: 1fr; text-align: center; }
          .tp-img-box { max-width: 450px; margin: 0 auto; order: -1; }
          .tp-meta { justify-content: center; }
          .tp-controls { justify-content: center !important; flex-direction: column; gap: 40px; }
          .nav-names { display: none !important; }
        }

        @media (max-width: 600px) {
          .tp-container { padding-top: 60px; }
          .tp-img-box { aspect-ratio: 1/1; }
        }
      `}</style>

      {/* Decorative BG element */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', fontFamily: 'Cinzel', fontSize: '25vw', color: 'rgba(0,0,0,0.02)', fontWeight: 700, pointerEvents: 'none', userSelect: 'none' }}>
        VOX
      </div>

      <div className="tp-container">
        <header style={{ marginBottom: 'clamp(40px, 6vw, 80px)', textAlign: 'center' }}>
          <motion.span 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 700, textTransform: 'uppercase' }}>
            The Patron Files
          </motion.span>
          <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(28px, 4vw, 42px)', color: '#1A1A1A', marginTop: 10 }}>Words of Trust</h2>
        </header>

        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={{
                enter: (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
                center: { opacity: 1, x: 0 },
                exit: (d) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="tp-grid"
            >
              {/* Content Side */}
              <div>
                <div style={{ background: '#8B1A28', color: '#FFF', padding: '6px 16px', display: 'inline-block', fontSize: 10, fontFamily: 'Raleway', letterSpacing: 2, fontWeight: 700, marginBottom: 30 }}>
                  {r.occasion.toUpperCase()}
                </div>

                <h3 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(24px, 3.5vw, 40px)', lineHeight: 1.2, color: '#1A1A1A', marginBottom: 30, fontStyle: 'italic', fontWeight: 400 }}>
                  "{r.short}"
                </h3>

                <p style={{ fontFamily: 'Raleway', fontSize: 'clamp(15px, 1.8vw, 17px)', color: '#555', lineHeight: 1.8, marginBottom: 40, maxWidth: 600 }}>
                  {r.text}
                </p>

                <div className="tp-meta" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 40, height: 1, background: '#B8860B' }} />
                  <div>
                    <p style={{ fontFamily: 'Cinzel', fontSize: 16, color: '#1A1A1A', margin: 0, fontWeight: 700, letterSpacing: 1 }}>{r.name}</p>
                    <p style={{ fontFamily: 'Raleway', fontSize: 11, color: '#B8860B', marginTop: 4, letterSpacing: 2 }}>{r.city.toUpperCase()} • {r.year}</p>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className="tp-img-box">
                <img src={r.img} alt={r.name} />
                <div style={{ position: 'absolute', top: 20, right: 20, background: '#FFF', padding: '10px 15px', display: 'flex', gap: 2 }}>
                  {[...Array(r.rating)].map((_, i) => <span key={i} style={{ color: '#B8860B', fontSize: 12 }}>★</span>)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls Section */}
        <div className="tp-controls" style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EAE8E0', paddingTop: 40 }}>
          
          {/* Desktop Names Navigation */}
          <div className="nav-names" style={{ display: 'flex', gap: 30 }}>
            {REVIEWS.map((rv, i) => (
              <button 
                key={i} onClick={() => go(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                <p style={{ fontFamily: 'Cinzel', fontSize: 11, letterSpacing: 2, color: i === idx ? '#8B1A28' : '#AAA', fontWeight: 700, transition: '0.3s' }}>
                  {rv.name.split(' ')[0]}
                </p>
                {i === idx && <motion.div layoutId="activeLine" style={{ height: 2, background: '#8B1A28', marginTop: 4 }} />}
              </button>
            ))}
          </div>

          {/* Mobile Dot Navigation */}
          <div className="nav-dots">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => go(i)} className={`nav-dot ${i === idx ? 'active' : ''}`} />
            ))}
          </div>

          {/* Arrow Controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={() => go((idx - 1 + REVIEWS.length) % REVIEWS.length)}
              style={{ width: 50, height: 50, border: '1px solid #EAE8E0', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
              ←
            </button>
            <button 
              onClick={() => go((idx + 1) % REVIEWS.length)}
              style={{ width: 50, height: 50, border: '1px solid #EAE8E0', background: '#8B1A28', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
              →
            </button>
          </div>
        </div>

        {/* Visual Progress bar */}
        <div style={{ width: '100%', height: 2, background: '#EEE', marginTop: 30, position: 'relative' }}>
          <motion.div 
            key={idx}
            initial={{ width: '0%' }}
            animate={{ width: paused ? '0%' : '100%' }}
            transition={{ duration: 7.5, ease: 'linear' }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#B8860B' }}
          />
        </div>
      </div>
    </section>
  );
}