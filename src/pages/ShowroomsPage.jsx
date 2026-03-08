import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchShowrooms } from '../store/slices/showroomSlice';
import { InlineLoader } from '../components/ui/Loader';
import { FiPhone, FiMapPin, FiClock, FiArrowUpRight } from 'react-icons/fi';

const C = { 
  maroon: '#6B0F1A', 
  gold: '#B5892E', 
  ink: '#1A0800', 
  muted: '#7A6040', 
  page: '#FAF3E4', 
  white: '#FFFDF7',
  parchment: '#F4E8D0',
  border: '#D4BC94', 
  borderL: '#EDE0C8' 
};

export default function ShowroomsPage() {
  const dispatch = useDispatch();
  const { showrooms, loading } = useSelector(st => st.showrooms);

  useEffect(() => { 
    dispatch(fetchShowrooms()); 
    window.scrollTo(0, 0);
  }, [dispatch]);

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingBottom: 100 }}>
      <style>{`
        .hero-section {
          /* CHANGED: Switched to light parchment background */
          background: ${C.parchment};
          padding: 160px 24px 120px;
          text-align: center;
          position: relative;
          border-bottom: 1px solid ${C.borderL};
        }
        .grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          max-width: 1000px;
          margin: -40px auto 0;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }
        .showroom-card {
          background: ${C.white};
          border: 1px solid ${C.borderL};
          display: flex;
          flex-direction: row;
          min-height: 280px;
          box-shadow: 0 15px 35px rgba(122, 96, 64, 0.1);
          overflow: hidden;
        }
        .img-container {
          width: 35%;
          background: #f0f0f0;
          position: relative;
          overflow: hidden;
        }
        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(0.1) contrast(1.05);
        }
        .city-tag {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: ${C.gold};
          font-weight: 700;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
        }
        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 24px;
          font-size: 11px;
          font-weight: 700;
          color: ${C.maroon};
          text-decoration: none;
          letter-spacing: 1px;
          border-bottom: 1.5px solid ${C.maroon};
          padding-bottom: 4px;
          transition: opacity 0.2s;
        }
        .contact-link:hover { opacity: 0.7; }
        
        @media (max-width: 900px) {
          .showroom-card { flex-direction: column; }
          .img-container { width: 100%; height: 240px; }
          .card-side-info { border-left: none !important; border-top: 1px solid ${C.borderL}; max-width: 100% !important; }
          .hero-section { padding: 140px 24px 80px; }
        }
      `}</style>

      {/* Hero Header - Updated to Light Theme */}
      <div className="hero-section">
        {/* Decorative background pattern for the light theme */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(${C.border} 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 10, letterSpacing: 5, color: C.maroon, fontWeight: 700, textTransform: 'uppercase' }}>Our Presence</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 56px)', color: C.ink, fontWeight: 600, marginTop: 15 }}>
            Experience the Craft
          </h1>
          <p style={{ color: C.muted, maxWidth: 550, margin: '20px auto 0', fontSize: 15, lineHeight: 1.6, fontFamily: 'Montserrat' }}>
            Visit our physical ateliers for expert consultations, fabric viewings, and precise bespoke measurements.
          </p>
        </motion.div>
      </div>

      <div className="grid-container">
        {loading ? (
          <div style={{ padding: '100px 0' }}><InlineLoader color={C.maroon} /></div>
        ) : (
          showrooms.map((shop, idx) => (
            <motion.div 
              key={shop._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="showroom-card"
            >
              <div className="img-container">
                <img 
                  src={`https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=800&auto=format&fit=crop`} 
                  alt="Showroom Interior" 
                />
                {/* Subtle light overlay instead of dark */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(255,253,247,0.2))' }} />
              </div>

              <div style={{ padding: '40px', flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="city-tag">{shop.city}</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: C.ink, fontWeight: 600, margin: '0 0 15px' }}>
                  {shop.name}
                </h2>
                <div style={{ display: 'flex', gap: 12, color: C.muted, fontSize: 14, lineHeight: 1.5, maxWidth: '300px' }}>
                  <FiMapPin size={16} style={{ color: C.gold, flexShrink: 0, marginTop: 4 }} />
                  <span>{shop.address}</span>
                </div>
                
                <a href={`tel:${shop.phone}`} className="contact-link">
                  BOOK APPOINTMENT <FiArrowUpRight />
                </a>
              </div>

              <div className="card-side-info" style={{ 
                padding: '40px', 
                background: `${C.page}60`, 
                borderLeft: `1px solid ${C.borderL}`, 
                width: '100%', 
                maxWidth: '260px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.ink, fontWeight: 700, fontSize: 10, marginBottom: 8, letterSpacing: 1.5 }}>
                    <FiClock color={C.gold} /> TIMINGS
                  </div>
                  <div style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>{shop.hours || '11:00 AM - 08:30 PM'}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.ink, fontWeight: 700, fontSize: 10, marginBottom: 8, letterSpacing: 1.5 }}>
                    <FiPhone color={C.gold} /> CONTACT
                  </div>
                  <div style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>{shop.phone}</div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {!loading && (
        <div style={{ textAlign: 'center', marginTop: 100, padding: '0 24px' }}>
          <div style={{ width: 80, height: 1.5, background: C.gold, margin: '0 auto 32px' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: C.ink, fontStyle: 'italic' }}>
            Can't find a location near you? 
          </p>
          <button style={{ background: 'none', border: `1px solid ${C.maroon}`, color: C.maroon, fontWeight: 700, letterSpacing: 2, fontSize: 10, padding: '12px 24px', marginTop: 25, cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.3s' }}>
            Request a Concierge Home Visit
          </button>
        </div>
      )}
    </div>
  );
}