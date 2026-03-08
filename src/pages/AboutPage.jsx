import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');`;

const SERVICES = [
  { icon: '👰', label: 'Bridal', sub: 'Lehenga · Anarkali' },
  { icon: '🤵', label: 'Groom', sub: 'Sherwani · Achkan' },
  { icon: '👔', label: 'Formal', sub: 'Suit · Bandhgala' },
  { icon: '👗', label: 'Women', sub: 'Salwar · Gharara' },
  { icon: '👧', label: 'Girls', sub: 'Festive · Ethnic' },
  { icon: '👦', label: 'Kids', sub: 'Kurta · Mini Sherwani' },
];

const CRAFTS = [
  {
    name: 'Zardozi', emoji: '✨',
    simple: 'Real gold & silver thread stitched by hand into patterns that last a lifetime.',
    img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=600&q=80',
  },
  {
    name: 'Chanderi Silk', emoji: '🌿',
    simple: 'Feather-light fabric woven on old handlooms. Breathable, luminous, timeless.',
    img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
  },
  {
    name: 'Gota Patti', emoji: '🌟',
    simple: 'Golden ribbon trim applied edge by edge — our most-loved signature finish.',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=600&q=80',
  },
  {
    name: 'Resham Kari', emoji: '🧵',
    simple: 'Dense, colourful silk thread embroidery. A full panel takes up to two weeks.',
    img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
  },
  {
    name: 'Maheshwari', emoji: '👑',
    simple: 'A royal double-sided weave from the banks of the Narmada. Worn both ways.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    name: 'Mukaish', emoji: '💫',
    simple: 'Tiny gold dots hand-hammered into fine cloth. A Nawabi tradition, revived.',
    img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=600&q=80',
  },
];

const CITIES = [
  {
    name: 'Bhopal', tag: 'Flagship · Est. 2004',
    addr: 'New Market, Bhopal – 462 003',
    hours: 'Mon–Sat · 10am–8pm',
    img: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=700&q=80',
  },
  {
    name: 'Indore', tag: 'Showroom · Est. 2011',
    addr: 'Vijay Nagar, Indore – 452 010',
    hours: 'Mon–Sat · 10am–8pm',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
  },
  {
    name: 'Vidisha', tag: 'Atelier · Est. 2018',
    addr: 'Civil Lines, Vidisha – 464 001',
    hours: 'Tue–Sun · 11am–7pm',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=700&q=80',
  },
];

const STATS = [
  { n: '20+', l: 'Years of Craft' },
  { n: '4000+', l: 'Happy Patrons' },
  { n: '24h', l: 'Ready In' },
  { n: '3', l: 'Cities' },
];

export default function AboutPage() {
  const [activeCraft, setActiveCraft] = useState(0);

  return (
    <div style={{ background: '#FFFDF5', color: '#1A0E08', overflowX: 'hidden' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .w { max-width: 1280px; margin: 0 auto; padding: 0 clamp(18px, 5vw, 56px); }

        .hero-bg {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #1A0E08 0%, #3D1A0A 50%, #8B1A28 100%);
          min-height: 100vh; display: flex; align-items: center;
        }
        .hero-pattern {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B8860B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .srv-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
        .srv-card {
          padding: 28px 16px; text-align: center; cursor: pointer;
          border: 1px solid rgba(184,134,11,0.15); background: rgba(255,253,245,0.04);
          transition: all 0.35s; border-radius: 2px;
        }
        .srv-card:hover { background: rgba(184,134,11,0.08); border-color: rgba(184,134,11,0.4); transform: translateY(-4px); }

        .craft-tabs { display: flex; gap: 0; flex-wrap: wrap; border-bottom: 1px solid #EAE5D5; }
        .craft-tab {
          padding: 14px 20px; font-family: 'Raleway', sans-serif; font-size: 11px;
          letter-spacing: 2px; text-transform: uppercase; cursor: pointer; border: none;
          background: transparent; color: #5C4A32; transition: all 0.25s;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
        }
        .craft-tab.active { color: #8B1A28; border-bottom-color: #8B1A28; font-weight: 700; }
        .craft-tab:hover:not(.active) { color: #B8860B; }

        .city-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .city-card { overflow: hidden; border-radius: 2px; cursor: pointer; }
        .city-img-wrap { height: clamp(200px, 25vw, 320px); overflow: hidden; position: relative; }
        .city-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; filter: sepia(10%); }
        .city-card:hover .city-img { transform: scale(1.07); filter: sepia(0%); }

        .choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }

        .kar-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
        .kar-tile { position: relative; overflow: hidden; aspect-ratio: 3/4; }
        .kar-tile img { width: 100%; height: 100%; object-fit: cover; filter: sepia(30%); transition: filter 0.5s, transform 0.6s; }
        .kar-tile:hover img { filter: sepia(0%); transform: scale(1.04); }
        .kar-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,14,8,0.88) 0%, transparent 55%); }
        .kar-info { position: absolute; bottom: 20px; left: 20px; right: 20px; color: #FFF; }

        .process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
        .process-step { padding: clamp(28px,4vw,48px) clamp(20px,3vw,36px); border-right: 1px solid rgba(184,134,11,0.15); position: relative; }
        .process-step:last-child { border-right: none; }
        .process-num { font-family: 'Cinzel', serif; font-size: clamp(48px,6vw,72px); color: rgba(184,134,11,0.08); font-weight: 700; line-height: 1; margin-bottom: 16px; }

        @media(max-width: 1024px) {
          .process-grid { grid-template-columns: repeat(2, 1fr); }
          .process-step:nth-child(2) { border-right: none; }
          .process-step:nth-child(1), .process-step:nth-child(2) { border-bottom: 1px solid rgba(184,134,11,0.15); }
        }
        @media(max-width: 900px) {
          .srv-grid { grid-template-columns: repeat(3, 1fr); }
          .city-row { grid-template-columns: repeat(2, 1fr); }
          .kar-strip { grid-template-columns: repeat(2, 1fr); }
          .choice-grid { grid-template-columns: 1fr; }
        }
        @media(max-width: 600px) {
          .srv-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .city-row { grid-template-columns: 1fr; }
          .kar-strip { grid-template-columns: repeat(2, 1fr); }
          .craft-tab { padding: 10px 12px; font-size: 10px; }
          .process-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ══════════ HERO */}
      <div className="hero-bg">
        <div className="hero-pattern" />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', opacity: 0.15 }}>
          <img src="https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=800&q=80" alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #1A0E08, transparent 60%)' }} />
        </div>

        <div className="w" style={{ padding: 'clamp(80px,10vw,140px) clamp(18px,5vw,56px)', position: 'relative', zIndex: 1, width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 1, background: '#B8860B' }} />
              <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 700 }}>EST. 2004 · MADHYA PRADESH</span>
            </div>

            <h1 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(40px, 7vw, 80px)', color: '#FFF', lineHeight: 1.05, fontWeight: 400, maxWidth: 680 }}>
              Every Outfit.<br />
              <em style={{ color: '#B8860B', fontStyle: 'italic' }}>Made For You.</em>
            </h1>

            <p style={{ fontFamily: 'Raleway', fontSize: 'clamp(14px,1.8vw,17px)', color: 'rgba(255,253,245,0.7)', marginTop: 28, maxWidth: 460, lineHeight: 1.8 }}>
              Custom Indian wear for weddings, festivals & formal occasions —
              stitched by master karigars in Madhya Pradesh.
              Ready in <strong style={{ color: '#B8860B' }}>24 hours.</strong>
            </p>

            <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
              <Link to="/catalog" style={{ background: '#B8860B', color: '#FFF', padding: '15px 32px', fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3, textDecoration: 'none', fontWeight: 700 }}>
                EXPLORE CATALOG
              </Link>
              <Link to="/contact" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#FFF', padding: '15px 32px', fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3, textDecoration: 'none', fontWeight: 600 }}>
                BOOK APPOINTMENT
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}
            style={{ display: 'flex', gap: 'clamp(20px,4vw,48px)', marginTop: 64, flexWrap: 'wrap', borderTop: '1px solid rgba(184,134,11,0.2)', paddingTop: 40 }}>
            {STATS.map((s, i) => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {i > 0 && <div style={{ width: 1, height: 36, background: 'rgba(184,134,11,0.2)' }} />}
                <div>
                  <p style={{ fontFamily: 'Cinzel', fontSize: 'clamp(22px,3vw,30px)', color: '#B8860B', fontWeight: 700 }}>{s.n}</p>
                  <p style={{ fontFamily: 'Raleway', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginTop: 2, textTransform: 'uppercase' }}>{s.l}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════ WHAT WE STITCH */}
      <div style={{ background: '#1A0E08', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="w">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
            <div>
              <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 700, marginBottom: 12 }}>WE STITCH FOR EVERYONE</p>
              <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,4vw,42px)', color: '#FFF', fontWeight: 400 }}>
                Choose Your Occasion
              </h2>
            </div>
            <p style={{ fontFamily: 'Raleway', fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 300, lineHeight: 1.7 }}>
              From a grand bridal lehenga to a child's first festival kurta — every garment receives the same devotion.
            </p>
          </motion.div>

          <div className="srv-grid">
            {SERVICES.map((s, i) => (
              <motion.div key={s.label} className="srv-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div style={{ fontSize: 'clamp(30px,4vw,42px)', marginBottom: 16 }}>{s.icon}</div>
                <p style={{ fontFamily: 'Cinzel', fontSize: 'clamp(13px,1.5vw,16px)', color: '#FFF', fontWeight: 600, marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontFamily: 'Raleway', fontSize: 10, color: '#B8860B', letterSpacing: 1, textTransform: 'uppercase' }}>{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CUSTOM vs READY */}
      <div style={{ background: '#F9F7F0', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="w">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#8B1A28', fontWeight: 700, marginBottom: 12 }}>TWO WAYS TO DRESS ROYAL</p>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,4vw,42px)', color: '#1A0E08', fontWeight: 400 }}>
              Which fits your need?
            </h2>
          </motion.div>

          <div className="choice-grid">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ background: '#8B1A28', padding: 'clamp(40px,5vw,64px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -10, fontFamily: 'Cinzel', fontSize: 140, color: 'rgba(255,255,255,0.04)', fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>I</div>
              <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#D4AF37', marginBottom: 16, fontWeight: 700 }}>BESPOKE</p>
              <h3 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,3vw,40px)', color: '#FFF', fontWeight: 400, marginBottom: 10, lineHeight: 1.1 }}>
                Custom Stitched
              </h3>
              <p style={{ fontFamily: 'Raleway', fontSize: 13, color: 'rgba(255,253,245,0.6)', marginBottom: 32, lineHeight: 1.6 }}>
                Your size, your fabric, your design — built from scratch.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {[
                  { icon: '📏', t: 'Your exact measurements & fit' },
                  { icon: '🎨', t: 'Pick any fabric, colour or embroidery' },
                  { icon: '✂️', t: 'Hand-crafted by master karigars' },
                  { icon: '⏰', t: 'Delivered in 24 hours' },
                ].map(t => (
                  <div key={t.t} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <span style={{ fontFamily: 'Raleway', fontSize: 14, color: 'rgba(255,253,245,0.85)' }}>{t.t}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" style={{ display: 'inline-block', background: '#D4AF37', color: '#1A0E08', padding: '15px 32px', fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3, textDecoration: 'none', fontWeight: 700 }}>
                BOOK APPOINTMENT
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ background: '#1A0E08', padding: 'clamp(40px,5vw,64px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -10, fontFamily: 'Cinzel', fontSize: 140, color: 'rgba(184,134,11,0.05)', fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>II</div>
              <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', marginBottom: 16, fontWeight: 700 }}>READY-TO-WEAR</p>
              <h3 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,3vw,40px)', color: '#FFF', fontWeight: 400, marginBottom: 10, lineHeight: 1.1 }}>
                Ready Collection
              </h3>
              <p style={{ fontFamily: 'Raleway', fontSize: 13, color: 'rgba(255,253,245,0.45)', marginBottom: 32, lineHeight: 1.6 }}>
                See it, love it, take it home today.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {[
                  { icon: '🛍️', t: '300+ designs always in store' },
                  { icon: '👁️', t: 'Try before you buy, same day' },
                  { icon: '🔧', t: 'Free alteration on every piece' },
                  { icon: '💎', t: 'Same premium fabrics & craft' },
                ].map(t => (
                  <div key={t.t} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <span style={{ fontFamily: 'Raleway', fontSize: 14, color: 'rgba(255,253,245,0.75)' }}>{t.t}</span>
                  </div>
                ))}
              </div>
              <Link to="/catalog" style={{ display: 'inline-block', border: '1px solid #B8860B', color: '#B8860B', padding: '15px 32px', fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3, textDecoration: 'none', fontWeight: 700 }}>
                BROWSE CATALOG
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══════════ HOW IT WORKS */}
      <div style={{ background: '#FFFDF5', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="w">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#8B1A28', fontWeight: 700, marginBottom: 12 }}>THE PROCESS</p>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,4vw,42px)', color: '#1A0E08', fontWeight: 400 }}>
              From Your Visit to Your Door
            </h2>
          </motion.div>

          <div className="process-grid" style={{ background: '#F9F7F0', border: '1px solid #EAE5D5' }}>
            {[
              { n: '01', icon: '📐', title: 'Walk In', desc: 'Visit any of our 3 showrooms. Browse fabrics & designs in person.' },
              { n: '02', icon: '✍️', title: 'We Measure', desc: 'Your exact measurements are taken by our senior cutters.' },
              { n: '03', icon: '🧵', title: 'Karigars Stitch', desc: 'Master artisans hand-craft your garment with full attention.' },
              { n: '04', icon: '🎁', title: 'Ready in 24h', desc: 'Pick up or receive delivery. Every stitch guaranteed.' },
            ].map((step, i) => (
              <motion.div key={step.n} className="process-step"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="process-num">{step.n}</div>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{step.icon}</div>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(15px,1.8vw,19px)', color: '#1A0E08', fontWeight: 600, marginBottom: 10 }}>{step.title}</h4>
                <p style={{ fontFamily: 'Raleway', fontSize: 13, color: '#5C4A32', lineHeight: 1.7 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CRAFT HERITAGE EXPLORER */}
      <div style={{ background: '#F3EFE0', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="w">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginBottom: 0 }}>
            <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#8B1A28', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
              Our Craft Heritage
            </p>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,4vw,42px)', color: '#1A0E08', fontWeight: 400, marginBottom: 32 }}>
              Every Stitch, Made by Hand
            </h2>
          </motion.div>

          <div className="craft-tabs">
            {CRAFTS.map((c, i) => (
              <button key={c.name} className={`craft-tab${activeCraft === i ? ' active' : ''}`} onClick={() => setActiveCraft(i)}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          <motion.div key={activeCraft} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340, border: '1px solid #EAE5D5', borderTop: 'none', background: '#FFFDF5' }}>
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <img src={CRAFTS[activeCraft].img} alt={CRAFTS[activeCraft].name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 280 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #FFFDF5)' }} />
            </div>
            <div style={{ padding: 'clamp(32px,4vw,56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 4, color: '#8B1A28', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>
                {CRAFTS[activeCraft].emoji} Craft {String(activeCraft + 1).padStart(2, '0')} of {CRAFTS.length}
              </p>
              <h3 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(28px,4vw,48px)', color: '#1A0E08', fontWeight: 400, marginBottom: 16 }}>
                {CRAFTS[activeCraft].name}
              </h3>
              <p style={{ fontFamily: 'Raleway', fontSize: 'clamp(15px,1.8vw,18px)', color: '#5C4A32', lineHeight: 1.8, borderLeft: '3px solid #B8860B', paddingLeft: 20 }}>
                {CRAFTS[activeCraft].simple}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 36 }}>
                {CRAFTS.map((_, i) => (
                  <button key={i} onClick={() => setActiveCraft(i)}
                    style={{ width: i === activeCraft ? 32 : 14, height: 3, background: i === activeCraft ? '#8B1A28' : '#D4C9B0', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0, borderRadius: 2 }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════ KARIGARS */}
      <div style={{ background: '#1A0E08', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="w">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 700, marginBottom: 10 }}>THE MASTER HANDS</p>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,4vw,42px)', color: '#FFF', fontWeight: 400 }}>
              Our Karigars
            </h2>
            <p style={{ fontFamily: 'Raleway', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>
              25–35 years of skill. Woven into every garment we make.
            </p>
          </motion.div>

          <div className="kar-strip">
            {[
              { role: 'Master Embroiderer', city: 'Bhopal', exp: '32 yrs', img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=500&q=80' },
              { role: 'Senior Cutter', city: 'Indore', exp: '28 yrs', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80' },
              { role: 'Bridal Specialist', city: 'Vidisha', exp: '24 yrs', img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=500&q=80' },
              { role: 'Fabric Artisan', city: 'Bhopal', exp: '35 yrs', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80' },
            ].map((k, i) => (
              <motion.div key={k.role} className="kar-tile"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <img src={k.img} alt={k.role} />
                <div className="kar-overlay" />
                <div className="kar-info">
                  <p style={{ fontFamily: 'Cinzel', fontSize: 'clamp(14px,1.8vw,18px)', color: '#B8860B', marginBottom: 4, fontWeight: 700 }}>{k.exp}</p>
                  <p style={{ fontFamily: 'Raleway', fontSize: 'clamp(11px,1.2vw,13px)', color: '#FFF', letterSpacing: 1 }}>{k.role}</p>
                  <p style={{ fontFamily: 'Raleway', fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 3, letterSpacing: 2 }}>{k.city.toUpperCase()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ SHOWROOMS */}
      <div style={{ background: '#F3EFE0', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="w">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#8B1A28', fontWeight: 700, marginBottom: 10 }}>VISIT US</p>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(26px,4vw,42px)', color: '#1A0E08', fontWeight: 400 }}>
              Our Showrooms
            </h2>
          </motion.div>

          <div className="city-row">
            {CITIES.map((city, i) => (
              <motion.div key={city.name} className="city-card"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="city-img-wrap">
                  <img src={city.img} alt={city.name} className="city-img" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,14,8,0.75) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16, background: '#8B1A28', color: '#FFF', padding: '6px 14px', fontFamily: 'Raleway', fontSize: 9, letterSpacing: 2, fontWeight: 700 }}>
                    {city.tag}
                  </div>
                  <h3 style={{ position: 'absolute', bottom: 20, left: 20, fontFamily: 'Cinzel', fontSize: 'clamp(24px,3vw,32px)', color: '#FFF', fontWeight: 400 }}>{city.name}</h3>
                </div>
                <div style={{ background: '#FFF', padding: '20px 24px', borderTop: '2px solid #8B1A28' }}>
                  <p style={{ fontFamily: 'Raleway', fontSize: 12, color: '#1A0E08', fontWeight: 600 }}>{city.addr}</p>
                  <p style={{ fontFamily: 'Raleway', fontSize: 11, color: '#8B1A28', marginTop: 4 }}>{city.hours}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CTA */}
      <div style={{ background: '#8B1A28', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="w" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p style={{ fontFamily: 'Cinzel', fontSize: 'clamp(10px,1.5vw,13px)', letterSpacing: 6, color: '#D4AF37', marginBottom: 20 }}>
              TAILOR 24 · SINCE 2004
            </p>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(28px,5vw,56px)', color: '#FFF', fontWeight: 400, lineHeight: 1.15, marginBottom: 12 }}>
              Your next special look —<br />
              <em style={{ color: '#D4AF37' }}>crafted by our hands.</em>
            </h2>
            <p style={{ fontFamily: 'Raleway', fontSize: 'clamp(13px,1.5vw,15px)', color: 'rgba(255,255,255,0.55)', marginBottom: 44, letterSpacing: 1 }}>
              Hand-stitched in Vidisha · Delivered Worldwide
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/catalog" style={{ background: '#FFF', color: '#8B1A28', padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,48px)', fontFamily: 'Raleway', fontWeight: 700, fontSize: 11, letterSpacing: 3, textDecoration: 'none' }}>
                EXPLORE CATALOG
              </Link>
              <Link to="/contact" style={{ border: '1px solid #D4AF37', color: '#D4AF37', padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,48px)', fontFamily: 'Raleway', fontWeight: 700, fontSize: 11, letterSpacing: 3, textDecoration: 'none' }}>
                BOOK A VISIT
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}