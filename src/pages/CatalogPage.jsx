import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, setActiveCategory } from '../store/slices/catalogSlice';
import ProductCard from '../components/catalog/ProductCard';
import { SkeletonCard } from '../components/ui/Loader';
import { FiSearch, FiChevronDown, FiTrendingUp } from 'react-icons/fi';

/* ─── TAILOR24 THEME CONFIG ──────────────────────────────── */
const C = {
  page:      "#FBF4E8",
  parchment: "#F4E8D0",
  maroon:    "#6B0F1A",
  gold:      "#B5892E",
  ink:       "#1A0800",
  muted:     "#7A6040",
  border:    "#D4BC94",
};

const CATEGORIES = ['All', 'Womenswear', 'Menswear', 'Kids'];
const TRENDY_SEARCHES = ['Sherwani', 'Lehenga', 'Kurta', 'Blazer', 'Nehru Jacket'];

const SORT_OPTIONS = [
  { label: 'Default Heritage', value: '' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
];

/* ─── DECORATIVE COMPONENTS ─────────────────────────────── */
const RangoliHeader = () => (
  <svg width="42" height="42" viewBox="0 0 52 52" className="opacity-60">
    <circle cx="26" cy="26" r="23" stroke={C.gold} strokeWidth="0.8" fill="none" />
    <circle cx="26" cy="26" r="4" fill={C.maroon} />
    {[...Array(8)].map((_, i) => (
      <line key={i} x1="26" y1="26" x2={26 + 15 * Math.cos(i * 45)} y2={26 + 15 * Math.sin(i * 45)} stroke={C.gold} strokeWidth="0.5" />
    ))}
  </svg>
);

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { products, loading, activeCategory } = useSelector(s => s.catalog);
  
  // States
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (sort) params.sort = sort;
    dispatch(fetchProducts(params));
    setVisibleCount(6); // Reset pagination on filter change
  }, [dispatch, activeCategory, sort]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Slice data for pagination
  const paginatedProducts = filtered.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: C.page }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* Header Section */}
      <header className="relative pt-32 pb-16 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div className="absolute -bottom-10 -right-10 font-display text-[15vw] text-gold-500/5 italic select-none pointer-events-none">Tailor24</div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 mb-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.5em]" style={{ color: C.maroon }}>Est. 1997 • Central India</span>
            <RangoliHeader />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl md:text-7xl" style={{ color: C.ink }}>
            The <span className="italic" style={{ color: C.maroon }}>Heritage</span> Archive
          </motion.h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between border-b pb-8" style={{ borderColor: C.border }}>
          
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => dispatch(setActiveCategory(cat))} className="group relative px-6 py-2 overflow-hidden transition-all">
                <span className={`relative z-10 font-sans text-[10px] tracking-widest uppercase font-bold ${activeCategory === cat ? 'text-white' : 'text-charcoal'}`}>{cat}</span>
                {activeCategory === cat && <motion.div layoutId="activeCat" className="absolute inset-0 z-0" style={{ backgroundColor: C.maroon }} />}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto relative">
            {/* Search Input with Trendy Suggestions */}
            <div className="relative group">
              <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.gold }} />
              <input
                type="text"
                value={search}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Timeout to allow click detection
                onChange={e => setSearch(e.target.value)}
                placeholder="Find a piece..."
                className="bg-transparent border border-cream-300 py-3 pl-12 pr-6 text-[11px] font-sans tracking-wider uppercase focus:border-maroon-700 outline-none w-full md:w-64 transition-colors"
                style={{ borderColor: C.border }}
              />
              
              {/* Trendy Searches Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-full bg-white shadow-2xl z-50 p-4 border mt-2"
                    style={{ borderColor: C.border }}
                  >
                    <div className="flex items-center gap-2 mb-3 opacity-40">
                      <FiTrendingUp size={12} />
                      <span className="font-sans text-[9px] uppercase tracking-tighter font-bold">Trendy Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDY_SEARCHES.map(item => (
                        <button 
                          key={item} 
                          onClick={() => setSearch(item)}
                          className="text-[10px] font-sans border px-3 py-1 hover:bg-maroon-50 transition-colors uppercase tracking-widest"
                          style={{ borderColor: C.border, color: C.muted }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <select value={sort} onChange={e => setSort(e.target.value)} className="appearance-none bg-transparent border border-cream-300 py-3 pl-6 pr-12 text-[11px] font-sans tracking-wider uppercase cursor-pointer outline-none w-full" style={{ borderColor: C.border }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.gold }} />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                <AnimatePresence>
                  {paginatedProducts.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {visibleCount < filtered.length && (
                <div className="flex justify-center mt-20">
                  <button 
                    onClick={handleLoadMore}
                    className="group relative px-12 py-4 border overflow-hidden transition-all"
                    style={{ borderColor: C.maroon }}
                  >
                    <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ backgroundColor: C.maroon }} />
                    <span className="relative z-10 font-sans text-xs font-bold uppercase tracking-[0.3em] group-hover:text-white transition-colors" style={{ color: C.maroon }}>
                      Discover More Pieces
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}