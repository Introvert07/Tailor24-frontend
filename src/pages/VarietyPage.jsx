import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`;

const CATS = [
  {
    l: 'Men', q: 'men', num: '120+', symbol: 'I',
    s: 'Sherwanis & Achkans',
    desc: 'Classic ivory to deep maroon.',
    img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=900&q=85',
    tall: true,
  },
  {
    l: 'Women', q: 'women', num: '85+', symbol: 'II',
    s: 'Anarkalis & Gharara',
    desc: 'Grace in Chanderi silk.',
    img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=85',
    tall: false,
  },
  {
    l: 'Bridal', q: 'bridal', num: '60+', symbol: 'III',
    s: 'Bespoke Lehengas',
    desc: 'Finest Zardozi & Mukaish.',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=900&q=85',
    tall: false,
  },
  {
    l: 'Girls', q: 'girls', num: '55+', symbol: 'IV',
    s: 'Festive Wear',
    desc: 'Pastels & golden gota.',
    img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=85',
    tall: false,
  },
  {
    l: 'Kids', q: 'kids', num: '40+', symbol: 'V',
    s: 'Mini Royals',
    desc: 'Heirloom quality kurtas.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85',
    tall: false,
  },
];

export default function VarietyPage() {
  const [hov, setHov] = useState(null);

  return (
    <section style={{ background: '#F9F8F3', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{fonts}{`
        .vp-img { transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .vp-card:hover .vp-img { transform: scale(1.1); }
        .vp-bento { display: grid; grid-template-columns: 1.3fr 1fr 1fr; grid-template-rows: 380px 340px; gap: 12px; }
        .vp-tall { grid-row: span 2; }
        
        @media(max-width: 1024px) { 
          .vp-bento { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 350px; } 
          .vp-tall { grid-row: span 1; } 
        }
        @media(max-width: 600px) { 
          .vp-bento { grid-template-columns: 1fr; grid-auto-rows: 400px; } 
        }
      `}</style>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '80px clamp(20px, 5vw, 60px)' }}>
        
        {/* LIGHT MINIMAL HEADER */}
        <header style={{ marginBottom: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 30 }}>
          <div>
            <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 600, textTransform: 'uppercase' }}>
              The Collections
            </span>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(32px, 5vw, 52px)', color: '#1A1A1A', marginTop: 15, fontWeight: 400 }}>
              Curated <em style={{ fontStyle: 'italic', color: '#B8860B' }}>Variety</em>
            </h2>
          </div>
          <Link to="/catalog" style={{ fontFamily: 'Raleway', fontSize: 11, color: '#1A1A1A', textDecoration: 'none', borderBottom: '1px solid #B8860B', paddingBottom: 5, letterSpacing: 2 }}>
            VIEW ALL COLLECTIONS
          </Link>
        </header>

        {/* BENTO GRID */}
        <div className="vp-bento">
          {CATS.map((cat, i) => (
            <motion.div key={cat.l} className={cat.tall ? 'vp-tall' : ''}
              onMouseEnter={() => setHov(cat.l)} onMouseLeave={() => setHov(null)}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              
              <Link to={`/catalog?cat=${cat.q}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div className="vp-card" style={{ position: 'relative', overflow: 'hidden', height: '100%', background: '#EAE8E0' }}>
                  
                  <img src={cat.img} alt={cat.l} className="vp-img" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  {/* Gradient Overlay - Lighter for Light Theme */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.8) 0%, transparent 60%)' }} />

                  {/* Top Info */}
                  <div style={{ position: 'absolute', top: 25, left: 25, color: '#F9F8F3' }}>
                     <span style={{ fontFamily: 'Cinzel', fontSize: 10, opacity: 0.7, letterSpacing: 3 }}>{cat.symbol}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 25, right: 25 }}>
                     <span style={{ fontFamily: 'Cinzel', fontSize: 20, color: '#B8860B', fontWeight: 700 }}>{cat.num}</span>
                  </div>

                  {/* Bottom Info (Always Visible) */}
                  <div style={{ position: 'absolute', bottom: 30, left: 30, right: 30, color: '#F9F8F3' }}>
                    <h3 style={{ fontFamily: 'Cinzel', fontSize: cat.tall ? 32 : 22, margin: 0, fontWeight: 500 }}>{cat.l}</h3>
                    <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.8, marginTop: 5 }}>{cat.s}</p>
                    
                    {/* Hover Reveal Text */}
                    <AnimatePresence>
                      {hov === cat.l && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }}>
                          <p style={{ fontFamily: 'Raleway', fontSize: 13, marginTop: 15, borderTop: '1px solid rgba(184,134,11,0.5)', paddingTop: 15, lineHeight: 1.6 }}>
                            {cat.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* MINIMAL FOOTER TAGLINE */}
        <footer style={{ marginTop: 60, textAlign: 'center' }}>
          <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 4, color: '#A09E94', textTransform: 'uppercase' }}>
            Hand-stitched in Vidisha • Delivered Worldwide
          </p>
        </footer>
      </div>
    </section>
  );
}