import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  gold: "#D4A017", 
  maroon: "#5D0E16", 
  ink: "#1A0800", 
  paper: "#FBF4E8", 
  silk: "#FFFDF5", 
  shadow: "rgba(26, 8, 0, 0.05)"
};

const CATS = [
  { l: "Men", s: "Sherwanis", tag: "The Maharaja", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200", color: "#F4EBD0" },
  { l: "Women", s: "Lehengas", tag: "The Noor Suite", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200", color: "#EEDFCC" },
  { l: "Kids", s: "Festive", tag: "Little Royals", img: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1200", color: "#E5DACE" }
];

export default function RoyalAtelier() {
  const [active, setActive] = useState(0);

  return (
    <div style={{ 
      height: "100vh", width: "100vw", overflow: "hidden", 
      background: C.paper, color: C.ink, fontFamily: "'Cormorant Garamond', serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,500&family=Montserrat:wght@200;400;600&display=swap');
        
        .main-container {
          width: 94%; height: 90%; display: flex; align-items: center; 
          background: ${C.silk}; z-index: 1; boxShadow: 0 40px 100px ${C.shadow};
          position: relative; overflow: hidden;
        }

        .nav-item { 
          font-family: 'Montserrat'; font-size: 10px; letter-spacing: 4px; 
          cursor: pointer; padding: 15px 0; opacity: 0.3; transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          position: relative; display: flex; align-items: center; width: fit-content;
        }

        .nav-item.active { opacity: 1; transform: translateX(20px); color: ${C.maroon}; }
        
        .nav-item::after {
          content: ""; position: absolute; bottom: 10px; left: 0; width: 0; height: 1px;
          background: ${C.maroon}; transition: 0.5s;
        }
        .nav-item.active::after { width: 40px; left: -50px; }

        .btn-atelier {
          background: ${C.maroon}; color: white; border: none; padding: 16px 40px; 
          font-family: 'Montserrat'; font-size: 9px; letter-spacing: 3px; cursor: pointer;
          transition: 0.4s; margin-top: 10px;
        }
        .btn-atelier:hover { background: ${C.ink}; transform: translateY(-2px); }

        @media (max-width: 1200px) {
          .text-content { padding-left: 40px !important; flex: 0 0 350px !important; }
          .main-title { font-size: 60px !important; }
        }
      `}</style>

      {/* ── AMBIENT BACKGROUND ── */}
      <motion.div 
        animate={{ backgroundColor: CATS[active].color }}
        transition={{ duration: 1.2 }}
        style={{ position: "absolute", inset: 0, opacity: 0.3, zIndex: 0 }}
      />

      <div className="main-container">
        
        {/* LEFT: CONTENT LAYER */}
        <div className="text-content" style={{ 
          flex: "0 0 500px", paddingLeft: "80px", zIndex: 10, position: "relative",
          display: "flex", flexDirection: "column", justifyContent: "center", height: "100%"
        }}>
          <header style={{ marginBottom: "5vh" }}>
            <motion.div
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
               style={{ fontSize: 9, letterSpacing: 8, color: C.gold, fontFamily: 'Montserrat', fontWeight: 600, marginBottom: 15 }}
            >
              EST. MCMXCVII
            </motion.div>
            <h1 className="main-title" style={{ 
              fontSize: "clamp(60px, 6vw, 84px)", 
              margin: 0, lineHeight: 0.9, fontWeight: 500, letterSpacing: "-1px" 
            }}>
              Atelier <br/><i style={{ fontWeight: 300, color: C.gold }}>Archive</i>
            </h1>
          </header>

          {/* SELECTOR */}
          <div style={{ marginBottom: "5vh" }}>
            {CATS.map((c, i) => (
              <div key={i} onClick={() => setActive(i)} className={`nav-item ${active === i ? 'active' : ''}`}>
                {c.l.toUpperCase()}
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div style={{ minHeight: "180px" }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={active} 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 style={{ fontSize: 28, marginBottom: 15, color: C.maroon, fontStyle: "italic" }}>{CATS[active].tag}</h3>
                <p style={{ 
                  fontFamily: 'Montserrat', fontSize: 13, lineHeight: 1.8, opacity: 0.6, 
                  fontWeight: 300, marginBottom: 30, maxWidth: "340px" 
                }}>
                  Crafted with precision in our flagship atelier. The {CATS[active].s} series represents the pinnacle of bespoke tradition.
                </p>
                <button className="btn-atelier">EXPLORE PIECES</button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: IMAGE LAYER */}
        <div style={{ 
          flex: 1, height: "100%", position: "relative", 
          overflow: "hidden", background: "#f0f0f0" 
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <img 
                src={CATS[active].img}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="Collection"
              />
              {/* VIGNETTE MASK TO PREVENT TEXT CLASH */}
              <div style={{ 
                position: "absolute", inset: 0, 
                background: `linear-gradient(to right, ${C.silk} 0%, transparent 60%)` 
              }} />
            </motion.div>
          </AnimatePresence>

          {/* FLOATING BADGE */}
          <div style={{ 
            position: "absolute", top: "40px", right: "40px", 
            padding: "20px", border: `1px solid ${C.gold}30`,
            backdropFilter: "blur(10px)", zIndex: 5
          }}>
            <div style={{ fontFamily: 'Montserrat', fontSize: 8, letterSpacing: 3, color: C.gold }}>COLLECTION</div>
            <div style={{ fontSize: 18, color: C.ink }}>2024 / 25</div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION / STATS */}
        <div style={{ 
          position: "absolute", bottom: 40, left: 80, 
          display: "flex", gap: 60, fontFamily: 'Montserrat', fontSize: 9, 
          letterSpacing: 3, zIndex: 20
        }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: C.gold }}>•</span>
            <span style={{ opacity: 0.4 }}>AUTHENTIC HAND-STITCHED</span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: C.gold }}>•</span>
            <span style={{ opacity: 0.4 }}>GLOBAL SHIPPING AVAILABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}