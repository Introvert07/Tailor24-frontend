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
  
  const [displayLimit, setDisplayLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => { 
    dispatch(fetchProducts(activeCategory));
    setDisplayLimit(10); 
  }, [activeCategory, dispatch]);

  const processedProducts = useMemo(() => {
    let list = [...products];
    if (sortOrder === 'asc') list.sort((a, b) => a.price - b.price);
    if (sortOrder === 'desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sortOrder]);

  const visibleProducts = processedProducts.slice(0, displayLimit);

  return (
    <div style={{ minHeight: '100vh', background: '#FBF4E8', color: '#1A1A1A', paddingTop: '80px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Raleway:wght@300;400;600&display=swap');
        
        .catalog-container { max-width: 1440px; margin: 0 auto; padding: 0 24px; }
        
        .filter-nav { 
          display: flex; gap: 24px; overflow-x: auto; scrollbar-width: none; 
          -ms-overflow-style: none; padding-bottom: 4px;
        }
        .filter-nav::-webkit-scrollbar { display: none; }
        
        .filter-link { 
          white-space: nowrap; transition: all 0.3s ease; 
          border-bottom: 1.5px solid transparent; background: none; 
          border-top: none; border-left: none; border-right: none;
          cursor: pointer; fontFamily: 'Cinzel'; fontSize: 13px;
          letter-spacing: 1.5px; color: #666;
        }
        .filter-link.active { color: #8B1A28; border-color: #8B1A28; font-weight: 600; }

        .sort-select {
          background: transparent; border: 1px solid rgba(0,0,0,0.1);
          padding: 8px 12px; font-family: 'Raleway'; font-size: 11px;
          text-transform: uppercase; letter-spacing: 1px; outline: none;
          cursor: pointer;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 24px;
          padding: 40px 0;
        }

        @media (min-width: 640px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); gap: 40px; padding: 60px 0; }
        }
        @media (min-width: 1280px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .toolbar {
          position: sticky; top: 60px; z-index: 100; 
          background: rgba(251, 244, 232, 0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.05); padding: 16px 0;
        }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '60px 24px 20px' }}>
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontFamily: 'Raleway', fontSize: 10, letterSpacing: 4, color: '#8B1A28', fontWeight: 600, textTransform: 'uppercase' }}>
          Heritage Collection
        </motion.span>
        <h1 style={{ fontFamily: 'Cinzel', fontSize: 'clamp(28px, 5vw, 42px)', color: '#060201', marginTop: 12, lineHeight: 1.2 }}>
          The Royal <span style={{ color: '#C9972A' }}>Gallery</span>
        </h1>
      </header>

      {/* Sticky Toolbar */}
      <div className="toolbar">
        <div className="catalog-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <nav className="filter-nav">
            {CATS.map(cat => {
              const isActive = activeCategory === (cat === 'All' ? '' : cat);
              return (
                <button 
                  key={cat}
                  onClick={() => dispatch(setActiveCategory(cat === 'All' ? '' : cat))}
                  className={`filter-link ${isActive ? 'active' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Featured</option>
            <option value="asc">Price: Low-High</option>
            <option value="desc">Price: High-Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <main className="catalog-container">
        {loading ? (
          <div style={{ padding: '100px 0' }}><InlineLoader color="#8B1A28" /></div>
        ) : (
          <>
            {visibleProducts.length > 0 ? (
              <motion.div layout className="product-grid">
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((p, i) => (
                    <motion.div key={p._id} layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 24px', fontFamily: 'Raleway' }}>
                <p style={{ color: '#666', fontStyle: 'italic' }}>No pieces found in this collection.</p>
                <button 
                  onClick={() => dispatch(setActiveCategory(''))}
                  style={{ background: 'none', border: 'none', color: '#8B1A28', cursor: 'pointer', textDecoration: 'underline', marginTop: 10 }}>
                  View All Collections
                </button>
              </div>
            )}

            {/* Pagination Button */}
            {processedProducts.length > displayLimit && (
              <div style={{ textAlign: 'center', paddingBottom: 80 }}>
                <button 
                  onClick={() => setDisplayLimit(prev => prev + 12)}
                  style={{
                    background: '#060201', color: '#FFF', padding: '18px 48px',
                    fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3,
                    textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Discover More Pieces
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}