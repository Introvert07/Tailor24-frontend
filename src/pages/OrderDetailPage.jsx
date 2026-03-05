import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchOrderDetail } from '../store/slices/orderSlice';
import { InlineLoader } from '../components/ui/Loader';
import { FiArrowLeft, FiScissors, FiCheckCircle, FiPackage, FiTruck, FiAward } from 'react-icons/fi';

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

const STATUS_STEPS = ['CREATED', 'VERIFIED', 'STITCHING', 'READY', 'DELIVERED'];

const STATUS_ICONS = {
  CREATED:   <FiAward />,
  VERIFIED:  <FiCheckCircle />,
  STITCHING: <FiScissors />,
  READY:     <FiPackage />,
  DELIVERED: <FiTruck />,
};

/* ─── DECORATIVE COMPONENTS ─────────────────────────────── */

const SectionArch = ({ title, children }) => (
  <div className="relative bg-white border border-transparent hover:border-gold-500/20 transition-all duration-500 shadow-sm p-8">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FBF4E8] px-4">
        <div className="w-12 h-6 border-t-2 border-l-2 border-r-2 rounded-t-full" style={{ borderColor: C.border }} />
    </div>
    <p className="font-display text-lg italic mb-6 text-center" style={{ color: C.maroon }}>{title}</p>
    <div className="space-y-4">{children}</div>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────── */

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedOrder: order, loading } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchOrderDetail(id)); }, [id, dispatch]);

  if (loading || !order) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.page }}>
        <InlineLoader color={C.maroon} />
    </div>
  );

  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: C.page }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* Hero Header */}
      <header className="relative pt-32 pb-12 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="jaali" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill={C.maroon}/></pattern><rect width="100%" height="100%" fill="url(#jaali)"/></svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
          <button 
            onClick={() => navigate('/orders')}
            className="group flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] transition-colors mb-12"
            style={{ color: C.muted }}
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Archive
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.4em]" style={{ color: C.gold }}>
                Commission No. {order._id?.slice(-8).toUpperCase()}
              </span>
              <h1 className="font-display text-5xl md:text-6xl mt-2" style={{ color: C.ink }}>
                {order.garmentType || 'Bespoke Piece'}
              </h1>
            </div>
            <div className="flex flex-col items-start md:items-end">
                <p className="font-sans text-[10px] uppercase tracking-widest opacity-40 mb-2">Current Stage</p>
                <span className={`px-6 py-2 rounded-full font-sans text-[10px] font-bold tracking-[0.2em] uppercase border ${
                    isCancelled ? 'border-red-200 text-red-700 bg-red-50' : 'border-gold-500/30 text-white bg-[#6B0F1A]'
                }`}>
                    {order.status}
                </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 md:px-8 mt-16">
        
        {/* Atelier Progress Tracker */}
        {!isCancelled && (
          <div className="mb-20">
            <div className="relative flex justify-between">
              {/* Background Line */}
              <div className="absolute top-5 left-0 w-full h-[1px] opacity-20" style={{ backgroundColor: C.gold }} />
              
              {STATUS_STEPS.map((s, i) => {
                const isActive = i <= stepIdx;
                const isCurrent = i === stepIdx;
                return (
                  <div key={s} className="relative z-10 flex flex-col items-center group">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 border ${
                        isActive ? 'bg-[#6B0F1A] border-[#6B0F1A] text-white' : 'bg-white border-[#D4BC94] text-[#D4BC94]'
                      } ${isCurrent ? 'ring-4 ring-maroon-700/10' : ''}`}
                    >
                      {isCurrent ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          {STATUS_ICONS[s]}
                        </motion.div>
                      ) : STATUS_ICONS[s]}
                    </div>
                    <p className={`font-sans text-[9px] mt-4 font-bold tracking-tighter uppercase transition-colors ${
                      isActive ? 'text-maroon-900' : 'opacity-30'
                    }`}>
                      {s}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Specification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <SectionArch title="The Design">
            <DetailRow label="Neckline Style" value={order.customization?.frontDesign?.neckline} />
            <DetailRow label="Back Closure" value={order.customization?.backDesign?.closure} />
            <DetailRow label="Sleeve Architecture" value={order.customization?.sleeveDesign?.style} />
            <DetailRow label="Structural Fit" value={order.customization?.structure?.fit} />
          </SectionArch>

          <div className="space-y-10">
            {order.fabric && (
              <SectionArch title="The Canvas">
                <DetailRow label="Fabric Source" value={order.fabric.source} />
                <DetailRow label="Primary Hue" value={order.fabric.color} />
              </SectionArch>
            )}

            {order.measurements && (
              <SectionArch title="The Fit">
                <DetailRow label="Sizing Method" value={order.measurements.method} />
                <DetailRow label="Fabric Handling" value={order.measurements.fabricHandling} />
              </SectionArch>
            )}
          </div>

          {/* Activity Log / Scroll */}
          <div className="md:col-span-2 mt-6">
            <div className="p-10 border border-dashed rounded-lg" style={{ borderColor: C.border }}>
                <p className="font-display text-2xl italic mb-8 text-center" style={{ color: C.ink }}>Atelier Log</p>
                <div className="space-y-6 max-w-xl mx-auto">
                    {order.timeline?.map((t, i) => (
                        <div key={i} className="flex justify-between items-baseline border-b border-gold-500/10 pb-2">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest" style={{ color: C.gold }}>{t.status}</span>
                            <span className="font-sans text-xs italic opacity-60 text-right">{t.note || 'No notes from the master tailor'}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Total & Footer */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between p-8 border-2" style={{ borderColor: C.maroon }}>
            <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1">Commission Value</p>
                <p className="font-display text-4xl" style={{ color: C.maroon }}>
                    {order.totalPrice ? `₹${order.totalPrice.toLocaleString()}` : 'Valuation Pending'}
                </p>
            </div>
            <div className="text-right mt-6 md:mt-0">
                <p className="font-sans text-[10px] uppercase tracking-widest opacity-60">
                    Established Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: C.gold }}>
                    Handcrafted in Central India
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center group">
      <span className="font-sans text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
      <div className="flex-1 border-b border-dotted mx-4 opacity-10" />
      <span className="font-sans text-xs font-semibold" style={{ color: C.ink }}>
        {value || 'Default'}
      </span>
    </div>
  );
}