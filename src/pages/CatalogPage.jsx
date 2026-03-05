import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, setActiveCategory } from '../store/slices/catalogSlice';
import ProductCard from '../components/catalog/ProductCard';
import { SkeletonCard } from '../components/ui/Loader';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

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
      <line 
        key={i} x1="26" y1="26" 
        x2={26 + 15 * Math.cos(i * 45)} y2={26 + 15 * Math.sin(i * 45)} 
        stroke={C.gold} strokeWidth="0.5" 
      />
    ))}
  </svg>
);

const JaaliDivider = () => (
  <div className="w-full h-3 overflow-hidden opacity-30 my-8">
    <svg width="100%" height="12" preserveAspectRatio="none">
      <pattern id="jaali" x="0" y="0" width="20" height="12" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="6" r="4" stroke={C.gold} fill="none" strokeWidth="0.5" />
        <circle cx="10" cy="6" r="1" fill={C.gold} />
      </pattern>
      <rect width="100%" height="100%" fill="url(#jaali)" />
    </svg>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────── */

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { products, loading, activeCategory } = useSelector(s => s.catalog);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (sort) params.sort = sort;
    dispatch(fetchProducts(params));
  }, [dispatch, activeCategory, sort]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: C.page }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* Header Section */}
      <header className="relative pt-32 pb-16 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        {/* Decorative watermark */}
        <div className="absolute -bottom-10 -right-10 font-display text-[15vw] text-gold-500/5 italic select-none pointer-events-none">
          Tailor24
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 mb-4"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.5em]" style={{ color: C.maroon }}>
              Est. 1997 • Central India
            </span>
            <RangoliHeader />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl"
            style={{ color: C.ink }}
          >
            The <span className="italic" style={{ color: C.maroon }}>Heritage</span> Archive
          </motion.h1>
          
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="font-sans text-sm mt-4 max-w-xl mx-auto opacity-60 italic"
          >
            Every thread tells a story of royalty. Browse our curated collection of bespoke menswear, bridal finery, and little royals.
          </motion.p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between border-b pb-8" style={{ borderColor: C.border }}>
          
          {/* Category Selection */}
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => dispatch(setActiveCategory(cat))}
                className="group relative px-6 py-2 overflow-hidden transition-all"
              >
                <span className={`relative z-10 font-sans text-[10px] tracking-widest uppercase font-bold ${
                  activeCategory === cat ? 'text-white' : 'text-charcoal'
                }`}>
                  {cat}
                </span>
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeCat"
                    className="absolute inset-0 z-0"
                    style={{ backgroundColor: C.maroon }}
                  />
                )}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-maroon-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            ))}
          </div>

          {/* Search & Sort UI */}
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group">
              <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.gold }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Find a piece..."
                className="bg-transparent border border-cream-300 py-3 pl-12 pr-6 text-[11px] font-sans tracking-wider uppercase focus:border-maroon-700 outline-none w-full md:w-64 transition-colors"
                style={{ borderColor: C.border }}
              />
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none bg-transparent border border-cream-300 py-3 pl-6 pr-12 text-[11px] font-sans tracking-wider uppercase cursor-pointer focus:border-maroon-700 outline-none w-full transition-colors"
                style={{ borderColor: C.border }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.gold }} />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center mt-6 mb-12">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase opacity-40">
            {loading ? 'Curating...' : `Archiving ${filtered.length} unique masterpieces`}
          </p>
          <div className="flex-1 h-[1px] mx-8 opacity-20" style={{ backgroundColor: C.gold }} />
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 border border-dashed"
              style={{ borderColor: C.border }}
            >
              <RangoliHeader />
              <p className="font-display text-3xl mt-6 italic" style={{ color: C.muted }}>The archive is quiet.</p>
              <p className="font-sans text-[10px] uppercase tracking-widest mt-2 opacity-50">No pieces match your search criteria</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + sort}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <JaaliDivider />
      </div>
    </div>
  );
}