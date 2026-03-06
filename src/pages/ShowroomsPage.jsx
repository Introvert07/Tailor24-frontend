import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchShowrooms, setActiveCity } from '../store/slices/showroomSlice';
import { InlineLoader } from '../components/ui/Loader';
import { FiPhone, FiMapPin, FiUser, FiClock } from 'react-icons/fi';

/* ─── TAILOR24 THEME CONFIG ──────────────────────────────── */
const C = {
  page:      "#FBF4E8", // Light Parchment
  parchment: "#F4E8D0", // Rich Parchment
  maroon:    "#6B0F1A",
  gold:      "#B5892E",
  ink:       "#1A0800",
  muted:     "#7A6040",
  border:    "#D4BC94",
};

const CITIES = ['All', 'Indore', 'Bhopal', 'Vidisha'];

const CITY_IMGS = {
  Indore:  'https://images.unsplash.com/photo-1567472563906-dbe48b4fbd97?w=800&q=80',
  Bhopal:  'https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=800&q=80',
  Vidisha: 'https://images.unsplash.com/photo-1519178614-68673b201f36?w=800&q=80',
};

/* ─── DECORATIVE COMPONENTS ─────────────────────────────── */

const ArchWrapper = ({ children }) => (
  // Reduced border radius for mobile to prevent extreme distortion
  <div className="relative overflow-hidden rounded-t-[80px] sm:rounded-t-[120px]">
    {children}
  </div>
);

const RangoliIcon = () => (
  <svg width="30" height="30" viewBox="0 0 52 52" className="opacity-40">
    <circle cx="26" cy="26" r="20" stroke={C.gold} strokeWidth="1" fill="none" strokeDasharray="4 4" />
    <path d="M26 10 L30 26 L26 42 L22 26 Z" fill={C.gold} />
    <path d="M10 26 L26 22 L42 26 L26 30 Z" fill={C.gold} />
  </svg>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────── */

export default function ShowroomsPage() {
  const dispatch = useDispatch();
  const { showrooms, loading, activeCity } = useSelector(s => s.showrooms);

  useEffect(() => {
    const params = activeCity !== 'All' ? { city: activeCity } : {};
    dispatch(fetchShowrooms(params));
  }, [dispatch, activeCity]);

  // Fallback data
  const displayData = showrooms.length > 0 ? showrooms : [
    { _id:'1', name:'Tailor24 Flagship - Indore', city:'Indore', address:'12, Vijay Nagar Square, Near C21 Mall', contactNumber:'9876543210', managerName:'Rahul Sharma', isActive:true },
    { _id:'2', name:'Tailor24 Studio - Bhopal',   city:'Bhopal', address:'45, New Market, Center Point',       contactNumber:'9123456789', managerName:'Priya Singh',  isActive:true },
    { _id:'3', name:'Tailor24 Hub - Vidisha',     city:'Vidisha', address:'Shop 5, Main Market, Near Durga Nagar', contactNumber:'8899776655', managerName:'Amit Verma',   isActive:true },
  ];

  const filtered = displayData.filter(s => activeCity === 'All' || s.city === activeCity);

  return (
    <div className="min-h-screen pb-12 md:pb-24" style={{ backgroundColor: C.page }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Hero Header */}
      <header className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div className="absolute top-0 right-0 w-1/2 md:w-1/3 h-full opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="100" cy="0" r="80" fill={C.maroon} /></svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-sans text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] mb-4 block" 
            style={{ color: C.gold }}
          >
            Regional Presence
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl mb-6 leading-tight"
            style={{ color: C.ink }}
          >
            Our <span className="italic" style={{ color: C.maroon }}>Studios</span>
          </motion.h1>
          <div className="w-16 md:w-24 h-[1px] bg-gold-600 mx-auto mb-6 opacity-30" style={{ backgroundColor: C.gold }} />
          <p className="font-sans text-xs md:text-sm text-charcoal/60 max-w-xl mx-auto leading-relaxed italic px-4">
            Experience the art of bespoke tailoring in person. Our master consultants await you at these premier locations across Central India.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 md:-mt-8 relative z-20">
        
        {/* Responsive City Filter Navigation */}
        <div className="flex justify-center mb-8 md:mb-16">
          <div className="w-full max-w-md overflow-x-auto no-scrollbar flex justify-start md:justify-center">
            <div className="inline-flex bg-white/80 backdrop-blur-md p-1.5 shadow-xl rounded-full border shrink-0" style={{ borderColor: C.border }}>
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => dispatch(setActiveCity(city))}
                  className="relative px-5 md:px-8 py-2 md:py-2.5 rounded-full transition-all duration-300 whitespace-nowrap"
                >
                  <span className={`relative z-10 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    activeCity === city ? 'text-white' : 'text-charcoal/60'
                  }`}>
                    {city}
                  </span>
                  {activeCity === city && (
                    <motion.div 
                      layoutId="activePill"
                      className="absolute inset-0 z-0 rounded-full"
                      style={{ backgroundColor: C.maroon }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><InlineLoader color={C.maroon} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((showroom, i) => (
                <motion.div
                  key={showroom._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-white border border-transparent hover:border-gold-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col"
                  style={{ backgroundColor: '#FFF' }}
                >
                  {/* The Arch Image */}
                  <div className="p-3 md:p-4 pb-0">
                    <ArchWrapper>
                      <div className="aspect-[4/5] overflow-hidden bg-cream-200 relative">
                        <img
                          src={CITY_IMGS[showroom.city] || CITY_IMGS.Indore}
                          alt={showroom.city}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 md:px-3 md:py-1.5 rounded-full">
                          <div className={`w-1.5 h-1.5 rounded-full ${showroom.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                          <span className="font-sans text-[8px] md:text-[9px] font-bold uppercase tracking-tighter" style={{ color: C.ink }}>
                            {showroom.isActive ? 'Open' : 'Closed'}
                          </span>
                        </div>
                        
                        <div className="absolute bottom-4 md:bottom-6 left-0 w-full text-center">
                           <p className="font-display text-white text-xl md:text-2xl italic tracking-wide">{showroom.city}</p>
                        </div>
                      </div>
                    </ArchWrapper>
                  </div>

                  {/* Studio Information */}
                  <div className="p-6 md:p-8 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-center mb-4">
                          <RangoliIcon />
                      </div>
                      <h3 className="font-display text-xl md:text-2xl mb-4 group-hover:text-maroon-800 transition-colors" style={{ color: C.ink }}>
                        {showroom.name}
                      </h3>
                      
                      <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                        <div className="flex items-start justify-center gap-3">
                          <FiMapPin size={14} style={{ color: C.gold }} className="mt-1 flex-shrink-0" />
                          <p className="font-sans text-xs leading-relaxed opacity-60 max-w-[180px] md:max-w-[200px]">{showroom.address}</p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3">
                          <FiClock size={14} style={{ color: C.gold }} />
                          <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-wider opacity-60">11 AM — 09 PM</p>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          <FiUser size={14} style={{ color: C.gold }} />
                          <p className="font-sans text-xs opacity-60">Manager: {showroom.managerName}</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:+91${showroom.contactNumber}`}
                      className="group/btn relative inline-flex items-center justify-center gap-3 px-6 md:px-8 py-3 overflow-hidden border transition-all w-full md:w-auto"
                      style={{ borderColor: C.border }}
                    >
                      <div className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" style={{ backgroundColor: C.maroon }} />
                      <FiPhone size={14} className="relative z-10 group-hover/btn:text-white" style={{ color: C.maroon }} />
                      <span className="relative z-10 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] group-hover/btn:text-white">
                        Connect with Studio
                      </span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Decorative Bottom Arch */}
      <div className="mt-12 md:mt-20 flex justify-center opacity-10">
          <div className="w-32 md:w-40 h-16 md:h-20 border-t-2 border-l-2 border-r-2 rounded-t-full" style={{ borderColor: C.gold }} />
      </div>
    </div>
  );
}