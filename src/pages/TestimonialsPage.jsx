import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

const REVIEWS = [
  {
    name:'Arjun Mehta', city:'New Delhi', year:'2024', rating:5,
    occasion:'Wedding Sherwani',
    short:'An heirloom in the truest sense.',
    text:'The sherwani crafted for my wedding was beyond imagination. Every guest stopped to ask where I had it made. The zardozi on the neckline alone took two artisans twelve days — and it shows in every stitch.',
    img:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
  },
  {
    name:'Priya Kapoor', city:'Mumbai', year:'2024', rating:5,
    occasion:'Bridal Lehenga',
    short:'Every thread felt like it was made for me.',
    text:'I have worn many designer lehengas, but nothing compares to what Tailor 24 created for my wedding. The fabric, the embroidery, the fit — there was not a single compromise. I felt like royalty.',
    img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  },
  {
    name:'Vikram Singh', city:'Jaipur', year:'2024', rating:5,
    occasion:'Achkan & Churidar',
    short:'Unmatched in every way.',
    text:'Tailor 24 turned my vision into reality. The Chanderi achkan drapes like nothing I have worn before — and the collar detailing alone took three karigars a week. I will not go anywhere else.',
    img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    name:'Rohit Agarwal', city:'Lucknow', year:'2023', rating:5,
    occasion:'Wedding Sherwani',
    short:'Timeless quality, across generations.',
    text:'Three generations of my family have been patrons of this craft. The quality is timeless — it carries the weight of tradition and wears like a second skin. My grandfather would have approved.',
    img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
  },
];

export default function TestimonialsPage() {
  const [idx, setIdx]     = useState(0);
  const [dir, setDir]     = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef          = useRef(null);

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
      }, 6000);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx(i => (i + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => { resetTimer(); }, [paused]);

  const r = REVIEWS[idx];

  return (
    <section
      style={{ background:'#060201', position:'relative', overflow:'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <style>{fonts}{`
        * { box-sizing:border-box; }
        @media(max-width:900px){ .tp-inner{ grid-template-columns:1fr!important; } .tp-photo{ display:none!important; } }
      `}</style>

      {/* Ambient glow */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(139,26,40,0.08) 0%, transparent 70%)' }} />

      {/* Top rule */}
      <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(201,151,42,0.4) 25%,rgba(201,151,42,0.4) 75%,transparent)' }} />

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'96px 48px 80px', position:'relative', zIndex:1 }}>

        {/* Section label */}
        <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:72 }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(to right, transparent, rgba(201,151,42,0.25))' }} />
          <span style={{ fontFamily:'Raleway, sans-serif', fontSize:9, letterSpacing:6, color:'#C9972A', textTransform:'uppercase', whiteSpace:'nowrap' }}>
            Patron Stories
          </span>
          <div style={{ flex:1, height:1, background:'linear-gradient(to left, transparent, rgba(201,151,42,0.25))' }} />
        </motion.div>

        {/* Main review area */}
        <div style={{ position:'relative', minHeight:420 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={idx}
              custom={dir}
              variants={{
                enter:(d) => ({ opacity:0, x: d > 0 ? 80 : -80, filter:'blur(6px)' }),
                center:    { opacity:1, x:0, filter:'blur(0px)' },
                exit:(d)  => ({ opacity:0, x: d > 0 ? -80 : 80, filter:'blur(6px)' }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>

              <div className="tp-inner" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:72, alignItems:'center' }}>

                {/* Left: quote block */}
                <div>
                  {/* Occasion tag */}
                  <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:32,
                    border:'1px solid rgba(201,151,42,0.2)', padding:'6px 16px' }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:'#C9972A', flexShrink:0 }} />
                    <span style={{ fontFamily:'Raleway, sans-serif', fontSize:9, letterSpacing:4,
                      color:'rgba(201,151,42,0.65)', textTransform:'uppercase' }}>{r.occasion}</span>
                  </div>

                  {/* Stars */}
                  <div style={{ display:'flex', gap:6, marginBottom:28 }}>
                    {Array(r.rating).fill(0).map((_,i) => (
                      <span key={i} style={{ color:'#C9972A', fontSize:13 }}>★</span>
                    ))}
                  </div>

                  {/* Short pull quote */}
                  <p style={{ fontFamily:'Cinzel, serif', fontSize:'clamp(20px,3vw,34px)',
                    color:'#FFFDF5', fontWeight:400, lineHeight:1.25, marginBottom:28,
                    fontStyle:'italic' }}>
                    "{r.short}"
                  </p>

                  {/* Full text */}
                  <p style={{ fontFamily:'Raleway, sans-serif', fontSize:15,
                    color:'rgba(244,232,208,0.55)', lineHeight:1.9, fontWeight:300, marginBottom:36 }}>
                    {r.text}
                  </p>

                  {/* Attribution */}
                  <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:32, height:1, background:'rgba(201,151,42,0.4)' }} />
                    <div>
                      <p style={{ fontFamily:'Cinzel, serif', fontSize:13, color:'#C9972A',
                        letterSpacing:3, fontWeight:600, marginBottom:4 }}>{r.name}</p>
                      <p style={{ fontFamily:'Raleway, sans-serif', fontSize:10, letterSpacing:3,
                        color:'rgba(201,151,42,0.4)', textTransform:'uppercase' }}>
                        {r.city} · {r.year}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: portrait photo */}
                <div className="tp-photo"
                  style={{ position:'relative', height:400 }}>

                  {/* Double-frame ornament */}
                  <div style={{ position:'absolute', top:-10, left:-10, right:10, bottom:10,
                    border:'1px solid rgba(201,151,42,0.15)', pointerEvents:'none' }} />

                  <div style={{ width:'100%', height:'100%', overflow:'hidden', position:'relative' }}>
                    <img src={r.img} alt={r.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center',
                        filter:'brightness(0.7) sepia(20%)', display:'block' }} />
                    {/* Gradient over photo */}
                    <div style={{ position:'absolute', inset:0,
                      background:'linear-gradient(to right, rgba(6,2,1,0.6) 0%, transparent 40%, rgba(6,2,1,0.2) 100%)' }} />
                  </div>

                  {/* Gold corner bracket */}
                  <div style={{ position:'absolute', bottom:-10, right:-10, width:40, height:40,
                    borderBottom:'1px solid rgba(201,151,42,0.4)', borderRight:'1px solid rgba(201,151,42,0.4)' }} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:64, flexWrap:'wrap', gap:24 }}>

          {/* Reviewer mini-list */}
          <div style={{ display:'flex', gap:2 }}>
            {REVIEWS.map((rv, i) => (
              <button key={i} onClick={() => go(i)}
                style={{ background:'none', border:'none', cursor:'pointer',
                  padding:'10px 16px', position:'relative', outline:'none' }}>
                <span style={{ fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:2,
                  color: i === idx ? '#C9972A' : 'rgba(201,151,42,0.3)',
                  transition:'color 0.3s', whiteSpace:'nowrap' }}>
                  {rv.name.split(' ')[0]}
                </span>
                {i === idx && (
                  <motion.div layoutId="reviewer-underline"
                    style={{ position:'absolute', bottom:0, left:16, right:16, height:1, background:'#C9972A' }} />
                )}
              </button>
            ))}
          </div>

          {/* Arrow nav */}
          <div style={{ display:'flex', gap:8 }}>
            {[
              { label:'←', fn:() => go((idx - 1 + REVIEWS.length) % REVIEWS.length) },
              { label:'→', fn:() => go((idx + 1) % REVIEWS.length) },
            ].map(btn => (
              <button key={btn.label} onClick={btn.fn}
                style={{ background:'none', border:'1px solid rgba(201,151,42,0.22)',
                  cursor:'pointer', width:44, height:44, color:'rgba(201,151,42,0.55)',
                  fontSize:16, fontFamily:'Cinzel, serif', transition:'all 0.25s', outline:'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#C9972A'; e.currentTarget.style.color='#C9972A'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,151,42,0.22)'; e.currentTarget.style.color='rgba(201,151,42,0.55)'; }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop:32, height:1, background:'rgba(201,151,42,0.1)', position:'relative', overflow:'hidden' }}>
          <motion.div
            key={idx}
            initial={{ width:'0%' }}
            animate={{ width: paused ? undefined : '100%' }}
            transition={{ duration:6, ease:'linear' }}
            style={{ position:'absolute', left:0, top:0, height:'100%', background:'rgba(201,151,42,0.45)' }} />
        </div>

        {/* Bottom tagline */}
        <div style={{ textAlign:'center', marginTop:48 }}>
          <p style={{ fontFamily:'Raleway, sans-serif', fontSize:11, fontStyle:'italic',
            color:'rgba(201,151,42,0.25)', letterSpacing:3 }}>
            10,000+ patrons served across Bhopal, Indore & Vidisha
          </p>
        </div>
      </div>

      <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(201,151,42,0.4) 25%,rgba(201,151,42,0.4) 75%,transparent)' }} />
    </section>
  );
}