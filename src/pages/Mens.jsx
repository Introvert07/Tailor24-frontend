import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/catalogService';
import { InlineLoader } from '../components/ui/Loader';
import { FiArrowRight, FiPercent, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { safeImg } from '../utils/imgUrl';


const C = {
  maroon: '#6B0F1A', gold: '#B5892E', goldL: '#D4AF37',
  ink: '#1A0800', muted: '#7A6040', page: '#FAF3E4',
  white: '#FFFDF7', border: '#D4BC94', accent: '#EAD7BB'
};

const BANNERS = [
  { id: 1, title: "The Royal Groom", sub: "Handcrafted Elegance", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600" },
  { id: 2, title: "Summer Linens", sub: "Breathable Sophistication", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600" },
  { id: 3, title: "Bespoke Suiting", sub: "Defined by Precision", img: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1600" },
];

const CATEGORIES = [
  { label: 'Grooms', tag: 'Wedding', img: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=500' },
  { label: 'Sherwani', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500' },
  { label: 'Formal Outfit', tag: 'Elite', img: 'https://images.unsplash.com/photo-1594938384824-023077755734?w=500' },
  { label: 'Official', tag: 'Work', img: 'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=500' },
  { label: 'Kurta Pajama', tag: 'Festive', img: 'https://images.unsplash.com/photo-1621532024765-a83f124c66e2?w=500' },
  { label: 'Indo-Western', tag: 'Modern', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500' },
];

export default function MenswearPage() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [currBanner, setCurrBanner] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenswear = async () => {
      try {
        setLoading(true);
        const data = await getProducts({ category: 'Menswear' });
        setProducts(data.products || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchMenswear();
  }, []);

  // Fast Auto-slide for Banner
  useEffect(() => {
    const timer = setInterval(() => setCurrBanner(p => (p + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // Fast Auto-slide for Category Carousel
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
    }, 3000); // Fast 3-second interval
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
              width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.white, textAlign: 'center'
            }}>
              <span style={{ fontFamily: 'Montserrat', letterSpacing: 8, fontSize: 12, color: C.goldL }}>{BANNERS[currBanner].sub}</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(40px, 8vw, 85px)', fontStyle: 'italic' }}>{BANNERS[currBanner].title}</h2>
              <button style={{ marginTop: 20, padding: '15px 40px', background: C.white, color: C.ink, border: 'none', fontWeight: 700, cursor: 'pointer' }}>EXPLORE</button>
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
            <span key={i}><FiPercent style={{ marginRight: 10, color: C.goldL }} /> ROYAL2026: FLAT 20% OFF ON ALL CUSTOM TAILORED SUITS</span>
          ))}
        </motion.div>
      </div>

      {/* 3. AUTOMATIC CATEGORY CAROUSEL */}
      <section style={{ maxWidth: 1400, margin: '60px auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, fontStyle: 'italic' }}>Our Collections</h3>
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
              <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20, borderRadius: '4px' }}>
                <span style={{ color: C.goldL, fontSize: 10, fontWeight: 700 }}>{cat.tag}</span>
                <h4 style={{ color: C.white, fontFamily: 'Cinzel', fontSize: 20 }}>{cat.label}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UPGRADED PRODUCT GRID */}
      <section style={{ maxWidth: 1300, margin: '80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 40, fontStyle: 'italic' }}>The Masterpiece Selection</h2>
          <div style={{ width: 40, height: 1, background: C.gold, margin: '15px auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px 25px' }}>
          {products.slice(0, visibleCount).map((product, idx) => (
            <motion.div 
              key={product._id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ cursor: 'pointer', group: 'true' }}
           onClick={() => navigate(`/catalog/${product._id}`)}
            >
              {/* Card Image Container */}
              <div style={{ position: 'relative', overflow: 'hidden', background: '#F9F9F9', aspectRatio: '3/4', borderRadius: '2px' }}>
               <motion.img 
  whileHover={{ scale: 1.08 }} 
  transition={{ duration: 0.8 }}
src={safeImg(product.image, 'men')}
  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35'; }}
  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
/>
                
                {/* Hover Overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{ 
                    position: 'absolute', inset: 0, background: 'rgba(26, 8, 0, 0.2)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}
                >
                  <div style={{ background: C.white, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                    <FiEye /> QUICK VIEW
                  </div>
                </motion.div>
              </div>

              {/* Card Info */}
              <div style={{ marginTop: 18, textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>New Arrival</p>
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
                padding: '15px 45px', background: 'transparent', border: `1px solid ${C.ink}`, 
                color: C.ink, fontWeight: 700, letterSpacing: 2, cursor: 'pointer',
                transition: '0.3s'
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