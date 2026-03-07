import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

const KARIGARS = [
  {
    role: 'Master Embroiderer', craft: 'Zardozi & Resham', exp: '32 yrs', city: 'Bhopal',
    note: 'Trained under the last Nawabi workshops of old Bhopal. Every gold thread placed by memory.',
  },
  {
    role: 'Senior Cutter', craft: 'Sherwani & Achkan', exp: '28 yrs', city: 'Indore',
    note: 'Has never used a pattern sheet. The silhouette lives in his hands — measured, balanced, exact.',
  },
  {
    role: 'Bridal Specialist', craft: 'Lehenga & Gota Patti', exp: '24 yrs', city: 'Vidisha',
    note: 'Over 400 bridal ensembles completed. No two alike. Each treated as a first.',
  },
  {
    role: 'Fabric Artisan', craft: 'Chanderi & Maheshwari', exp: '35 yrs', city: 'Bhopal',
    note: 'Sources directly from the looms of Chanderi. Can identify a weave by touch alone.',
  },
];

const CRAFTS = [
  { name: 'Zardozi', origin: 'Mughal Courts', desc: 'Gold and silver wire wound by hand into motifs that outlast the garment itself.' },
  { name: 'Chanderi', origin: 'Chanderi, MP', desc: 'Silk-cotton blend woven on handlooms. Translucent, luminous, weightless on the body.' },
  { name: 'Gota Patti', origin: 'Rajasthan via MP', desc: 'Ribbon-like metallic trim applied edge by edge. The signature of a Tailor 24 lehenga.' },
  { name: 'Resham Kari', origin: 'Persian tradition', desc: 'Silk thread embroidery — dense, colourful, architectural. A full panel can take two weeks.' },
  { name: 'Maheshwari', origin: 'Maheshwar, MP', desc: 'Named for the town on the Narmada. Double-sided weave, reversible. The fabric of royalty.' },
  { name: 'Mukaish', origin: 'Lucknow tradition', desc: 'Tiny metallic dots hammered into fine fabric. Worn by Nawabs. Revived by our karigars.' },
];

const CITIES = [
  {
    name: 'Bhopal', tag: 'Flagship', since: '2004', craft: 'Zardozi & Resham Kari',
    addr: 'New Market, Bhopal – 462 003', hours: 'Mon – Sat · 10 am – 8 pm',
    desc: 'Our first atelier. Set in the heart of the City of Lakes, where Nawabi tradition breathes in the walls.',
    img: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=700&q=80',
  },
  {
    name: 'Indore', tag: 'Showroom', since: '2011', craft: 'Chanderi & Maheshwari',
    addr: 'Vijay Nagar, Indore – 452 010', hours: 'Mon – Sat · 10 am – 8 pm',
    desc: "MP's commercial capital. A full-floor showroom where ready-to-try and bespoke sit side by side.",
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
  },
  {
    name: 'Vidisha', tag: 'Atelier', since: '2018', craft: 'Heritage Handloom',
    addr: 'Civil Lines, Vidisha – 464 001', hours: 'Tue – Sun · 11 am – 7 pm',
    desc: 'Our most intimate space. Appointment-preferred. Built for patrons who want the full bespoke experience.',
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=700&q=80',
  },
];

function GoldRule() {
  return (
    <div style={{ height: 1, width: '100%', background: 'linear-gradient(90deg,transparent,rgba(201,151,42,0.4) 25%,rgba(201,151,42,0.4) 75%,transparent)' }} />
  );
}

function SectionLabel({ text }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,151,42,0.28))' }} />
      <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 6,
        color: '#C9972A', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,151,42,0.28))' }} />
    </motion.div>
  );
}

export default function AboutPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 70]);

  return (
    <div style={{ background: '#060201', overflow: 'hidden', width: '100%' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Layout Grids */
        .wrapper { max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 48px); }
        .ag { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 8vw, 80px); align-items: center; }
        .kg { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        .cg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .crg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }

        /* Hover States via CSS (Performant) */
        .karigar-card { transition: background 0.4s; background: transparent; }
        .karigar-card:hover { background: rgba(201,151,42,0.06); }
        .karigar-card .exp-tag { transition: color 0.4s; color: rgba(201,151,42,0.2); }
        .karigar-card:hover .exp-tag { color: rgba(201,151,42,0.45); }
        .karigar-card .k-line { transition: width 0.35s, background 0.35s; width: 18px; background: rgba(201,151,42,0.3); }
        .karigar-card:hover .k-line { width: 48px; background: #C9972A; }

        .craft-card { transition: background 0.45s cubic-bezier(0.22,1,0.36,1); background: #FAF3E8; }
        .craft-card:hover { background: #0F0402; }
        .craft-card .c-glow { opacity: 0; transition: opacity 0.45s; }
        .craft-card:hover .c-glow { opacity: 1; }
        .craft-card .c-origin { transition: color 0.45s; color: rgba(139,115,85,0.55); }
        .craft-card:hover .c-origin { color: rgba(201,151,42,0.4); }
        .craft-card .c-title { transition: color 0.45s; color: #8B1A28; }
        .craft-card:hover .c-title { color: #C9972A; }
        .craft-card .c-desc { transition: color 0.45s; color: rgba(92,74,50,0.65); }
        .craft-card:hover .c-desc { color: rgba(244,232,208,0.55); }
        .craft-card .c-line { transition: width 0.35s, background 0.35s; width: 20px; background: rgba(139,26,40,0.35); }
        .craft-card:hover .c-line { width: 52px; background: #C9972A; }

        .city-card { cursor: default; }
        .city-card .city-img { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); transform: scale(1); }
        .city-card:hover .city-img { transform: scale(1.06); }
        .city-card .city-tag { transition: background 0.4s; background: #8B1A28; }
        .city-card:hover .city-tag { background: #C9972A; }
        .city-card .city-tag-text { transition: color 0.4s; color: #FAF3E8; }
        .city-card:hover .city-tag-text { color: #060201; }
        .city-card .city-title { transition: color 0.4s; color: #FFFDF5; }
        .city-card:hover .city-title { color: #C9972A; }
        .city-card .city-panel { transition: background 0.45s; background: #0A0301; }
        .city-card:hover .city-panel { background: #0F0402; }
        .city-card .city-glow { opacity: 0; transition: opacity 0.45s; }
        .city-card:hover .city-glow { opacity: 1; }
        .city-card .city-line { transition: width 0.35s, background 0.35s; width: 20px; background: rgba(201,151,42,0.25); }
        .city-card:hover .city-line { width: 52px; background: #C9972A; }

        /* Media Queries */
        @media(max-width:1024px) { 
          .kg, .crg { grid-template-columns: repeat(2, 1fr); } 
          .crg > div { border-right: none !important; border-bottom: 1px solid rgba(212,188,148,0.4) !important; }
        }
        @media(max-width:900px) { 
          .ag, .cg { grid-template-columns: 1fr; } 
          .hero-stats { justify-content: flex-start; }
          .hero-ornaments { display: none; }
        }
        @media(max-width:600px) { 
          .kg, .crg { grid-template-columns: 1fr; } 
          .kg > div { border-right: none !important; border-bottom: 1px solid rgba(201,151,42,0.06); }
          .cta-band { flex-direction: column; text-align: center; justify-content: center; }
          .cta-buttons { justify-content: center; width: 100%; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO — split layout, cinematic
      ═══════════════════════════════════════ */}
      <div style={{ position: 'relative', padding: 'clamp(80px, 10vw, 130px) 0 clamp(60px, 8vw, 90px)', background: '#060201' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 80% at 75% 50%, rgba(139,26,40,0.38) 0%, transparent 65%)' }} />

        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(45deg,#C9972A 0,#C9972A 1px,transparent 1px,transparent 48px),
                            repeating-linear-gradient(-45deg,#C9972A 0,#C9972A 1px,transparent 1px,transparent 48px)` }} />

        <div className="hero-ornaments">
          {[
            { top: 32, right: 44, borderTop: '1px solid rgba(201,151,42,0.25)', borderRight: '1px solid rgba(201,151,42,0.25)' },
            { bottom: 32, left: 44, borderBottom: '1px solid rgba(201,151,42,0.25)', borderLeft: '1px solid rgba(201,151,42,0.25)' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 56, height: 56, pointerEvents: 'none', ...s }} />
          ))}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent, rgba(201,151,42,0.08) 20%, rgba(201,151,42,0.08) 80%, transparent)' }} />
        </div>

        <motion.div style={{ y: heroY }}>
          <div className="wrapper">
            <div className="ag">
              {/* Left */}
              <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(20px, 4vw, 32px)' }}>
                  <div style={{ width: 28, height: 1, background: '#C9972A' }} />
                  <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 6,
                    color: '#C9972A', textTransform: 'uppercase', fontWeight: 600 }}>
                    Est. 2004 · Madhya Pradesh
                  </span>
                </div>

                <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(42px, 6vw, 68px)',
                  color: '#FFFDF5', lineHeight: 1.04, fontWeight: 400 }}>
                  Traditional<br />
                  <em style={{ color: '#C9972A', fontStyle: 'italic', fontWeight: 600 }}>Craft,</em><br />
                  Modern Speed.
                </h1>

                <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 12, letterSpacing: 4,
                  color: 'rgba(201,151,42,0.45)', fontStyle: 'italic', fontWeight: 300, marginTop: 20 }}>
                  — Crafted for You
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 36 }}>
                  <div style={{ height: 1, width: 40, background: 'linear-gradient(to right,#C9972A,transparent)' }} />
                  <span style={{ color: '#C9972A', fontSize: 10 }}>✦</span>
                  <div style={{ height: 1, width: 40, background: '#C9972A' }} />
                  <span style={{ color: '#C9972A', fontSize: 10 }}>✦</span>
                  <div style={{ height: 1, width: 40, background: 'linear-gradient(to left,#C9972A,transparent)' }} />
                </div>

                <div className="hero-stats" style={{ display: 'flex', gap: 4, marginTop: 36, flexWrap: 'wrap' }}>
                  {[
                    { n: '20+', l: 'Years of Craft' },
                    { n: '3',   l: 'Showrooms' },
                    { n: '24h', l: 'Turnaround' },
                  ].map(s => (
                    <div key={s.n} style={{ border: '1px solid rgba(201,151,42,0.2)', padding: '12px clamp(12px, 2vw, 20px)', textAlign: 'center', flexGrow: 1, minWidth: '80px' }}>
                      <p style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700,
                        color: '#C9972A', lineHeight: 1 }}>{s.n}</p>
                      <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 3,
                        color: 'rgba(201,151,42,0.5)', textTransform: 'uppercase', marginTop: 6 }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right */}
              <motion.div initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}>

                <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(244,232,208,0.6)',
                  lineHeight: 1.9, fontWeight: 300, marginBottom: 36 }}>
                  Tailor 24 was built on a single conviction: the finest Indian garments should not
                  require months of waiting. We brought together master karigars — each with 20 to
                  35 years of classical training — and built a system that honours their craft
                  while delivering it in 24 hours.
                </p>

                <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 'clamp(14px, 1.8vw, 15px)', color: 'rgba(244,232,208,0.42)',
                  lineHeight: 1.9, fontWeight: 300, marginBottom: 40 }}>
                  The hands are old. The approach is new. Nothing else has changed.
                </p>

                <div style={{ position: 'relative', paddingLeft: 28 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
                    background: 'linear-gradient(to bottom, #C9972A, rgba(201,151,42,0.05))' }} />
                  <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 'clamp(14px, 1.8vw, 15px)',
                    color: 'rgba(201,151,42,0.5)', lineHeight: 1.9, fontStyle: 'italic', fontWeight: 300 }}>
                    "We are not a fast-fashion house. We are a fast house of slow craft."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <GoldRule />

      {/* ═══════════════════════════════════════
          THE KARIGARS
      ═══════════════════════════════════════ */}
      <div style={{ background: '#0A0301', padding: 'clamp(60px, 8vw, 96px) 0' }}>
        <div style={{ position: 'absolute', pointerEvents: 'none', width: '100%',
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,151,42,0.04), transparent 70%)' }} />

        <div className="wrapper">
          <SectionLabel text="The Hands Behind the Work" />

          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 3vw, 28px)',
              color: 'rgba(255,253,245,0.75)', fontWeight: 400, lineHeight: 1.45,
              maxWidth: 720, marginBottom: 'clamp(40px, 6vw, 64px)', fontStyle: 'italic' }}>
            Our karigars are not employees.<br />
            <span style={{ color: 'rgba(201,151,42,0.6)' }}>They are the reason Tailor 24 exists.</span>
          </motion.p>

          <div className="kg" style={{ background: 'rgba(201,151,42,0.05)' }}>
            {KARIGARS.map((k, i) => (
              <motion.div key={k.role} className="karigar-card"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                style={{ padding: 'clamp(32px, 4vw, 44px) clamp(24px, 3vw, 36px)', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(201,151,42,0.06)' }}>

                <span className="exp-tag" style={{ position: 'absolute', top: 20, right: 20,
                  fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: 3 }}>{k.exp}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9972A', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 4,
                    color: 'rgba(201,151,42,0.5)', textTransform: 'uppercase' }}>{k.city}</span>
                </div>

                <p style={{ fontFamily: 'Cinzel, serif', fontSize: 16, color: '#FFFDF5',
                  fontWeight: 600, letterSpacing: 2, marginBottom: 8, lineHeight: 1.3 }}>{k.role}</p>

                <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 2,
                  color: 'rgba(201,151,42,0.55)', textTransform: 'uppercase', marginBottom: 20 }}>{k.craft}</p>

                <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13,
                  color: 'rgba(212,188,148,0.45)', lineHeight: 1.8, fontWeight: 300, fontStyle: 'italic' }}>
                  {k.note}
                </p>

                <div className="k-line" style={{ height: 1, marginTop: 24 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <GoldRule />

      {/* ═══════════════════════════════════════
          THE CRAFT & FABRICS
      ═══════════════════════════════════════ */}
      <div style={{ background: '#FAF3E8', padding: 'clamp(60px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(45deg,#8B1A28 0,#8B1A28 1px,transparent 1px,transparent 44px),
                            repeating-linear-gradient(-45deg,#8B1A28 0,#8B1A28 1px,transparent 1px,transparent 44px)` }} />

        <div className="wrapper">
          <SectionLabel text="Our Craft" />

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(30px, 5vw, 80px)', marginBottom: 'clamp(40px, 6vw, 64px)', alignItems: 'flex-end' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 4vw, 40px)',
              color: '#1A0E08', fontWeight: 400, lineHeight: 1.2, flex: '1 1 300px' }}>
              Six traditions.<br />
              <em style={{ color: '#8B1A28', fontStyle: 'italic' }}>One house.</em>
            </h2>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: 'rgba(92,74,50,0.7)',
              lineHeight: 1.9, fontWeight: 300, flex: '1 1 400px' }}>
              Every technique we practise has a lineage stretching back centuries.
              Our karigars did not learn these from books — they inherited them, workshop by
              workshop, hand by hand, across decades of making.
            </p>
          </motion.div>

          <div className="crg" style={{ background: 'rgba(212,188,148,0.2)' }}>
            {CRAFTS.map((c, i) => (
              <motion.div key={c.name} className="craft-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }} viewport={{ once: true }}
                style={{ padding: 'clamp(32px, 4vw, 40px) clamp(24px, 3vw, 32px)', position: 'relative', overflow: 'hidden',
                  borderRight: '1px solid rgba(212,188,148,0.4)', borderBottom: '1px solid rgba(212,188,148,0.4)' }}>

                <div className="c-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,26,40,0.25), transparent)' }} />

                <p className="c-origin" style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 4,
                  textTransform: 'uppercase', marginBottom: 14 }}>
                  {c.origin}
                </p>

                <p className="c-title" style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 600,
                  marginBottom: 16, lineHeight: 1.1 }}>{c.name}</p>

                <p className="c-desc" style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, lineHeight: 1.8, fontWeight: 300 }}>{c.desc}</p>

                <div className="c-line" style={{ height: 1, marginTop: 24 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <GoldRule />

      {/* ═══════════════════════════════════════
          THE SHOWROOMS
      ═══════════════════════════════════════ */}
      <div style={{ background: '#060201', padding: 'clamp(60px, 8vw, 96px) 0 0' }}>
        <div className="wrapper" style={{ paddingBottom: 'clamp(60px, 8vw, 96px)' }}>
          <SectionLabel text="Visit Us" />

          <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 3vw, 30px)', color: 'rgba(255,253,245,0.7)',
              fontWeight: 400, lineHeight: 1.4, maxWidth: 620, marginBottom: 'clamp(40px, 6vw, 72px)', fontStyle: 'italic' }}>
            Three cities. Three spaces.<br />
            <span style={{ color: 'rgba(201,151,42,0.55)' }}>One standard of craft.</span>
          </motion.p>

          <div className="cg">
            {CITIES.map((city, i) => (
              <motion.div key={city.name} className="city-card"
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.13, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                style={{ position: 'relative', overflow: 'hidden' }}>

                <div style={{ height: 'clamp(220px, 30vw, 260px)', overflow: 'hidden', position: 'relative' }}>
                  <img src={city.img} alt={city.name} className="city-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover',
                      objectPosition: 'center', filter: 'brightness(0.5) sepia(20%)', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(6,2,1,0.85) 0%, transparent 60%)' }} />
                  
                  <div className="city-tag" style={{ position: 'absolute', top: 0, right: 0, padding: '6px 16px' }}>
                    <span className="city-tag-text" style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 3,
                      fontWeight: 600, textTransform: 'uppercase' }}>{city.tag}</span>
                  </div>
                  
                  <p className="city-title" style={{ position: 'absolute', bottom: 20, left: 24,
                    fontFamily: 'Cinzel, serif', fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: 2 }}>{city.name}</p>
                </div>

                <div className="city-panel" style={{ padding: 'clamp(24px, 3vw, 28px) clamp(20px, 3vw, 24px) 32px', position: 'relative' }}>
                  <div className="city-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,26,40,0.2), transparent)' }} />

                  <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 2,
                    textTransform: 'uppercase', color: 'rgba(201,151,42,0.55)', fontWeight: 600, marginBottom: 12 }}>{city.craft}</p>

                  <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, fontStyle: 'italic',
                    color: 'rgba(244,232,208,0.45)', lineHeight: 1.75, marginBottom: 20 }}>{city.desc}</p>

                  <div style={{ borderTop: '1px solid rgba(201,151,42,0.08)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[city.addr, city.hours].map((line, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(201,151,42,0.4)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 11, color: 'rgba(201,151,42,0.45)', letterSpacing: 1 }}>{line}</span>
                      </div>
                    ))}
                  </div>

                  <div className="city-line" style={{ height: 1, marginTop: 24 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CLOSING CTA BAND
      ═══════════════════════════════════════ */}
      <div style={{ background: '#0F0402', position: 'relative', overflow: 'hidden' }}>
        <GoldRule />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 100% at 50% 50%, rgba(201,151,42,0.05), transparent 70%)' }} />

        <div className="wrapper cta-band" style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>

          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 4vw, 38px)',
              color: '#FFFDF5', fontWeight: 400, lineHeight: 1.25, margin: 0 }}>
              Ready to be<br />
              <em style={{ color: '#C9972A', fontWeight: 600, fontStyle: 'italic' }}>Crafted for You?</em>
            </p>
          </motion.div>

          <motion.div className="cta-buttons" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.12 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/catalog"
              style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 4, fontWeight: 600,
                textTransform: 'uppercase', color: '#060201', background: '#C9972A',
                padding: '16px 32px', textDecoration: 'none', transition: 'background 0.3s', flex: '1 1 auto', textAlign: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = '#D4A017'}
              onMouseLeave={e => e.currentTarget.style.background = '#C9972A'}>
              Explore Catalogue →
            </Link>
            <Link to="/contact"
              style={{ fontFamily: 'Raleway, sans-serif', fontSize: 10, letterSpacing: 4, fontWeight: 600,
                textTransform: 'uppercase', color: 'rgba(201,151,42,0.8)',
                border: '1px solid rgba(201,151,42,0.3)', padding: '16px 32px',
                textDecoration: 'none', transition: 'all 0.3s', flex: '1 1 auto', textAlign: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#C9972A'; e.currentTarget.style.color='#C9972A'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,151,42,0.3)'; e.currentTarget.style.color='rgba(201,151,42,0.8)'; }}>
              Book a Visit
            </Link>
          </motion.div>
        </div>
        <GoldRule />
      </div>
    </div>
  );
}