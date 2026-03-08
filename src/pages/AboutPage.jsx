import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ConsultationModal from '../components/ui/ConsultationModal';

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');`;

const SERVICES = [
  { icon: '👰', label: 'Bridal', sub: 'Lehenga · Anarkali' },
  { icon: '🤵', label: 'Groom', sub: 'Sherwani · Achkan' },
  { icon: '👔', label: 'Formal', sub: 'Suit · Bandhgala' },
  { icon: '👗', label: 'Women', sub: 'Salwar · Gharara' },
  { icon: '👧', label: 'Girls', sub: 'Festive · Ethnic' },
  { icon: '👦', label: 'Kids', sub: 'Kurta · Mini Sherwani' },
];

const INFINITE_SERVICES = [...SERVICES, ...SERVICES, ...SERVICES];

const CRAFTS = [
  { name: 'Zardozi', emoji: '✨', simple: 'Real gold & silver thread stitched by hand into patterns that last a lifetime.', img: 'https://images.unsplash.com/photo-1610189020017-7d44682f53d4?w=800&q=80' },
  { name: 'Chanderi Silk', emoji: '🌿', simple: 'Feather-light fabric woven on old handlooms. Breathable and luminous.', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80' },
  { name: 'Gota Patti', emoji: '🌟', simple: 'Golden ribbon trim applied edge by edge — our most-loved signature finish.', img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=800&q=80' },
  { name: 'Maheshwari', emoji: '👑', simple: 'A royal double-sided weave from the banks of the Narmada. Worn both ways.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
];

export default function AboutPage() {
  const [activeCraft, setActiveCraft] = useState(0);
  const [modal, setModal] = useState(false);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    let intervalId;
    const startScrolling = () => {
      intervalId = setInterval(() => {
        if (!isPaused) {
          const cardWidth = 280 + 15;
          const maxScroll = slider.scrollWidth / 1.5;
          if (slider.scrollLeft >= maxScroll) {
            slider.scrollLeft = 0;
          } else {
            slider.scrollTo({ left: slider.scrollLeft + cardWidth, behavior: 'smooth' });
          }
        }
      }, 1000);
    };
    startScrolling();
    return () => clearInterval(intervalId);
  }, [isPaused]);

  return (
    <div style={{ background: '#FFFDF5', color: '#1A0E08', overflowX: 'hidden' }}>
      <style>{fonts}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .w { max-width: 1300px; margin: 0 auto; padding: 0 25px; }
        .occ-slider {
          display: flex; gap: 15px; overflow-x: auto;
          scroll-snap-type: x mandatory; padding: 20px 0;
          scrollbar-width: none; -ms-overflow-style: none;
          scroll-behavior: smooth;
        }
        .occ-slider::-webkit-scrollbar { display: none; }
        .occ-card {
          flex: 0 0 280px; scroll-snap-align: start;
          background: #23150D; padding: 40px 30px;
          border-radius: 4px; border: 1px solid rgba(184,134,11,0.2);
          transition: all 0.3s ease;
        }
        .occ-card:hover { border-color: #B8860B; transform: translateY(-5px); }
        .step-card { padding: 30px; border: 1px solid #EAE5D5; background: #FFF; transition: 0.3s; }
        .step-card:hover { border-color: #B8860B; }
        .craft-tab {
          padding: 15px 25px; font-family: 'Raleway'; font-size: 11px;
          letter-spacing: 2px; text-transform: uppercase; cursor: pointer;
          border: none; background: transparent; color: #5C4A32; transition: 0.3s;
        }
        .craft-tab.active { color: #8B1A28; font-weight: 700; box-shadow: inset 0 -2px 0 #8B1A28; }
        .btn-gold { 
          background: #B8860B; color: #FFF; padding: 18px 35px; 
          font-family: 'Raleway'; font-size: 11px; letter-spacing: 3px;
          text-decoration: none; display: inline-block; transition: 0.3s; border: none; cursor: pointer;
        }
        .btn-gold:hover { background: #8B1A28; transform: translateY(-2px); }
      `}</style>

      {modal && <ConsultationModal isOpen={modal} onClose={() => setModal(false)} />}

      {/* Hero */}
      <section style={{ background: '#1A0E08', padding: '120px 0 80px' }}>
        <div className="w">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 5, color: '#B8860B', fontWeight: 700 }}>TAILOR24 • MODERN LUXURY</span>
            <h1 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(40px, 7vw, 85px)', color: '#FFF', margin: '20px 0', lineHeight: 1.1 }}>
              Bespoke Fitting.<br/><span style={{ color: '#B8860B', fontStyle: 'italic' }}>At Your Doorstep.</span>
            </h1>
            <p style={{ fontFamily: 'Raleway', color: 'rgba(255,255,255,0.6)', maxWidth: 550, lineHeight: 1.8, marginBottom: 40 }}>
              Why choose between ready-made speed and custom-made class? We bring the master tailor to you. Royal designs, perfect fits, and home delivery in just 2-3 days.
            </p>
            <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
               <button onClick={() => setModal(true)} className="btn-gold">BOOK HOME MEASUREMENT</button>
               <Link to="/contact" style={{ border: '1px solid #B8860B', color: '#B8860B', padding: '18px 35px', fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3, textDecoration: 'none' }}>CONTACT US</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - The Tailor24 Experience */}
      <section style={{ padding: '100px 0', background: '#FFF' }}>
        <div className="w">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Cinzel', fontSize: 32, marginBottom: 15 }}>The Tailor24 Experience</h2>
            <p style={{ fontFamily: 'Raleway', color: '#5C4A32' }}>No more waiting. No more traveling. Just luxury.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 25 }}>
            <div className="step-card">
              <span style={{ fontSize: 30 }}>📅</span>
              <h4 style={{ fontFamily: 'Cinzel', margin: '15px 0' }}>1. Book Online</h4>
              <p style={{ fontFamily: 'Raleway', fontSize: 14, color: '#5C4A32', lineHeight: 1.6 }}>Skip the traffic. Book a consultation in seconds from your phone.</p>
            </div>
            <div className="step-card">
              <span style={{ fontSize: 30 }}>📏</span>
              <h4 style={{ fontFamily: 'Cinzel', margin: '15px 0' }}>2. Home Measurement</h4>
              <p style={{ fontFamily: 'Raleway', fontSize: 14, color: '#5C4A32', lineHeight: 1.6 }}>Our Master Tailor visits your home to take precision measurements.</p>
            </div>
            <div className="step-card">
              <span style={{ fontSize: 30 }}>🧵</span>
              <h4 style={{ fontFamily: 'Cinzel', margin: '15px 0' }}>3. Expert Crafting</h4>
              <p style={{ fontFamily: 'Raleway', fontSize: 14, color: '#5C4A32', lineHeight: 1.6 }}>Track every stage of stitching—from fabric cutting to final polish—in your profile.</p>
            </div>
            <div className="step-card">
              <span style={{ fontSize: 30 }}>🚚</span>
              <h4 style={{ fontFamily: 'Cinzel', margin: '15px 0' }}>4. Doorstep Delivery</h4>
              <p style={{ fontFamily: 'Raleway', fontSize: 14, color: '#5C4A32', lineHeight: 1.6 }}>Your custom-fitted garment arrives in 2-3 days, ready to wear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Slide Occasion Section */}
      <section 
        style={{ background: '#1A0E08', padding: '100px 0' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="w">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
            <h2 style={{ fontFamily: 'Cinzel', color: '#FFF', fontSize: 28 }}>Choose Your Style</h2>
            <div style={{ width: 80, height: 1, background: '#B8860B' }} />
          </div>
          <div className="occ-slider" ref={scrollRef}>
            {INFINITE_SERVICES.map((s, i) => (
              <div key={i} className="occ-card">
                <span style={{ fontSize: 45, display: 'block', marginBottom: 20 }}>{s.icon}</span>
                <h3 style={{ fontFamily: 'Cinzel', color: '#FFF', fontSize: 22, marginBottom: 10 }}>{s.label}</h3>
                <p style={{ fontFamily: 'Raleway', color: '#B8860B', fontSize: 12, letterSpacing: 1 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft Heritage */}
      <section style={{ padding: '100px 0', background: '#F4F1E8' }}>
        <div className="w">
          <h2 style={{ fontFamily: 'Cinzel', fontSize: 32, textAlign: 'center', marginBottom: 50 }}>Royal Heritage</h2>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
            {CRAFTS.map((c, i) => (
              <button key={i} className={`craft-tab ${activeCraft === i ? 'active' : ''}`} onClick={() => setActiveCraft(i)}>
                {c.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCraft}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: '#FFF' }}
            >
              <div style={{ height: 450 }}>
                <img src={CRAFTS[activeCraft].img} alt={CRAFTS[activeCraft].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10% 12%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: 40, marginBottom: 15 }}>{CRAFTS[activeCraft].emoji}</span>
                <h3 style={{ fontFamily: 'Cinzel', fontSize: 28, marginBottom: 20 }}>{CRAFTS[activeCraft].name}</h3>
                <p style={{ fontFamily: 'Raleway', fontSize: 15, lineHeight: 1.8, color: '#5C4A32' }}>{CRAFTS[activeCraft].simple}</p>
                <Link to="/contact" style={{ marginTop: 20, color: '#8B1A28', textDecoration: 'none', fontWeight: 700, fontSize: 12 }}>INQUIRE NOW —</Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ background: '#FFFDF5', padding: '60px 0', borderTop: '1px solid #EAE5D5' }}>
        <div className="w" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: 30 }}>
          {[
            { n: '20+', l: 'Years' },
            { n: '4k+', l: 'Patrons' },
            { n: '3 Days', l: 'Fast Delivery' },
            { n: 'Live', l: 'Order Tracking' }
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cinzel', fontSize: 28, color: '#B8860B', fontWeight: 700 }}>{s.n}</p>
              <p style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 2, color: '#5C4A32', textTransform: 'uppercase' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}