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
import { FiArrowLeft, FiArrowRight, FiCheck, FiShoppingBag, FiMapPin, FiClock, FiScissors } from 'react-icons/fi';

const C = {
  maroon: '#6B0F1A', maroonL: '#8B1A28', maroonXL: '#A82030',
  gold: '#B5892E', goldL: '#D4AF37',
  ink: '#1A0800', inkL: '#3A2010', muted: '#7A6040',
  page: '#FAF3E4', pageD: '#F0E8D0', white: '#FFFDF7',
  border: '#D4BC94', borderL: '#EDE0C8', borderXL: '#F5EDD8',
};

const STEPS = [
  { label: 'Aesthetics', icon: '✦' },
  { label: 'Material',   icon: '◈' },
  { label: 'Proportions',icon: '⊞' },
  { label: 'Commission', icon: '◉' },
];

const Lbl = ({ t, c = C.maroon, s = 7.5 }) => (
  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize: s,
    letterSpacing: '0.5em', textTransform: 'uppercase', fontWeight: 700, color: c }}>
    {t}
  </span>
);

const GoldDivider = () => (
  <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0 24px' }}>
    <div style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${C.gold}60)` }}/>
    <svg width="14" height="14" viewBox="0 0 14 14">
      <polygon points="7,1 8.5,5.5 13,5.5 9.5,8.5 10.5,13 7,10 3.5,13 4.5,8.5 1,5.5 5.5,5.5" fill={C.gold} opacity="0.8"/>
    </svg>
    <div style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${C.gold}60)` }}/>
  </div>
);

function OptionGrid({ label, options=[], selected, onSelect }) {
  return (
    <div style={{ marginBottom:28 }}>
      <Lbl t={label} c={C.muted}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))', gap:8, marginTop:12 }}>
        {options.map(o => {
          const sel = selected === o;
          return (
            <motion.button key={o} onClick={() => onSelect(o)} whileTap={{ scale: 0.96 }}
              style={{ padding:'12px 8px', border:`1.5px solid ${sel ? C.maroon : C.borderL}`,
                background: sel ? C.maroon : C.white, cursor:'pointer',
                position:'relative', transition:'all .2s', borderRadius:1 }}>
              {sel && <div style={{position:'absolute',top:5,right:6}}><FiCheck size={9} color={C.goldL}/></div>}
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8.5, fontWeight:700,
                letterSpacing:'0.12em', textTransform:'uppercase',
                color: sel ? C.white : C.muted }}>{o}</span>
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
    <div style={{ background: f ? C.white : C.pageD, border:`1.5px solid ${f ? C.maroon : C.borderL}`,
      padding:'14px 16px', transition:'all .2s' }}>
      <Lbl t={label} c={C.muted}/>
      <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:6 }}>
        <input type="number" value={value} placeholder="—"
          onFocus={() => setF(true)} onBlur={() => setF(false)}
          onChange={e => onChange(e.target.value)}
          style={{ background:'none', border:'none', outline:'none', width:'100%',
            fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:C.ink, fontWeight:600 }}/>
        <span style={{ fontSize:10, color:C.muted, letterSpacing:'0.2em',
          fontFamily:"'Montserrat',sans-serif" }}>in</span>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'12px 0', borderBottom:`1px solid ${C.borderXL}` }}>
      <Lbl t={label} c={C.muted}/>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17,
        color:C.inkL, fontWeight:600, fontStyle:'italic', textAlign: 'right' }}>{value || '—'}</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { selectedProduct: product, loading, fabrics } = useSelector(s => s.catalog);
  const { showrooms } = useSelector(s => s.showrooms);
  const { customization } = useSelector(s => s.orders);
  const { token }  = useSelector(s => s.auth);

  const [step,  setStep]  = useState(0);
  const [modal, setModal] = useState(false);
  const [meas,  setMeas]  = useState({ chest:'', waist:'', length:'', shoulder:'' });
  const [placing, setPlacing] = useState(false); 

  useEffect(() => {
    dispatch(fetchProductDetail(id));
    dispatch(fetchFabrics());
    dispatch(fetchShowrooms());
    dispatch(resetCustomization());
    window.scrollTo(0,0);
  }, [id, dispatch]);

  const fabric = fabrics.find(f => f._id === customization.fabricId);
  const room   = showrooms.find(s => s._id === customization.showroomId);
  const total  = product
    ? (product.basePrice || 0) + ((fabric?.pricePerMeter || 0) * 2.5)
    : 0;

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
    if (step < 3) setStep(s => s + 1);
  };

  const place = async () => {
    if (!token) return navigate('/login');
    try {
      setPlacing(true);
      await createOrder({
        city:        room?.city || 'Indore',
        garmentType:  product.name,
        customization: {
          structure:   { sleeveType: customization.sleeve, fit: 'Bespoke' },
          frontDesign: { neckline: customization.neckline },
          backDesign:  { closure: customization.back },
        },
        fabric: {
          source:   'TAILOR24',
          fabricId: customization.fabricId,
        },
        measurements: {
          method: customization.showroomId ? 'SHOWROOM' : 'HOME',
          notes:  `Chest:${meas.chest},Waist:${meas.waist},Length:${meas.length},Shoulder:${meas.shoulder}`,
        },
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
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:C.page }}>
      <div style={{ textAlign:'center' }}>
        <InlineLoader color={C.maroon}/>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16,
          color:C.muted, marginTop:16, fontStyle:'italic' }}>Preparing your commission…</p>
      </div>
    </div>
  );

  const opts = product.customizationOptions || {};

  return (
    /* Added paddingTop: 90px to prevent navbar collision */
    <div style={{ background:C.page, minHeight:'100vh', paddingTop: '90px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Montserrat:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; }
        .pdp-wrap  { max-width:1140px; margin:0 auto; padding:0 clamp(16px,4vw,40px); }
        .pdp-grid  { display:grid; grid-template-columns:320px 1fr; gap:32px; align-items:start; }
        .pdp-left  { display:grid; grid-template-columns:1fr; gap:16px; align-items:start; }
        .pdp-sticky { position:sticky; top:110px; }
        .fab-grid  { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .meas-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:28px; }
        .room-btn  { text-align:left; cursor:pointer; transition:all .2s; width:100%; }
        .room-btn:hover { border-color:${C.goldL} !important; }
        @media(max-width:860px) {
          .pdp-grid { grid-template-columns:1fr; gap:24px; }
          .pdp-sticky { position:static; }
          .pdp-left { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width:600px) {
          .pdp-left { grid-template-columns:1fr; }
          .fab-grid { grid-template-columns:1fr; }
          .meas-grid { grid-template-columns:1fr; }
          .step-label { display:none; }
        }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background:C.maroon, borderBottom:`1px solid ${C.maroonXL}` }}>
        <div className="pdp-wrap" style={{ padding:'14px clamp(16px,4vw,40px)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
            <motion.button onClick={() => navigate(-1)} whileHover={{ x:-3 }}
              style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', color:'rgba(255,253,247,0.6)', fontFamily:"'Montserrat',sans-serif", fontSize:8, letterSpacing:'0.4em', textTransform:'uppercase', fontWeight:700 }}>
              <FiArrowLeft size={12}/> Back
            </motion.button>

            {/* Step bar */}
            <div style={{ flex:1, maxWidth:520, display:'flex', alignItems:'center' }}>
              {STEPS.map((s, i) => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', flex: i < 3 ? 1 : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <motion.div whileTap={{ scale:0.95 }}
                      onClick={() => i < step && setStep(i)}
                      style={{ width:30, height:30, borderRadius:'50%', flexShrink:0,
                        border:`1.5px solid ${i <= step ? C.goldL : 'rgba(255,255,255,0.2)'}`,
                        background: i < step ? C.goldL : i === step ? 'rgba(212,175,55,0.15)' : 'transparent',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        cursor: i < step ? 'pointer' : 'default', transition:'all .3s' }}>
                      {i < step
                        ? <FiCheck size={11} color={C.maroon}/>
                        : <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color: i === step ? C.goldL : 'rgba(255,255,255,0.3)', fontWeight:700 }}>{i+1}</span>}
                    </motion.div>
                    <span className="step-label" style={{ fontFamily:"'Montserrat',sans-serif", fontSize:7.5, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color: i === step ? C.goldL : i < step ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.25)', transition:'color .3s', whiteSpace:'nowrap' }}>{s.label}</span>
                  </div>
                  {i < 3 && <div style={{ flex:1, height:1, margin:'0 10px', background: i < step ? `${C.goldL}60` : 'rgba(255,255,255,0.1)' }}/>}
                </div>
              ))}
            </div>

            {/* Live price */}
            <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8, letterSpacing:'0.3em', color:'rgba(255,253,247,0.5)', textTransform:'uppercase' }}>Total</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.goldL, fontWeight:700 }}>
                ₹{Math.round(total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="pdp-wrap" style={{ padding:'clamp(24px,4vw,48px) clamp(16px,4vw,40px) 80px' }}>
        <div className="pdp-grid">

          {/* LEFT */}
          <div className="pdp-sticky">
            <div className="pdp-left">
              {/* Image */}
              <div style={{ background:C.white, border:`1px solid ${C.borderL}`, overflow:'hidden', position:'relative', boxShadow:`0 12px 40px ${C.ink}12` }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(to right,${C.maroon},${C.goldL},${C.maroon})`, zIndex:3 }}/>
                <div style={{ position:'absolute', top:12, left:12, background:C.maroon, padding:'4px 10px', zIndex:4 }}>
                  <Lbl t={product.category || 'Collection'} c="white" s={7}/>
                </div>
                <AnimatePresence mode="wait">
                  <motion.img key={product.image} initial={{ opacity:0, scale:1.03 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:0.8 }} src={product.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'} alt={product.name} style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block' }}/>
                </AnimatePresence>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'16px', background:'linear-gradient(to top,rgba(26,8,0,.7),transparent)' }}>
                  <div style={{ display:'flex', gap:5, justifyContent:'center' }}>
                    {STEPS.map((_,i) => (
                      <div key={i} style={{ height:2, borderRadius:1, width: i === step ? 24 : 8, background: i <= step ? C.goldL : 'rgba(255,255,255,0.25)', transition:'all .4s' }}/>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price + info */}
              <div>
                <div style={{ background:C.maroon, padding:'20px', marginBottom:12, boxShadow:`0 8px 24px ${C.maroon}30` }}>
                  <Lbl t="Your Commission" c={C.goldL}/>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,4vw,40px)', color:C.white, fontWeight:700, lineHeight:1, marginTop:8 }}>
                    ₹{Math.round(total).toLocaleString()}
                  </div>
                  <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8, color:'rgba(255,253,247,0.45)', marginTop:6, letterSpacing:'0.2em' }}>FABRIC + CRAFT INCLUDED</div>
                </div>
                {[{ic:FiScissors,l:'Bespoke Fit'},{ic:FiClock,l:'Get Tailor Online'},{ic:FiMapPin,l:'3 Showroom Locations'}].map(({ic:Icon,l}) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:C.white, border:`1px solid ${C.borderXL}`, marginBottom:6 }}>
                    <Icon size={10} color={C.maroon}/>
                    <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', color:C.muted, fontWeight:600 }}>{l}</span>
                  </div>
                ))}
                
                {/* Live choices summary */}
                {(customization.neckline || fabric) && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ marginTop:10, padding:'14px 16px', background:`${C.maroon}07`, border:`1px dashed ${C.gold}50` }}>
                    <Lbl t="Your Choices" c={C.gold}/>
                    <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
                      {customization.neckline && (
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <Lbl t="Neckline" c={C.muted}/>
                          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.maroon, fontStyle:'italic' }}>{customization.neckline}</span>
                        </div>
                      )}
                      {customization.sleeve && (
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <Lbl t="Sleeve" c={C.muted}/>
                          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.maroon, fontStyle:'italic' }}>{customization.sleeve}</span>
                        </div>
                      )}
                      {fabric && (
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <Lbl t="Fabric" c={C.muted}/>
                          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.maroon, fontStyle:'italic' }}>{fabric.name}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ background:C.white, border:`1px solid ${C.borderL}`, boxShadow:`0 4px 20px ${C.ink}06` }}>
            {/* Header */}
            <div style={{ padding:'clamp(24px,3vw,36px) clamp(20px,3vw,36px) 0', borderBottom:`1px solid ${C.borderXL}`, paddingBottom:'clamp(20px,3vw,28px)' }}>
              <AnimatePresence mode="wait">
                <motion.div key={`h${step}`} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }} transition={{ duration:.3 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                    <Lbl t={`Step ${step+1} of ${STEPS.length} · ${STEPS[step].label}`} c={C.maroon}/>
                    <div style={{ display:'flex', gap:4 }}>
                      {STEPS.map((_,i) => (
                        <div key={i} style={{ width: i === step ? 20 : 6, height:3, background: i < step ? C.gold : i === step ? C.maroon : C.borderL, borderRadius:2, transition:'all .3s' }}/>
                      ))}
                    </div>
                  </div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,3.5vw,40px)', color:C.ink, fontWeight:600, fontStyle:'italic', lineHeight:1.1, marginTop:8 }}>
                    {product.name}
                  </h2>
                </motion.div>
              </AnimatePresence>
              <GoldDivider/>
            </div>

            {/* Step content */}
            <div style={{ padding:'clamp(20px,3vw,32px) clamp(20px,3vw,36px)' }}>
              <AnimatePresence mode="wait">
                {/* STEP 0 */}
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:.3 }}>
                    <OptionGrid label="Neckline" options={opts.necklines || ['Round','V-Neck','Mandarin','Square','Halter','Sweetheart']} selected={customization.neckline} onSelect={v => dispatch(setCustomization({ neckline: v }))}/>
                    <OptionGrid label="Sleeve Style" options={opts.sleeves || ['Full','3/4 Sleeve','Half','Sleeveless','Bell','Cap']} selected={customization.sleeve} onSelect={v => dispatch(setCustomization({ sleeve: v }))}/>
                    <OptionGrid label="Back Design" options={opts.backs || ['Closed','Open','Keyhole','Lace Panel','Zipper','Tie-Back']} selected={customization.back} onSelect={v => dispatch(setCustomization({ back: v }))}/>
                  </motion.div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:.3 }}>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.muted, fontStyle:'italic', marginBottom:20, lineHeight:1.6 }}>Select your preferred fabric — price adjusts accordingly.</p>
                    <div className="fab-grid">
                      {fabrics.map((f, i) => (
                        <motion.div key={f._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}>
                          <FabricCard fabric={f} index={i} selected={customization.fabricId === f._id} onSelect={() => dispatch(setCustomization({ fabricId: f._id }))}/>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:.3 }}>
                    <div style={{ background:`${C.maroon}08`, border:`1px solid ${C.gold}50`, padding:'16px 20px', marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                      <div>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.maroon, fontStyle:'italic', marginBottom:4 }}>Prefer a home fitting?</div>
                        <Lbl t="Our tailor visits you — free of charge" c={C.muted}/>
                      </div>
                      <button onClick={() => setModal(true)} style={{ padding:'10px 20px', border:`1.5px solid ${C.maroon}`, background:'none', cursor:'pointer', fontFamily:"'Montserrat',sans-serif", fontSize:8, letterSpacing:'0.35em', textTransform:'uppercase', fontWeight:700, color:C.maroon, whiteSpace:'nowrap' }}>Book Visit</button>
                    </div>

                    <div style={{ marginBottom:8 }}><Lbl t="Enter Measurements" c={C.maroon}/></div>
                    <div className="meas-grid">
                      {[['chest','Chest'],['waist','Waist'],['length','Length'],['shoulder','Shoulder']].map(([k,l]) => (
                        <MField key={k} label={l} value={meas[k]} onChange={v => setMeas(p => ({ ...p, [k]: v }))}/>
                      ))}
                    </div>

                    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'8px 0 20px' }}>
                      <div style={{ flex:1, height:1, background:C.borderL }}/>
                      <Lbl t="or visit a showroom" c={C.muted}/>
                      <div style={{ flex:1, height:1, background:C.borderL }}/>
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {fallbackShowrooms.map(sr => {
                        const sel = customization.showroomId === sr._id;
                        return (
                          <button key={sr._id} className="room-btn" onClick={() => dispatch(setCustomization({ showroomId: sr._id }))}
                            style={{ padding:'14px 18px', border:`1.5px solid ${sel ? C.maroon : C.borderL}`, background: sel ? `${C.maroon}08` : C.white, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                              <div style={{ width:36, height:36, background: sel ? C.maroon : C.pageD, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .2s' }}>
                                <FiMapPin size={14} color={sel ? C.white : C.muted}/>
                              </div>
                              <div style={{ textAlign:'left' }}>
                                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color: sel ? C.maroon : C.ink, fontWeight:600, lineHeight:1 }}>{sr.name}</div>
                                <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8, color:C.muted, letterSpacing:'0.2em', marginTop:4 }}>{sr.city}{sr.hours ? ` · ${sr.hours}` : ''}</div>
                              </div>
                            </div>
                            {sel && <div style={{ width:22, height:22, borderRadius:'50%', background:C.maroon, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><FiCheck size={11} color="white"/></div>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity:0, scale:.98 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.35 }}>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.muted, fontStyle:'italic', marginBottom:20, lineHeight:1.6 }}>Review every detail before we begin crafting your garment.</p>
                    <Lbl t="Commission Summary" c={C.maroon}/>
                    <div style={{ marginTop:8 }}>
                      <ReviewRow label="Garment"     value={product.name}/>
                      <ReviewRow label="Neckline"    value={customization.neckline}/>
                      <ReviewRow label="Sleeve"      value={customization.sleeve}/>
                      <ReviewRow label="Back Design" value={customization.back}/>
                      <ReviewRow label="Fabric"      value={fabric?.name}/>
                      <ReviewRow label="Fitting"     value={customization.showroomId ? (room?.name || 'Showroom') : 'Home / Manual'}/>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:20, paddingTop:18, borderTop:`1px dashed ${C.border}` }}>
                      <Lbl t="Total Commission" s={9}/>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, color:C.maroon, fontWeight:700 }}>₹{Math.round(total).toLocaleString()}</span>
                    </div>
                    <div style={{ display:'flex', gap:20, flexWrap:'wrap', padding:'16px 0', borderTop:`1px solid ${C.borderXL}`, marginTop:16 }}>
                      {['✦ Bespoke Fit','✦ 24h Delivery','✦ Master Karigars'].map(t => (
                        <span key={t} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8, letterSpacing:'0.3em', color:C.gold, fontWeight:700 }}>{t}</span>
                      ))}
                    </div>
                    <motion.button onClick={place} disabled={placing} whileTap={{ scale: 0.98 }}
                      style={{ width:'100%', marginTop:8, padding:'17px', background:`linear-gradient(135deg,${C.maroon},${C.maroonXL})`, border:'none', cursor: placing ? 'not-allowed' : 'pointer', fontFamily:"'Montserrat',sans-serif", fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', fontWeight:700, color:'white', opacity: placing ? 0.6 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:12, boxShadow:`0 8px 28px ${C.maroon}35`, transition:'opacity .25s' }}>
                      <FiShoppingBag size={14}/> {placing ? 'Filing Commission…' : 'Confirm & File Commission'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nav buttons */}
              {step < 3 && (
                <div style={{ display:'flex', gap:10, marginTop:32, paddingTop:24, borderTop:`1px solid ${C.borderXL}` }}>
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                      style={{ padding:'13px 22px', border:`1.5px solid ${C.borderL}`, background:'none', cursor:'pointer', fontFamily:"'Montserrat',sans-serif", fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', fontWeight:700, color:C.muted, display:'flex', alignItems:'center', gap:8 }}>
                      <FiArrowLeft size={10}/> Back
                    </button>
                  )}
                  <button onClick={next}
                    style={{ flex: 1, padding: '13px 22px', background: C.maroon, border: 'none', cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    Continue <FiArrowRight size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {modal && <ConsultationModal onClose={() => setModal(false)} />}
    </div>
  );
}