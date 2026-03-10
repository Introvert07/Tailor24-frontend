import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductDetail, fetchFabrics } from '../store/slices/catalogSlice';
import { fetchShowrooms } from '../store/slices/showroomSlice';
import { setCustomization, resetCustomization } from '../store/slices/orderSlice';
import { createOrder } from '../services/orderService'; 
import FabricCard from '../components/catalog/FabricCard';
import ConsultationModal from '../components/ui/ConsultationModal';
import { InlineLoader } from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiArrowRight, FiCheck, FiShoppingBag, FiMapPin, FiClock, FiScissors, FiInfo, FiPhone, FiUser } from 'react-icons/fi';
import { safeImg } from '../utils/imgUrl';

const C = {
  maroon: '#6B0F1A', maroonL: '#8B1A28', maroonXL: '#A82030',
  gold: '#B5892E', goldL: '#D4AF37',
  ink: '#1A0800', inkL: '#3A2010', muted: '#7A6040',
  page: '#FAF3E4', pageD: '#F0E8D0', white: '#FFFDF7',
  border: '#D4BC94', borderL: '#EDE0C8', borderXL: '#F5EDD8',
};

const STEPS = [
  { label: 'Aesthetics',   icon: '✦' },
  { label: 'Material',     icon: '◈' },
  { label: 'Proportions', icon: '⊞' },
  { label: 'Address',      icon: '◎' },
  { label: 'Commission',   icon: '◉' },
];

const Lbl = ({ t, c = C.maroon, s = 7.5 }) => (
  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: s,
    letterSpacing: '0.5em', textTransform: 'uppercase', fontWeight: 700, color: c }}>
    {t}
  </span>
);

const GoldDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 24px' }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}60)` }}/>
    <svg width="14" height="14" viewBox="0 0 14 14">
      <polygon points="7,1 8.5,5.5 13,5.5 9.5,8.5 10.5,13 7,10 3.5,13 4.5,8.5 1,5.5 5.5,5.5" fill={C.gold} opacity="0.8"/>
    </svg>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.gold}60)` }}/>
  </div>
);

function OptionGrid({ label, options = [], selected, onSelect }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <Lbl t={label} c={C.muted}/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8, marginTop: 12 }}>
        {options.map(o => {
          const sel = selected === o;
          return (
            <motion.button key={o} onClick={() => onSelect(o)} whileTap={{ scale: 0.96 }}
              style={{ padding: '12px 8px', border: `1.5px solid ${sel ? C.maroon : C.borderL}`,
                background: sel ? C.maroon : C.white, cursor: 'pointer',
                position: 'relative', transition: 'all .2s', borderRadius: 1 }}>
              {sel && <div style={{ position: 'absolute', top: 5, right: 6 }}><FiCheck size={9} color={C.goldL}/></div>}
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8.5, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: sel ? C.white : C.muted }}>{o}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function MField({ label, value, onChange }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ background: f ? C.white : C.pageD, border: `1.5px solid ${f ? C.maroon : C.borderL}`,
      padding: '14px 16px', transition: 'all .2s' }}>
      <Lbl t={label} c={C.muted}/>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
        <input type="number" value={value} placeholder="—"
          onFocus={() => setF(true)} onBlur={() => setF(false)}
          onChange={e => onChange(e.target.value)}
          style={{ background: 'none', border: 'none', outline: 'none', width: '100%',
            fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: C.ink, fontWeight: 600 }}/>
        <span style={{ fontSize: 10, color: C.muted, letterSpacing: '0.2em', fontFamily: "'Montserrat', sans-serif" }}>in</span>
      </div>
    </div>
  );
}

function AField({ label, value, onChange, placeholder = '', type = 'text', required = false, icon: Icon }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ background: f ? C.white : C.pageD,
      border: `1.5px solid ${f ? C.maroon : C.borderL}`,
      padding: '14px 16px', transition: 'all .2s', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {Icon && <Icon size={10} color={C.muted}/>}
          <Lbl t={label} c={C.muted}/>
        </div>
        {required && <span style={{ fontSize: 9, color: C.maroon,
          fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.1em' }}>REQUIRED</span>}
      </div>
      <input type={type} value={value} placeholder={placeholder}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        onChange={e => onChange(e.target.value)}
        style={{ background: 'none', border: 'none', outline: 'none', width: '100%',
          fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.ink,
          fontWeight: 500, marginTop: 6, padding: 0 }}
      />
    </div>
  );
}

function ReviewRow({ label, value, icon: Icon }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: `1px solid ${C.borderXL}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {Icon && <Icon size={10} color={C.muted}/>}
        <Lbl t={label} c={C.muted}/>
      </div>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17,
        color: C.inkL, fontWeight: 600, fontStyle: 'italic', textAlign: 'right', maxWidth: '60%' }}>
        {value || '—'}
      </span>
    </div>
  );
}

// ─── NAVBAR_HEIGHT: adjust this value to match your actual navbar height ───
const NAVBAR_HEIGHT = 64; // px — change to match your navbar (e.g. 72, 80)
const PROGRESS_BAR_HEIGHT = 58; // px — the maroon step progress bar height
const TOTAL_OFFSET = NAVBAR_HEIGHT + PROGRESS_BAR_HEIGHT;

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, loading, fabrics } = useSelector(s => s.catalog);
  const { showrooms } = useSelector(s => s.showrooms);
  const { customization } = useSelector(s => s.orders);
  const { token } = useSelector(s => s.auth);

  const [step, setStep] = useState(0);
  const [modal, setModal] = useState(false);
  const [meas, setMeas] = useState({ chest: '', waist: '', length: '', shoulder: '' });
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    street: '', landmark: '', pincode: '', state: 'Madhya Pradesh',
  });

  const [phone, setPhone] = useState('');

  useEffect(() => {
    dispatch(fetchProductDetail(id));
    dispatch(fetchFabrics());
    dispatch(fetchShowrooms());
    dispatch(resetCustomization());
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  const fabric = fabrics.find(f => f._id === customization.fabricId);
  const room   = showrooms.find(s => s._id === customization.showroomId);
  const total  = product ? (product.basePrice || 0) + ((fabric?.pricePerMeter || 0) * 2.5) : 0;

  const fallbackShowrooms = showrooms.length ? showrooms : [
    { _id: 'a', name: 'Indore Flagship', city: 'Indore', hours: 'Mon–Sat · 10am–8pm' },
    { _id: 'b', name: 'Bhopal Atelier',  city: 'Bhopal', hours: 'Mon–Sat · 10am–8pm' },
    { _id: 'c', name: 'Vidisha Studio',  city: 'Vidisha', hours: 'Tue–Sun · 11am–7pm' },
  ];

  const next = () => {
    if (step === 0 && (!customization.neckline || !customization.sleeve || !customization.back))
      return toast.error('Complete all aesthetic details');
    if (step === 1 && !customization.fabricId)
      return toast.error('Select a fabric');
    if (step === 2 && !customization.showroomId && (!meas.chest || !meas.waist))
      return toast.error('Add measurements or select a showroom');
    if (step === 3) {
      if (!phone.trim())                           return toast.error('Please enter a contact number');
      if (!/^\d{10}$/.test(phone.trim()))          return toast.error('Mobile number must be 10 digits');
      if (!address.street.trim())                 return toast.error('Please enter your street address');
      if (!address.pincode.trim())                return toast.error('Please enter your pincode');
      if (!/^\d{6}$/.test(address.pincode.trim())) return toast.error('Pincode must be 6 digits');
    }
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const place = async () => {
    if (!token) { toast.error('Authentication required'); return navigate('/login'); }
    try {
      setPlacing(true);
      await createOrder({
        city: room?.city || 'Indore',
        garmentType: product.name,
        customization: {
          structure: { sleeveType: customization.sleeve, fit: 'Bespoke' },
          frontDesign: { neckline: customization.neckline },
          backDesign:  { closure: customization.back },
        },
        fabric: { source: 'TAILOR24', fabricId: customization.fabricId },
        measurements: {
          method: customization.showroomId ? 'SHOWROOM' : 'HOME',
          notes: `Chest:${meas.chest},Waist:${meas.waist},Length:${meas.length},Shoulder:${meas.shoulder}`,
        },
        address: {
          street:   address.street.trim(),
          landmark: address.landmark.trim(),
          pincode:  address.pincode.trim(),
          state:    address.state,
        },
        phone: phone.trim(),
        totalPrice: Math.round(total),
      });
      toast.success('Commission filed! Redirecting to orders…');
      navigate('/orders');
    } catch (err) {
      toast.error(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading || !product) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.page }}>
      <div style={{ textAlign: 'center' }}>
        <InlineLoader color={C.maroon}/>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: C.muted, marginTop: 16, fontStyle: 'italic' }}>
          Preparing your commission…
        </p>
      </div>
    </div>
  );

  const opts = product.customizationOptions || {};

  return (
    // ✅ FIX 1: paddingTop accounts for navbar + progress bar so content never hides under them
    <div style={{ background: C.page, minHeight: '100vh', paddingTop: `${TOTAL_OFFSET}px` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Montserrat:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        .pdp-wrap { max-width: 1140px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px); }
        .pdp-grid { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: start; }
        .pdp-left { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }
        /* ✅ FIX 2: sticky top = TOTAL_OFFSET so the card sticks below both fixed bars */
        .pdp-sticky { position: sticky; top: ${TOTAL_OFFSET + 16}px; }
        .fab-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .meas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
        .room-btn  { text-align: left; cursor: pointer; transition: all .2s; width: 100%; }
        .room-btn:hover { border-color: ${C.goldL} !important; }
        @media(max-width: 860px) {
          .pdp-grid { grid-template-columns: 1fr; gap: 24px; }
          .pdp-sticky { position: static; }
          .pdp-left { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 600px) {
          .pdp-left { grid-template-columns: 1fr; }
          .fab-grid  { grid-template-columns: 1fr; }
          .meas-grid { grid-template-columns: 1fr; }
          .step-label { display: none; }
        }
      `}</style>

      {/* ✅ FIX 3: Progress bar sits at top: NAVBAR_HEIGHT so it goes BELOW the navbar, not on top of it */}
      <div style={{
        background: C.maroon,
        borderBottom: `1px solid ${C.maroonXL}`,
        position: 'fixed',
        top: NAVBAR_HEIGHT,   // ← key change: was 0, now sits below navbar
        left: 0,
        right: 0,
        zIndex: 90,           // ← lower than navbar (navbar should be z-index: 100+)
      }}>
        <div className="pdp-wrap" style={{ padding: '14px clamp(16px, 4vw, 40px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <motion.button onClick={() => navigate(-1)} whileHover={{ x: -3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,253,247,0.6)', fontFamily: "'Montserrat', sans-serif", fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 700 }}>
              <FiArrowLeft size={12}/> Back
            </motion.button>

            <div style={{ flex: 1, maxWidth: 640, display: 'flex', alignItems: 'center' }}>
              {STEPS.map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.div whileTap={{ scale: 0.95 }} onClick={() => i < step && setStep(i)}
                      style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        border: `1.5px solid ${i <= step ? C.goldL : 'rgba(255,255,255,0.25)'}`,
                        background: i < step ? C.goldL : i === step ? 'rgba(212,175,55,0.15)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: i < step ? 'pointer' : 'default', transition: 'all .3s' }}>
                      {i < step
                        ? <FiCheck size={11} color={C.maroon}/>
                        : <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: i === step ? C.goldL : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{i + 1}</span>}
                    </motion.div>
                    <span className="step-label" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: i === step ? C.goldL : i < step ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.25)', transition: 'color .3s', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, margin: '0 10px', background: i < step ? `${C.goldL}60` : 'rgba(255,255,255,0.1)' }}/>}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,253,247,0.5)', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.goldL, fontWeight: 700 }}>
                ₹{Math.round(total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pdp-wrap" style={{ padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px) 80px' }}>
        <div className="pdp-grid">

          {/* LEFT: IMAGE + PRICE + CONSULTATION */}
          <div className="pdp-sticky">
            <div className="pdp-left">
              <div style={{ background: C.white, border: `1px solid ${C.borderL}`, overflow: 'hidden', position: 'relative', boxShadow: `0 12px 40px ${C.ink}12` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${C.maroon}, ${C.goldL}, ${C.maroon})`, zIndex: 3 }}/>
                <div style={{ position: 'absolute', top: 12, left: 12, background: C.maroon, padding: '4px 10px', zIndex: 4 }}>
                  <Lbl t={product.category || 'Collection'} c="white" s={7}/>
                </div>
                <AnimatePresence mode="wait">
                  <motion.img key={product.image} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
src={safeImg(product.image, 'men')}
  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'; }}
  alt={product.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}/>
                </AnimatePresence>
              </div>

              <div>
                <div style={{ background: C.maroon, padding: '20px', marginBottom: 12, boxShadow: `0 8px 24px ${C.maroon}30` }}>
                  <Lbl t="Your Commission" c={C.goldL}/>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 40px)', color: C.white, fontWeight: 700, lineHeight: 1, marginTop: 8 }}>
                    ₹{Math.round(total).toLocaleString()}
                  </div>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setModal(true)}
                  style={{ background: C.white, border: `2px solid ${C.goldL}`, padding: '16px', marginBottom: 12, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                    <FiUser size={14} color={C.maroon}/>
                    <Lbl t="Expert Assistance" c={C.maroon} s={8}/>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: C.ink, fontStyle: 'italic', lineHeight: 1.4 }}>
                    Want home measurement? Our experts will visit your doorstep.
                  </p>
                  <div style={{ marginTop: 10, fontSize: 9, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1em', color: C.gold, textTransform: 'uppercase' }}>
                    Book Free Consultation
                  </div>
                </motion.div>

                {[{ ic: FiScissors, l: 'Bespoke Fit' }, { ic: FiClock, l: 'Get Tailor Online' }, { ic: FiMapPin, l: '3 Showroom Locations' }].map(({ ic: Icon, l }) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: C.white, border: `1px solid ${C.borderXL}`, marginBottom: 6 }}>
                    <Icon size={10} color={C.maroon}/>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.muted, fontWeight: 600 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: STEPS */}
          <div style={{ background: C.white, border: `1px solid ${C.borderL}`, boxShadow: `0 4px 20px ${C.ink}06` }}>
            <div style={{ padding: 'clamp(24px, 3vw, 36px) clamp(20px, 3vw, 36px) 0', borderBottom: `1px solid ${C.borderXL}`, paddingBottom: 'clamp(20px, 3vw, 28px)' }}>
              <AnimatePresence mode="wait">
                <motion.div key={`h${step}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: .3 }}>
                  <Lbl t={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step].label}`} c={C.maroon}/>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px, 3.5vw, 40px)', color: C.ink, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.1, marginTop: 8 }}>
                    {product.name}
                  </h2>
                </motion.div>
              </AnimatePresence>
              <GoldDivider/>
            </div>

            <div style={{ padding: 'clamp(20px, 3vw, 32px) clamp(20px, 3vw, 36px)' }}>
              <AnimatePresence mode="wait">

                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <OptionGrid label="Neckline" options={opts.necklines} selected={customization.neckline} onSelect={v => dispatch(setCustomization({ neckline: v }))}/>
                    <OptionGrid label="Sleeve Style" options={opts.sleeves} selected={customization.sleeve} onSelect={v => dispatch(setCustomization({ sleeve: v }))}/>
                    <OptionGrid label="Back Design" options={opts.backs} selected={customization.back} onSelect={v => dispatch(setCustomization({ back: v }))}/>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <div className="fab-grid">
                      {fabrics.map((f, i) => (
                        <FabricCard key={f._id} fabric={f} index={i} selected={customization.fabricId === f._id} onSelect={() => dispatch(setCustomization({ fabricId: f._id }))}/>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <div className="meas-grid">
                      {[['chest','Chest'],['waist','Waist'],['length','Length'],['shoulder','Shoulder']].map(([k,l]) => (
                        <MField key={k} label={l} value={meas[k]} onChange={v => setMeas(p => ({ ...p, [k]: v }))}/>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 20px' }}>
                      <div style={{ flex: 1, height: 1, background: C.borderL }}/>
                      <Lbl t="or visit a showroom" c={C.muted}/>
                      <div style={{ flex: 1, height: 1, background: C.borderL }}/>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {fallbackShowrooms.map(sr => (
                        <button key={sr._id} className="room-btn" onClick={() => dispatch(setCustomization({ showroomId: sr._id }))}
                          style={{ padding: '14px 18px', border: `1.5px solid ${customization.showroomId === sr._id ? C.maroon : C.borderL}`, background: customization.showroomId === sr._id ? `${C.maroon}08` : C.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <FiMapPin size={14} color={customization.showroomId === sr._id ? C.maroon : C.muted}/>
                            <div style={{ textAlign: 'left' }}>
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.ink, fontWeight: 600 }}>{sr.name}</div>
                              <div style={{ fontSize: 8, color: C.muted }}>{sr.city} · {sr.hours}</div>
                            </div>
                          </div>
                          {customization.showroomId === sr._id && <FiCheck size={14} color={C.maroon}/>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <AField label="Mobile Number" icon={FiPhone} value={phone} onChange={setPhone} placeholder="10-digit mobile number" type="tel" required/>
                    <AField label="Street Address" icon={FiMapPin} value={address.street} onChange={v => setAddress(p => ({ ...p, street: v }))} placeholder="House no., street, area…" required/>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <AField label="Pincode" value={address.pincode} onChange={v => setAddress(p => ({ ...p, pincode: v }))} placeholder="6-digit pincode" type="text" required/>
                      <div style={{ background: C.pageD, border: `1.5px solid ${C.borderL}`, padding: '14px 16px' }}>
                        <Lbl t="State" c={C.muted}/>
                        <select value={address.state} onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                          style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.ink, fontWeight: 500, marginTop: 6, cursor: 'pointer', padding: 0 }}>
                          {['Madhya Pradesh','Maharashtra','Rajasthan','Gujarat','Delhi','Uttar Pradesh','Karnataka','Tamil Nadu','Other'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}>
                    <ReviewRow label="Garment" value={product.name}/>
                    <ReviewRow label="Neckline" value={customization.neckline}/>
                    <ReviewRow label="Fabric" value={fabric?.name}/>
                    <ReviewRow label="Fitting" value={room?.name || 'Home Appointment'}/>
                    <ReviewRow label="Contact" icon={FiPhone} value={phone ? `+91 ${phone}` : '—'}/>
                    <ReviewRow label="Deliver To" icon={FiMapPin} value={address.street ? `${address.street} – ${address.pincode}` : '—'}/>

                    <motion.button onClick={place} disabled={placing}
                      style={{ width: '100%', marginTop: 24, padding: '17px', background: C.maroon, border: 'none', cursor: placing ? 'not-allowed' : 'pointer', color: 'white', fontWeight: 700, letterSpacing: '0.4em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      {placing ? <InlineLoader color="white"/> : <FiShoppingBag size={14}/>}
                      {placing ? 'FILING COMMISSION...' : 'CONFIRM & FILE COMMISSION'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {step < STEPS.length - 1 && (
                <div style={{ display: 'flex', gap: 10, marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.borderXL}` }}>
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} style={{ padding: '13px 22px', border: `1.5px solid ${C.borderL}`, background: 'none', cursor: 'pointer', color: C.muted }}>Back</button>
                  )}
                  <button onClick={next} style={{ flex: 1, padding: '13px 22px', background: C.maroon, border: 'none', cursor: 'pointer', color: C.white }}>Continue</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIX 4: Modal now has isOpen prop — matches AboutPage pattern exactly */}
      <ConsultationModal isOpen={modal} onClose={() => setModal(false)} />
    </div>
  );
}