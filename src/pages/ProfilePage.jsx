import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../services/ProfileService';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave,
  FiCamera, FiX, FiCheck, FiPackage, FiClock,
  FiTrendingUp, FiChevronDown, FiChevronRight,
} from 'react-icons/fi';

/* ─── PALETTE ─────────────────────────────────────────────── */
const C = {
  page:      '#FBF4E8',
  parchment: '#F4E8D0',
  sand:      '#EDD9B2',
  white:     '#FFFDF5',
  maroon:    '#6B0F1A',
  maroonL:   '#8B1A28',
  maroonD:   '#4A0A10',
  gold:      '#B5892E',
  goldB:     '#D4A017',
  goldL:     '#F2C84B',
  teal:      '#1A5C5C',
  ink:       '#1A0800',
  muted:     '#7A6040',
  border:    '#D4BC94',
  green:     '#1A5C2A',
  red:       '#7A0A0A',
};

/* ─── ORDER STATUS CONFIG ───────────────────────────────────── */
const STATUS_LABEL = {
  ORDER_CREATED:           'Created',
  ORDER_VERIFIED:          'Verified',
  FABRIC_PICKUP_SCHEDULED: 'Pickup Scheduled',
  FABRIC_RECEIVED:         'Fabric Received',
  STITCHING_IN_PROGRESS:   'Stitching',
  TRIAL_READY:             'Trial Ready',
  QC_PASSED:               'QC Passed',
  READY_FOR_PICKUP:        'Ready for Pickup',
  OUT_FOR_DELIVERY:        'Out for Delivery',
  COMPLETED:               'Completed',
  CANCELLED:               'Cancelled',
};

const STATUS_META = {
  ORDER_CREATED:           { color: C.goldB,  icon: FiClock      },
  ORDER_VERIFIED:          { color: C.teal,   icon: FiCheck      },
  FABRIC_PICKUP_SCHEDULED: { color:'#7A4A1A', icon: FiPackage    },
  FABRIC_RECEIVED:         { color:'#7A4A1A', icon: FiPackage    },
  STITCHING_IN_PROGRESS:   { color: C.maroon, icon: FiPackage    },
  TRIAL_READY:             { color:'#2A4A7A', icon: FiPackage    },
  QC_PASSED:               { color: C.teal,   icon: FiCheck      },
  READY_FOR_PICKUP:        { color: C.goldB,  icon: FiTrendingUp },
  OUT_FOR_DELIVERY:        { color:'#4A2A7A', icon: FiTrendingUp },
  COMPLETED:               { color: C.green,  icon: FiCheck      },
  CANCELLED:               { color: C.red,    icon: FiX          },
};

const MEASUREMENT_FIELDS = [
  { key:'chest',    label:'Chest'    },
  { key:'waist',    label:'Waist'    },
  { key:'shoulder', label:'Shoulder' },
  { key:'length',   label:'Length'   },
  { key:'sleeves',  label:'Sleeves'  },
  { key:'neck',     label:'Neck'     },
  { key:'hip',      label:'Hip'      },
];

const SIZE_OPTIONS = ['S','M','L','XL','XXL','Custom'];

/* ─── SVG ORNAMENTS ─────────────────────────────────────────── */
const ToranaStrip = () => (
  <div style={{position:'absolute',top:0,left:0,right:0,height:5,
    overflow:'hidden',pointerEvents:'none',zIndex:10}}>
    <svg width="100%" height="5" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tg-prof" x1="0%" x2="100%">
          <stop offset="0%"   stopColor={C.maroon} stopOpacity="0.6"/>
          <stop offset="50%"  stopColor={C.goldB}  stopOpacity="0.9"/>
          <stop offset="100%" stopColor={C.maroon} stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="5" fill="url(#tg-prof)"/>
      {Array.from({length:130}).map((_,i)=>(
        <circle key={i} cx={`${i*0.8+0.4}%`} cy="2.5" r="1"
          fill={i%5===2?C.maroon:C.goldB} opacity={i%5===2?0.75:0.28}/>
      ))}
    </svg>
  </div>
);

const Rangoli = ({s=40}) => (
  <svg width={s} height={s} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" stroke={C.gold} strokeWidth="0.7" fill="none" opacity="0.35"/>
    <circle cx="22" cy="22" r="13" stroke={C.gold} strokeWidth="0.5" fill="none" opacity="0.25"/>
    <circle cx="22" cy="22" r="7"  stroke={C.maroon} strokeWidth="0.6" fill="none" opacity="0.3"/>
    <circle cx="22" cy="22" r="3"  fill={C.gold} opacity="0.38"/>
    <circle cx="22" cy="22" r="1.4" fill={C.maroon} opacity="0.65"/>
    {Array.from({length:8}).map((_,i)=>{
      const a=(i/8)*Math.PI*2, px=22+19*Math.cos(a), py=22+19*Math.sin(a);
      return <ellipse key={i} cx={px} cy={py} rx="2" ry="3.5"
        transform={`rotate(${i*45+90},${px},${py})`}
        fill={`${C.maroon}40`} stroke={C.gold} strokeWidth="0.35"/>;
    })}
  </svg>
);

const Stitch = ({c1=C.maroon, c2=C.gold}) => (
  <div style={{height:10,overflow:'hidden',width:'100%'}}>
    <svg width="100%" height="10" preserveAspectRatio="none">
      {Array.from({length:55}).map((_,i)=>(
        <line key={i} x1={`${i*1.9}%`} y1="3" x2={`${i*1.9+0.9}%`} y2="3"
          stroke={c1} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      ))}
      {Array.from({length:38}).map((_,i)=>(
        <g key={i}>
          <line x1={`${i*2.7+0.5}%`} y1="7" x2={`${i*2.7+1.5}%`} y2="11"
            stroke={c2} strokeWidth="0.9" strokeLinecap="round" opacity="0.38"/>
          <line x1={`${i*2.7+1.5}%`} y1="7" x2={`${i*2.7+0.5}%`} y2="11"
            stroke={c2} strokeWidth="0.9" strokeLinecap="round" opacity="0.38"/>
        </g>
      ))}
    </svg>
  </div>
);

const ArchFrame = ({color=C.gold, height=32}) => (
  <div style={{position:'absolute',top:0,left:0,right:0,height,
    overflow:'hidden',pointerEvents:'none',zIndex:1}}>
    <svg width="100%" height={height} viewBox={`0 0 300 ${height}`} preserveAspectRatio="none">
      <path d={`M0 ${height} L0 ${height*0.55} Q150 ${-height*0.18} 300 ${height*0.55} L300 ${height}Z`}
        fill={`${color}10`}/>
      <path d={`M0 ${height} L0 ${height*0.62} Q150 ${height*0.05} 300 ${height*0.62}`}
        stroke={color} strokeWidth="0.7" fill="none" opacity="0.45"/>
      {[50,100,150,200,250].map((x,i)=>(
        <g key={i}>
          <line x1={x} y1={height*0.08} x2={x} y2={height*0.32}
            stroke={C.gold} strokeWidth="0.6" opacity="0.35"/>
          <ellipse cx={x} cy={height*0.38} rx="2.2" ry="3"
            fill={`${color}40`} stroke={C.gold} strokeWidth="0.35"/>
        </g>
      ))}
    </svg>
  </div>
);

/* ─── ORDER STATUS BADGE ─────────────────────────────────────── */
const Badge = ({status}) => {
  const m    = STATUS_META[status] || STATUS_META.ORDER_CREATED;
  const Icon = m.icon;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,
      padding:'3px 10px',background:`${m.color}14`,
      fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
      letterSpacing:'0.22em',color:m.color,fontWeight:700,
      textTransform:'uppercase',whiteSpace:'nowrap'}}>
      <Icon size={8}/>{STATUS_LABEL[status]||status}
    </span>
  );
};

/* ─── SECTION CARD ───────────────────────────────────────────── */
const Card = ({title, icon:Icon, children, accent=C.maroon, action}) => (
  <div style={{background:C.white,border:`1px solid ${C.border}`,
    overflow:'hidden',marginBottom:20}}>
    {/* Card header */}
    <div style={{background:C.parchment,padding:'14px 20px',
      borderBottom:`1px solid ${C.border}`,position:'relative'}}>
      <ArchFrame color={accent} height={28}/>
      <div style={{position:'relative',zIndex:2,display:'flex',
        alignItems:'center',justifyContent:'space-between',paddingTop:4}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Icon size={14} color={accent}/>
          <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:9,
            letterSpacing:'0.4em',color:accent,fontWeight:700,
            textTransform:'uppercase'}}>{title}</span>
        </div>
        {action}
      </div>
    </div>
    <div style={{padding:'20px'}}>{children}</div>
  </div>
);

/* ─── INPUT ROW ──────────────────────────────────────────────── */
const InputRow = ({label, value, onChange, type='text', disabled=false, placeholder=''}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{marginBottom:18}}>
      <label style={{display:'block',fontFamily:"'Montserrat',sans-serif",
        fontSize:7.5,letterSpacing:'0.4em',textTransform:'uppercase',
        fontWeight:700,color:focused?C.maroon:C.muted,marginBottom:6,
        transition:'color .25s'}}>{label}</label>
      <div style={{display:'flex',alignItems:'center',
        borderBottom:`1.5px solid ${focused?C.maroon:C.border}`,
        paddingBottom:7,transition:'border-color .25s'}}>
        <input type={type} value={value||''} onChange={onChange}
          disabled={disabled} placeholder={placeholder}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{flex:1,background:'transparent',border:'none',outline:'none',
            fontFamily:"'Montserrat',sans-serif",fontSize:13,color:C.ink,
            opacity:disabled?0.5:1,cursor:disabled?'not-allowed':'text'}}/>
      </div>
    </div>
  );
};

/* ─── MEASUREMENT INPUT ─────────────────────────────────────── */
const MeasureInput = ({label, value, onChange, unit, disabled}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:5}}>
      <label style={{fontFamily:"'Montserrat',sans-serif",fontSize:7,
        letterSpacing:'0.35em',textTransform:'uppercase',
        color:focused?C.maroon:C.muted,fontWeight:700,transition:'color .25s'}}>
        {label}
      </label>
      <div style={{display:'flex',alignItems:'center',
        border:`1px solid ${focused?C.maroon:C.border}`,
        background:disabled?C.parchment:C.white,transition:'border-color .25s'}}>
        <input type="number" value={value||''} onChange={onChange}
          disabled={disabled} placeholder="—"
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{flex:1,background:'transparent',border:'none',outline:'none',
            fontFamily:"'Montserrat',sans-serif",fontSize:12,color:C.ink,
            padding:'8px 10px',opacity:disabled?0.5:1}}/>
        <span style={{padding:'0 9px',fontFamily:"'Montserrat',sans-serif",
          fontSize:8,color:C.muted,letterSpacing:'0.2em',
          borderLeft:`1px solid ${C.border}`}}>{unit}</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN PROFILE PAGE
═══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user: authUser } = useSelector(s => s.auth);
  const navigate = useNavigate();

  const [profile,      setProfile]      = useState(null);
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('profile');
  const [editMode,     setEditMode]     = useState(false);
  const [editMeasure,  setEditMeasure]  = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [expandOrder,  setExpandOrder]  = useState(null);

  /* Editable form state */
  const [form,     setForm]     = useState({ name:'', city:'' });
  const [measures, setMeasures] = useState({
    unit:'inches', standardSize:'M',
    values:{ chest:'', waist:'', shoulder:'', length:'', sleeves:'', neck:'', hip:'' }
  });

  /* Profile image */
  const [imgPreview, setImgPreview] = useState(null);
  const [imgFile,    setImgFile]    = useState(null);
  const fileRef = useRef(null);

  /* Redirect if not logged in */
  useEffect(() => {
    if (!authUser) navigate('/login', {replace:true});
  }, [authUser, navigate]);

  /* Fetch profile + orders */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [profRes, ordRes] = await Promise.all([
        profileService.getMe(),
        profileService.getMyOrders().catch(()=>({data:[]})),
      ]);
      const p = profRes.data;
      setProfile(p);
      setForm({ name: p.name||'', city: p.city||'' });
      setMeasures({
        unit:         p.savedMeasurements?.unit         || 'inches',
        standardSize: p.savedMeasurements?.standardSize || 'M',
        values: {
          chest:    p.savedMeasurements?.values?.chest    || '',
          waist:    p.savedMeasurements?.values?.waist    || '',
          shoulder: p.savedMeasurements?.values?.shoulder || '',
          length:   p.savedMeasurements?.values?.length   || '',
          sleeves:  p.savedMeasurements?.values?.sleeves  || '',
          neck:     p.savedMeasurements?.values?.neck     || '',
          hip:      p.savedMeasurements?.values?.hip      || '',
        }
      });
      setOrders(ordRes.data || []);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Image pick ── */
  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2*1024*1024)
      return toast.error('Image must be under 2 MB');
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  /* ── Save profile details ── */
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      if (form.name)  fd.append('name',  form.name);
      if (form.city)  fd.append('city',  form.city);
      if (imgFile)    fd.append('profileImage', imgFile);
      await profileService.updateProfile(fd);
      toast.success('Profile updated');
      setEditMode(false);
      setImgFile(null);
      fetchData();
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  /* ── Save measurements ── */
  const handleSaveMeasures = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('unit',         measures.unit);
      fd.append('standardSize', measures.standardSize);
      Object.entries(measures.values).forEach(([k,v]) => {
        if (v !== '') fd.append(k, v);
      });
      await profileService.updateProfile(fd);
      toast.success('Measurements saved');
      setEditMeasure(false);
      fetchData();
    } catch {
      toast.error('Failed to save measurements');
    } finally {
      setSaving(false);
    }
  };

  /* ── Profile image src ── */
  const avatarSrc = imgPreview ||
    (profile?.profileImage && profile.profileImage !== 'default-avatar.png'
      ? `${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:5000'}${profile.profileImage}`
      : null);

  /* ── Loading ── */
  if (loading) return (
    <div style={{minHeight:'100vh',background:C.page,display:'flex',
      flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <motion.div animate={{rotate:360}}
        transition={{duration:3,repeat:Infinity,ease:'linear'}}>
        <Rangoli s={56}/>
      </motion.div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,
        color:C.muted,letterSpacing:'0.2em'}}>Loading Profile…</div>
    </div>
  );

  const activeOrders   = orders.filter(o => !['COMPLETED','CANCELLED'].includes(o.status));
  const completedOrders= orders.filter(o => o.status === 'COMPLETED');

  return (
    <div style={{minHeight:'100vh',background:C.page,
      fontFamily:"'Montserrat',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;}
        .prof-tab{transition:color .25s,border-color .25s;}
        .ord-row:hover{background:${C.parchment}!important;}
        @media(max-width:768px){
          .prof-grid{grid-template-columns:1fr!important;}
          .measure-grid{grid-template-columns:repeat(2,1fr)!important;}
        }
        @media(max-width:480px){
          .measure-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* ══ HERO HEADER ══ */}
      <div style={{background:C.maroon,position:'relative',
        overflow:'hidden',padding:'32px 24px 28px'}}>
        <ToranaStrip/>
        <div style={{position:'absolute',right:-20,bottom:-20,
          fontFamily:"'Cormorant Garamond',serif",fontSize:'13vw',
          color:'rgba(255,255,255,0.04)',fontStyle:'italic',
          lineHeight:1,userSelect:'none',pointerEvents:'none'}}>Profile</div>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2,paddingTop:8}}>

          {/* Avatar + name row */}
          <div style={{display:'flex',alignItems:'flex-end',gap:22,flexWrap:'wrap'}}>

            {/* Avatar */}
            <div style={{position:'relative',flexShrink:0}}>
              {/* Arch halo */}
              <svg width="100" height="52" viewBox="0 0 100 52"
                style={{position:'absolute',top:-10,left:'50%',
                  transform:'translateX(-50%)',zIndex:1,pointerEvents:'none'}}>
                <path d="M4 52 L4 26 Q50 -6 96 26 L96 52"
                  stroke={C.goldL} strokeWidth="1.2" fill="none" opacity="0.5"/>
                <circle cx="50" cy="5" r="3" fill={C.goldL} opacity="0.5"/>
                {[20,35,50,65,80].map((x,i)=>(
                  <g key={i}>
                    <line x1={x} y1="8" x2={x} y2="18"
                      stroke={C.goldL} strokeWidth="0.7" opacity="0.35"/>
                    <ellipse cx={x} cy="21" rx="2" ry="2.8"
                      fill={`${C.goldL}40`} stroke={C.goldL} strokeWidth="0.3"/>
                  </g>
                ))}
              </svg>

              {/* Circle avatar */}
              <div style={{width:88,height:88,borderRadius:'50%',
                border:`2.5px solid ${C.goldL}60`,overflow:'hidden',
                background:`linear-gradient(135deg,${C.maroon},${C.maroonL})`,
                display:'flex',alignItems:'center',justifyContent:'center',
                flexShrink:0, position:'relative', zIndex:2}}>
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar"
                      style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  : <span style={{fontFamily:"'Cormorant Garamond',serif",
                      fontSize:38,color:C.goldL,fontWeight:700}}>
                      {profile?.name?.charAt(0).toUpperCase()}
                    </span>
                }
              </div>

              {/* Camera overlay button */}
              {editMode && (
                <motion.button initial={{scale:0}} animate={{scale:1}}
                  onClick={()=>fileRef.current?.click()}
                  style={{position:'absolute',bottom:2,right:2,zIndex:3,
                    width:26,height:26,borderRadius:'50%',
                    background:C.gold,border:`2px solid ${C.white}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    cursor:'pointer'}}>
                  <FiCamera size={12} color="white"/>
                </motion.button>
              )}
              <input ref={fileRef} type="file" accept="image/*"
                onChange={handleImagePick}
                style={{display:'none'}}/>
            </div>

            {/* Name + meta */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:7.5,letterSpacing:'0.55em',
                color:`${C.goldL}70`,textTransform:'uppercase',marginBottom:5}}>
                Tailor24 Patron
              </div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",
                fontSize:'clamp(26px,4vw,42px)',color:'white',
                fontWeight:700,lineHeight:1,margin:0}}>
                {profile?.name}
              </h1>
              <div style={{display:'flex',alignItems:'center',gap:14,
                marginTop:8,flexWrap:'wrap'}}>
                {profile?.city && (
                  <div style={{display:'flex',alignItems:'center',gap:5,
                    fontSize:10,color:`rgba(255,255,255,0.55)`}}>
                    <FiMapPin size={10}/>{profile.city}
                  </div>
                )}
                <span style={{padding:'2px 10px',
                  background: profile?.role==='admin'?`${C.goldL}25`:
                               profile?.role==='staff'?`${C.teal}40`:`rgba(255,255,255,0.12)`,
                  fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
                  letterSpacing:'0.3em',color:C.goldL,fontWeight:700,
                  textTransform:'uppercase'}}>
                  {profile?.role}
                </span>
              </div>
            </div>

            {/* Stats pills */}
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {[
                {label:'Total Orders',  val:orders.length,          color:C.goldL  },
                {label:'Active',        val:activeOrders.length,    color:'#7DD3F5'},
                {label:'Completed',     val:completedOrders.length, color:'#86EFAC'},
              ].map((stat,i)=>(
                <div key={i} style={{padding:'10px 16px',
                  background:'rgba(255,255,255,0.08)',
                  border:`1px solid rgba(255,255,255,0.12)`,textAlign:'center'}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",
                    fontSize:26,color:stat.color,fontWeight:700,lineHeight:1}}>
                    {stat.val}
                  </div>
                  <div style={{fontSize:7,letterSpacing:'0.35em',
                    color:'rgba(255,255,255,0.45)',textTransform:'uppercase',
                    marginTop:4}}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Stitch c1={C.maroon} c2={C.goldB}/>

      {/* ══ TABS ══ */}
      <div style={{background:C.white,borderBottom:`2px solid ${C.border}`}}>
        <div style={{maxWidth:1100,margin:'0 auto',
          display:'flex',padding:'0 24px',flexWrap:'wrap'}}>
          {[
            {id:'profile',      label:'Profile Details',  icon:FiUser     },
            {id:'measurements', label:'Measurements',     icon:FiEdit3    },
            {id:'orders',       label:`Orders (${orders.length})`, icon:FiPackage},
          ].map(tab=>(
            <button key={tab.id} className="prof-tab"
              onClick={()=>setActiveTab(tab.id)}
              style={{display:'flex',alignItems:'center',gap:7,
                padding:'13px 20px',background:'transparent',border:'none',
                cursor:'pointer',
                borderBottom:`2.5px solid ${activeTab===tab.id?C.maroon:'transparent'}`,
                marginBottom:-2,fontFamily:"'Montserrat',sans-serif",
                fontSize:8.5,letterSpacing:'0.32em',fontWeight:700,
                textTransform:'uppercase',
                color:activeTab===tab.id?C.maroon:C.muted}}>
              <tab.icon size={12}/>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 24px'}}>
        <AnimatePresence mode="wait">

          {/* ── PROFILE DETAILS TAB ── */}
          {activeTab==='profile' && (
            <motion.div key="profile"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}}
              transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>

              <div className="prof-grid"
                style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>

                {/* Left — editable info */}
                <Card title="Personal Details" icon={FiUser} accent={C.maroon}
                  action={
                    editMode ? (
                      <div style={{display:'flex',gap:8}}>
                        <motion.button whileTap={{scale:0.95}}
                          onClick={()=>{setEditMode(false);setImgPreview(null);setImgFile(null);}}
                          style={{display:'flex',alignItems:'center',gap:5,
                            padding:'5px 12px',background:'transparent',
                            border:`1px solid ${C.border}`,cursor:'pointer',
                            fontFamily:"'Montserrat',sans-serif",fontSize:8,
                            letterSpacing:'0.25em',color:C.muted,
                            textTransform:'uppercase'}}>
                          <FiX size={10}/>Cancel
                        </motion.button>
                        <motion.button whileTap={{scale:0.95}}
                          onClick={handleSaveProfile} disabled={saving}
                          style={{display:'flex',alignItems:'center',gap:5,
                            padding:'5px 12px',background:C.maroon,border:'none',
                            cursor:'pointer',fontFamily:"'Montserrat',sans-serif",
                            fontSize:8,letterSpacing:'0.25em',color:'white',
                            textTransform:'uppercase',opacity:saving?0.65:1}}>
                          <FiSave size={10}/>
                          {saving?'Saving…':'Save'}
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button whileTap={{scale:0.95}}
                        onClick={()=>setEditMode(true)}
                        style={{display:'flex',alignItems:'center',gap:5,
                          padding:'5px 12px',background:'transparent',
                          border:`1px solid ${C.border}`,cursor:'pointer',
                          fontFamily:"'Montserrat',sans-serif",fontSize:8,
                          letterSpacing:'0.25em',color:C.maroon,
                          textTransform:'uppercase'}}>
                        <FiEdit3 size={10}/>Edit
                      </motion.button>
                    )
                  }>

                  {/* Profile picture upload area (edit mode) */}
                  <AnimatePresence>
                    {editMode && (
                      <motion.div initial={{height:0,opacity:0}}
                        animate={{height:'auto',opacity:1}}
                        exit={{height:0,opacity:0}}
                        style={{overflow:'hidden',marginBottom:18}}>
                        <div onClick={()=>fileRef.current?.click()}
                          style={{border:`1.5px dashed ${C.border}`,
                            padding:'16px',cursor:'pointer',textAlign:'center',
                            background:C.parchment,transition:'border-color .25s'}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=C.maroon}
                          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                          {imgPreview
                            ? <img src={imgPreview} alt="preview"
                                style={{height:60,width:60,objectFit:'cover',
                                  borderRadius:'50%',margin:'0 auto',display:'block'}}/>
                            : <FiCamera size={22} color={C.muted}
                                style={{display:'block',margin:'0 auto 8px'}}/>
                          }
                          <div style={{fontSize:9,letterSpacing:'0.25em',
                            color:C.muted,textTransform:'uppercase',marginTop:6}}>
                            {imgPreview?'Change Photo':'Upload Profile Photo'}
                          </div>
                          <div style={{fontSize:8,color:C.border,marginTop:3}}>
                            JPG, PNG, WEBP · Max 2 MB
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <InputRow label="Full Name"
                    value={editMode?form.name:profile?.name}
                    onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                    disabled={!editMode}/>

                  <InputRow label="City / Location"
                    value={editMode?form.city:profile?.city}
                    onChange={e=>setForm(p=>({...p,city:e.target.value}))}
                    disabled={!editMode} placeholder="e.g. Bhopal"/>
                </Card>

                {/* Right — read-only account info */}
                <Card title="Account Info" icon={FiMail} accent={C.teal}>

                  {/* Email */}
                  <div style={{marginBottom:20}}>
                    <div style={{fontSize:7.5,letterSpacing:'0.38em',color:C.muted,
                      textTransform:'uppercase',fontWeight:700,marginBottom:6}}>
                      Email Address
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10,
                      padding:'10px 12px',background:C.parchment,
                      border:`1px solid ${C.border}`}}>
                      <FiMail size={14} color={C.teal}/>
                      <span style={{fontFamily:"'Montserrat',sans-serif",
                        fontSize:13,color:C.ink}}>{profile?.email}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{marginBottom:20}}>
                    <div style={{fontSize:7.5,letterSpacing:'0.38em',color:C.muted,
                      textTransform:'uppercase',fontWeight:700,marginBottom:6}}>
                      Phone Number
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10,
                      padding:'10px 12px',background:C.parchment,
                      border:`1px solid ${C.border}`}}>
                      <FiPhone size={14} color={C.teal}/>
                      <span style={{fontFamily:"'Montserrat',sans-serif",
                        fontSize:13,color:C.ink}}>{profile?.phone||'—'}</span>
                    </div>
                  </div>

                  {/* Member since */}
                  <div>
                    <div style={{fontSize:7.5,letterSpacing:'0.38em',color:C.muted,
                      textTransform:'uppercase',fontWeight:700,marginBottom:6}}>
                      Member Since
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10,
                      padding:'10px 12px',background:C.parchment,
                      border:`1px solid ${C.border}`}}>
                      <FiClock size={14} color={C.teal}/>
                      <span style={{fontFamily:"'Montserrat',sans-serif",
                        fontSize:13,color:C.ink}}>
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString('en-IN',
                              {day:'2-digit',month:'long',year:'numeric'})
                          : '—'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ── MEASUREMENTS TAB ── */}
          {activeTab==='measurements' && (
            <motion.div key="measurements"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}}
              transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>

              <Card title="Saved Measurements" icon={FiEdit3} accent={C.gold}
                action={
                  editMeasure ? (
                    <div style={{display:'flex',gap:8}}>
                      <motion.button whileTap={{scale:0.95}}
                        onClick={()=>setEditMeasure(false)}
                        style={{display:'flex',alignItems:'center',gap:5,
                          padding:'5px 12px',background:'transparent',
                          border:`1px solid ${C.border}`,cursor:'pointer',
                          fontFamily:"'Montserrat',sans-serif",fontSize:8,
                          letterSpacing:'0.25em',color:C.muted,
                          textTransform:'uppercase'}}>
                        <FiX size={10}/>Cancel
                      </motion.button>
                      <motion.button whileTap={{scale:0.95}}
                        onClick={handleSaveMeasures} disabled={saving}
                        style={{display:'flex',alignItems:'center',gap:5,
                          padding:'5px 12px',background:C.gold,border:'none',
                          cursor:'pointer',fontFamily:"'Montserrat',sans-serif",
                          fontSize:8,letterSpacing:'0.25em',color:C.ink,
                          textTransform:'uppercase',fontWeight:700,
                          opacity:saving?0.65:1}}>
                        <FiSave size={10}/>
                        {saving?'Saving…':'Save'}
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button whileTap={{scale:0.95}}
                      onClick={()=>setEditMeasure(true)}
                      style={{display:'flex',alignItems:'center',gap:5,
                        padding:'5px 12px',background:'transparent',
                        border:`1px solid ${C.border}`,cursor:'pointer',
                        fontFamily:"'Montserrat',sans-serif",fontSize:8,
                        letterSpacing:'0.25em',color:C.gold,
                        textTransform:'uppercase'}}>
                      <FiEdit3 size={10}/>Edit
                    </motion.button>
                  )
                }>

                {/* Unit + Size row */}
                <div style={{display:'flex',gap:14,marginBottom:22,flexWrap:'wrap'}}>
                  {/* Unit toggle */}
                  <div style={{flex:1,minWidth:140}}>
                    <div style={{fontSize:7.5,letterSpacing:'0.38em',color:C.muted,
                      textTransform:'uppercase',fontWeight:700,marginBottom:8}}>Unit</div>
                    <div style={{display:'flex',border:`1px solid ${C.border}`,overflow:'hidden'}}>
                      {['inches','cm'].map(u=>(
                        <button key={u} onClick={()=>editMeasure&&setMeasures(p=>({...p,unit:u}))}
                          style={{flex:1,padding:'9px',border:'none',
                            cursor:editMeasure?'pointer':'default',
                            background:measures.unit===u?C.maroon:'transparent',
                            fontFamily:"'Montserrat',sans-serif",fontSize:8.5,
                            letterSpacing:'0.25em',textTransform:'uppercase',
                            color:measures.unit===u?'white':C.muted,
                            fontWeight:700,transition:'all .25s'}}>
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Standard size */}
                  <div style={{flex:2,minWidth:200}}>
                    <div style={{fontSize:7.5,letterSpacing:'0.38em',color:C.muted,
                      textTransform:'uppercase',fontWeight:700,marginBottom:8}}>
                      Standard Size
                    </div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {SIZE_OPTIONS.map(sz=>(
                        <button key={sz}
                          onClick={()=>editMeasure&&setMeasures(p=>({...p,standardSize:sz}))}
                          style={{padding:'7px 14px',border:`1.5px solid ${
                            measures.standardSize===sz?C.maroon:C.border}`,
                            cursor:editMeasure?'pointer':'default',
                            background:measures.standardSize===sz?`${C.maroon}12`:'transparent',
                            fontFamily:"'Montserrat',sans-serif",fontSize:9,
                            letterSpacing:'0.2em',textTransform:'uppercase',
                            color:measures.standardSize===sz?C.maroon:C.muted,
                            fontWeight:700,transition:'all .25s'}}>
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Stitch c1={C.gold} c2={C.maroon}/>
                <div style={{height:16}}/>

                {/* Measurement grid */}
                <div className="measure-grid"
                  style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
                  {MEASUREMENT_FIELDS.map(({key,label})=>(
                    <MeasureInput key={key} label={label}
                      value={measures.values[key]}
                      unit={measures.unit}
                      disabled={!editMeasure}
                      onChange={e=>setMeasures(p=>({
                        ...p,values:{...p.values,[key]:e.target.value}
                      }))}/>
                  ))}
                </div>

                {/* Notes */}
                <div style={{marginTop:18}}>
                  <div style={{fontSize:7.5,letterSpacing:'0.38em',color:C.muted,
                    textTransform:'uppercase',fontWeight:700,marginBottom:8}}>
                    Additional Notes
                  </div>
                  <textarea
                    value={measures.values.additionalNotes||''}
                    disabled={!editMeasure}
                    onChange={e=>setMeasures(p=>({
                      ...p,values:{...p.values,additionalNotes:e.target.value}
                    }))}
                    placeholder="Special fitting notes, preferences…"
                    rows={3}
                    style={{width:'100%',background:editMeasure?C.white:C.parchment,
                      border:`1px solid ${C.border}`,padding:'10px 12px',
                      fontFamily:"'Montserrat',sans-serif",fontSize:12,
                      color:C.ink,resize:'vertical',outline:'none',
                      opacity:!editMeasure?0.65:1}}/>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab==='orders' && (
            <motion.div key="orders"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}}
              transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>

              {orders.length === 0 ? (
                <div style={{padding:'64px 24px',textAlign:'center'}}>
                  <Rangoli s={48}/>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,
                    color:C.muted,marginTop:14}}>No orders yet</div>
                  <p style={{fontSize:9.5,color:C.border,letterSpacing:'0.2em',
                    textTransform:'uppercase',marginTop:6}}>
                    Your bespoke commissions will appear here
                  </p>
                </div>
              ) : (
                <div>
                  {orders.map((o,i) => {
                    const isExpanded = expandOrder === o._id;
                    return (
                      <motion.div key={o._id}
                        initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                        transition={{delay:i*0.04}}
                        style={{background:C.white,border:`1px solid ${C.border}`,
                          marginBottom:10,overflow:'hidden'}}>

                        {/* Order row header */}
                        <div className="ord-row"
                          onClick={()=>setExpandOrder(isExpanded?null:o._id)}
                          style={{display:'flex',alignItems:'center',
                            justifyContent:'space-between',flexWrap:'wrap',
                            gap:10,padding:'14px 18px',cursor:'pointer',
                            background:i%2===0?C.white:C.page,
                            transition:'background .18s'}}>

                          <div style={{display:'flex',alignItems:'center',gap:14}}>
                            {/* Mini arch icon */}
                            <div style={{width:34,height:34,flexShrink:0}}>
                              <svg width="34" height="34" viewBox="0 0 34 34">
                                <path d="M3 34 L3 17 Q17 2 31 17 L31 34"
                                  stroke={C.maroon} strokeWidth="1.2"
                                  fill={`${C.maroon}08`}/>
                                <circle cx="17" cy="12" r="3.5"
                                  fill={C.maroon} opacity="0.7"/>
                              </svg>
                            </div>

                            <div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",
                                fontSize:16,color:C.maroon,fontWeight:700}}>
                                #{o._id?.slice(-6).toUpperCase()}
                              </div>
                              <div style={{fontSize:8.5,color:C.muted,marginTop:2}}>
                                {new Date(o.createdAt).toLocaleDateString('en-IN',
                                  {day:'2-digit',month:'short',year:'numeric'})}
                                {' · '}
                                {o.items?.length||0} item{o.items?.length!==1?'s':''}
                              </div>
                            </div>
                          </div>

                          <div style={{display:'flex',alignItems:'center',gap:12}}>
                            <Badge status={o.status}/>
                            <motion.div animate={{rotate:isExpanded?180:0}}
                              transition={{duration:0.25}}>
                              <FiChevronDown size={15} color={C.muted}/>
                            </motion.div>
                          </div>
                        </div>

                        {/* Expanded order details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{height:0,opacity:0}}
                              animate={{height:'auto',opacity:1}}
                              exit={{height:0,opacity:0}}
                              transition={{duration:0.28}}>
                              <div style={{padding:'18px',
                                borderTop:`1px solid ${C.border}`,
                                background:C.parchment}}>

                                {/* Timeline */}
                                {o.timeline?.length > 0 && (
                                  <div style={{marginBottom:18}}>
                                    <div style={{fontSize:7.5,letterSpacing:'0.4em',
                                      color:C.muted,textTransform:'uppercase',
                                      fontWeight:700,marginBottom:12}}>Timeline</div>
                                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                                      {[...o.timeline].reverse().map((t,ti)=>(
                                        <div key={ti}
                                          style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                                          <div style={{width:8,height:8,borderRadius:'50%',
                                            background:ti===0?C.maroon:C.border,
                                            flexShrink:0,marginTop:4}}/>
                                          <div style={{flex:1}}>
                                            <div style={{fontSize:9.5,color:C.ink,
                                              fontWeight:600}}>{t.note}</div>
                                            <div style={{fontSize:8,color:C.muted,marginTop:2}}>
                                              {new Date(t.timestamp||t.createdAt||Date.now())
                                                .toLocaleDateString('en-IN',
                                                  {day:'2-digit',month:'short',
                                                   year:'numeric',hour:'2-digit',minute:'2-digit'})}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Items */}
                                {o.items?.length > 0 && (
                                  <div>
                                    <div style={{fontSize:7.5,letterSpacing:'0.4em',
                                      color:C.muted,textTransform:'uppercase',
                                      fontWeight:700,marginBottom:10}}>Items Ordered</div>
                                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                                      {o.items.map((item,ii)=>(
                                        <div key={ii}
                                          style={{display:'flex',alignItems:'center',
                                            justifyContent:'space-between',
                                            padding:'9px 12px',background:C.white,
                                            border:`1px solid ${C.border}`}}>
                                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                                            <FiChevronRight size={10} color={C.gold}/>
                                            <span style={{fontFamily:"'Cormorant Garamond',serif",
                                              fontSize:14,color:C.ink,fontWeight:600}}>
                                              {item.name||item.productName||`Item ${ii+1}`}
                                            </span>
                                          </div>
                                          {item.quantity && (
                                            <span style={{fontSize:8.5,color:C.muted}}>
                                              Qty: {item.quantity}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer rangoli dots */}
        <div style={{marginTop:32}}>
          <Stitch c1={C.maroon} c2={C.teal}/>
          <div style={{display:'flex',alignItems:'center',
            justifyContent:'center',gap:8,padding:'14px 0'}}>
            {[0,1,2,1,0].map((s,i)=>(
              <div key={i} style={{
                width: s===2?8:s===1?5:3,
                height:s===2?8:s===1?5:3,
                borderRadius:'50%',
                background:s===2?C.maroon:C.gold,
                opacity:s===2?0.7:0.3}}/>
            ))}
          </div>
          <div style={{textAlign:'center',fontSize:7.5,letterSpacing:'0.45em',
            color:C.muted,textTransform:'uppercase'}}>
            Tailor24 · Est. 1997
          </div>
        </div>
      </div>
    </div>
  );
}