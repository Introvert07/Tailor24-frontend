import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMyOrders } from '../store/slices/orderSlice';
import OrderCard from '../components/orders/OrderCard';
import { InlineLoader } from '../components/ui/Loader';
import { FiShoppingBag, FiArrowRight, FiClock } from 'react-icons/fi';

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

/* ─── DECORATIVE COMPONENTS ─────────────────────────────── */

const RoyalDivider = () => (
  <div className="flex items-center justify-center gap-4 my-8 opacity-40">
    <div className="h-[1px] w-12 bg-gold-600" style={{ backgroundColor: C.gold }} />
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5">
      <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" />
    </svg>
    <div className="h-[1px] w-12 bg-gold-600" style={{ backgroundColor: C.gold }} />
  </div>
);

const EmptyArchiveIllustration = () => (
  <div className="relative w-24 h-32 mx-auto mb-8">
    {/* Arch shape with dotted border */}
    <div 
      className="absolute inset-0 border-2 border-dashed rounded-t-full opacity-20" 
      style={{ borderColor: C.gold }} 
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <FiShoppingBag size={32} style={{ color: C.gold }} className="opacity-40" />
    </div>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────── */

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(s => s.orders);

  useEffect(() => { 
    dispatch(fetchMyOrders()); 
  }, [dispatch]);

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: C.page }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* Hero Header */}
      <header className="relative pt-32 pb-16 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        {/* Large subtle watermark */}
        <div className="absolute bottom-[-20%] left-[-5%] font-display text-[15vw] text-gold-500/5 italic select-none pointer-events-none whitespace-nowrap">
          Order Archive
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-8 h-[1px]" style={{ backgroundColor: C.maroon }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: C.maroon }}>
              Account Profile
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl"
            style={{ color: C.ink }}
          >
            Your <span className="italic" style={{ color: C.maroon }}>Sartorial</span> History
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-sans text-xs mt-4 opacity-50 tracking-wider uppercase"
          >
            Tracing your journey through bespoke craftsmanship
          </motion.p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 md:px-8 mt-12">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
             <InlineLoader color={C.maroon} />
             <p className="font-sans text-[10px] uppercase tracking-widest opacity-40">Retrieving Records...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white/50 border border-dashed rounded-xl"
            style={{ borderColor: C.border }}
          >
            <EmptyArchiveIllustration />
            <h2 className="font-display text-3xl mb-2 italic" style={{ color: C.muted }}>The Archive is Quiet</h2>
            <p className="font-sans text-sm text-charcoal/50 mb-10 max-w-xs mx-auto leading-relaxed">
              It seems you haven't commissioned your first masterpiece yet.
            </p>
            
            <Link to="/catalog" className="group relative inline-flex items-center gap-4 px-10 py-4 bg-transparent border overflow-hidden transition-all" style={{ borderColor: C.maroon }}>
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ backgroundColor: C.maroon }} />
              <span className="relative z-10 font-sans text-[10px] font-bold uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                Begin Your Journey
              </span>
              <FiArrowRight className="relative z-10 group-hover:text-white transition-colors" />
            </Link>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Status Summary */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <FiClock size={14} style={{ color: C.gold }} />
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60">
                  {orders.length} Commissions Filed
                </p>
              </div>
              <div className="text-[10px] font-sans uppercase tracking-tighter italic opacity-40">
                Sorted by Date Descending
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-8 relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-0 top-0 w-[1px] h-full opacity-10 ml-[-20px] hidden md:block" style={{ backgroundColor: C.maroon }} />
                
                <AnimatePresence>
                  {orders.map((order, i) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline dot for desktop */}
                      <div className="absolute left-0 top-12 w-2 h-2 rounded-full ml-[-24px] hidden md:block" style={{ backgroundColor: C.maroon }} />
                      
                      <OrderCard order={order} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
            </div>
            
            <RoyalDivider />
            
            <div className="text-center mt-12">
               <p className="font-sans text-[9px] uppercase tracking-[0.4em] opacity-30">
                 Thank you for choosing Tailor24 Heritage
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}