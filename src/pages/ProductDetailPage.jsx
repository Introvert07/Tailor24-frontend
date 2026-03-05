import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductDetail, fetchFabrics } from '../store/slices/catalogSlice';
import { fetchShowrooms } from '../store/slices/showroomSlice';
import { placeOrder, setCustomization, resetCustomization } from '../store/slices/orderSlice';
import FabricCard from '../components/catalog/FabricCard';
import { InlineLoader } from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiArrowRight, FiCheck, FiShoppingBag, FiInfo } from 'react-icons/fi';

/* ─── TAILOR24 THEME CONFIG ──────────────────────────────── */
const C = {
  page:      "#FBF4E8",
  parchment: "#F4E8D0",
  maroon:    "#6B0F1A",
  gold:      "#B5892E",
  ink:       "#1A0800",
  border:    "#D4BC94",
};

const STEPS = ['Aesthetics', 'Material', 'Proportions', 'Finalize'];

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, loading, fabrics } = useSelector(s => s.catalog);
  const { showrooms } = useSelector(s => s.showrooms);
  const { customization, placing } = useSelector(s => s.orders);
  const { token } = useSelector(s => s.auth);

  const [step, setStep] = useState(0);
  const [measurements, setMeasurements] = useState({
    chest: '', waist: '', hip: '', length: '', shoulder: '',
  });

  useEffect(() => {
    dispatch(fetchProductDetail(id));
    dispatch(fetchFabrics());
    dispatch(fetchShowrooms());
    dispatch(resetCustomization());
  }, [id, dispatch]);

  if (loading || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF4E8]">
      <InlineLoader color={C.maroon} />
    </div>
  );

  const opts = product.customizationOptions || {};
  const selectedFabric = fabrics.find(f => f._id === customization.fabricId);
  const selectedShowroom = showrooms.find(s => s._id === customization.showroomId);
  const fabricCost = (selectedFabric?.pricePerMeter || 0) * 2.5;
  const totalPrice = (product.basePrice || 0) + fabricCost;

  const handleNext = () => {
    if (step === 0 && (!customization.neckline || !customization.sleeve || !customization.back)) 
      return toast.error('Please define all aesthetic details');
    if (step === 1 && !customization.fabricId) 
      return toast.error('Please select a material');
    if (step === 2 && (!measurements.chest || !measurements.waist || !measurements.length))
      return toast.error('Key proportions are required for a perfect fit');
    
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    if (!token) return navigate('/login');
    const orderPayload = {
      city: selectedShowroom?.city || 'Indore',
      garmentType: product.name,
      customization: {
        structure: { sleeveType: customization.sleeve, fit: 'Bespoke' },
        frontDesign: { neckline: customization.neckline },
        backDesign: { closure: customization.back },
        sleeveDesign: { style: customization.sleeve },
      },
      fabric: { source: 'TAILOR24', fabricId: customization.fabricId },
      measurements: {
        method: customization.showroomId ? 'SHOWROOM' : 'HOME',
        fabricHandling: 'WALK_IN',
        notes: `Chest: ${measurements.chest}, Waist: ${measurements.waist}, Length: ${measurements.length}`,
      },
      totalPrice: Math.round(totalPrice),
    };

    const result = await dispatch(placeOrder(orderPayload));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Your commission has been filed');
      navigate('/orders');
    }
  };

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: C.page }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Navigation Header */}
        <div className="pt-32 pb-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Catalog
          </button>
          <div className="hidden md:flex items-center gap-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className={`font-sans text-[10px] uppercase tracking-widest ${i === step ? 'text-maroon-700 font-bold' : 'opacity-30'}`}>
                  {i + 1}. {s}
                </span>
                {i < STEPS.length - 1 && <div className="w-4 h-[1px] bg-gold-600/20" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* ── LEFT: VISUAL PANEL ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="relative group overflow-hidden border border-gold-500/10 shadow-2xl bg-white">
                <motion.img
                  key={product.image}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Price Reveal Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-8 p-8 border-l-4 shadow-sm bg-white" 
                style={{ borderColor: C.maroon }}
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: C.gold }}>Current Valuation</p>
                <div className="flex items-baseline gap-4">
                    <h2 className="font-display text-5xl" style={{ color: C.ink }}>₹{Math.round(totalPrice).toLocaleString()}</h2>
                    <span className="font-sans text-[10px] uppercase opacity-40 tracking-tighter">Incl. Craftsmanship & Fabric</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT: CREATION SUITE ── */}
          <div className="lg:col-span-7">
            <header className="mb-12">
              <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-maroon-700">{product.category} Collection</span>
              <h1 className="font-display text-6xl mt-2 italic" style={{ color: C.ink }}>{product.name}</h1>
              <p className="font-sans text-sm mt-4 opacity-60 leading-relaxed max-w-lg">
                Hand-tailored to your exact proportions in our Central Indian atelier. 
                Configure your masterwork below.
              </p>
            </header>

            <div className="bg-white/40 backdrop-blur-sm border border-gold-500/10 p-8 md:p-12 min-h-[500px]">
              <AnimatePresence mode="wait">
                {/* STEP 0: AESTHETICS */}
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <OptionGrid label="The Neckline" options={opts.necklines} selected={customization.neckline} onSelect={v => dispatch(setCustomization({ neckline: v }))} />
                    <OptionGrid label="Sleeve Architecture" options={opts.sleeves} selected={customization.sleeve} onSelect={v => dispatch(setCustomization({ sleeve: v }))} />
                    <OptionGrid label="Reverse Profile" options={opts.backs} selected={customization.back} onSelect={v => dispatch(setCustomization({ back: v }))} />
                  </motion.div>
                )}

                {/* STEP 1: MATERIAL */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="font-display text-2xl italic mb-8" style={{ color: C.maroon }}>Select Your Fabric</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {fabrics.map((f, i) => (
                        <FabricCard key={f._id} fabric={f} index={i} selected={customization.fabricId === f._id} onSelect={f => dispatch(setCustomization({ fabricId: f._id }))} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PROPORTIONS */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="font-display text-2xl italic mb-8" style={{ color: C.maroon }}>Define Your Silhouette</h3>
                    <div className="grid grid-cols-2 gap-8 mb-12">
                      {[['chest', 'Chest'], ['waist', 'Waist'], ['length', 'Garment Length'], ['shoulder', 'Shoulder Width']].map(([key, label]) => (
                        <div key={key} className="border-b border-gold-500/20 pb-2">
                          <label className="font-sans text-[10px] uppercase tracking-widest opacity-40 block mb-2">{label} (in)</label>
                          <input type="number" value={measurements[key]} onChange={e => setMeasurements(p => ({ ...p, [key]: e.target.value }))} className="bg-transparent w-full font-display text-2xl outline-none placeholder:opacity-10" placeholder="00" />
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="font-sans text-[10px] uppercase tracking-widest opacity-40 mb-4">Showroom Measurement (Optional)</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {showrooms.map(sr => (
                            <button key={sr._id} onClick={() => dispatch(setCustomization({ showroomId: sr._id }))} className={`text-left p-4 border transition-all ${customization.showroomId === sr._id ? 'border-maroon-700 bg-maroon-700/5' : 'border-gold-500/10'}`}>
                                <p className="font-sans text-xs font-bold uppercase">{sr.name}</p>
                                <p className="font-sans text-[10px] opacity-40">{sr.city}</p>
                            </button>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: FINALIZE */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-20 h-20 bg-maroon-700/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiShoppingBag size={24} className="text-maroon-700" />
                    </div>
                    <h3 className="font-display text-4xl italic mb-4">Ready for the Atelier</h3>
                    <div className="max-w-sm mx-auto space-y-3 mb-10 text-left bg-white p-6 border">
                        <ReviewItem label="Design" value={`${customization.neckline} Neck`} />
                        <ReviewItem label="Material" value={selectedFabric?.name} />
                        <ReviewItem label="Showroom" value={selectedShowroom?.city || 'Home Delivery'} />
                        <div className="border-t border-dashed pt-3 mt-3 flex justify-between font-bold">
                            <span className="font-sans text-[10px] uppercase">Final Commission</span>
                            <span className="font-display text-xl">₹{Math.round(totalPrice).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onClick={handlePlaceOrder} disabled={placing} className="w-full py-5 bg-[#6B0F1A] text-white font-sans text-xs uppercase tracking-[0.4em] hover:bg-black transition-colors disabled:opacity-50">
                        {placing ? 'Filing Commission...' : 'Confirm Order'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              {step < 3 && (
                <div className="mt-16 flex gap-4 pt-8 border-t border-gold-500/10">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} className="px-8 py-4 border border-maroon-700 text-maroon-700 font-sans text-[10px] uppercase tracking-widest hover:bg-maroon-700/5 transition-all">Back</button>
                  )}
                  <button onClick={handleNext} className="flex-1 py-4 bg-[#6B0F1A] text-white font-sans text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-black transition-all">
                    Advance to {STEPS[step+1]} <FiArrowRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── HELPERS ────────────────────────────────────────────────── */

const OptionGrid = ({ label, options = [], selected, onSelect }) => (
  <div>
    <p className="font-sans text-[10px] uppercase tracking-[0.3em] opacity-40 mb-4">{label}</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map(opt => (
        <button key={opt} onClick={() => onSelect(opt)} className={`py-3 px-4 text-left border transition-all ${selected === opt ? 'border-maroon-700 bg-maroon-700 text-white shadow-lg' : 'border-gold-500/20 hover:border-maroon-700/40 text-black/60'}`}>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">{opt}</span>
        </button>
      ))}
    </div>
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
    <span className="opacity-40 font-sans">{label}</span>
    <span className="font-bold font-sans text-maroon-700">{value || 'Not Specified'}</span>
  </div>
);