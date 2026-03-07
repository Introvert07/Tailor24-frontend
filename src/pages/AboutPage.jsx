import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  gold: "#D4A017",
  maroon: "#4A0E0E",
  ink: "#1A0800",
  paper: "#FBF4E8",
  silk: "#FFFDF5",
};

export default function RoyalAbout() {
  const [hoveredCity, setHoveredCity] = useState(null);

  return (
    <div style={{ 
      background: `linear-gradient(to bottom, ${C.silk}, ${C.paper})`, 
      color: C.ink, 
      fontFamily: "'Cormorant Garamond', serif", 
      minHeight: "100vh", 
      padding: "60px 80px", // Increased outer padding
      boxSizing: "border-box",
      position: "relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Montserrat:wght@200;400;600&display=swap');
        
        .about-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 2fr 1.2fr;
          gap: 100px; /* Massive gap to stop congestion */
          margin: 80px 0;
          align-items: start;
        }

        .side-panel { display: flex; flex-direction: column; gap: 120px; }
        .royal-line { width: 60px; height: 1px; background: ${C.gold}; margin: 40px auto; }
        .mini-label { font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 6px; color: ${C.gold}; text-transform: uppercase; margin-bottom: 20px; font-weight: 600; }
        
        .nav-btn {
          background: none; border: 1px solid ${C.gold}50; padding: 12px 35px; 
          font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 3px; 
          cursor: pointer; color: ${C.ink}; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-btn:hover { background: ${C.maroon}; color: ${C.silk}; border-color: ${C.maroon}; letter-spacing: 5px; }

        .city-item { cursor: pointer; transition: all 0.4s ease; padding: 15px 0; border-bottom: 1px solid ${C.gold}15; }
        .city-item:hover { padding-left: 15px; border-bottom: 1px solid ${C.gold}; }
        
        @media (max-width: 1100px) {
          .about-grid { grid-template-columns: 1fr; gap: 60px; }
          .side-panel { gap: 60px; }
        }
      `}</style>

      {/* ── BACKGROUND ORNAMENT ── */}
      <div style={{ 
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
        fontSize: "25vw", opacity: 0.02, pointerEvents: "none", color: C.gold, fontStyle: "italic", zIndex: 0 
      }}>
        T24
      </div>

      <div className="about-container">
        {/* ── HEADER ── */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}
        >
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: 6 }}>TAILOR<span style={{ color: C.gold }}>24</span></span>
          <button className="nav-btn">THE ATELIER</button>
        </motion.div>

        <div className="about-grid">
          
          {/* ── LEFT: LEGACY ── */}
          <div className="side-panel">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <div className="mini-label">Genesis</div>
              <h2 style={{ fontSize: 48, lineHeight: 1.1, fontWeight: 400, marginBottom: 30 }}>The Silver <br/><i>Needle</i></h2>
              <p style={{ fontFamily: 'Montserrat', fontSize: 14, lineHeight: 2.2, fontWeight: 300, opacity: 0.7 }}>
                Founded in Vidisha, we carry the weight of tradition in every thread. Our process is a slow dialogue between the tailor and the cloth.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="mini-label">Timeline</div>
              <div style={{ fontSize: 72, color: C.maroon, fontWeight: 300 }}>XXVIII</div>
              <p style={{ fontFamily: 'Montserrat', fontSize: 11, letterSpacing: 3, opacity: 0.5, marginTop: 10 }}>YEARS OF MASTERY</p>
            </motion.div>
          </div>

          {/* ── CENTER: HERO ── */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h1 style={{ fontSize: "clamp(60px, 7vw, 120px)", lineHeight: 0.9, margin: "0 auto", fontWeight: 400, maxWidth: "600px" }}>
                Crafting <br/><span style={{ color: C.gold, fontStyle: "italic", fontWeight: 300 }}>Sartorial</span> <br/>History
              </h1>
              
              <div className="royal-line" />
              
              <div style={{ position: "relative", margin: "60px auto", maxWidth: "450px" }}>
                 <motion.div
                   style={{ 
                     border: `1px solid ${C.gold}40`, padding: "15px", borderRadius: "300px 300px 0 0",
                     background: "white", boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
                   }}
                 >
                   <img 
                     src="https://images.unsplash.com/photo-1598432439345-866463eaa2bc?auto=format&fit=crop&w=800" 
                     style={{ width: "100%", height: "45vh", objectFit: "cover", borderRadius: "300px 300px 0 0" }}
                     alt="Tailoring craftsmanship"
                   />
                 </motion.div>
              </div>
              
              <p style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 300, fontStyle: 'italic', maxWidth: "400px", margin: "0 auto", lineHeight: 1.8, opacity: 0.8 }}>
                "Clothes do not make the man, but they provide the armor for his destiny."
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT: ATELIERS ── */}
          <div className="side-panel">
            <div>
              <div className="mini-label">Philosophy</div>
              <ul style={{ listStyle: "none", padding: 0, fontFamily: 'Montserrat', fontSize: 12, lineHeight: 3.5, fontWeight: 400, letterSpacing: 1 }}>
                {["Hand-Basted Construction", "Noble Fiber Sourcing", "Architectural Fit", "Eternal Maintenance"].map((item, i) => (
                  <motion.li 
                      initial={{ opacity: 0, x: 20 }} 
                      whileInView={{ opacity: 1, x: 0 }} 
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      style={{ display: "flex", alignItems: "center" }}
                  >
                      <span style={{ width: "8px", height: "1px", background: C.gold, marginRight: "15px" }} /> {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mini-label">Presence</div>
              {["INDORE", "BHOPAL", "VIDISHA"].map((city) => (
                <motion.div 
                  key={city} 
                  className="city-item"
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: 2 }}>{city}</div>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={hoveredCity === city}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ fontSize: 9, fontFamily: 'Montserrat', color: C.gold, letterSpacing: 3, marginTop: 5 }}
                    >
                      {hoveredCity === city ? "BOOK PRIVATE SESSION →" : "ESTABLISHED HOUSE"}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }}
          style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center", 
            borderTop: `1px solid ${C.gold}20`, paddingTop: "40px", marginTop: "80px" 
          }}
        >
          <p style={{ fontFamily: 'Montserrat', fontSize: 10, letterSpacing: 6, opacity: 0.4 }}>
            BY APPOINTMENT ONLY • MCMXCVII
          </p>
          <div style={{ display: "flex", gap: "40px" }}>
              {['INSTAGRAM', 'JOURNAL', 'LEGAL'].map(link => (
                  <a key={link} href="#" style={{ 
                    fontSize: 10, letterSpacing: 3, textDecoration: "none", color: C.ink, opacity: 0.6, 
                    fontFamily: 'Montserrat', fontWeight: 400 
                  }}>{link}</a>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}