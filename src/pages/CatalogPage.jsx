import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, setActiveCategory } from '../store/slices/catalogSlice';
import ProductCard from '../components/catalog/ProductCard';
import { InlineLoader } from '../components/ui/Atoms';

const CATS = ['All', 'Men', 'Women', 'Bridal', 'Kids'];

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { products, activeCategory, loading } = useSelector(st => st.catalog);
  
  // Local state for pagination and sorting
  const [displayLimit, setDisplayLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState('default'); // 'asc' | 'desc' | 'default'

  useEffect(() => { 
    dispatch(fetchProducts(activeCategory));
    setDisplayLimit(10); // Reset limit when category changes
  }, [activeCategory, dispatch]);

  // Handle Sorting and Limiting
  const processedProducts = useMemo(() => {
    let list = [...products];
    if (sortOrder === 'asc') list.sort((a, b) => a.price - b.price);
    if (sortOrder === 'desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sortOrder]);

  const visibleProducts = processedProducts.slice(0, displayLimit);

  return (
    <div style={{ minHeight: '100vh', background: '#FBF4E8', color: '#1A1A1A', paddingTop: 100 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Raleway:wght@300;400;600&display=swap');
        .filter-link { transition: all 0.3s ease; border-bottom: 1px solid transparent; }
        .filter-link:hover { color: #8B1A28; border-color: #8B1A28; }
        .sort-select {
          background: transparent; border: 1px solid rgba(0,0,0,0.1);
          padding: 8px 12px; font-family: 'Raleway'; font-size: 11px;
          text-transform: uppercase; letter-spacing: 1px; outline: none;
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <span style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 4, color: '#8B1A28', fontWeight: 600, textTransform: 'uppercase' }}>
          Heritage Collection
        </span>
        <h1 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(32px, 5vw, 48px)', color: '#060201', marginTop: 10 }}>
          The Royal <span style={{ color: '#C9972A' }}>Gallery</span>
        </h1>
      </div>

      {/* ── Toolbar: Filters & Sort ── */}
      <div style={{ 
        position: 'sticky', top: 70, zInitialize: 10, background: 'rgba(251, 244, 232, 0.9)', 
        backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '20px 48px' 
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          
          {/* Categories */}
          <div style={{ display: 'flex', gap: 25 }}>
            {CATS.map(cat => (
              <button key={cat}
                onClick={() => dispatch(setActiveCategory(cat === 'All' ? '' : cat))}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Cinzel',
                  fontSize: 12, letterSpacing: 2, color: activeCategory === (cat === 'All' ? '' : cat) ? '#8B1A28' : '#666',
                  fontWeight: activeCategory === (cat === 'All' ? '' : cat) ? 600 : 400
                }} className="filter-link">
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Sort By: Featured</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 48px' }}>
        {loading ? <InlineLoader color="#8B1A28" /> : (
          <>
            <motion.div layout style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 40 
            }}>
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((p, i) => (
                  <motion.div key={p._id} layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 10) * 0.05 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ── Discover More ── */}
            {processedProducts.length > displayLimit && (
              <div style={{ textAlign: 'center', marginTop: 80 }}>
                <button 
                  onClick={() => setDisplayLimit(prev => prev + 10)}
                  style={{
                    background: '#060201', color: '#FFF', padding: '16px 40px',
                    fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3,
                    textTransform: 'uppercase', border: 'none', cursor: 'pointer'
                  }}>
                  Discover More Pieces
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}