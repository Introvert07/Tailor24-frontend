import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

/* ─── PALETTE ────────────────────────────────────────────── */
const C = {
  page:"#FBF4E8",parchment:"#F4E8D0",sand:"#EDD9B2",white:"#FFFDF5",
  maroon:"#6B0F1A",maroonL:"#8B1A28",maroonD:"#4A0A10",
  gold:"#B5892E",goldB:"#D4A017",goldL:"#F2C84B",
  teal:"#1A5C5C",ink:"#1A0800",inkMid:"#3D2008",
  muted:"#7A6040",border:"#D4BC94",threadR:"#6B0F1A",threadG:"#1A5C5C",
};

/* ─── DATA ───────────────────────────────────────────────── */
const HERO_SLIDES = [
  { src:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop", label:"Jodhpuri Bandhgala", for:"Men" },
  { src:"https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop", label:"Bridal Anarkali",    for:"Women" },
  { src:"https://images.unsplash.com/photo-1593033516514-60e5aa277467?q=80&w=1200&auto=format&fit=crop", label:"Festive Lehenga",    for:"Women" },
  { src:"https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1200&auto=format&fit=crop", label:"Little Royals",      for:"Kids" },
];

const MARQUEE_ITEMS = ["Banarasi Silk","·","Zardozi Embroidery","·","Bridal Lehengas","·","Jodhpuri Suits","·","Anarkali Sets","·","Kids Festive","·","Kashmiri Pashmina","·","Chanderi Brocade","·"];

/* ─── SVG ATOMS ──────────────────────────────────────────── */
const Rangoli = ({ s = 48 }) => (
  <svg width={s} height={s} viewBox="0 0 52 52" style={{ flexShrink:0 }}>
    <circle cx="26" cy="26" r="23" stroke={C.gold}  strokeWidth="0.8" fill="none" opacity="0.4"/>
    <circle cx="26" cy="26" r="16" stroke={C.gold}  strokeWidth="0.6" fill="none" opacity="0.3"/>
    <circle cx="26" cy="26" r="9"  stroke={C.maroon} strokeWidth="0.8" fill="none" opacity="0.4"/>
    <circle cx="26" cy="26" r="4"  fill={C.gold}  opacity="0.45"/>
    <circle cx="26" cy="26" r="2"  fill={C.maroon} opacity="0.8"/>
    {[...Array(8)].map((_,i)=>{
      const a=(i/8)*Math.PI*2, x1=26+9*Math.cos(a), y1=26+9*Math.sin(a),
            x2=26+16*Math.cos(a), y2=26+16*Math.sin(a),
            px=26+21*Math.cos(a), py=26+21*Math.sin(a);
      return <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth="0.7" opacity="0.45"/>
        <ellipse cx={px} cy={py} rx="2.5" ry="4" transform={`rotate(${i*45+90},${px},${py})`} fill={`${C.maroon}55`} stroke={C.gold} strokeWidth="0.5"/>
      </g>;
    })}
    {[...Array(8)].map((_,i)=>{
      const a=((i+0.5)/8)*Math.PI*2;
      return <circle key={i} cx={26+13*Math.cos(a)} cy={26+13*Math.sin(a)} r="1.5" fill={C.teal} opacity="0.5"/>;
    })}
  </svg>
);

const Corner = ({ flip=false, s=64 }) => (
  <svg width={s} height={s} viewBox="0 0 64 64" style={{ transform:flip?"scaleX(-1)":"none", display:"block" }}>
    <path d="M2 62 L2 20 Q2 2 20 2 L62 2" stroke={C.gold}   strokeWidth="1.2" fill="none" opacity="0.5"/>
    <path d="M7 62 L7 24 Q7 7 24 7 L62 7" stroke={C.maroon} strokeWidth="0.6" fill="none" opacity="0.3"/>
    <path d="M2 22 Q9 14 16 22 Q9 30 2 22Z" fill={`${C.gold}45`} stroke={C.gold} strokeWidth="0.7"/>
    <circle cx="9" cy="22" r="2" fill={C.gold} opacity="0.5"/>
    {[12,22,32,42,52].map(v=><g key={v}>
      <circle cx="2"  cy={v} r="1" fill={C.gold} opacity="0.3"/>
      <circle cx={v}  cy="2" r="1" fill={C.gold} opacity="0.3"/>
    </g>)}
    <path d="M20 8 Q24 3 28 8 Q24 13 20 8Z" fill={`${C.teal}55`}/>
    <path d="M8 20 Q3 24 8 28 Q13 24 8 20Z" fill={`${C.teal}55`}/>
  </svg>
);

const Torana = ({ color=C.gold, w=1200 }) => (
  <svg width={w} height={52} viewBox={`0 0 ${w} 52`} style={{ display:"block", overflow:"visible" }}>
    <line x1="0" y1="26" x2={w} y2="26" stroke={color} strokeWidth="0.8" opacity="0.35"/>
    <path d={`M0 21 Q${w*.25} 40 ${w*.5} 21 Q${w*.75} 2 ${w} 21`} stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
    {[...Array(9)].map((_,i)=>{
      const x=(w/8)*i+w/16, y=21+18*Math.sin((i/8)*Math.PI);
      return <g key={i} transform={`translate(${x},${y})`}>
        <ellipse cx="0" cy="5" rx="4" ry="7" fill={i%2===0?`${C.teal}55`:`${color}45`} stroke={color} strokeWidth="0.5"/>
        <line x1="0" y1="-2" x2="0" y2="12" stroke={color} strokeWidth="0.4" opacity="0.5"/>
      </g>;
    })}
    <g transform={`translate(${w/2},8)`}>
      <ellipse cx="0" cy="8" rx="7" ry="9" fill={`${color}20`} stroke={color} strokeWidth="0.9"/>
      <ellipse cx="0" cy="3" rx="5" ry="3" fill={`${color}35`} stroke={color} strokeWidth="0.7"/>
      <line x1="-4" y1="16" x2="4" y2="16" stroke={color} strokeWidth="1"/>
      <circle cx="0" cy="-3" r="2.5" fill={color} opacity="0.7"/>
      {[-8,-4,0,4,8].map(dx=><circle key={dx} cx={dx} cy="-6" r="1.2" fill={color} opacity="0.5"/>)}
    </g>
    {[...Array(14)].map((_,i)=><circle key={i} cx={(w/13)*i+w/26} cy="26" r="1.2" fill={color} opacity="0.28"/>)}
  </svg>
);

const ArchOverlay = ({ w=340, color=C.gold }) => {
  const h = w*0.54;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position:"absolute",top:0,left:0,zIndex:3,pointerEvents:"none" }}>
      <path d={`M8 ${h} L8 ${h*.5} Q${w/2} ${-h*.12} ${w-8} ${h*.5} L${w-8} ${h}`}
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.85"/>
      <path d={`M20 ${h} L20 ${h*.54} Q${w/2} ${h*.04} ${w-20} ${h*.54} L${w-20} ${h}`}
        stroke={color} strokeWidth="0.8" fill="none" opacity="0.5"/>
      <circle cx={w/2} cy={h*.07} r="6" stroke={color} strokeWidth="1" fill={`${color}30`}/>
      <circle cx={w/2} cy={h*.07} r="2.5" fill={color} opacity="0.8"/>
      {[-22,-11,0,11,22].map(dx=><circle key={dx} cx={w/2+dx} cy={h*.01} r="1.4" fill={color} opacity="0.45"/>)}
    </svg>
  );
};

const Jaali = ({ h=14 }) => (
  <div style={{ height:h, overflow:"hidden", width:"100%" }}>
    <svg width="100%" height={h} preserveAspectRatio="none">
      {[...Array(80)].map((_,i)=><g key={i}>
        <circle cx={`${i*1.3+.65}%`} cy={h/2} r="3.5" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.35"/>
        <circle cx={`${i*1.3+.65}%`} cy={h/2} r="1"   fill={C.gold} opacity="0.25"/>
      </g>)}
    </svg>
  </div>
);

const SpinningSeal = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    style={{ position: "absolute", bottom: -20, right: -40, zIndex: 20, width: 120, height: 120, opacity: 0.8 }}
  >
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
      <text fontSize="10" fill={C.gold} letterSpacing="3" fontFamily="'Montserrat', sans-serif" fontWeight="700">
        <textPath href="#curve" startOffset="50%" textAnchor="middle">
          EST. 1997 • BESPOKE TAILORS •
        </textPath>
      </text>
      <circle cx="50" cy="50" r="22" stroke={C.gold} strokeWidth="0.5" fill="none" />
      <circle cx="50" cy="50" r="18" fill={`${C.gold}20`} />
      <text x="50" y="54" fontSize="14" fill={C.gold} fontFamily="'Cormorant Garamond', serif" fontStyle="italic" textAnchor="middle">
        T24
      </text>
    </svg>
  </motion.div>
);

/* ─── COMPONENTS ─────────────────────────────────────────── */
function RoyalCursor() {
  const mx=useMotionValue(-200), my=useMotionValue(-200);
  const sx=useSpring(mx,{stiffness:150,damping:20}), sy=useSpring(my,{stiffness:150,damping:20});
  useEffect(()=>{
    const h=e=>{mx.set(e.clientX);my.set(e.clientY);};
    window.addEventListener("mousemove",h);
    return ()=>window.removeEventListener("mousemove",h);
  },[]);
  return <>
    <motion.div style={{ position:"fixed",top:0,left:0,zIndex:9999,pointerEvents:"none",
      width:8,height:8,borderRadius:"50%",background:C.gold,boxShadow:`0 0 10px ${C.gold}`,x:mx,y:my,translateX:"-50%",translateY:"-50%"}}/>
    <motion.div style={{ position:"fixed",top:0,left:0,zIndex:9998,pointerEvents:"none",
      width:40,height:40,borderRadius:"50%",border:`1.5px solid ${C.maroon}AA`,background:"rgba(107, 15, 26, 0.05)",
      backdropFilter:"blur(2px)",x:sx,y:sy,translateX:"-50%",translateY:"-50%"}}/>
  </>;
}

function RBtn({ children, filled=false, onClick }) {
  const [hov,setHov] = useState(false);
  return (
    <motion.button onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      whileTap={{ scale:.95 }} onClick={onClick}
      style={{ position:"relative",overflow:"hidden",padding:"14px 36px",
        border:`1.5px solid ${C.maroon}`,background:filled?C.maroon:"transparent",
        fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:"0.4em",
        fontWeight:700,textTransform:"uppercase",cursor:"none",
        color:filled?"white":C.maroon,
        boxShadow: hov && filled ? `0 10px 30px ${C.maroon}50` : "none",
        transition: "box-shadow 0.3s ease"
      }}>
      <motion.div animate={{ x:hov?"0%":"-101%" }} transition={{ duration:.4,ease:[.22,1,.36,1] }}
        style={{ position:"absolute",inset:0,background:filled?C.maroonL:C.maroon }}/>
      <span style={{ position:"relative",zIndex:1,transition:"color .25s",
        color:hov?"white":(filled?"white":C.maroon) }}>{children}</span>
    </motion.button>
  );
}

function MarqueeStrip() {
  const items=[...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div style={{ overflow:"hidden",background:`linear-gradient(to right, ${C.parchment}, ${C.sand}, ${C.parchment})`,position:"relative" }}>
      <Jaali/>
      <div style={{ padding:"14px 0",overflow:"hidden", background: "rgba(255,255,255,0.2)" }}>
        <motion.div style={{ display:"flex",gap:28,whiteSpace:"nowrap" }}
          animate={{ x:["0%","-50%"] }} transition={{ duration:35,repeat:Infinity,ease:"linear" }}>
          {items.map((t,i)=>(
            <span key={i} style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,
              letterSpacing:"0.45em",textTransform:"uppercase", fontWeight: 600,
              color:t==="·"?C.gold:C.maroonD, textShadow: t==="·" ? `0 0 8px ${C.gold}80` : "none" }}>{t}</span>
          ))}
        </motion.div>
      </div>
      <Jaali/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY,[0,600],[0,-50]);
  const heroOp = useTransform(scrollY,[0,500],[1,0]);

  useEffect(()=>{
    const t=setInterval(()=>setHeroIdx(p=>(p+1)%HERO_SLIDES.length),6000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{ background:C.page,color:C.ink,fontFamily:"'Montserrat',sans-serif",overflowX:"hidden",cursor:"none" }}>
      <RoyalCursor/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{cursor:none!important;box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#6B0F1A44; color: #FFFDF5;}
        html{scroll-behavior:smooth;}
        .glass-panel { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-arch{display:none!important;}
          .hero-copy{padding-top:0!important;}
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position:"relative",minHeight:"100vh",display:"flex",
        alignItems:"center",overflow:"hidden",background:`linear-gradient(180deg, ${C.white} 0%, ${C.parchment} 100%)`,paddingTop:20 }}>

        {/* Noise Overlay for Silk Texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none",
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')", 
          mixBlendMode: "overlay" }}/>

        {/* Watermark */}
        <motion.div style={{ position:"absolute",bottom:-40,right:-50,userSelect:"none",pointerEvents:"none",
          fontFamily:"'Cormorant Garamond',serif",fontSize:"20vw",color:`${C.gold}10`,
          lineHeight:1,fontStyle:"italic",whiteSpace:"nowrap" }}
          animate={{ x: [-20, 0, -20] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}>
          Tailor24
        </motion.div>

        {/* Radial glow */}
        <div style={{ position:"absolute",top:"15%",right:"8%",width:500,height:500,
          borderRadius:"50%",pointerEvents:"none",
          background:`radial-gradient(circle,${C.goldB}15,transparent 70%)`, filter: "blur(40px)" }}/>

        {/* Torana top */}
        <div style={{ position:"absolute",top:0,left:0,right:0,overflow:"hidden",zIndex:4 }}>
          <Torana color={C.gold} w={1600}/>
        </div>

        <div className="hero-grid" style={{ maxWidth:1280,margin:"0 auto",padding:"80px 24px 40px",
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,
          alignItems:"center",position:"relative",zIndex:10,width:"100%" }}>

          {/* LEFT COPY */}
          <motion.div className="hero-copy" style={{ y:heroY,opacity:heroOp }}>
            <motion.div initial={{ opacity:0,x:-18 }} animate={{ opacity:1,x:0 }}
              transition={{ duration:.9,delay:.3 }}
              style={{ display:"flex",alignItems:"center",gap:10,marginBottom:22 }}>
              <div style={{ width:40,height:1.5,background:C.maroon }}/>
              <span style={{ fontSize:9,letterSpacing:"0.6em",color:C.maroon,
                textTransform:"uppercase",fontWeight:700 }}>Heritage Tailoring</span>
            </motion.div>

            {/* Typography updated for heavier, more royal feel */}
            {[["Bespoke",C.ink,700],["for All.",C.maroon,400]].map(([text,color,weight],i)=>(
              <div key={i} style={{ overflow:"hidden",marginBottom:4 }}>
                <motion.h1 initial={{ y:100 }} animate={{ y:0 }}
                  transition={{ duration:1.2,delay:.5+i*.15,ease:[.22,1,.36,1] }}
                  style={{ fontFamily:"'Cormorant Garamond',serif",
                    fontSize:"clamp(56px,8.5vw,116px)",color,lineHeight:.9,fontWeight:weight,
                    fontStyle:i===1?"italic":"normal", textShadow: i===0 ? `4px 4px 12px ${C.gold}20` : "none" }}>{text}</motion.h1>
              </div>
            ))}

            <motion.p initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }}
              transition={{ duration:1,delay:.9 }}
              style={{ color:C.inkMid,fontSize:15,lineHeight:1.8,maxWidth:420,
                marginTop: 24, marginBottom:40,letterSpacing:"0.03em", fontWeight: 500 }}>
              From a groom's sherwani to a bride's lehenga to a child's first festive outfit — every thread carries the weight of your occasion.
            </motion.p>

            <motion.div initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }}
              transition={{ delay:1.05 }}
              style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
              <RBtn filled>Explore Lookbook</RBtn>
              <RBtn>Book Fitting</RBtn>
            </motion.div>

            {/* Glassmorphism Slide indicators */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
              className="glass-panel"
              style={{ display:"inline-flex",alignItems:"center",gap:12,marginTop:48, padding: "10px 20px", borderRadius: 30 }}>
              {HERO_SLIDES.map((s,i)=>(
                <button key={i} onClick={()=>setHeroIdx(i)} style={{ border:"none",background:"none",padding:0,cursor:"none" }}>
                  <motion.div animate={{ width:i===heroIdx?32:8,background:i===heroIdx?C.maroon:C.muted }}
                    style={{ height:3,borderRadius:3 }} transition={{ duration:.5, type:"spring" }}/>
                </button>
              ))}
              <div style={{ width: 1, height: 12, background: C.border, margin: "0 8px" }} />
              <AnimatePresence mode="wait">
                 <motion.span key={heroIdx} initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}}
                   style={{ fontSize:9,letterSpacing:"0.3em",color:C.maroon,
                   textTransform:"uppercase",fontWeight:700 }}>
                   {HERO_SLIDES[heroIdx].for}
                 </motion.span>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* RIGHT — Arch Frame */}
          <motion.div className="hero-arch" initial={{ opacity:0,x:40 }} animate={{ opacity:1,x:0 }}
            transition={{ duration:1.3,delay:.4,ease:[.22,1,.36,1] }}
            style={{ position:"relative",display:"flex",justifyContent:"center",paddingTop:20 }}>
            
            <SpinningSeal />

            <div style={{ position:"absolute",top:18,left:18,right:-18,bottom:-18,
              border:`2px solid ${C.gold}40`, boxShadow: `inset 0 0 20px ${C.gold}20` }}/>
            
            <div style={{ position:"relative",zIndex:1,maxWidth:360,width:"100%" }}>
              <ArchOverlay w={360} color={C.gold}/>
              <div style={{ background:C.white,padding:6,boxShadow:`0 30px 60px ${C.maroonD}25`, borderRadius: 2 }}>
                
                {/* Image Container with Ken Burns Effect */}
                <div style={{ overflow: "hidden", position: "relative", borderRadius: "2px 2px 0 0" }}>
                  <AnimatePresence mode="wait">
                    <motion.img key={heroIdx} src={HERO_SLIDES[heroIdx].src}
                      initial={{ opacity:0,scale:1.15 }} 
                      animate={{ opacity:1,scale:1 }} 
                      exit={{ opacity:0, transition: { duration: 0.8 } }}
                      transition={{ duration: 7, ease: "easeOut" }}
                      style={{ width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block" }}/>
                  </AnimatePresence>
                </div>

                <div className="glass-panel" style={{ padding:"14px 18px", borderTop:`1px solid ${C.border}`,
                  display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <AnimatePresence mode="wait">
                    <motion.span key={heroIdx} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0 }}
                      style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.ink,fontStyle:"italic", fontWeight: 600 }}>
                      {HERO_SLIDES[heroIdx].label}
                    </motion.span>
                  </AnimatePresence>
                  <div style={{ display:"flex",gap:8 }}>
                    {[["‹",()=>setHeroIdx(p=>(p-1+HERO_SLIDES.length)%HERO_SLIDES.length)],
                      ["›",()=>setHeroIdx(p=>(p+1)%HERO_SLIDES.length)]].map(([ch,fn])=>(
                      <motion.button key={ch} whileHover={{ backgroundColor: C.maroon, color: "white", borderColor: C.maroon }} onClick={fn} 
                        style={{ width:30,height:30,border:`1px solid ${C.border}`, borderRadius: "50%",
                        background:"none",color:C.maroon,fontSize:16,cursor:"none", transition: "all 0.3s" }}>{ch}</motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <MarqueeStrip/>

      {/* ══ FEATURED TEASER STRIP ══ */}
     

      {/* ══ QUICK STATS BAND ══ */}
      

    </div>
  );
}