import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";

/* ─── PALETTE ────────────────────────────────────────────── */
const C = {
  page:      "#FBF4E8",
  parchment: "#F4E8D0",
  sand:      "#EDD9B2",
  white:     "#FFFDF5",
  maroon:    "#6B0F1A",
  maroonL:   "#8B1A28",
  maroonD:   "#4A0A10",
  gold:      "#B5892E",
  goldB:     "#D4A017",
  goldL:     "#F2C84B",
  teal:      "#1A5C5C",
  ink:       "#1A0800",
  inkMid:    "#3D2008",
  muted:     "#7A6040",
  border:    "#D4BC94",
  threadR:   "#6B0F1A",
  threadG:   "#1A5C5C",
};

/* ─── DATA ───────────────────────────────────────────────── */
const HERO_SLIDES = [
  { src:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop", label:"Jodhpuri Bandhgala", for:"Men" },
  { src:"https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop", label:"Bridal Anarkali",    for:"Women" },
  { src:"https://images.unsplash.com/photo-1593033516514-60e5aa277467?q=80&w=1200&auto=format&fit=crop", label:"Festive Lehenga",    for:"Women" },
  { src:"https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1200&auto=format&fit=crop", label:"Little Royals",      for:"Kids" },
];

const CATEGORIES = [
  { label:"Men",   sub:"Sherwanis · Bandhgalas · Kurtas", color:C.maroon,  img:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop" },
  { label:"Women", sub:"Lehengas · Sarees · Anarkalis",   color:C.teal,    img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop" },
  { label:"Kids",  sub:"Tiny Royals · Festive Wear",      color:C.goldB,   img:"https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=600&auto=format&fit=crop" },
];

const PRODUCTS = [
  { id:1, name:"Sovereign Bandhgala", for:"Men",   price:"₹ 32,000", tag:"New",        img:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop" },
  { id:2, name:"Bridal Lehenga",      for:"Women", price:"₹ 65,000", tag:"Bestseller", img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop" },
  { id:3, name:"Silk Anarkali",       for:"Women", price:"₹ 28,000", tag:"Heritage",   img:"https://images.unsplash.com/photo-1593033516514-60e5aa277467?q=80&w=600&auto=format&fit=crop" },
  { id:4, name:"Sherwani Royale",     for:"Men",   price:"₹ 48,000", tag:"Exclusive",  img:"https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=600&auto=format&fit=crop" },
  { id:5, name:"Kids Sherwani Set",   for:"Kids",  price:"₹ 12,000", tag:"New",        img:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop" },
  { id:6, name:"Banarasi Saree",      for:"Women", price:"₹ 22,000", tag:"Heritage",   img:"https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop" },
];

const TESTIMONIALS = [
  { name:"Priya Verma",  city:"Bhopal",  for:"Women", stars:5, avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop&face",  text:"My wedding lehenga was beyond imagination. Every zari thread placed with love. Tailor24 made me feel like a queen." },
  { name:"Arjun Sharma", city:"Indore",  for:"Men",   stars:5, avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&face",  text:"The Bandhgala fit like it was born on my shoulders. Central India finally has a tailor worthy of the occasion." },
  { name:"Meena Tiwari", city:"Vidisha", for:"Kids",  stars:5, avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop&face",  text:"Our twins looked adorable in their matching outfits. The craftsmanship on such small garments was remarkable." },
];

const MARQUEE_ITEMS = ["Banarasi Silk","·","Zardozi Embroidery","·","Bridal Lehengas","·","Jodhpuri Suits","·","Anarkali Sets","·","Kids Festive","·","Kashmiri Pashmina","·","Chanderi Brocade","·"];

const STATS = [["28+","Years of Legacy"],["12K+","Patrons Served"],["3","Heritage Ateliers"]];

const PROCESS_STEPS = [
  { n:"01", title:"Consultation",     desc:"A private dialogue — your occasion, your culture. We listen before we create." },
  { n:"02", title:"Fabric Selection", desc:"Banarasi silk, Kashmiri pashmina, Chanderi brocade — chosen for you alone." },
  { n:"03", title:"Master Fitting",   desc:"Three sessions, twelve measurements. Zero compromise on silhouette." },
  { n:"04", title:"Royal Delivery",   desc:"Hand-tied in ivory-and-saffron cloth, sealed with wax and our crest." },
];

const ATELIERS = [
  { city:"Indore",  addr:"12 Vijay Nagar, Indore",    timing:"Mon–Sat · 10am–8pm", flagship:true  },
  { city:"Bhopal",  addr:"Sector C, MP Nagar, Bhopal", timing:"Mon–Sat · 10am–8pm", flagship:false },
  { city:"Vidisha", addr:"Civil Lines, Vidisha",        timing:"Tue–Sun · 11am–7pm", flagship:false },
];

/* ─── SVG ATOMS ──────────────────────────────────────────── */

// Rangoli mandala — used as ornament divider
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

// Corner mehendi ornament
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

// Torana decorative row
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

// Mughal arch frame overlay
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
      {[0.2,.35,.5,.65,.8].map((t,i)=>{
        const angle=Math.PI*(1-t), rx=(w/2-14)*Math.cos(angle),
              ry=-(w/2-14)*Math.sin(angle)*0.54+h*.5,
              bx=w/2-rx, by=ry+h*.02;
        return <g key={i}>
          <line x1={bx} y1={by-6} x2={bx} y2={by+1} stroke={color} strokeWidth="0.8" opacity="0.5"/>
          <ellipse cx={bx} cy={by+4} rx="2.5" ry="3.5" stroke={color} strokeWidth="0.7" fill={`${color}20`}/>
        </g>;
      })}
    </svg>
  );
};

// Thread-stitch separator
const Stitch = ({ c1=C.threadR, c2=C.threadG }) => (
  <div style={{ height:16, overflow:"hidden", width:"100%" }}>
    <svg width="100%" height="16" preserveAspectRatio="none">
      {[...Array(60)].map((_,i)=><line key={i} x1={`${i*1.8}%`} y1="4" x2={`${i*1.8+.8}%`} y2="4" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.65"/>)}
      {[...Array(40)].map((_,i)=><g key={i}>
        <line x1={`${i*2.5+.5}%`} y1="10" x2={`${i*2.5+1.5}%`} y2="15" stroke={c2} strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
        <line x1={`${i*2.5+1.5}%`} y1="10" x2={`${i*2.5+.5}%`} y2="15" stroke={c2} strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
      </g>)}
    </svg>
  </div>
);

// Jaali lattice strip
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

// Needle icon
const Needle = ({ color=C.maroon }) => (
  <svg width="30" height="30" viewBox="0 0 30 30">
    <line x1="4" y1="26" x2="22" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="22" cy="4" rx="3" ry="5" transform="rotate(-45 22 4)" fill="none" stroke={color} strokeWidth="1.2"/>
    <ellipse cx="20.5" cy="5.5" rx="1" ry="1.8" transform="rotate(-45 20.5 5.5)" fill={color} opacity="0.5"/>
    <path d="M4 26 Q0 30 2 28 Q11 17 7 22 Q5 25 4 26" stroke={C.teal} strokeWidth="0.8" fill="none"/>
  </svg>
);

/* ─── NEW COMPONENT: Animated Number Counter ─── */
function CountUpStat({ endString, label }) {
  const numMatch = endString.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 0;
  const suffix = endString.replace(/\d+/g, '');

  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = num / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= num) {
          setCount(num);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, num]);

  return (
    <div ref={ref}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:42, color:C.maroon,fontWeight:700,lineHeight:1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize:9,letterSpacing:"0.25em",color:C.muted, textTransform:"uppercase",marginTop:8, fontWeight:600 }}>
        {label}
      </div>
    </div>
  );
}

/* ─── SHARED COMPONENTS ──────────────────────────────────── */

// Section heading
const Head = ({ eyebrow, title, center=true }) => (
  <div style={{ textAlign:center?"center":"left", marginBottom:48 }}>
    <div style={{ fontSize:8, letterSpacing:"0.55em", color:C.maroon,
      textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>{eyebrow}</div>
    <div style={{ display:"flex", alignItems:"center", justifyContent:center?"center":"flex-start", gap:12, marginBottom:14 }}>
      {center&&<div style={{ flex:1, maxWidth:72, height:1, background:`linear-gradient(to right,transparent,${C.gold}50)` }}/>}
      <Rangoli s={42}/>
      {center&&<div style={{ flex:1, maxWidth:72, height:1, background:`linear-gradient(to left,transparent,${C.gold}50)` }}/>}
    </div>
    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,3.8vw,52px)",
      color:C.ink, fontWeight:600, lineHeight:1.1 }} dangerouslySetInnerHTML={{ __html:title }}/>
  </div>
);

// Royal button
function RBtn({ children, filled=false, onClick }) {
  const [hov,setHov] = useState(false);
  return (
    <motion.button onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      whileTap={{ scale:.97 }} onClick={onClick}
      style={{ position:"relative", overflow:"hidden", padding:"12px 32px",
        border:`1.5px solid ${C.maroon}`, background:filled?C.maroon:"transparent",
        fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:"0.4em",
        fontWeight:700, textTransform:"uppercase", cursor:"none",
        color:filled?"white":C.maroon }}>
      <motion.div animate={{ x:hov?"0%":"-101%" }} transition={{ duration:.4, ease:[.22,1,.36,1] }}
        style={{ position:"absolute",inset:0, background:filled?C.maroonL:C.maroon }}/>
      <span style={{ position:"relative",zIndex:1, transition:"color .25s",
        color:hov?"white":(filled?"white":C.maroon) }}>{children}</span>
    </motion.button>
  );
}

// Scroll fade-up
const FUp = ({ children, delay=0 }) => (
  <motion.div initial={{ opacity:0,y:32 }} whileInView={{ opacity:1,y:0 }}
    viewport={{ once:true, margin:"-50px" }} transition={{ duration:.85, ease:[.22,1,.36,1], delay }}>
    {children}
  </motion.div>
);

// Custom cursor
function RoyalCursor() {
  const mx=useMotionValue(-200), my=useMotionValue(-200);
  const sx=useSpring(mx,{stiffness:90,damping:18}), sy=useSpring(my,{stiffness:90,damping:18});
  useEffect(()=>{
    const h=e=>{mx.set(e.clientX);my.set(e.clientY);};
    window.addEventListener("mousemove",h);
    return ()=>window.removeEventListener("mousemove",h);
  },[]);
  return <>
    <motion.div style={{ position:"fixed",top:0,left:0,zIndex:9999,pointerEvents:"none",
      width:10,height:10,borderRadius:"50%",background:C.maroon,x:mx,y:my,translateX:"-50%",translateY:"-50%"}}/>
    <motion.div style={{ position:"fixed",top:0,left:0,zIndex:9998,pointerEvents:"none",
      width:36,height:36,borderRadius:"50%",border:`1px solid ${C.gold}AA`,background:"transparent",
      x:sx,y:sy,translateX:"-50%",translateY:"-50%"}}/>
  </>;
}

// Scrolling marquee
function Marquee() {
  const items=[...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  return (
    <div style={{ overflow:"hidden", background:C.parchment, position:"relative" }}>
      <Jaali/>
      <div style={{ padding:"10px 0", overflow:"hidden" }}>
        <motion.div style={{ display:"flex",gap:28,whiteSpace:"nowrap" }}
          animate={{ x:["0%","-50%"] }} transition={{ duration:28,repeat:Infinity,ease:"linear" }}>
          {items.map((t,i)=>(
            <span key={i} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12,
              letterSpacing:"0.45em", textTransform:"uppercase",
              color:t==="·"?C.gold:C.muted }}>{t}</span>
          ))}
        </motion.div>
      </div>
      <Jaali/>
    </div>
  );
}

// Product card
function PCard({ product, index }) {
  const [hov,setHov] = useState(false);
  const tc = product.for==="Men"?C.maroon:product.for==="Women"?C.teal:C.goldB;
  return (
    <motion.div initial={{ opacity:0,y:36 }} whileInView={{ opacity:1,y:0 }}
      viewport={{ once:true }} transition={{ duration:.75, delay:index*.1, ease:[.22,1,.36,1] }}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      style={{ background:C.white, position:"relative", overflow:"hidden", cursor:"none", border:`1px solid ${C.border}` }}>
      {/* Tag */}
      <div style={{ position:"absolute",top:10,left:10,zIndex:10,background:tc,padding:"3px 9px" }}>
        <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:7,letterSpacing:"0.3em",
          color:"white",fontWeight:700,textTransform:"uppercase" }}>{product.for} · {product.tag}</span>
      </div>
      {/* Image */}
      <div style={{ overflow:"hidden",aspectRatio:"3/4",position:"relative" }}>
        <motion.img src={product.img} alt={product.name}
          animate={{ scale:hov?1.07:1 }} transition={{ duration:.7,ease:[.22,1,.36,1] }}
          style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
        {/* Arch tint overlay */}
        <svg viewBox="0 0 100 38" preserveAspectRatio="none"
          style={{ position:"absolute",top:0,left:0,width:"100%",height:38,pointerEvents:"none",zIndex:2 }}>
          <path d="M0 38 L0 19 Q50 -7 100 19 L100 38Z" fill={`${C.gold}12`}/>
          <path d="M0 38 L0 22 Q50 -3 100 22" stroke={C.gold} strokeWidth="0.5" fill="none" opacity="0.4"/>
        </svg>
        <motion.div animate={{ opacity:hov?1:0 }}
          style={{ position:"absolute",inset:0,zIndex:1,
            background:`linear-gradient(to top,${tc}22 0%,transparent 55%)`,pointerEvents:"none" }}/>
      </div>
      {/* Info */}
      <div style={{ padding:"14px 14px 12px", borderTop:`1px solid ${C.border}` }}>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.ink,
          fontWeight:600,marginBottom:6 }}>{product.name}</h3>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,color:C.gold,fontWeight:600 }}>{product.price}</span>
          <motion.span animate={{ opacity:hov?1:0,x:hov?0:6 }}
            style={{ fontFamily:"'Montserrat',sans-serif",fontSize:8,color:tc,
              letterSpacing:"0.3em",textTransform:"uppercase",fontWeight:700 }}>View →</motion.span>
        </div>
      </div>
      <motion.div animate={{ scaleX:hov?1:0 }} transition={{ duration:.4 }}
        style={{ position:"absolute",bottom:0,left:0,right:0,height:2,
          background:`linear-gradient(to right,${tc},${C.goldB})`,transformOrigin:"left" }}/>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [heroIdx,  setHeroIdx]  = useState(0);
  const [testIdx,  setTestIdx]  = useState(0);
  const [colStart, setColStart] = useState(0);
  const [tab,      setTab]      = useState("All");

  const { scrollY, scrollYProgress } = useScroll();
  const heroY  = useTransform(scrollY,[0,600],[0,-50]);
  const heroOp = useTransform(scrollY,[0,500],[1,0]);
  // Parallax for Philosophy Image
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(()=>{
    const t=setInterval(()=>setHeroIdx(p=>(p+1)%HERO_SLIDES.length),5500);
    return ()=>clearInterval(t);
  },[]);

  const filtered = tab==="All"?PRODUCTS:PRODUCTS.filter(p=>p.for===tab);
  const visible  = filtered.slice(colStart,colStart+3);

  return (
    <div style={{ background:C.page,color:C.ink,fontFamily:"'Montserrat',sans-serif",overflowX:"hidden",cursor:"none" }}>
      <RoyalCursor/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{cursor:none!important;box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#6B0F1A22;}
        html{scroll-behavior:smooth;}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;}
          .cat-grid{grid-template-columns:1fr!important;}
          .prod-grid{grid-template-columns:1fr 1fr!important;}
          .proc-grid{grid-template-columns:1fr 1fr!important;}
          .atelier-grid{grid-template-columns:1fr!important;}
          .stats-grid{grid-template-columns:repeat(3,1fr)!important;}
          .cta-btns{flex-direction:column!important;align-items:center!important;}
          .hero-arch{display:none!important;}
          .hero-copy{padding-top:0!important;}
        }
        @media(max-width:480px){
          .prod-grid{grid-template-columns:1fr!important;}
          .proc-grid{grid-template-columns:1fr!important;}
          .stats-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position:"relative",minHeight:"100vh",display:"flex",
        alignItems:"center",overflow:"hidden",background:C.parchment,paddingTop:20 }}>

        {/* Watermark */}
        <div style={{ position:"absolute",bottom:-20,right:-50,userSelect:"none",pointerEvents:"none",
          fontFamily:"'Cormorant Garamond',serif",fontSize:"18vw",color:`${C.gold}06`,
          lineHeight:1,fontStyle:"italic",whiteSpace:"nowrap" }}>Tailor24</div>

        {/* Glow */}
        <div style={{ position:"absolute",top:"15%",right:"8%",width:400,height:400,
          borderRadius:"50%",pointerEvents:"none",
          background:`radial-gradient(circle,${C.goldB}12,transparent 70%)` }}/>

        {/* Torana at very top */}
        <div style={{ position:"absolute",top:0,left:0,right:0,overflow:"hidden",zIndex:4 }}>
          <Torana color={C.gold} w={1600}/>
        </div>

        {/* Vertical thread accent */}
        <div style={{ position:"absolute",left:"55%",top:0,bottom:0,width:1,
          background:`linear-gradient(to bottom,transparent,${C.gold}25,transparent)` }}/>

        <div className="hero-grid" style={{ maxWidth:1280,margin:"0 auto",padding:"60px 24px 40px",
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,
          alignItems:"center",position:"relative",zIndex:10,width:"100%" }}>

          {/* ── LEFT COPY ── */}
          <motion.div className="hero-copy" style={{ y:heroY,opacity:heroOp }}>
            <motion.div initial={{ opacity:0,x:-18 }} animate={{ opacity:1,x:0 }}
              transition={{ duration:.9,delay:.3 }}
              style={{ display:"flex",alignItems:"center",gap:10,marginBottom:22 }}>
              <div style={{ width:28,height:1,background:C.maroon }}/>
              <span style={{ fontSize:8,letterSpacing:"0.5em",color:C.maroon,
                textTransform:"uppercase",fontWeight:700 }}>Men · Women · Kids · Central India</span>
            </motion.div>

            {[["Bespoke",C.ink,700],["for All.",C.maroon,300]].map(([text,color,weight],i)=>(
              <div key={i} style={{ overflow:"hidden",marginBottom:4 }}>
                <motion.h1 initial={{ y:100 }} animate={{ y:0 }}
                  transition={{ duration:1,delay:.5+i*.13,ease:[.22,1,.36,1] }}
                  style={{ fontFamily:"'Cormorant Garamond',serif",
                    fontSize:"clamp(52px,8vw,108px)",color,lineHeight:.9,fontWeight:weight,
                    fontStyle:i===1?"italic":"normal" }}>{text}</motion.h1>
              </div>
            ))}

            {/* Gender pills */}
            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
              transition={{ delay:.78 }}
              style={{ display:"flex",gap:6,marginTop:18,marginBottom:22,flexWrap:"wrap" }}>
              {[["👔 Men",C.maroon],["👗 Women",C.teal],["🎀 Kids",C.goldB]].map(([l,c])=>(
                <div key={l} style={{ padding:"5px 12px",border:`1px solid ${c}40`,
                  background:`${c}10`,borderRadius:2 }}>
                  <span style={{ fontSize:8.5,letterSpacing:"0.3em",color:c,
                    textTransform:"uppercase",fontWeight:700 }}>{l}</span>
                </div>
              ))}
            </motion.div>

            <motion.p initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
              transition={{ duration:.9,delay:.9 }}
              style={{ color:C.muted,fontSize:13,lineHeight:1.9,maxWidth:400,
                marginBottom:36,letterSpacing:"0.04em" }}>
              From a groom's sherwani to a bride's lehenga to a child's first festive outfit — every thread carries the weight of your occasion.
            </motion.p>

            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
              transition={{ delay:1.05 }}
              style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
              <RBtn filled>Explore Lookbook</RBtn>
              <RBtn>Book a Consultation</RBtn>
            </motion.div>

            {/* Slide indicators */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
              style={{ display:"flex",alignItems:"center",gap:6,marginTop:36 }}>
              {HERO_SLIDES.map((s,i)=>(
                <button key={i} onClick={()=>setHeroIdx(i)} style={{ border:"none",background:"none",padding:0,cursor:"none" }}>
                  <motion.div animate={{ width:i===heroIdx?26:6, background:i===heroIdx?C.maroon:C.border }}
                    style={{ height:2,borderRadius:2 }} transition={{ duration:.4 }}/>
                </button>
              ))}
              <span style={{ fontSize:7.5,letterSpacing:"0.4em",color:C.muted,marginLeft:8 }}>
                {String(heroIdx+1).padStart(2,"0")} / {String(HERO_SLIDES.length).padStart(2,"0")}
              </span>
              <span style={{ fontSize:7.5,letterSpacing:"0.3em",color:C.maroon,
                textTransform:"uppercase",marginLeft:4,fontWeight:700 }}>
                · {HERO_SLIDES[heroIdx].for}
              </span>
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Arch Frame ── */}
          <motion.div className="hero-arch" initial={{ opacity:0,x:36 }} animate={{ opacity:1,x:0 }}
            transition={{ duration:1.1,delay:.4,ease:[.22,1,.36,1] }}
            style={{ position:"relative",display:"flex",justifyContent:"center",paddingTop:20 }}>
            {/* Offset border */}
            <div style={{ position:"absolute",top:18,left:18,right:-18,bottom:-18,
              border:`1px solid ${C.gold}35` }}/>

            <div style={{ position:"relative",zIndex:1,maxWidth:340,width:"100%" }}>
              <ArchOverlay w={340} color={C.gold}/>
              <div style={{ background:C.white,padding:5,boxShadow:`0 20px 60px ${C.maroon}18` }}>
                <AnimatePresence mode="wait">
                  <motion.img key={heroIdx} src={HERO_SLIDES[heroIdx].src}
                    initial={{ opacity:0,scale:1.03 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0 }}
                    transition={{ duration:.9,ease:[.22,1,.36,1] }}
                    style={{ width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block" }}/>
                </AnimatePresence>
                {/* Caption */}
                <div style={{ padding:"10px 14px",borderTop:`1px solid ${C.border}`,
                  display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <AnimatePresence mode="wait">
                    <motion.span key={heroIdx} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                      style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.ink,fontStyle:"italic" }}>
                      {HERO_SLIDES[heroIdx].label}
                    </motion.span>
                  </AnimatePresence>
                  <div style={{ display:"flex",gap:5 }}>
                    {[["‹",()=>setHeroIdx(p=>(p-1+HERO_SLIDES.length)%HERO_SLIDES.length)],
                      ["›",()=>setHeroIdx(p=>(p+1)%HERO_SLIDES.length)]].map(([ch,fn])=>(
                      <button key={ch} onClick={fn} style={{ width:26,height:26,border:`1px solid ${C.border}`,
                        background:"none",color:C.muted,fontSize:15,cursor:"none" }}>{ch}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.2 }}
                style={{ position:"absolute",bottom:32,left:-22,zIndex:10,background:C.maroon,
                  padding:"12px 18px",boxShadow:`0 8px 28px ${C.maroon}30` }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:"white",fontStyle:"italic" }}>Bespoke</div>
                <div style={{ fontSize:7,letterSpacing:"0.4em",color:`rgba(255,255,255,0.55)`,
                  textTransform:"uppercase",marginTop:3 }}>Est. 1997 · Indore</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <Marquee/>

      {/* ══ PHILOSOPHY / STATS ══ */}
      <section style={{ padding:"120px 0",background:C.page,position:"relative", overflow:"hidden" }}>
        {/* Corners */}
        {[[20,20,false],[null,20,true],[20,null,false],[null,null,true]].map(([t,l,flip],i)=>(
          <div key={i} style={{ position:"absolute", top:t!==null?t:"auto",bottom:t===null?20:"auto", left:l!==null?l:"auto",right:l===null?20:"auto" }}>
            <Corner flip={flip} s={64}/>
          </div>
        ))}

        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 24px" }}>
          <div className="hero-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr", gap:80,alignItems:"center" }}>

            {/* ── LEFT: Text & Stats ── */}
            <div>
              <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration: 0.6 }}>
                <div style={{ fontSize:9,letterSpacing:"0.55em",color:C.maroon, textTransform:"uppercase",fontWeight:700,marginBottom:12 }}>
                  The Royal Philosophy
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
                  <Rangoli s={42}/>
                  <div style={{ flex:1,height:1,background:`linear-gradient(to right,${C.gold}50,transparent)` }}/>
                </div>
              </motion.div>

              <motion.h2 
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration: 0.8, delay: 0.2 }}
                style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,4vw,56px)",color:C.ink,lineHeight:1.1, fontWeight:600,marginBottom:24 }}
              >
                Crafted for the family<br/>that <em style={{ color:C.maroon }}>commands</em> every room.
              </motion.h2>

              <motion.p 
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration: 0.8, delay: 0.4 }}
                style={{ color:C.muted,lineHeight:1.9,fontSize:14,maxWidth:460,marginBottom:40 }}
              >
                Every garment begins as a conversation. We listen to your occasion, your culture, your silhouette — before a single thread is chosen. Hand-stitched precision for men, women, and children.
              </motion.p>

              {/* Animated Stats Grid */}
              <motion.div 
                initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration: 1, delay: 0.6 }}
                className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)", gap:24,paddingTop:32,borderTop:`1px solid ${C.border}` }}
              >
                {STATS.map(([n,l], i) => (
                  <CountUpStat key={i} endString={n} label={l} />
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: Interactive Image ── */}
            <div style={{ position:"relative", display:"flex", justifyContent:"center" }}>
              {/* Floating Background Elements */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ position:"absolute", top:-30, right:-10, zIndex:0, opacity:0.6 }}
              >
                 <Rangoli s={100} />
              </motion.div>

              {/* Smaller, Interactive Image Container */}
              <motion.div 
                style={{ position:"relative", zIndex:1, width:"80%", maxWidth:400, y: imageY }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Decorative Frame */}
                <div style={{ position:"absolute",top:-15,right:-15,bottom:15,left:15, border:`1px solid ${C.gold}50`,zIndex:0, transition:"all 0.3s ease" }} className="hover-frame"/>
                
                <img
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop"
                  alt="Atelier Craftsmanship" 
                  style={{ width:"100%", display:"block", position:"relative", zIndex:1, boxShadow:`0 20px 40px ${C.ink}20` }}
                />
                
                {/* Interactive 'View Craft' Button on Hover */}
                <motion.div 
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  style={{ position:"absolute", inset:0, background:"rgba(107, 15, 26, 0.4)", zIndex:2, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(2px)" }}
                >
                   <span style={{ color:"white", fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"1px solid white", padding:"10px 20px" }}>
                     View Heritage
                   </span>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section style={{ padding:"80px 0",background:C.parchment,position:"relative" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0 }}><Stitch/></div>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"40px 24px 0" }}>
          <Head eyebrow="Collections" title="Sartorial <em style='color:#6B0F1A'>Divisions</em>"/>
          
          <div className="cat-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
            {CATEGORIES.map((c,i)=>(
              <FUp key={c.label} delay={i*.1}>
                <motion.div whileHover="hover" style={{ position:"relative",overflow:"hidden",aspectRatio:"4/5",cursor:"none" }}>
                  <motion.img src={c.img} alt={c.label}
                    variants={{ hover:{scale:1.08} }} transition={{ duration:1,ease:[.22,1,.36,1] }}
                    style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                  <div style={{ position:"absolute",inset:0,background:`linear-gradient(to top,${c.color}99 0%,transparent 60%)` }}/>
                  
                  <div style={{ position:"absolute",inset:20,border:`1px solid ${C.gold}40`,pointerEvents:"none" }}/>
                  
                  <div style={{ position:"absolute",bottom:30,left:30,right:30,textAlign:"center" }}>
                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:"white",fontWeight:600,marginBottom:4 }}>{c.label}</h3>
                    <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:8,letterSpacing:"0.3em",color:`${C.goldL}CC`,textTransform:"uppercase" }}>{c.sub}</p>
                    
                    <motion.div variants={{ hover:{y:0,opacity:1} }} initial={{ y:10,opacity:0 }}
                      style={{ marginTop:16, display:"inline-block", borderBottom:`1px solid ${C.goldL}`,
                        paddingBottom:4, color:"white", fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase" }}>
                      Discover →
                    </motion.div>
                  </div>
                </motion.div>
              </FUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ THE PROCESS ══ */}
      <section style={{ padding:"100px 0",background:C.page,position:"relative" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"0 24px" }}>
          <Head eyebrow="The Journey" title="From <em style='color:#6B0F1A'>Thread</em> to <em style='color:#1A5C5C'>Throne</em>" center={false}/>
          
          <div className="proc-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24,marginTop:60 }}>
            {PROCESS_STEPS.map((p,i)=>(
              <FUp key={p.n} delay={i*.1}>
                <div style={{ position:"relative",paddingTop:20 }}>
                  <div style={{ position:"absolute",top:0,left:0,fontSize:64,fontFamily:"'Cormorant Garamond',serif",
                    color:`${C.gold}20`,lineHeight:1,fontWeight:700,zIndex:0 }}>{p.n}</div>
                  <div style={{ position:"relative",zIndex:1,paddingLeft:10 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                      <div style={{ width:16,height:1,background:C.maroon }}/>
                      <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.ink,fontWeight:600 }}>{p.title}</h4>
                    </div>
                    <p style={{ color:C.muted,fontSize:12,lineHeight:1.8 }}>{p.desc}</p>
                  </div>
                </div>
              </FUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SHOWCASE CATALOG ══ */}
      <section style={{ padding:"100px 0",background:C.parchment,position:"relative" }}>
        <Jaali/>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"60px 24px 0" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:24 }}>
            <Head eyebrow="Atelier Showcase" title="Recent <em style='color:#6B0F1A'>Commissions</em>" center={false}/>
            
            <div style={{ display:"flex",gap:16,alignItems:"center" }}>
              <div style={{ display:"flex",gap:4 }}>
                {["All","Men","Women","Kids"].map(t=>(
                  <button key={t} onClick={()=>{setTab(t);setColStart(0);}}
                    style={{ padding:"6px 16px",background:tab===t?C.maroon:"transparent",
                      border:`1px solid ${tab===t?C.maroon:C.border}`,
                      color:tab===t?"white":C.muted,fontFamily:"'Montserrat',sans-serif",
                      fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"none" }}>
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex",gap:4,marginLeft:16 }}>
                <button onClick={()=>setColStart(Math.max(0,colStart-1))} disabled={colStart===0}
                  style={{ width:32,height:32,border:`1px solid ${C.border}`,background:"white",
                    display:"flex",alignItems:"center",justifyContent:"center",color:C.ink,opacity:colStart===0?.5:1,cursor:"none" }}>←</button>
                <button onClick={()=>setColStart(Math.min(filtered.length-3,colStart+1))} disabled={colStart>=filtered.length-3}
                  style={{ width:32,height:32,border:`1px solid ${C.border}`,background:"white",
                    display:"flex",alignItems:"center",justifyContent:"center",color:C.ink,opacity:colStart>=filtered.length-3?.5:1,cursor:"none" }}>→</button>
              </div>
            </div>
          </div>

          <div className="prod-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
            <AnimatePresence mode="popLayout">
              {visible.map((p,i)=><PCard key={p.id} product={p} index={i}/>)}
            </AnimatePresence>
          </div>
          
          <div style={{ textAlign:"center",marginTop:60 }}>
            <RBtn>View Entire Archive</RBtn>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding:"100px 0",background:C.page,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",right:"-10%",top:"10%",opacity:0.05,pointerEvents:"none" }}>
          <Rangoli s={600}/>
        </div>
        
        <div style={{ maxWidth:800,margin:"0 auto",padding:"0 24px",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ display:"flex",justifyContent:"center",marginBottom:32 }}>
            <Needle/>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div key={testIdx} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }} transition={{ duration:.6 }}>
              <div style={{ display:"flex",justifyContent:"center",gap:4,marginBottom:24 }}>
                {[...Array(TESTIMONIALS[testIdx].stars)].map((_,i)=>(
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={C.gold}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(24px,3vw,36px)",
                color:C.ink,fontStyle:"italic",lineHeight:1.4,marginBottom:32 }}>
                "{TESTIMONIALS[testIdx].text}"
              </p>
              
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:16 }}>
                <img src={TESTIMONIALS[testIdx].avatar} alt=""
                  style={{ width:48,height:48,borderRadius:"50%",objectFit:"cover",border:`1px solid ${C.gold}` }}/>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",
                    textTransform:"uppercase",color:C.ink,marginBottom:2 }}>{TESTIMONIALS[testIdx].name}</div>
                  <div style={{ fontSize:9,color:C.muted,letterSpacing:"0.1em" }}>
                    {TESTIMONIALS[testIdx].city} · {TESTIMONIALS[testIdx].for}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:40 }}>
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>setTestIdx(i)}
                style={{ width:i===testIdx?24:8,height:8,borderRadius:4,
                  background:i===testIdx?C.maroon:C.border,border:"none",padding:0,cursor:"none",transition:"width .3s" }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ATELIERS ══ */}
      <section style={{ padding:"100px 0",background:C.ink,color:"white",position:"relative" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(to right,${C.maroon},${C.gold},${C.maroon})` }}/>
        
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"0 24px" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <div style={{ fontSize:8,letterSpacing:"0.5em",color:C.gold,textTransform:"uppercase",marginBottom:16 }}>Presence</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:600 }}>The <em style={{ color:C.goldL }}>Studios</em></h2>
          </div>

          <div className="atelier-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24 }}>
            {ATELIERS.map((a,i)=>(
              <FUp key={a.city} delay={i*.1}>
                <div style={{ border:`1px solid ${C.gold}30`,padding:32,background:`${C.white}03`,position:"relative",overflow:"hidden" }}>
                  {a.flagship && <div style={{ position:"absolute",top:16,right:16,background:C.maroon,color:"white",
                    fontSize:7,padding:"4px 8px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:700 }}>Flagship</div>}
                  
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:C.parchment,marginBottom:12 }}>{a.city}</h3>
                  <div style={{ width:30,height:1,background:C.gold,marginBottom:20,opacity:0.5 }}/>
                  
                  <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:11,color:`${C.white}90`,marginBottom:8,lineHeight:1.6 }}>{a.addr}</p>
                  <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:10,color:`${C.gold}AA`,letterSpacing:"0.1em" }}>{a.timing}</p>
                  
                  <div style={{ marginTop:24 }}>
                    <a href="#" style={{ color:C.goldL,fontSize:9,textTransform:"uppercase",letterSpacing:"0.2em",
                      textDecoration:"none",borderBottom:`1px solid ${C.goldL}` }}>Get Directions</a>
                  </div>
                </div>
              </FUp>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}