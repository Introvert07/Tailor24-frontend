import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductDetail, fetchFabrics } from '../store/slices/catalogSlice';
import { fetchShowrooms } from '../store/slices/showroomSlice';
import { placeOrder, setCustomization, resetCustomization } from '../store/slices/orderSlice';
import FabricCard from '../components/catalog/FabricCard';
import ConsultationModal from '../components/ui/ConsultationModal';
import { InlineLoader } from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiArrowRight, FiCheck, FiShoppingBag } from 'react-icons/fi';

const C = { maroon:'#6B0F1A', maroonL:'#8B1A28', gold:'#B5892E', goldL:'#F0C040',
  ink:'#1A0800', muted:'#7A6040', page:'#FAF3E4', white:'#FFFDF7',
  border:'#D4BC94', borderL:'#EDE0C8' };

const STEPS = ['Aesthetics','Material','Proportions','Commission'];

const Label = ({ txt, color=C.maroon }) => (
  <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:7.5, letterSpacing:'0.5em',
    textTransform:'uppercase', fontWeight:700, color }}>{txt}</span>
);

const Rule = () => (
  <div style={{ display:'flex', alignItems:'center', gap:10, margin:'8px 0 20px' }}>
    <div style={{ width:24, height:1.5, background:C.gold }}/>
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke={C.gold} strokeWidth="0.8" fill="none" opacity=".5"/>
      <circle cx="12" cy="12" r="5"  stroke={C.maroon} strokeWidth="0.8" fill="none" opacity=".5"/>
      <circle cx="12" cy="12" r="2"  fill={C.gold} opacity=".9"/>
    </svg>
    <div style={{ flex:1, height:1, background:`linear-gradient(to right,${C.gold}40,transparent)` }}/>
  </div>
);

function OptionGrid({ label, options=[], selected, onSelect }) {
  return (
    <div style={{ marginBottom:26 }}>
      <Label txt={label} color={C.muted}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:10 }}>
        {options.map(o => {
          const sel = selected===o;
          return (
            <motion.button key={o} onClick={()=>onSelect(o)} whileTap={{scale:.97}}
              style={{ padding:'10px 6px', border:`1.5px solid ${sel?C.maroon:C.borderL}`,
                background:sel?C.maroon:C.white, cursor:'pointer', position:'relative',
                transition:'border-color .2s, background .2s' }}>
              {sel && <FiCheck size={9} color={C.gold} style={{position:'absolute',top:4,right:5}}/>}
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8, fontWeight:700,
                letterSpacing:'0.15em', textTransform:'uppercase', color:sel?'white':C.muted }}>
                {o}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function MField({ label, value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ borderBottom:`1.5px solid ${focus?C.maroon:C.borderL}`, paddingBottom:8, transition:'border .2s' }}>
      <Label txt={label} color={C.muted}/>
      <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:4 }}>
        <input type="number" value={value} placeholder="—"
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          onChange={e=>onChange(e.target.value)}
          style={{ background:'none', border:'none', outline:'none', width:'100%',
            fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:C.ink, fontWeight:600 }}/>
        <span style={{ fontSize:9, color:C.muted, letterSpacing:'0.2em' }}>in</span>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'9px 0', borderBottom:`1px solid ${C.borderL}` }}>
      <Label txt={label} color={C.muted}/>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16,
        color:C.maroon, fontWeight:600, fontStyle:'italic' }}>{value||'—'}</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading, fabrics } = useSelector(s => s.catalog);
  const { showrooms } = useSelector(s => s.showrooms);
  const { customization, placing } = useSelector(s => s.orders);
  const { token } = useSelector(s => s.auth);
  const [step, setStep] = useState(0);
  const [modal, setModal] = useState(false);
  const [meas, setMeas] = useState({ chest:'', waist:'', length:'', shoulder:'' });

  useEffect(()=>{ dispatch(fetchProductDetail(id)); dispatch(fetchFabrics()); dispatch(fetchShowrooms()); dispatch(resetCustomization()); },[id,dispatch]);

  if (loading||!product) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.page}}>
      <InlineLoader color={C.maroon}/>
    </div>
  );

  const opts   = product.customizationOptions||{};
  const fabric = fabrics.find(f=>f._id===customization.fabricId);
  const room   = showrooms.find(s=>s._id===customization.showroomId);
  const total  = (product.basePrice||0)+((fabric?.pricePerMeter||0)*2.5);

  const next = () => {
    if (step===0&&(!customization.neckline||!customization.sleeve||!customization.back)) return toast.error('Complete all aesthetic details');
    if (step===1&&!customization.fabricId) return toast.error('Select a fabric');
    if (step===2&&!customization.showroomId&&(!meas.chest||!meas.waist)) return toast.error('Add measurements or select a showroom');
    if (step<3) setStep(s=>s+1);
  };

  const place = async () => {
    if (!token) return navigate('/login');
    const r = await dispatch(placeOrder({
      city:room?.city||'Indore', garmentType:product.name,
      customization:{ structure:{sleeveType:customization.sleeve,fit:'Bespoke'}, frontDesign:{neckline:customization.neckline}, backDesign:{closure:customization.back} },
      fabric:{ source:'TAILOR24', fabricId:customization.fabricId },
      measurements:{ method:customization.showroomId?'SHOWROOM':'HOME', notes:`Chest:${meas.chest},Waist:${meas.waist}` },
      totalPrice:Math.round(total),
    }));
    if (r.meta.requestStatus==='fulfilled') { toast.success('Commission filed!'); navigate('/orders'); }
  };

  return (
    <div style={{ background:C.page, minHeight:'100vh', padding:'44px 0 80px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
      `}</style>

      <div style={{ maxWidth:1080, margin:'0 auto', padding:'0 28px' }}>

        {/* Back */}
        <motion.button onClick={()=>navigate(-1)} whileHover={{x:-3}}
          style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none',
            cursor:'pointer', marginBottom:32, color:C.muted, fontFamily:"'Montserrat',sans-serif",
            fontSize:8, letterSpacing:'0.4em', textTransform:'uppercase', fontWeight:700 }}>
          <FiArrowLeft size={11}/> Back to Catalog
        </motion.button>

        {/* Step bar */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:44 }}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i<3?1:'auto' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:26, height:26, borderRadius:'50%', flexShrink:0,
                  border:`1.5px solid ${i<=step?C.maroon:C.borderL}`,
                  background:i<step?C.maroon:i===step?`${C.maroon}10`:'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {i<step
                    ? <FiCheck size={11} color="white"/>
                    : <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,color:i===step?C.maroon:C.border,fontWeight:700}}>{i+1}</span>
                  }
                </div>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:7.5, fontWeight:700,
                  letterSpacing:'0.3em', textTransform:'uppercase',
                  color:i===step?C.maroon:i<step?C.gold:C.border }}>{s}</span>
              </div>
              {i<3 && <div style={{ flex:1, height:1, background:i<step?`${C.gold}80`:C.borderL, margin:'0 16px' }}/>}
            </div>
          ))}
        </div>

        {/* Two-column */}
        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:36, alignItems:'start' }}>

          {/* LEFT */}
          <div style={{ position:'sticky', top:28 }}>
            <div style={{ background:C.white, border:`1px solid ${C.borderL}`,
              boxShadow:`0 8px 32px ${C.ink}0A`, overflow:'hidden', position:'relative' }}>
              <svg viewBox="0 0 300 70" style={{position:'absolute',top:0,left:0,width:'100%',zIndex:2,pointerEvents:'none'}}>
                <path d="M0 70 L0 35 Q150 -14 300 35 L300 70Z" fill={`${C.gold}09`}/>
                <path d="M0 70 L0 38 Q150 -8 300 38" stroke={C.gold} strokeWidth="0.7" fill="none" opacity=".45"/>
              </svg>
              <div style={{position:'absolute',top:10,left:10,background:C.maroon,padding:'3px 8px',zIndex:3}}>
                <Label txt={product.category||'Collection'} color="white"/>
              </div>
              <AnimatePresence mode="wait">
                <motion.img key={product.image}
                  initial={{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                  transition={{duration:.8}}
                  src={product.image||'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop'}
                  alt={product.name}
                  style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block' }}/>
              </AnimatePresence>
            </div>

            {/* Price */}
            <div style={{ marginTop:14, background:C.white, borderLeft:`3px solid ${C.maroon}`,
              border:`1px solid ${C.borderL}`, borderLeft:`3px solid ${C.maroon}`, padding:'18px 22px' }}>
              <div style={{ marginBottom:3 }}><Label txt="Current Valuation" color={C.gold}/></div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40,
                color:C.maroon, fontWeight:700, lineHeight:1 }}>
                ₹{Math.round(total).toLocaleString()}
              </div>
              <div style={{ fontSize:9, color:C.muted, marginTop:5, letterSpacing:'0.1em' }}>
                Craftsmanship & fabric included
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ background:C.white, border:`1px solid ${C.borderL}`,
            padding:'32px 36px', boxShadow:`0 4px 16px ${C.ink}06` }}>

            <AnimatePresence mode="wait">
              <motion.div key={`h${step}`} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                exit={{opacity:0,y:8}} transition={{duration:.35}}>
                <Label txt={`Step ${step+1} · ${STEPS[step]}`}/>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(24px,2.8vw,38px)',
                  color:C.ink, fontWeight:600, fontStyle:'italic', lineHeight:1.1, marginTop:4 }}>
                  {product.name}
                </h2>
                <Rule/>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">

              {step===0 && (
                <motion.div key="s0" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-14}} transition={{duration:.35}}>
                  <OptionGrid label="Neckline"    options={opts.necklines||['Round','V-Neck','Mandarin','Square','Halter']}  selected={customization.neckline} onSelect={v=>dispatch(setCustomization({neckline:v}))}/>
                  <OptionGrid label="Sleeve"      options={opts.sleeves||['Full','3/4 Sleeve','Half','Sleeveless','Bell']}   selected={customization.sleeve}   onSelect={v=>dispatch(setCustomization({sleeve:v}))}/>
                  <OptionGrid label="Back Design" options={opts.backs||['Closed','Open','Keyhole','Lace Panel','Zipper']}    selected={customization.back}     onSelect={v=>dispatch(setCustomization({back:v}))}/>
                </motion.div>
              )}

              {step===1 && (
                <motion.div key="s1" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-14}} transition={{duration:.35}}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    {fabrics.map((f,i)=>(
                      <motion.div key={f._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}>
                        <FabricCard fabric={f} index={i} selected={customization.fabricId===f._id}
                          onSelect={()=>dispatch(setCustomization({fabricId:f._id}))}/>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step===2 && (
                <motion.div key="s2" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-14}} transition={{duration:.35}}>
                  <div style={{ background:`${C.maroon}07`, border:`1px dashed ${C.gold}60`,
                    padding:'16px 20px', marginBottom:28, display:'flex',
                    justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                    <div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:C.maroon, fontStyle:'italic', marginBottom:3 }}>
                        Prefer a professional fitting?
                      </div>
                      <Label txt="Our master tailor visits your home" color={C.muted}/>
                    </div>
                    <button onClick={()=>setModal(true)} style={{ padding:'8px 18px', border:`1.5px solid ${C.maroon}`,
                      background:'none', cursor:'pointer', fontFamily:"'Montserrat',sans-serif",
                      fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', fontWeight:700, color:C.maroon }}>
                      Book Now
                    </button>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 28px', marginBottom:28 }}>
                    {[['chest','Chest'],['waist','Waist'],['length','Length'],['shoulder','Shoulder']].map(([k,l])=>(
                      <MField key={k} label={l} value={meas[k]} onChange={v=>setMeas(p=>({...p,[k]:v}))}/>
                    ))}
                  </div>
                  <div style={{ marginBottom:10 }}><Label txt="Or visit a showroom" color={C.muted}/></div>
                  <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                    {(showrooms.length?showrooms:[{_id:'a',name:'Indore Flagship',city:'Indore'},{_id:'b',name:'Bhopal Atelier',city:'Bhopal'},{_id:'c',name:'Vidisha Studio',city:'Vidisha'}]).map(sr=>{
                      const sel=customization.showroomId===sr._id;
                      return (
                        <button key={sr._id} onClick={()=>dispatch(setCustomization({showroomId:sr._id}))}
                          style={{ textAlign:'left', padding:'11px 16px', cursor:'pointer',
                            border:`1.5px solid ${sel?C.maroon:C.borderL}`, background:sel?`${C.maroon}07`:C.white,
                            display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all .2s' }}>
                          <div>
                            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:sel?C.maroon:C.ink, fontWeight:600 }}>{sr.name}</div>
                            <div style={{ fontSize:10, color:C.muted }}>{sr.city}</div>
                          </div>
                          {sel&&<FiCheck size={13} color={C.maroon}/>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step===3 && (
                <motion.div key="s3" initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} transition={{duration:.35}}>
                  <ReviewRow label="Garment"  value={product.name}/>
                  <ReviewRow label="Neckline" value={customization.neckline}/>
                  <ReviewRow label="Sleeve"   value={customization.sleeve}/>
                  <ReviewRow label="Back"     value={customization.back}/>
                  <ReviewRow label="Fabric"   value={fabric?.name}/>
                  <ReviewRow label="Fitting"  value={customization.showroomId?room?.name||'Showroom':'Home / Manual'}/>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline',
                    marginTop:20, paddingTop:16, borderTop:`1px dashed ${C.border}` }}>
                    <Label txt="Total Commission"/>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, color:C.maroon, fontWeight:700 }}>
                      ₹{Math.round(total).toLocaleString()}
                    </span>
                  </div>
                  <motion.button onClick={place} disabled={placing} whileTap={{scale:.98}}
                    style={{ width:'100%', marginTop:22, padding:'15px', background:C.maroon, border:'none',
                      cursor:'pointer', fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:'0.4em',
                      textTransform:'uppercase', fontWeight:700, color:'white', opacity:placing?.6:1,
                      display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                      boxShadow:`0 8px 24px ${C.maroon}28`, transition:'background .25s' }}>
                    <FiShoppingBag size={13}/>
                    {placing?'Filing Commission…':'Confirm & Place Order'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {step<3 && (
              <div style={{ display:'flex', gap:9, marginTop:32, paddingTop:22, borderTop:`1px solid ${C.borderL}` }}>
                {step>0&&(
                  <button onClick={()=>setStep(s=>s-1)}
                    style={{ padding:'12px 22px', border:`1.5px solid ${C.borderL}`, background:'none',
                      cursor:'pointer', fontFamily:"'Montserrat',sans-serif", fontSize:8,
                      letterSpacing:'0.3em', textTransform:'uppercase', fontWeight:700, color:C.muted,
                      display:'flex', alignItems:'center', gap:7 }}>
                    <FiArrowLeft size={10}/> Back
                  </button>
                )}
                <motion.button onClick={next} whileTap={{scale:.97}}
                  style={{ flex:1, padding:'12px', background:C.maroon, border:'none', cursor:'pointer',
                    fontFamily:"'Montserrat',sans-serif", fontSize:8.5, letterSpacing:'0.35em',
                    textTransform:'uppercase', fontWeight:700, color:'white',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    boxShadow:`0 6px 18px ${C.maroon}22` }}>
                  {STEPS[step+1]} <FiArrowRight size={11}/>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConsultationModal isOpen={modal} onClose={()=>setModal(false)}/>
    </div>
  );
}