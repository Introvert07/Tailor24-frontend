import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── PALETTE ────────────────────────────────────────────── */
const C = {
  page:"#FBF4E8",parchment:"#F4E8D0",white:"#FFFDF5",
  maroon:"#6B0F1A",maroonL:"#8B1A28",
  gold:"#B5892E",goldB:"#D4A017",goldL:"#F2C84B",
  teal:"#1A5C5C",ink:"#1A0800",inkMid:"#3D2008",
  muted:"#7A6040",border:"#D4BC94",threadR:"#6B0F1A",threadG:"#1A5C5C",
};

/* ─── DATA ───────────────────────────────────────────────── */
const TESTIMONIALS = [
  { id:1,  name:"Priya Verma",     city:"Bhopal",   for:"Women", stars:5, occasion:"Wedding Lehenga",
    avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    text:"My wedding lehenga was beyond imagination. Every zari thread placed with love. Tailor24 made me feel like a queen. The three fittings were an experience in themselves — they remembered every detail I mentioned in our first consultation.",
    garment:"Bridal Lehenga · Katan Silk", year:"2024" },
  { id:2,  name:"Arjun Sharma",    city:"Indore",   for:"Men",   stars:5, occasion:"Reception Bandhgala",
    avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    text:"The Bandhgala fit like it was born on my shoulders. Central India finally has a tailor worthy of the occasion. I've worn custom pieces from tailors across India and Tailor24 is unmatched in the region for menswear.",
    garment:"Jodhpuri Bandhgala · Ivory Brocade", year:"2024" },
  { id:3,  name:"Meena Tiwari",    city:"Vidisha",  for:"Kids",  stars:5, occasion:"Festival Outfits",
    avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    text:"Our twins looked adorable in their matching outfits. The craftsmanship on such small garments was remarkable — the same level of detail as adult pieces. They received compliments all evening.",
    garment:"Kids Matching Sherwani + Lehenga Set", year:"2023" },
  { id:4,  name:"Sunita Agarwal",  city:"Indore",   for:"Women", stars:5, occasion:"Anniversary Saree",
    avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    text:"I commissioned a Banarasi saree for my 25th anniversary and it arrived like a piece of art. The drape, the weight, the border — everything was perfect. My mother-in-law was speechless.",
    garment:"Banarasi Handwoven Silk Saree", year:"2023" },
  { id:5,  name:"Vikram Malhotra", city:"Bhopal",   for:"Men",   stars:5, occasion:"Groom's Sherwani",
    avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    text:"I was married in a Sherwani Royale from Tailor24. Seven years later, it still fits perfectly — and I wear it every Diwali. The stitching has not yielded even slightly.",
    garment:"Sherwani Royale · Banarasi Brocade", year:"2017" },
  { id:6,  name:"Rekha Singh",     city:"Jabalpur", for:"Women", stars:5, occasion:"Mother-of-Bride",
    avatar:"https://images.unsplash.com/photo-1507101105822-7472b28602ef?q=80&w=150&auto=format&fit=crop",
    text:"As the mother of the bride, I wanted to be elegant without overshadowing my daughter. Tailor24 understood perfectly. My anarkali was the quiet confidence I needed.",
    garment:"Silk Anarkali · Chanderi Weave", year:"2024" },
];

const RATING_SUMMARY = [
  { stars:5, pct:94 },
  { stars:4, pct:5  },
  { stars:3, pct:1  },
  { stars:2, pct:0  },
  { stars:1, pct:0  },
];

/* ─── SVG ATOMS ──────────────────────────────────────────── */
const Rangoli = ({ s=48 }) => (
  <svg width={s} height={s} viewBox="0 0 52 52" style={{ flexShrink:0 }}>
    <circle cx="26" cy="26" r="23" stroke={C.gold}   strokeWidth="0.8" fill="none" opacity="0.4"/>
    <circle cx="26" cy="26" r="16" stroke={C.gold}   strokeWidth="0.6" fill="none" opacity="0.3"/>
    <circle cx="26" cy="26" r="9"  stroke={C.maroon} strokeWidth="0.8" fill="none" opacity="0.4"/>
    <circle cx="26" cy="26" r="4"  fill={C.gold}   opacity="0.45"/>
    <circle cx="26" cy="26" r="2"  fill={C.maroon}  opacity="0.8"/>
    {[...Array(8)].map((_,i)=>{
      const a=(i/8)*Math.PI*2,
            x1=26+9*Math.cos(a),  y1=26+9*Math.sin(a),
            x2=26+16*Math.cos(a), y2=26+16*Math.sin(a),
            px=26+21*Math.cos(a), py=26+21*Math.sin(a);
      return <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth="0.7" opacity="0.45"/>
        <ellipse cx={px} cy={py} rx="2.5" ry="4"
          transform={`rotate(${i*45+90},${px},${py})`}
          fill={`${C.maroon}55`} stroke={C.gold} strokeWidth="0.5"/>
      </g>;
    })}
    {[...Array(8)].map((_,i)=>{
      const a=((i+0.5)/8)*Math.PI*2;
      return <circle key={i} cx={26+13*Math.cos(a)} cy={26+13*Math.sin(a)} r="1.5" fill={C.teal} opacity="0.5"/>;
    })}
  </svg>
);

const Corner = ({ flip=false, s=64 }) => (
  <svg width={s} height={s} viewBox="0 0 64 64"
    style={{ transform:flip?"scaleX(-1)":"none", display:"block" }}>
    <path d="M2 62 L2 20 Q2 2 20 2 L62 2"   stroke={C.gold}   strokeWidth="1.2" fill="none" opacity="0.5"/>
    <path d="M7 62 L7 24 Q7 7 24 7 L62 7"   stroke={C.maroon} strokeWidth="0.6" fill="none" opacity="0.3"/>
    <path d="M2 22 Q9 14 16 22 Q9 30 2 22Z"  fill={`${C.gold}45`} stroke={C.gold} strokeWidth="0.7"/>
    <circle cx="9" cy="22" r="2" fill={C.gold} opacity="0.5"/>
    {[12,22,32,42,52].map(v=><g key={v}>
      <circle cx="2" cy={v} r="1" fill={C.gold} opacity="0.3"/>
      <circle cx={v} cy="2" r="1" fill={C.gold} opacity="0.3"/>
    </g>)}
  </svg>
);

const Needle = ({ color=C.maroon }) => (
  <svg width="30" height="30" viewBox="0 0 30 30">
    <line x1="4" y1="26" x2="22" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="22" cy="4" rx="3" ry="5" transform="rotate(-45 22 4)"
      fill="none" stroke={color} strokeWidth="1.2"/>
    <path d="M4 26 Q0 30 2 28 Q11 17 7 22 Q5 25 4 26"
      stroke={C.teal} strokeWidth="0.8" fill="none"/>
  </svg>
);

const Stitch = () => (
  <div style={{ height:16, overflow:"hidden", width:"100%" }}>
    <svg width="100%" height="16" preserveAspectRatio="none">
      {[...Array(60)].map((_,i)=>(
        <line key={i} x1={`${i*1.8}%`} y1="4" x2={`${i*1.8+.8}%`} y2="4"
          stroke={C.threadR} strokeWidth="1.5" strokeLinecap="round" opacity="0.65"/>
      ))}
      {[...Array(40)].map((_,i)=>(
        <g key={i}>
          <line x1={`${i*2.5+.5}%`}  y1="10" x2={`${i*2.5+1.5}%`} y2="15"
            stroke={C.threadG} strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
          <line x1={`${i*2.5+1.5}%`} y1="10" x2={`${i*2.5+.5}%`}  y2="15"
            stroke={C.threadG} strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
        </g>
      ))}
    </svg>
  </div>
);

const Torana = ({ color=C.gold, w=1200 }) => (
  <svg width={w} height={52} viewBox={`0 0 ${w} 52`} style={{ display:"block", overflow:"visible" }}>
    <line x1="0" y1="26" x2={w} y2="26" stroke={color} strokeWidth="0.8" opacity="0.35"/>
    <path d={`M0 21 Q${w*.25} 40 ${w*.5} 21 Q${w*.75} 2 ${w} 21`}
      stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
    {[...Array(9)].map((_,i)=>{
      const x=(w/8)*i+w/16, y=21+18*Math.sin((i/8)*Math.PI);
      return <g key={i} transform={`translate(${x},${y})`}>
        <ellipse cx="0" cy="5" rx="4" ry="7"
          fill={i%2===0?`${C.teal}55`:`${color}45`} stroke={color} strokeWidth="0.5"/>
      </g>;
    })}
    {[...Array(14)].map((_,i)=>(
      <circle key={i} cx={(w/13)*i+w/26} cy="26" r="1.2" fill={color} opacity="0.28"/>
    ))}
  </svg>
);

const Stars = ({ n, size=14, color=C.gold }) => (
  <div style={{ display:"flex", gap:3 }}>
    {[...Array(5)].map((_,i)=>(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24"
        fill={i<n?color:"none"} stroke={color} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

/* ─── COMPONENTS ─────────────────────────────────────────── */
function RBtn({ children, filled=false, onClick }) {
  const [hov,setHov] = useState(false);
  return (
    <motion.button onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      whileTap={{ scale:.97 }} onClick={onClick}
      style={{ position:"relative", overflow:"hidden", padding:"12px 32px",
        border:`1.5px solid ${C.maroon}`, background:filled?C.maroon:"transparent",
        fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:"0.4em",
        fontWeight:700, textTransform:"uppercase",
        color:filled?"white":C.maroon }}>
      <motion.div animate={{ x:hov?"0%":"-101%" }}
        transition={{ duration:.4, ease:[.22,1,.36,1] }}
        style={{ position:"absolute", inset:0, background:filled?C.maroonL:C.maroon }}/>
      <span style={{ position:"relative", zIndex:1, transition:"color .25s",
        color:hov?"white":(filled?"white":C.maroon) }}>{children}</span>
    </motion.button>
  );
}

const FUp = ({ children, delay=0 }) => (
  <motion.div initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true, margin:"-50px" }}
    transition={{ duration:.85, ease:[.22,1,.36,1], delay }}>
    {children}
  </motion.div>
);

const Head = ({ eyebrow, title, center=true }) => (
  <div style={{ textAlign:center?"center":"left", marginBottom:48 }}>
    <div style={{ fontSize:8, letterSpacing:"0.55em", color:C.maroon,
      textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>{eyebrow}</div>
    <div style={{ display:"flex", alignItems:"center",
      justifyContent:center?"center":"flex-start", gap:12, marginBottom:14 }}>
      {center && <div style={{ flex:1, maxWidth:72, height:1,
        background:`linear-gradient(to right,transparent,${C.gold}50)` }}/>}
      <Rangoli s={42}/>
      {center && <div style={{ flex:1, maxWidth:72, height:1,
        background:`linear-gradient(to left,transparent,${C.gold}50)` }}/>}
    </div>
    <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
      fontSize:"clamp(28px,3.8vw,52px)", color:C.ink, fontWeight:600, lineHeight:1.1 }}
      dangerouslySetInnerHTML={{ __html:title }}/>
  </div>
);

const colorFor = f => f==="Men"?C.maroon:f==="Women"?C.teal:C.goldB;

/* ══════════════════════════════════════════════════════════
   TESTIMONIALS PAGE
══════════════════════════════════════════════════════════ */
export default function TestimonialsPage() {
  const [featured, setFeatured] = useState(0);
  const [filter,   setFilter]   = useState("All");

  const filteredT = filter==="All"
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t=>t.for===filter);

  return (
    <div style={{ background:C.page, color:C.ink,
      fontFamily:"'Montserrat',sans-serif", overflowX:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Montserrat:wght@400;600;700&display=swap');
        .test-feat-grid  { display:grid; grid-template-columns:1fr 2fr; gap:80px; align-items:center; }
        .test-cards-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .test-rating-grid{ display:grid; grid-template-columns:1fr 2fr; gap:60px; align-items:center; }
        @media(max-width:900px){
          .test-feat-grid   { grid-template-columns:1fr!important; gap:40px!important; }
          .test-cards-grid  { grid-template-columns:1fr 1fr!important; }
          .test-rating-grid { grid-template-columns:1fr!important; gap:32px!important; }
        }
        @media(max-width:560px){
          .test-cards-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      {/* ── PAGE HERO ── */}
      

      {/* ── FEATURED TESTIMONIAL ── */}
      <section style={{ padding:"100px 0", background:C.page,
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:"-10%", top:"10%",
          opacity:.04, pointerEvents:"none" }}>
          <Rangoli s={600}/>
        </div>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
          <div className="test-feat-grid">

            {/* Sidebar nav */}
            <div>
              <div style={{ fontSize:8, letterSpacing:"0.4em", color:C.maroon,
                textTransform:"uppercase", fontWeight:700, marginBottom:24 }}>
                Featured Voices
              </div>
              {TESTIMONIALS.map((t,i)=>(
                <motion.div key={t.id} onClick={()=>setFeatured(i)}
                  whileHover={{ x:4 }}
                  style={{ display:"flex", gap:14, alignItems:"center",
                    padding:"12px 0", borderBottom:`1px solid ${C.border}`,
                    cursor:"pointer",
                    opacity:i===featured?1:.45, transition:"opacity .3s" }}>
                  <img src={t.avatar} alt=""
                    style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover",
                      border:`2px solid ${i===featured?colorFor(t.for):C.border}`,
                      transition:"border-color .3s" }}/>
                  <div>
                    <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9,
                      fontWeight:700, color:C.ink, letterSpacing:"0.1em",
                      marginBottom:2 }}>{t.name}</div>
                    <div style={{ fontSize:8.5, color:C.muted }}>{t.city} · {t.for}</div>
                  </div>
                  {i===featured && (
                    <div style={{ marginLeft:"auto", width:3, height:36,
                      background:`linear-gradient(to bottom,${C.maroon},${C.gold})`,
                      borderRadius:2 }}/>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Main display */}
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", top:-40, left:-20,
                fontFamily:"'Cormorant Garamond',serif", fontSize:160,
                color:`${C.gold}12`, lineHeight:1,
                pointerEvents:"none", userSelect:"none" }}>"</div>

              <AnimatePresence mode="wait">
                <motion.div key={featured}
                  initial={{ opacity:0, y:24, x:10 }}
                  animate={{ opacity:1, y:0, x:0 }}
                  exit={{ opacity:0, y:-16 }}
                  transition={{ duration:.6, ease:[.22,1,.36,1] }}>

                  <Stars n={TESTIMONIALS[featured].stars} size={16}/>

                  <blockquote style={{ fontFamily:"'Cormorant Garamond',serif",
                    fontSize:"clamp(22px,2.8vw,34px)", color:C.ink, fontStyle:"italic",
                    lineHeight:1.5, margin:"24px 0 32px", position:"relative", zIndex:1 }}>
                    "{TESTIMONIALS[featured].text}"
                  </blockquote>

                  <div style={{ display:"flex", alignItems:"center", gap:20,
                    paddingTop:28, borderTop:`1px solid ${C.border}` }}>
                    <img src={TESTIMONIALS[featured].avatar} alt=""
                      style={{ width:60, height:60, borderRadius:"50%", objectFit:"cover",
                        border:`2px solid ${C.gold}` }}/>
                    <div>
                      <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10,
                        fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase",
                        color:C.ink, marginBottom:4 }}>{TESTIMONIALS[featured].name}</div>
                      <div style={{ fontSize:9, color:C.muted, marginBottom:4 }}>
                        {TESTIMONIALS[featured].city} · {TESTIMONIALS[featured].occasion}
                      </div>
                      <div style={{ fontSize:9,
                        color:colorFor(TESTIMONIALS[featured].for),
                        letterSpacing:"0.1em", fontWeight:600 }}>
                        {TESTIMONIALS[featured].garment}
                      </div>
                    </div>
                    <div style={{ marginLeft:"auto", textAlign:"right" }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif",
                        fontSize:36, color:`${C.gold}30`, fontWeight:700 }}>
                        {TESTIMONIALS[featured].year}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div style={{ display:"flex", gap:8, marginTop:36 }}>
                <button onClick={()=>setFeatured(p=>(p-1+TESTIMONIALS.length)%TESTIMONIALS.length)}
                  style={{ width:40, height:40, border:`1px solid ${C.border}`,
                    background:C.white, fontSize:18, color:C.muted }}>‹</button>
                <button onClick={()=>setFeatured(p=>(p+1)%TESTIMONIALS.length)}
                  style={{ width:40, height:40, border:`1px solid ${C.maroon}`,
                    background:C.maroon, fontSize:18, color:"white" }}>›</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RATING SUMMARY ── */}
      

      {/* ── ALL REVIEW CARDS ── */}
     

      {/* ── SHARE YOUR STORY ── */}
      <section style={{ padding:"100px 0", background:C.page,
        position:"relative", overflow:"hidden" }}>
        {[[20,20,false],[null,20,true],[20,null,false],[null,null,true]].map(([t,l,flip],i)=>(
          <div key={i} style={{ position:"absolute",
            top:t!==null?t:"auto", bottom:t===null?20:"auto",
            left:l!==null?l:"auto", right:l===null?20:"auto" }}>
            <Corner flip={flip} s={64}/>
          </div>
        ))}
        <div style={{ maxWidth:680, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
          <FUp>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
              <Needle/>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(30px,4vw,54px)", color:C.ink, fontWeight:600,
              lineHeight:1.15, marginBottom:20 }}>
              Wore a Tailor24<br/><em style={{ color:C.maroon }}>creation?</em>
            </h2>
            <p style={{ color:C.muted, fontSize:14, lineHeight:1.9, marginBottom:40 }}>
              Your story is a gift to every future patron who stands at our threshold, wondering if the occasion is worth the craft.
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <RBtn filled>Share Your Story</RBtn>
              <RBtn>Book a Consultation</RBtn>
            </div>
          </FUp>
        </div>
      </section>

      {/* ── CTA BAND ── */}
     

    </div>
  );
}