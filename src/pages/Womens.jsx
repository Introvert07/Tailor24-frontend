import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/catalogService';
import { InlineLoader } from '../components/ui/Loader';
import { FiPercent, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';

const C = {
  maroon: '#6B0F1A', gold: '#B5892E', goldL: '#D4AF37',
  ink: '#1A0800', muted: '#7A6040', page: '#FAF3E4',
  white: '#FFFDF7', border: '#D4BC94', accent: '#EAD7BB'
};

const BANNERS = [
  { id: 1, title: "The Bridal Couture", sub: "Ethereal Grace", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600" },
  { id: 2, title: "Velvet Heritage", sub: "Royal Textures", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600" },
  { id: 3, title: "Floral Organza", sub: "Spring Whisper", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1600" },
];

const CATEGORIES = [
  { label: 'Lehenga Choli', tag: 'Wedding', img: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500' },
  { label: 'Banarasi Saree', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1610030469668-93510ec22f97?w=500' },
  { label: 'Evening Gowns', tag: 'Elite', img: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=500' },
  { label: 'Anarkali Suits', tag: 'Festive', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500' },
  { label: 'Chiffon Drapes', tag: 'Party', img: 'https://images.unsplash.com/photo-1610030470298-09028043681d?w=500' },
  { label: 'Indo-Western', tag: 'Modern', img: 'https://images.unsplash.com/photo-1621411534438-e6b720619a86?w=500' },
];

export default function WomenswearPage() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [currBanner, setCurrBanner] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWomenswear = async () => {
      try {
        setLoading(true);
        const data = await getProducts({ category: 'Womenswear' });
        setProducts(data.products || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchWomenswear();
  }, []);

  // Sync Banners & Carousel Speed with Menswear
  useEffect(() => {
    const timer = setInterval(() => setCurrBanner(p => (p + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3000); 
    return () => clearInterval(slideTimer);
  }, []);

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const move = dir === 'next' ? 340 : -340;
      carouselRef.current.scrollBy({ left: move, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.page }}>
      <InlineLoader color={C.maroon} />
    </div>
  );

  return (
    <div style={{ background: C.page, minHeight: '100vh', paddingTop: '120px' }}>
      
      {/* 1. HERO BANNER */}
      <section style={{ height: '70vh', minHeight: '500px', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currBanner}
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              width: '100%', height: '100%', position: 'absolute',
              background: `url(${BANNERS[currBanner].img}) center/cover no-repeat`
            }}
          >
            <div style={{ 
              width: '100%', height: '100%', background: 'rgba(0,0,0,0.35)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.white, textAlign: 'center'
            }}>
              <span style={{ fontFamily: 'Montserrat', letterSpacing: 8, fontSize: 12, color: C.goldL }}>{BANNERS[currBanner].sub}</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(40px, 8vw, 85px)', fontStyle: 'italic' }}>{BANNERS[currBanner].title}</h2>
              <button style={{ marginTop: 20, padding: '15px 40px', background: C.white, color: C.ink, border: 'none', fontWeight: 700, cursor: 'pointer' }}>VIEW ATELIER</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 2. MARQUEE */}
      <div style={{ background: C.maroon, color: C.white, padding: '12px 0', overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, -1500] }} 
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          style={{ whiteSpace: 'nowrap', display: 'flex', gap: 80, fontSize: 11, fontWeight: 700, letterSpacing: 3 }}
        >
          {[1,2,3,4].map(i => (
            <span key={i}><FiPercent style={{ marginRight: 10, color: C.goldL }} /> FESTIVE SPECIAL: FREE MEASUREMENT CONSULTATION FOR ALL BRIDAL WEAR</span>
          ))}
        </motion.div>
      </div>

      {/* 3. AUTOMATIC CATEGORY CAROUSEL */}
      <section style={{ maxWidth: 1400, margin: '60px auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
          <div>
            <span style={{ color: C.gold, fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>WOMENSWEAR</span>
            <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, fontStyle: 'italic' }}>Graceful Silhouettes</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => scrollCarousel('prev')} style={{ background: C.white, border: `1px solid ${C.border}`, padding: 8, cursor: 'pointer', borderRadius: '50%' }}><FiChevronLeft /></button>
            <button onClick={() => scrollCarousel('next')} style={{ background: C.white, border: `1px solid ${C.border}`, padding: 8, cursor: 'pointer', borderRadius: '50%' }}><FiChevronRight /></button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          style={{ 
            display: 'flex', gap: 20, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 10, scrollSnapType: 'x mandatory'
          }}
        >
          {CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ minWidth: '320px', height: '400px', flexShrink: 0, position: 'relative', cursor: 'pointer', scrollSnapAlign: 'start' }}>
              <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
                <span style={{ color: C.goldL, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{cat.tag}</span>
                <h4 style={{ color: C.white, fontFamily: 'Cinzel', fontSize: 20 }}>{cat.label}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UPGRADED PRODUCT GRID */}
      <section style={{ maxWidth: 1300, margin: '80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 40, fontStyle: 'italic' }}>Curated Couture</h2>
          <div style={{ width: 40, height: 1, background: C.gold, margin: '15px auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px 25px' }}>
          {products.slice(0, visibleCount).map((product) => (
            <motion.div 
              key={product._id} 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/catalog/${product._id}`)}
            >
              <div style={{ position: 'relative', overflow: 'hidden', background: '#F9F9F9', aspectRatio: '3/4', borderRadius: '2px' }}>
                <motion.img 
                  whileHover={{ scale: 1.08 }} 
                  transition={{ duration: 0.8 }}
                  src={product.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                {/* Hover Quick View Overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{ position: 'absolute', inset: 0, background: 'rgba(107, 15, 26, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ background: C.white, padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
                    <FiEye /> QUICK VIEW
                  </div>
                </motion.div>
              </div>

              <div style={{ marginTop: 18, textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>Handcrafted</p>
                <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22, color: C.ink, fontWeight: 500 }}>{product.name}</h3>
                <div style={{ color: C.gold, fontFamily: "Montserrat", fontWeight: 700, fontSize: 15, marginTop: 6 }}>
                  ₹{product.basePrice?.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < products.length && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <button 
              onClick={() => setVisibleCount(p => p + 8)}
              style={{ 
                padding: '15px 50px', background: 'transparent', border: `1px solid ${C.ink}`, 
                color: C.ink, fontWeight: 700, letterSpacing: 2, cursor: 'pointer',
                transition: '0.4s ease'
              }}
              onMouseOver={(e) => { e.target.style.background = C.ink; e.target.style.color = C.white; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = C.ink; }}
            >
              DISCOVER MORE
            </button>
          </div>
        )}
      </section>
    </div>
  );
}