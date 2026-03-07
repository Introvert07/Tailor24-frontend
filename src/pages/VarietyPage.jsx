import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

const CATS = [
  {
    l: 'Men', q: 'men', num: '120+', symbol: 'I',
    s: 'Sherwanis & Achkans',
    desc: 'From classic ivory to deep maroon — every sherwani a statement of lineage.',
    detail: 'Hand-embroidered. Individually fitted. Eternally yours.',
    img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=800&q=85',
    accent: 'rgba(139,26,40,0.7)',
    tall: true,
  },
  {
    l: 'Women', q: 'women', num: '85+', symbol: 'II',
    s: 'Anarkalis & Gharara',
    desc: 'Flowing silhouettes in Chanderi silk — grace made wearable.',
    detail: 'Resham embroidery. Maheshwari weaves. Bespoke cuts.',
    img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=85',
    accent: 'rgba(107,45,94,0.7)',
    tall: false,
  },
  {
    l: 'Bridal', q: 'bridal', num: '60+', symbol: 'III',
    s: 'Lehengas & Ensembles',
    desc: 'The most sacred of occasions deserves the finest of cloth.',
    detail: 'Zardozi. Gota patti. Mukaish. Crafted over weeks.',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=800&q=85',
    accent: 'rgba(26,58,92,0.7)',
    tall: false,
  },
  {
    l: 'Girls', q: 'girls', num: '55+', symbol: 'IV',
    s: 'Festive Lehengas',
    desc: 'Soft pastels and golden gota — for every little princess.',
    detail: 'Lightweight fabrics. Playful motifs. Royal finishes.',
    img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=85',
    accent: 'rgba(92,58,26,0.7)',
    tall: false,
  },
  {
    l: 'Kids', q: 'kids', num: '40+', symbol: 'V',
    s: 'Mini Sherwanis & Kurtas',
    desc: 'The youngest royals, dressed with the same care as the elders.',
    detail: 'Soft linings. Easy buttons. Full heirloom quality.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
    accent: 'rgba(26,74,46,0.7)',
    tall: false,
  },
];

export default function VarietyPage() {
  const [hov, setHov] = useState(null);

  return (
    <section style={{ background: '#060201', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; }
        .vp-img { transition: transform 0.8s cubic-bezier(0.22,1,0.36,1), filter 0.6s; }
        .vp-card:hover .vp-img { transform: scale(1.07); filter: brightness(0.3) sepia(20%) !important; }
        
        /* Desktop Base Styles */
        .vp-wrapper { max-width: 1400px; margin: 0 auto; padding: 88px 48px 80px; position: relative; z-index: 1; }
        .vp-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 72px; flex-wrap: wrap; gap: 24px; }
        .vp-stats { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .vp-bento { display: grid; grid-template-columns: 1.2fr 1fr 1fr; grid-template-rows: 340px 300px; gap: 4px; }
        .vp-tall { grid-row: span 2; }
        .vp-cell { grid-row: span 1; }
        
        /* Responsive Breakpoints */
        @media(max-width: 1024px) { 
          .vp-wrapper { padding: 60px 32px 60px; }
          .vp-bento { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto; grid-auto-rows: 320px; } 
          .vp-tall { grid-row: span 1; } 
        }
        @media(max-width: 768px) {
          .vp-header { flex-direction: column; align-items: flex-start; }
          .vp-stats { align-items: flex-start; margin-top: 16px; }
          .vp-bento { grid-auto-rows: 300px; }
        }
        @media(max-width: 560px) { 
          .vp-wrapper { padding: 40px 16px 40px; }
          .vp-bento { grid-template-columns: 1fr; grid-auto-rows: 340px; } 
          .vp-card-title { font-size: 24px !important; }
          .vp-card-bottom { padding: 0 20px 20px !important; }
        }
      `}</style>

      {/* Background accents */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(139,26,40,0.1), transparent 65%)' }} />
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,151,42,0.45) 25%,rgba(201,151,42,0.45) 75%,transparent)' }} />

      <div className="vp-wrapper">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="vp-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 28, height: 1, background: '#C9972A' }} />
              <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 6, color: '#C9972A', textTransform: 'uppercase' }}>Our Collections</span>
              <div style={{ width: 28, height: 1, background: 'rgba(201,151,42,0.3)' }} />
            </div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(30px,4vw,56px)', color: '#FFFDF5', fontWeight: 400, lineHeight: 1.08, margin: 0 }}>
              Dressed for Every<br />
              <em style={{ color: '#C9972A', fontWeight: 600, fontStyle: 'italic' }}>Royal Occasion</em>
            </h2>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, fontStyle: 'italic', color: 'rgba(201,151,42,0.4)', letterSpacing: 3, marginTop: 14 }}>
              — Crafted for You
            </p>
          </div>
          <div className="vp-stats">
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 40, fontWeight: 700, color: 'rgba(201,151,42,0.15)', lineHeight: 1, margin: 0 }}>360+</p>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 4, color: 'rgba(201,151,42,0.4)', textTransform: 'uppercase' }}>Pieces in Catalogue</p>
            <Link to="/catalog"
              style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 4, color: 'rgba(201,151,42,0.7)', textDecoration: 'none', textTransform: 'uppercase', borderBottom: '1px solid rgba(201,151,42,0.3)', paddingBottom: 4, marginTop: 8 }}>
              Browse All →
            </Link>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="vp-bento">
          {CATS.map((cat, i) => (
            <motion.div key={cat.l}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className={cat.tall ? 'vp-tall' : 'vp-cell'}
              onMouseEnter={() => setHov(cat.l)}
              onMouseLeave={() => setHov(null)}>

              <Link to={`/catalog?cat=${cat.q}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div className="vp-card"
                  style={{ position: 'relative', overflow: 'hidden', height: '100%', cursor: 'pointer', background: '#0A0402' }}>

                  <img src={cat.img} alt={cat.l} className="vp-img"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', filter: 'brightness(0.48) sepia(15%)' }} />

                  {/* Dark gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,2,1,0.97) 0%, rgba(6,2,1,0.5) 45%, rgba(6,2,1,0.05) 100%)' }} />

                  {/* Accent colour glow on hover */}
                  <motion.div animate={{ opacity: hov === cat.l ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 120% 55% at 50% 110%, ${cat.accent}, transparent 65%)` }} />

                  {/* Border on hover */}
                  <motion.div animate={{ opacity: hov === cat.l ? 1 : 0 }}
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', border: '1px solid rgba(201,151,42,0.22)' }} />

                  {/* Symbol + count top-right */}
                  <div style={{ position: 'absolute', top: 20, right: 22, textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Cinzel, serif', fontSize: 9, letterSpacing: 4, color: 'rgba(201,151,42,0.28)', margin: 0, marginBottom: 5 }}>{cat.symbol}</p>
                    <motion.p
                      animate={{ color: hov === cat.l ? '#C9972A' : 'rgba(201,151,42,0.38)' }}
                      style={{ fontFamily: 'Cinzel, serif', fontSize: cat.tall ? 30 : 22, fontWeight: 700, lineHeight: 1, margin: 0 }}>
                      {cat.num}
                    </motion.p>
                  </div>

                  {/* Bottom content */}
                  <div className="vp-card-bottom" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: cat.tall ? '0 32px 36px' : '0 24px 24px' }}>

                    <p className="vp-card-title" style={{ fontFamily: 'Cinzel, serif', fontSize: cat.tall ? 34 : 22, color: '#FFFDF5', fontWeight: 600, letterSpacing: 3, marginBottom: 6, lineHeight: 1.1 }}>
                      {cat.l}
                    </p>

                    <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 2, color: 'rgba(201,151,42,0.5)', textTransform: 'uppercase', marginBottom: 0 }}>
                      {cat.s}
                    </p>

                    <AnimatePresence>
                      {hov === cat.l && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.32 }}>
                          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, fontStyle: 'italic', color: 'rgba(244,232,208,0.5)', lineHeight: 1.7, marginTop: 10, marginBottom: 10 }}>
                            {cat.desc}
                          </p>
                          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,151,42,0.55)', textTransform: 'uppercase', margin: 0 }}>
                            {cat.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      animate={{ width: hov === cat.l ? '100%' : 28 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: 1, background: 'rgba(201,151,42,0.5)', marginTop: 16 }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer tagline */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 56 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,151,42,0.1))' }} />
          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, fontStyle: 'italic', color: 'rgba(201,151,42,0.28)', letterSpacing: 4, margin: 0, whiteSpace: 'nowrap' }}>
            Every piece is made-to-order — no two alike
          </p>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,151,42,0.1))' }} />
        </motion.div>
      </div>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,151,42,0.45) 25%,rgba(201,151,42,0.45) 75%,transparent)' }} />
    </section>
  );
}