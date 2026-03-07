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
    <div style={{ height: 1, width: '100%', background: 'linear-gradient(90deg,transparent,rgba(184,134,11,0.2) 25%,rgba(184,134,11,0.2) 75%,transparent)' }} />
  );
}

function SectionLabel({ text }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(139,26,40,0.15))' }} />
      <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: 9, letterSpacing: 6,
        color: '#8B1A28', textTransform: 'uppercase', whiteSpace: 'nowrap', fontWeight: 600 }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(139,26,40,0.15))' }} />
    </motion.div>
  );
}

export default function AboutPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 70]);

  return (
    <div style={{ background: '#FFFDF5', overflow: 'hidden', width: '100%', color: '#1A0E08' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .wrapper { max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 48px); }
        .ag { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(40px, 8vw, 80px); align-items: center; }
        .kg { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        .cg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .crg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }

        /* Card Hover Effects */
        .karigar-card { transition: all 0.4s; background: #FFFFFF; border: 1px solid #F0EAD6; }
        .karigar-card:hover { background: #FDF9F0; border-color: #D4AF37; transform: translateY(-4px); }
        .karigar-card .exp-tag { color: #B8860B; }
        .karigar-card .k-line { transition: width 0.35s; width: 18px; background: #8B1A28; opacity: 0.3; }
        .karigar-card:hover .k-line { width: 48px; opacity: 1; }

        .craft-card { transition: all 0.45s cubic-bezier(0.22,1,0.36,1); background: #F9F7F2; border: 1px solid #EAE5D5; }
        .craft-card:hover { background: #FFFFFF; box-shadow: 0 20px 40px rgba(0,0,0,0.03); transform: translateY(-4px); }
        .craft-card .c-origin { color: #8B1A28; opacity: 0.6; }
        .craft-card .c-title { color: #1A0E08; }
        .craft-card:hover .c-title { color: #8B1A28; }

        .city-card { transition: transform 0.4s ease; }
        .city-card .city-img { transition: transform 0.8s ease; transform: scale(1); filter: sepia(15%) contrast(90%); }
        .city-card:hover .city-img { transform: scale(1.08); filter: sepia(0%) contrast(100%); }
        .city-panel { background: #FFFFFF; border: 1px solid #F0EAD6; border-top: none; }
        .city-card:hover .city-panel { border-color: #D4AF37; }

        @media(max-width:1024px) { 
          .kg, .crg { grid-template-columns: repeat(2, 1fr); } 
          .cg { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media(max-width:900px) { 
          .ag { grid-template-columns: 1fr; } 
        }
        @media(max-width:600px) { 
          .kg, .crg, .cg { grid-template-columns: 1fr; } 
          .cta-band { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* LIGHT HERO SECTION */}
      <div style={{ position: 'relative', padding: 'clamp(100px, 12vw, 160px) 0 clamp(80px, 10vw, 120px)', background: '#FDF9F0' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
          backgroundImage: `radial-gradient(#8B1A28 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        
        <motion.div style={{ y: heroY }}>
          <div className="wrapper">
            <div className="ag">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 30, height: 1, background: '#8B1A28' }} />
                  <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#8B1A28', fontWeight: 700, textTransform: 'uppercase' }}>
                    Est. 2004 · Madhya Pradesh
                  </span>
                </div>

                <h1 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(44px, 7vw, 76px)', color: '#1A0E08', lineHeight: 1.05, fontWeight: 400 }}>
                  Timeless<br />
                  <em style={{ color: '#8B1A28', fontStyle: 'italic', fontWeight: 600 }}>Artistry,</em><br />
                  Modern Speed.
                </h1>

                <div className="hero-stats" style={{ display: 'flex', gap: 8, marginTop: 48 }}>
                  {[{ n: '20+', l: 'Years' }, { n: '4k+', l: 'Patrons' }, { n: '24h', l: 'Ready' }].map(s => (
                    <div key={s.l} style={{ border: '1px solid rgba(139,26,40,0.1)', background: '#FFF', padding: '16px 24px', flex: 1, textAlign: 'center' }}>
                      <p style={{ fontFamily: 'Cinzel', fontSize: 24, color: '#8B1A28', margin: 0, fontWeight: 700 }}>{s.n}</p>
                      <p style={{ fontFamily: 'Raleway', fontSize: 8, letterSpacing: 2, color: '#5C4A32', textTransform: 'uppercase', marginTop: 4 }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <p style={{ fontFamily: 'Raleway', fontSize: 'clamp(16px, 2vw, 18px)', color: '#5C4A32', lineHeight: 1.8, fontWeight: 400 }}>
                  Tailor 24 was born from a singular vision: to preserve the soul of Indian craftsmanship while meeting the demands of a new generation. 
                </p>
                <p style={{ fontFamily: 'Raleway', fontSize: '15px', color: 'rgba(92,74,50,0.7)', lineHeight: 1.8, marginTop: 24 }}>
                  We don't just sew garments; we curate heritage. By empowering our local karigars with optimized workflows, we deliver hand-crafted luxury within 24 hours without compromising a single stitch.
                </p>
                <div style={{ marginTop: 32, paddingLeft: 20, borderLeft: '2px solid #D4AF37' }}>
                  <p style={{ fontFamily: 'Cinzel', fontSize: 14, color: '#8B1A28', fontStyle: 'italic' }}>
                    "Slow craft, delivered fast."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <GoldRule />

      {/* KARIGARS SECTION */}
      <div style={{ background: '#FFFDF5', padding: '100px 0' }}>
        <div className="wrapper">
          <SectionLabel text="The Master Hands" />
          <div className="kg" style={{ background: '#F0EAD6' }}>
            {KARIGARS.map((k, i) => (
              <motion.div key={k.role} className="karigar-card" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                style={{ padding: '48px 32px', position: 'relative' }}>
                <span className="exp-tag" style={{ fontFamily: 'Cinzel', fontSize: 10, position: 'absolute', top: 24, right: 24, fontWeight: 700 }}>{k.exp}</span>
                <p style={{ fontFamily: 'Raleway', fontSize: 9, color: '#8B1A28', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12 }}>{k.city}</p>
                <h3 style={{ fontFamily: 'Cinzel', fontSize: 18, color: '#1A0E08', marginBottom: 8, fontWeight: 600 }}>{k.role}</h3>
                <p style={{ fontFamily: 'Raleway', fontSize: 11, color: '#5C4A32', textTransform: 'uppercase', marginBottom: 20, opacity: 0.7 }}>{k.craft}</p>
                <p style={{ fontFamily: 'Raleway', fontSize: 13, color: '#5C4A32', fontStyle: 'italic', lineHeight: 1.6 }}>{k.note}</p>
                <div className="k-line" style={{ height: 1, marginTop: 24 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <GoldRule />

      {/* CRAFT SECTION */}
      <div style={{ background: '#F3EFE0', padding: '100px 0' }}>
        <div className="wrapper">
          <SectionLabel text="Our Heritage" />
          <div className="crg" style={{ background: '#EAE5D5' }}>
            {CRAFTS.map((c, i) => (
              <motion.div key={c.name} className="craft-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ padding: '40px 32px', position: 'relative' }}>
                <p className="c-origin" style={{ fontFamily: 'Raleway', fontSize: 9, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>{c.origin}</p>
                <h3 className="c-title" style={{ fontFamily: 'Cinzel', fontSize: 22, marginBottom: 16, fontWeight: 600 }}>{c.name}</h3>
                <p className="c-desc" style={{ fontFamily: 'Raleway', fontSize: 14, lineHeight: 1.7, color: '#5C4A32' }}>{c.desc}</p>
                <div style={{ height: 1, width: 20, background: '#D4AF37', marginTop: 24 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <GoldRule />

      {/* SHOWROOMS SECTION */}
      <div style={{ background: '#FFFDF5', padding: '100px 0' }}>
        <div className="wrapper">
          <SectionLabel text="Visit Our Ateliers" />
          <div className="cg">
            {CITIES.map((city, i) => (
              <motion.div key={city.name} className="city-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div style={{ height: 280, overflow: 'hidden', position: 'relative', border: '1px solid #F0EAD6' }}>
                  <img src={city.img} alt={city.name} className="city-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#8B1A28', color: '#FFF', padding: '8px 16px', fontSize: 9, fontFamily: 'Raleway', fontWeight: 600, letterSpacing: 2 }}>{city.tag}</div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,14,8,0.4), transparent)' }} />
                  <h3 style={{ position: 'absolute', bottom: 20, left: 24, fontFamily: 'Cinzel', fontSize: 28, color: '#FFF', margin: 0 }}>{city.name}</h3>
                </div>
                <div className="city-panel" style={{ padding: '32px 24px' }}>
                  <p style={{ fontFamily: 'Raleway', fontSize: 10, color: '#8B1A28', letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>{city.craft}</p>
                  <p style={{ fontFamily: 'Raleway', fontSize: 13, color: '#5C4A32', lineHeight: 1.6, marginBottom: 24 }}>{city.desc}</p>
                  <div style={{ borderTop: '1px solid #F0EAD6', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p style={{ fontFamily: 'Raleway', fontSize: 11, color: '#8B1A28', fontWeight: 500 }}>{city.addr}</p>
                    <p style={{ fontFamily: 'Raleway', fontSize: 11, color: '#5C4A32', opacity: 0.7 }}>{city.hours}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHT CTA BAND */}
      <div style={{ background: '#8B1A28', padding: '100px 0', color: '#FFFDF5' }}>
        <div className="wrapper cta-band" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFF', fontWeight: 400, margin: 0 }}>
              Begin Your <em style={{ color: '#D4AF37' }}>Custom</em> Journey.
            </h2>
            <p style={{ fontFamily: 'Raleway', marginTop: 12, opacity: 0.8, letterSpacing: 1 }}>Crafted in Vidisha. Worn Worldwide.</p>
          </div>
          <div className="cta-buttons" style={{ display: 'flex', gap: 20 }}>
            <Link to="/catalog" style={{ background: '#FFFDF5', color: '#8B1A28', padding: '18px 36px', fontFamily: 'Raleway', fontWeight: 700, fontSize: 11, letterSpacing: 3, textDecoration: 'none', transition: 'all 0.3s' }}>
              EXPLORE
            </Link>
            <Link to="/contact" style={{ border: '1px solid #D4AF37', color: '#D4AF37', padding: '18px 36px', fontFamily: 'Raleway', fontWeight: 700, fontSize: 11, letterSpacing: 3, textDecoration: 'none' }}>
              APPOINTMENT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}