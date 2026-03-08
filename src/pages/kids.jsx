import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/catalogService';
import { InlineLoader } from '../components/ui/Loader';
import { FiPercent, FiChevronLeft, FiChevronRight, FiEye, FiStar } from 'react-icons/fi';

const C = {
  maroon: '#6B0F1A', gold: '#B5892E', goldL: '#D4AF37',
  ink: '#1A0800', muted: '#7A6040', page: '#FAF3E4',
  white: '#FFFDF7', border: '#D4BC94', accent: '#EAD7BB'
};

const BANNERS = [
  { id: 1, title: "Young Prince & Princess", sub: "The Heritage Collection", img: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=1600" },
  { id: 2, title: "Festive Joy", sub: "Little Milestones", img: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1600" },
];

const CATEGORIES = [
  { label: 'Kids Sherwani', tag: 'Boys', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500' },
  { label: 'Pattu Pavadai', tag: 'Girls', img: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=500' },
  { label: 'Junior Tuxedos', tag: 'Formal', img: 'https://images.unsplash.com/photo-1503919919749-640141b1d9b2?w=500' },
  { label: 'Ethnic Lehengas', tag: 'Festive', img: 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=500' },
];

export default function KidswearPage() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [currBanner, setCurrBanner] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKids = async () => {
      try {
        setLoading(true);
        const data = await getProducts({ category: 'Kids' });
        setProducts(data.products || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchKids();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrBanner(p => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
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
      <section style={{ height: '65vh', minHeight: '450px', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currBanner}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ 
              width: '100%', height: '100%', position: 'absolute',
              background: `url(${BANNERS[currBanner].img}) center/cover no-repeat`
            }}
          >
            <div style={{ 
              width: '100%', height: '100%', background: 'rgba(26,8,0,0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.white, textAlign: 'center'
            }}>
               <FiStar style={{ color: C.goldL, marginBottom: 15 }} size={20} />
              <span style={{ fontFamily: 'Montserrat', letterSpacing: 6, fontSize: 11 }}>{BANNERS[currBanner].sub}</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(36px, 6vw, 70px)', fontStyle: 'italic', marginTop: 10 }}>{BANNERS[currBanner].title}</h2>
              <button style={{ marginTop: 25, padding: '14px 35px', background: C.maroon, color: C.white, border: 'none', fontWeight: 600, cursor: 'pointer', letterSpacing: 2 }}>SHOP JUNIOR</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 2. MARQUEE */}
      <div style={{ background: C.ink, color: C.white, padding: '12px 0', overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, -1200] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          style={{ whiteSpace: 'nowrap', display: 'flex', gap: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2 }}
        >
          {[1,2,3].map(i => (
            <span key={i}>✨ GENTLE ON SKIN • LUXURY FABRICS • HAND-STITCHED PRECISION • PERFECT FOR GROWING MILESTONES ✨</span>
          ))}
        </motion.div>
      </div>

      {/* 3. CATEGORY CAROUSEL */}
      <section style={{ maxWidth: 1400, margin: '60px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 30 }}>
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, fontStyle: 'italic', color: C.ink }}>Little Legacies</h3>
            <p style={{ color: C.muted, fontSize: 13 }}>Explore tailored collections for every age</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => scrollCarousel('prev')} style={{ background: C.white, border: `1px solid ${C.border}`, padding: 10, cursor: 'pointer', borderRadius: '50%' }}><FiChevronLeft /></button>
            <button onClick={() => scrollCarousel('next')} style={{ background: C.white, border: `1px solid ${C.border}`, padding: 10, cursor: 'pointer', borderRadius: '50%' }}><FiChevronRight /></button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 15 }}
        >
          {CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ minWidth: '300px', height: '380px', flexShrink: 0, position: 'relative', cursor: 'pointer' }}>
              <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,8,0,0.5), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 25 }}>
                <span style={{ color: C.goldL, fontSize: 9, fontWeight: 700, letterSpacing: 1.5 }}>{cat.tag}</span>
                <h4 style={{ color: C.white, fontFamily: 'Cinzel', fontSize: 18, marginTop: 5 }}>{cat.label}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUCT GRID */}
      <section style={{ maxWidth: 1300, margin: '80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ color: C.gold, fontSize: 10, letterSpacing: 4, fontWeight: 700 }}>THE ATELIER</span>
          <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 42, fontStyle: 'italic', marginTop: 10 }}>Children's Couture</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '45px 25px' }}>
          {products.slice(0, visibleCount).map((product) => (
            <motion.div 
              key={product._id} 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              style={{ cursor: 'pointer' }}
             onClick={() => navigate(`/catalog/${product._id}`)}
            >
              <div style={{ position: 'relative', overflow: 'hidden', background: C.white, aspectRatio: '3/4', border: `1px solid ${C.border}40` }}>
                <motion.img 
                  whileHover={{ scale: 1.05 }} 
                  src={product.image || 'https://images.unsplash.com/photo-1503919919749-640141b1d9b2'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                {/* Age Range Badge */}
                <div style={{ position: 'absolute', top: 15, left: 15, background: C.white, padding: '5px 12px', fontSize: 9, fontWeight: 700, color: C.maroon, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  {product.ageRange || '2-12 YEARS'}
                </div>

                <motion.div 
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  style={{ position: 'absolute', inset: 0, background: 'rgba(26, 8, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div style={{ background: C.white, padding: '12px 25px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700 }}>
                    <FiEye /> DETAILS
                  </div>
                </motion.div>
              </div>

              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22, color: C.ink, fontWeight: 600 }}>{product.name}</h3>
                <p style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 }}>Bespoke Tailoring</p>
                <div style={{ color: C.gold, fontFamily: "Montserrat", fontWeight: 700, fontSize: 16, marginTop: 10 }}>
                  ₹{product.basePrice?.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < products.length && (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <button 
              onClick={() => setVisibleCount(p => p + 8)}
              style={{ 
                padding: '16px 60px', background: 'transparent', border: `1px solid ${C.border}`, 
                color: C.ink, fontWeight: 700, letterSpacing: 2, cursor: 'pointer'
              }}
            >
              VIEW ALL KID'S WEAR
            </button>
          </div>
        )}
      </section>
    </div>
  );
}