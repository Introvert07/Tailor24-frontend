import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../services/ProfileService';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiCamera, FiX, FiCheck, FiPackage, FiClock, FiChevronDown } from 'react-icons/fi';

const C = { page:'#FAF3E4', parchment:'#F4E8D0', white:'#FFFDF5', maroon:'#6B0F1A', maroonL:'#8B1A28', gold:'#B5892E', goldL:'#D4A017', ink:'#1A0800', muted:'#7A6040', border:'#D4BC94', borderL:'#EDE0C8', teal:'#1A5C5C', green:'#1A5C2A', red:'#7A0A0A' };

const STATUS_META = { ORDER_CREATED:{c:C.goldL,l:'Created'}, ORDER_VERIFIED:{c:C.teal,l:'Verified'}, FABRIC_PICKUP_SCHEDULED:{c:'#7A4A1A',l:'Pickup Scheduled'}, FABRIC_RECEIVED:{c:'#7A4A1A',l:'Fabric Received'}, STITCHING_IN_PROGRESS:{c:C.maroon,l:'Stitching'}, TRIAL_READY:{c:'#2A4A7A',l:'Trial Ready'}, QC_PASSED:{c:C.teal,l:'QC Passed'}, READY_FOR_PICKUP:{c:C.goldL,l:'Ready'}, OUT_FOR_DELIVERY:{c:'#4A2A7A',l:'Delivering'}, COMPLETED:{c:C.green,l:'Completed'}, CANCELLED:{c:C.red,l:'Cancelled'} };

const SIZES = ['S','M','L','XL','XXL','Custom'];
const MFIELDS = [['chest','Chest'],['waist','Waist'],['shoulder','Shoulder'],['length','Length'],['sleeves','Sleeves'],['neck','Neck'],['hip','Hip']];

const Lbl = ({t,c=C.muted,s=7.5}) => <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:s,letterSpacing:'0.45em',textTransform:'uppercase',fontWeight:700,color:c}}>{t}</span>;

const InfoRow = ({icon:Icon, label, value}) => (
  <div style={{marginBottom:14}}>
    <Lbl t={label}/>
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:C.parchment,border:`1px solid ${C.borderL}`,marginTop:6}}>
      <Icon size={13} color={C.teal}/><span style={{fontFamily:"'Montserrat',sans-serif",fontSize:13,color:C.ink}}>{value||'—'}</span>
    </div>
  </div>
);

const Field = ({label, value, onChange, disabled, placeholder=''}) => {
  const [f,setF] = useState(false);
  return (
    <div style={{marginBottom:18}}>
      <Lbl t={label} c={f?C.maroon:C.muted}/>
      <div style={{borderBottom:`1.5px solid ${f?C.maroon:C.border}`,paddingBottom:7,marginTop:6,transition:'border-color .2s'}}>
        <input value={value||''} onChange={onChange} disabled={disabled} placeholder={placeholder}
          onFocus={()=>setF(true)} onBlur={()=>setF(false)}
          style={{width:'100%',background:'transparent',border:'none',outline:'none',fontFamily:"'Montserrat',sans-serif",fontSize:13,color:C.ink,opacity:disabled?.55:1,cursor:disabled?'not-allowed':'text'}}/>
      </div>
    </div>
  );
};

const MInput = ({label, value, onChange, unit, disabled}) => {
  const [f,setF] = useState(false);
  return (
    <div>
      <Lbl t={label} c={f?C.maroon:C.muted}/>
      <div style={{display:'flex',alignItems:'center',border:`1px solid ${f?C.maroon:C.border}`,background:disabled?C.parchment:C.white,marginTop:5,transition:'border-color .2s'}}>
        <input type="number" value={value||''} onChange={onChange} disabled={disabled} placeholder="—"
          onFocus={()=>setF(true)} onBlur={()=>setF(false)}
          style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:"'Montserrat',sans-serif",fontSize:13,color:C.ink,padding:'8px 10px',opacity:disabled?.5:1}}/>
        <span style={{padding:'0 9px',fontSize:8,color:C.muted,borderLeft:`1px solid ${C.border}`,fontFamily:"'Montserrat',sans-serif"}}>{unit}</span>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { user: authUser } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editMeas, setEditMeas] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [form, setForm] = useState({name:'',city:''});
  const [meas, setMeas] = useState({unit:'inches',size:'M',v:{chest:'',waist:'',shoulder:'',length:'',sleeves:'',neck:'',hip:''}});
  const [imgPreview, setImgPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(()=>{ if (!authUser) navigate('/login',{replace:true}); },[authUser,navigate]);

  const load = useCallback(async()=>{
    try {
      setLoading(true);
      const [p,o] = await Promise.all([profileService.getMe(), profileService.getMyOrders().catch(()=>({data:[]}))]);
      const d = p.data;
      setProfile(d);
      setForm({name:d.name||'',city:d.city||''});
      const sm = d.savedMeasurements;
      setMeas({unit:sm?.unit||'inches',size:sm?.standardSize||'M',v:{chest:sm?.values?.chest||'',waist:sm?.values?.waist||'',shoulder:sm?.values?.shoulder||'',length:sm?.values?.length||'',sleeves:sm?.values?.sleeves||'',neck:sm?.values?.neck||'',hip:sm?.values?.hip||''}});
      setOrders(o.data||[]);
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{ load(); },[load]);

  const saveProfile = async()=>{
    try { setSaving(true); const fd=new FormData(); if(form.name) fd.append('name',form.name); if(form.city) fd.append('city',form.city); if(imgFile) fd.append('profileImage',imgFile); await profileService.updateProfile(fd); toast.success('Profile updated'); setEditMode(false); setImgFile(null); load(); }
    catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const saveMeas = async()=>{
    try { setSaving(true); const fd=new FormData(); fd.append('unit',meas.unit); fd.append('standardSize',meas.size); Object.entries(meas.v).forEach(([k,v])=>{ if(v!=='') fd.append(k,v); }); await profileService.updateProfile(fd); toast.success('Measurements saved'); setEditMeas(false); load(); }
    catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const avatarSrc = imgPreview||(profile?.profileImage&&profile.profileImage!=='default-avatar.png'?`${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:5000'}${profile.profileImage}`:null);
  const active = orders.filter(o=>!['COMPLETED','CANCELLED'].includes(o.status));
  const done = orders.filter(o=>o.status==='COMPLETED');

  if (loading) return (
<div style={{minHeight:'100vh',background:C.page,fontFamily:"'Montserrat',sans-serif", marginTop: '80px'}}>
        <div style={{textAlign:'center'}}><div style={{width:40,height:40,border:`2px solid ${C.maroon}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto'}}/>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.muted,marginTop:16}}>Loading…</p></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const Btn = ({onClick,children,variant='outline',color=C.maroon,disabled=false}) => (
    <button onClick={onClick} disabled={disabled}
      style={{display:'flex',alignItems:'center',gap:5,padding:'6px 14px',cursor:'pointer',fontFamily:"'Montserrat',sans-serif",fontSize:8,letterSpacing:'0.25em',textTransform:'uppercase',fontWeight:700,transition:'all .2s',opacity:disabled?.6:1,
        border:variant==='solid'?'none':`1px solid ${C.border}`,
        background:variant==='solid'?color:'transparent',
        color:variant==='solid'?'white':color}}>
      {children}
    </button>
  );

  return (
    <div style={{minHeight:'100vh',background:C.page,fontFamily:"'Montserrat',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        .p-wrap{max-width:1100px;margin:0 auto;padding:0 clamp(16px,4vw,32px);}
        .p-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
        .m-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        @media(max-width:760px){.p-grid{grid-template-columns:1fr;}.m-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:440px){.m-grid{grid-template-columns:1fr 1fr;}.hero-stats{display:none!important;}}
        .ord-row:hover{background:${C.parchment}!important;}
        .tab-btn:hover{color:${C.maroon}!important;}
      `}</style>

      {/* ── HERO ── */}
      <div style={{background:`linear-gradient(135deg,${C.maroon} 0%,#4A0A10 100%)`,padding:'clamp(28px,5vw,48px) 0 clamp(20px,3vw,32px)',position:'relative',overflow:'hidden',borderBottom:`3px solid ${C.goldL}`}}>
        <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:`radial-gradient(${C.goldL} 1px,transparent 1px)`,backgroundSize:'28px 28px'}}/>
        <div style={{position:'absolute',right:-10,bottom:-20,fontFamily:"'Cormorant Garamond',serif",fontSize:'12vw',color:'rgba(255,255,255,0.03)',fontStyle:'italic',lineHeight:1,userSelect:'none'}}>Profile</div>
        <div className="p-wrap" style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:clamp(16),flexWrap:'wrap',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:20}}>
              {/* Avatar */}
              <div style={{position:'relative',flexShrink:0}}>
                <div style={{width:80,height:80,borderRadius:'50%',border:`2.5px solid ${C.goldL}60`,overflow:'hidden',background:`linear-gradient(135deg,${C.maroon},${C.maroonL})`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {avatarSrc?<img src={avatarSrc} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,color:C.goldL,fontWeight:700}}>{profile?.name?.charAt(0).toUpperCase()}</span>}
                </div>
                {editMode&&<motion.button initial={{scale:0}} animate={{scale:1}} onClick={()=>fileRef.current?.click()} style={{position:'absolute',bottom:0,right:0,width:24,height:24,borderRadius:'50%',background:C.goldL,border:`2px solid ${C.white}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><FiCamera size={11} color={C.maroon}/></motion.button>}
                <input ref={fileRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;if(f.size>2*1024*1024)return toast.error('Max 2 MB');setImgFile(f);setImgPreview(URL.createObjectURL(f));}} style={{display:'none'}}/>
              </div>
              <div>
                <Lbl t="Tailor24 Patron" c={`${C.goldL}70`} s={7}/>
                <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(22px,4vw,38px)',color:'white',fontWeight:700,lineHeight:1.1,marginTop:4}}>{profile?.name}</h1>
                <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6,flexWrap:'wrap'}}>
                  {profile?.city&&<span style={{fontSize:10,color:'rgba(255,255,255,0.5)',display:'flex',alignItems:'center',gap:4}}><FiMapPin size={9}/>{profile.city}</span>}
                  <span style={{padding:'2px 9px',background:'rgba(255,255,255,0.1)',fontFamily:"'Montserrat',sans-serif",fontSize:7.5,letterSpacing:'0.3em',color:C.goldL,fontWeight:700,textTransform:'uppercase'}}>{profile?.role}</span>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="hero-stats" style={{display:'flex',gap:10}}>
              {[{l:'Orders',v:orders.length},{l:'Active',v:active.length},{l:'Done',v:done.length}].map((s,i)=>(
                <div key={i} style={{padding:'12px 18px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',textAlign:'center'}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:i===0?C.goldL:i===1?'#7DD3F5':'#86EFAC',fontWeight:700,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:7,letterSpacing:'0.3em',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',marginTop:4}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:20}}>
        <div className="p-wrap" style={{display:'flex',overflowX:'auto'}}>
          {[{id:'profile',l:'Profile',ic:FiUser},{id:'measurements',l:'Measurements',ic:FiEdit3},{id:'orders',l:`Orders (${orders.length})`,ic:FiPackage}].map(t=>(
            <button key={t.id} className="tab-btn" onClick={()=>setTab(t.id)}
              style={{display:'flex',alignItems:'center',gap:7,padding:'13px 18px',background:'transparent',border:'none',borderBottom:`2.5px solid ${tab===t.id?C.maroon:'transparent'}`,marginBottom:-1,cursor:'pointer',fontFamily:"'Montserrat',sans-serif",fontSize:8.5,letterSpacing:'0.3em',fontWeight:700,textTransform:'uppercase',color:tab===t.id?C.maroon:C.muted,transition:'color .2s',whiteSpace:'nowrap'}}>
              <t.ic size={12}/>{t.l}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-wrap" style={{padding:'clamp(20px,4vw,36px) clamp(16px,4vw,32px) 64px'}}>
        <AnimatePresence mode="wait">

          {/* PROFILE TAB */}
          {tab==='profile'&&(
            <motion.div key="p" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
              <div className="p-grid">
                {/* Editable */}
                <div style={{background:C.white,border:`1px solid ${C.border}`}}>
                  <div style={{background:C.parchment,padding:'13px 18px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}><FiUser size={13} color={C.maroon}/><Lbl t="Personal Details" c={C.maroon}/></div>
                    <div style={{display:'flex',gap:8}}>
                      {editMode?<><Btn onClick={()=>{setEditMode(false);setImgPreview(null);setImgFile(null);}}><FiX size={9}/>Cancel</Btn><Btn onClick={saveProfile} variant="solid" disabled={saving}><FiSave size={9}/>{saving?'Saving…':'Save'}</Btn></>:<Btn onClick={()=>setEditMode(true)}><FiEdit3 size={9}/>Edit</Btn>}
                    </div>
                  </div>
                  <div style={{padding:'20px'}}>
                    <AnimatePresence>
                      {editMode&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden',marginBottom:16}}>
                        <div onClick={()=>fileRef.current?.click()} style={{border:`1.5px dashed ${C.border}`,padding:'14px',cursor:'pointer',textAlign:'center',background:C.parchment}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.maroon} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                          {imgPreview?<img src={imgPreview} alt="" style={{height:52,width:52,objectFit:'cover',borderRadius:'50%',margin:'0 auto',display:'block'}}/>:<FiCamera size={20} color={C.muted} style={{display:'block',margin:'0 auto'}}/>}
                          <div style={{fontSize:8.5,letterSpacing:'0.2em',color:C.muted,textTransform:'uppercase',marginTop:6}}>{imgPreview?'Change Photo':'Upload Photo'}</div>
                        </div>
                      </motion.div>}
                    </AnimatePresence>
                    <Field label="Full Name" value={editMode?form.name:profile?.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} disabled={!editMode}/>
                    <Field label="City" value={editMode?form.city:profile?.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} disabled={!editMode} placeholder="e.g. Bhopal"/>
                  </div>
                </div>
                {/* Account info */}
                <div style={{background:C.white,border:`1px solid ${C.border}`}}>
                  <div style={{background:C.parchment,padding:'13px 18px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:8}}><FiMail size={13} color={C.teal}/><Lbl t="Account Info" c={C.teal}/></div>
                  <div style={{padding:'20px'}}>
                    <InfoRow icon={FiMail} label="Email Address" value={profile?.email}/>
                    <InfoRow icon={FiPhone} label="Phone" value={profile?.phone}/>
                    <InfoRow icon={FiClock} label="Member Since" value={profile?.createdAt?new Date(profile.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}):null}/>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MEASUREMENTS TAB */}
          {tab==='measurements'&&(
            <motion.div key="m" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
              <div style={{background:C.white,border:`1px solid ${C.border}`}}>
                <div style={{background:C.parchment,padding:'13px 18px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}><FiEdit3 size={13} color={C.gold}/><Lbl t="Saved Measurements" c={C.gold}/></div>
                  <div style={{display:'flex',gap:8}}>
                    {editMeas?<><Btn onClick={()=>setEditMeas(false)}><FiX size={9}/>Cancel</Btn><Btn onClick={saveMeas} variant="solid" color={C.gold} disabled={saving}><FiSave size={9}/>{saving?'Saving…':'Save'}</Btn></>:<Btn onClick={()=>setEditMeas(true)} color={C.gold}><FiEdit3 size={9}/>Edit</Btn>}
                  </div>
                </div>
                <div style={{padding:'20px'}}>
                  {/* Unit + Size */}
                  <div style={{display:'flex',gap:14,marginBottom:22,flexWrap:'wrap'}}>
                    <div style={{minWidth:130}}>
                      <Lbl t="Unit"/><div style={{display:'flex',border:`1px solid ${C.border}`,overflow:'hidden',marginTop:8}}>
                        {['inches','cm'].map(u=><button key={u} onClick={()=>editMeas&&setMeas(p=>({...p,unit:u}))} style={{flex:1,padding:'9px',border:'none',cursor:editMeas?'pointer':'default',background:meas.unit===u?C.maroon:'transparent',fontFamily:"'Montserrat',sans-serif",fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',color:meas.unit===u?'white':C.muted,fontWeight:700,transition:'all .2s'}}>{u}</button>)}
                      </div>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <Lbl t="Standard Size"/><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
                        {SIZES.map(sz=><button key={sz} onClick={()=>editMeas&&setMeas(p=>({...p,size:sz}))} style={{padding:'7px 12px',border:`1.5px solid ${meas.size===sz?C.maroon:C.border}`,cursor:editMeas?'pointer':'default',background:meas.size===sz?`${C.maroon}12`:'transparent',fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:'0.15em',color:meas.size===sz?C.maroon:C.muted,fontWeight:700,transition:'all .2s'}}>{sz}</button>)}
                      </div>
                    </div>
                  </div>
                  <div style={{height:1,background:`linear-gradient(to right,transparent,${C.gold}40,transparent)`,marginBottom:20}}/>
                  <div className="m-grid">
                    {MFIELDS.map(([k,l])=><MInput key={k} label={l} value={meas.v[k]} unit={meas.unit} disabled={!editMeas} onChange={e=>setMeas(p=>({...p,v:{...p.v,[k]:e.target.value}}))}/>)}
                  </div>
                  <div style={{marginTop:16}}>
                    <Lbl t="Notes"/><textarea value={meas.v.additionalNotes||''} disabled={!editMeas} onChange={e=>setMeas(p=>({...p,v:{...p.v,additionalNotes:e.target.value}}))} placeholder="Special fitting notes…" rows={3} style={{width:'100%',background:editMeas?C.white:C.parchment,border:`1px solid ${C.border}`,padding:'10px 12px',fontFamily:"'Montserrat',sans-serif",fontSize:12,color:C.ink,resize:'vertical',outline:'none',marginTop:6,opacity:!editMeas?.6:1}}/>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {tab==='orders'&&(
            <motion.div key="o" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
              {orders.length===0?(
                <div style={{textAlign:'center',padding:'60px 20px'}}>
                  <FiPackage size={40} color={C.border} style={{margin:'0 auto',display:'block'}}/>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.muted,marginTop:16}}>No orders yet</p>
                  <p style={{fontSize:9,letterSpacing:'0.2em',color:C.border,textTransform:'uppercase',marginTop:6}}>Your commissions will appear here</p>
                </div>
              ):(
                orders.map((o,i)=>{
                  const m=STATUS_META[o.status]||STATUS_META.ORDER_CREATED;
                  const exp=expandedOrder===o._id;
                  return (
                    <motion.div key={o._id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.04}} style={{background:C.white,border:`1px solid ${C.border}`,marginBottom:10,overflow:'hidden'}}>
                      <div className="ord-row" onClick={()=>setExpandedOrder(exp?null:o._id)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,padding:'14px 18px',cursor:'pointer',transition:'background .15s'}}>
                        <div style={{display:'flex',alignItems:'center',gap:14}}>
                          <div style={{width:36,height:36,background:`${C.maroon}10`,border:`1px solid ${C.maroon}25`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <FiPackage size={15} color={C.maroon}/>
                          </div>
                          <div>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.maroon,fontWeight:700}}>#{o._id?.slice(-6).toUpperCase()}</div>
                            <div style={{fontSize:8.5,color:C.muted,marginTop:2}}>{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})} · {o.items?.length||0} item{o.items?.length!==1?'s':''}</div>
                          </div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',background:`${m.c}15`,fontFamily:"'Montserrat',sans-serif",fontSize:7.5,letterSpacing:'0.2em',color:m.c,fontWeight:700,textTransform:'uppercase'}}>{m.l}</span>
                          <motion.div animate={{rotate:exp?180:0}} transition={{duration:.25}}><FiChevronDown size={15} color={C.muted}/></motion.div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {exp&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25}} style={{overflow:'hidden'}}>
                          <div style={{padding:'16px 18px',borderTop:`1px solid ${C.borderL}`,background:C.parchment}}>
                            {o.timeline?.length>0&&<div style={{marginBottom:14}}>
                              <Lbl t="Timeline"/>
                              <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:10}}>
                                {[...o.timeline].reverse().map((t,ti)=>(
                                  <div key={ti} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                                    <div style={{width:7,height:7,borderRadius:'50%',background:ti===0?C.maroon:C.border,flexShrink:0,marginTop:4}}/>
                                    <div><div style={{fontSize:10,color:C.ink,fontWeight:600}}>{t.note}</div><div style={{fontSize:8,color:C.muted,marginTop:2}}>{new Date(t.timestamp||t.createdAt||Date.now()).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div></div>
                                  </div>
                                ))}
                              </div>
                            </div>}
                            {o.items?.length>0&&<div>
                              <Lbl t="Items Ordered"/>
                              {o.items.map((item,ii)=>(
                                <div key={ii} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',background:C.white,border:`1px solid ${C.border}`,marginTop:6}}>
                                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.ink,fontWeight:600}}>{item.name||item.productName||`Item ${ii+1}`}</span>
                                  {item.quantity&&<span style={{fontSize:8.5,color:C.muted}}>Qty: {item.quantity}</span>}
                                </div>
                              ))}
                            </div>}
                          </div>
                        </motion.div>}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function clamp(n){return n;}