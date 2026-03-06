import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';
import {
  FiUsers, FiShoppingBag, FiCheck, FiX, FiRefreshCw,
  FiTrash2, FiEdit3, FiChevronDown, FiSearch, FiFilter,
  FiClock, FiPackage, FiTrendingUp,
} from 'react-icons/fi';

/* ─── PALETTE ──────────────────────────────────────────────── */
const C = {
  page:      '#FBF4E8',
  parchment: '#F4E8D0',
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

/* ─── ORDER STATUSES — exact values from backend orderStatuses.js ── */
const STATUSES = [
  'ORDER_CREATED',
  'ORDER_VERIFIED',
  'FABRIC_PICKUP_SCHEDULED',
  'FABRIC_RECEIVED',
  'STITCHING_IN_PROGRESS',
  'TRIAL_READY',
  'QC_PASSED',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
];

/* Human-readable display labels */
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
  ORDER_CREATED:           { color: C.goldB,   bg: `${C.goldB}18`,   icon: FiClock       },
  ORDER_VERIFIED:          { color: C.teal,    bg: `${C.teal}18`,    icon: FiCheck       },
  FABRIC_PICKUP_SCHEDULED: { color: '#5A3A1A', bg: '#5A3A1A18',      icon: FiPackage     },
  FABRIC_RECEIVED:         { color: '#7A4A1A', bg: '#7A4A1A18',      icon: FiPackage     },
  STITCHING_IN_PROGRESS:   { color: C.maroon,  bg: `${C.maroon}14`,  icon: FiPackage     },
  TRIAL_READY:             { color: '#2A4A7A', bg: '#2A4A7A18',      icon: FiRefreshCw   },
  QC_PASSED:               { color: C.teal,    bg: `${C.teal}14`,    icon: FiCheck       },
  READY_FOR_PICKUP:        { color: C.goldB,   bg: `${C.goldB}18`,   icon: FiTrendingUp  },
  OUT_FOR_DELIVERY:        { color: '#4A2A7A', bg: '#4A2A7A18',      icon: FiTrendingUp  },
  COMPLETED:               { color: C.green,   bg: `${C.green}18`,   icon: FiCheck       },
  CANCELLED:               { color: C.red,     bg: `${C.red}18`,     icon: FiX           },
};

const TERMINAL = ['COMPLETED', 'CANCELLED']; // no further updates allowed

/* ─── SVG ORNAMENTS ─────────────────────────────────────────── */
const ToranaStrip = () => (
  <div style={{ position:'absolute', top:0, left:0, right:0, height:4,
    overflow:'hidden', pointerEvents:'none' }}>
    <svg width="100%" height="4" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tg-adm" x1="0%" x2="100%">
          <stop offset="0%"   stopColor={C.maroon} stopOpacity="0.6"/>
          <stop offset="50%"  stopColor={C.goldB}  stopOpacity="0.9"/>
          <stop offset="100%" stopColor={C.maroon} stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="4" fill="url(#tg-adm)" opacity="0.5"/>
      {Array.from({length:120}).map((_,i) => (
        <circle key={i} cx={`${i*0.86+0.43}%`} cy="2" r="1"
          fill={i%5===2 ? C.maroon : C.goldB}
          opacity={i%5===2 ? 0.7 : 0.25}/>
      ))}
    </svg>
  </div>
);

const Rangoli = ({s=40}) => (
  <svg width={s} height={s} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" stroke={C.gold} strokeWidth="0.7" fill="none" opacity="0.35"/>
    <circle cx="22" cy="22" r="13" stroke={C.gold} strokeWidth="0.5" fill="none" opacity="0.28"/>
    <circle cx="22" cy="22" r="7"  stroke={C.maroon} strokeWidth="0.7" fill="none" opacity="0.35"/>
    <circle cx="22" cy="22" r="3"  fill={C.gold} opacity="0.4"/>
    <circle cx="22" cy="22" r="1.5" fill={C.maroon} opacity="0.7"/>
    {Array.from({length:8}).map((_,i) => {
      const a = (i/8)*Math.PI*2, px = 22+19*Math.cos(a), py = 22+19*Math.sin(a);
      return <ellipse key={i} cx={px} cy={py} rx="2" ry="3.5"
        transform={`rotate(${i*45+90},${px},${py})`}
        fill={`${C.maroon}45`} stroke={C.gold} strokeWidth="0.4"/>;
    })}
  </svg>
);

const ArchTop = ({color=C.gold}) => (
  <div style={{position:'absolute',top:0,left:0,right:0,height:44,
    overflow:'hidden',pointerEvents:'none',zIndex:1}}>
    <svg width="100%" height="44" viewBox="0 0 300 44" preserveAspectRatio="none">
      <path d="M0 44 L0 22 Q150 -8 300 22 L300 44Z" fill={`${color}12`}/>
      <path d="M0 44 L0 26 Q150 2 300 26" stroke={color} strokeWidth="0.7" fill="none" opacity="0.5"/>
      {[50,100,150,200,250].map((x,i) => (
        <g key={i}>
          <line x1={x} y1="5" x2={x} y2="15" stroke={C.gold} strokeWidth="0.7" opacity="0.4"/>
          <ellipse cx={x} cy="18" rx="2.5" ry="3.5"
            fill={`${color}45`} stroke={C.gold} strokeWidth="0.4"/>
        </g>
      ))}
    </svg>
  </div>
);

const Stitch = ({c1=C.maroon, c2=C.teal}) => (
  <div style={{height:12,overflow:'hidden',width:'100%'}}>
    <svg width="100%" height="12" preserveAspectRatio="none">
      {Array.from({length:55}).map((_,i) => (
        <line key={i} x1={`${i*1.9}%`} y1="3" x2={`${i*1.9+0.9}%`} y2="3"
          stroke={c1} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
      ))}
      {Array.from({length:38}).map((_,i) => (
        <g key={i}>
          <line x1={`${i*2.7+0.5}%`} y1="8" x2={`${i*2.7+1.5}%`} y2="12"
            stroke={c2} strokeWidth="0.9" strokeLinecap="round" opacity="0.4"/>
          <line x1={`${i*2.7+1.5}%`} y1="8" x2={`${i*2.7+0.5}%`} y2="12"
            stroke={c2} strokeWidth="0.9" strokeLinecap="round" opacity="0.4"/>
        </g>
      ))}
    </svg>
  </div>
);

/* ─── STATUS BADGE ──────────────────────────────────────────── */
const Badge = ({status}) => {
  const m    = STATUS_META[status] || STATUS_META.ORDER_CREATED;
  const Icon = m.icon;
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 10px', background:m.bg,
      fontFamily:"'Montserrat',sans-serif", fontSize:8,
      letterSpacing:'0.22em', color:m.color, fontWeight:700,
      textTransform:'uppercase', whiteSpace:'nowrap'}}>
      <Icon size={9}/>{STATUS_LABEL[status] || status}
    </span>
  );
};

/* ─── CONFIRM MODAL ─────────────────────────────────────────── */
function ConfirmModal({isOpen, title, message, onConfirm, onCancel,
  danger=false, hasInput=false, inputLabel='', inputValue='', onInputChange}) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        style={{position:'fixed',inset:0,zIndex:500,
          background:`${C.maroon}40`,backdropFilter:'blur(6px)',
          display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <motion.div
          initial={{scale:0.93,y:20}} animate={{scale:1,y:0}} exit={{scale:0.93,y:10}}
          transition={{duration:0.25,ease:[0.22,1,0.36,1]}}
          style={{background:C.white,maxWidth:420,width:'100%',overflow:'hidden',
            boxShadow:`0 24px 64px ${C.maroon}22`,border:`1px solid ${C.border}`}}>

          {/* Header */}
          <div style={{background:danger?C.maroon:C.parchment,
            padding:'22px 24px 18px',position:'relative'}}>
            <ArchTop color={danger?C.goldL:C.gold}/>
            <div style={{position:'relative',zIndex:2,paddingTop:18}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,
                color:danger?'white':C.ink,fontWeight:700,marginBottom:6}}>{title}</div>
              <p style={{fontSize:12,color:danger?'rgba(255,255,255,0.6)':C.muted,
                lineHeight:1.7,margin:0}}>{message}</p>
            </div>
          </div>

          {/* Body */}
          <div style={{padding:'18px 24px 22px'}}>
            {hasInput && (
              <div style={{marginBottom:16}}>
                <label style={{fontSize:8,letterSpacing:'0.38em',color:C.muted,
                  textTransform:'uppercase',fontWeight:700,display:'block',marginBottom:8}}>
                  {inputLabel}
                </label>
                <textarea value={inputValue} onChange={e=>onInputChange(e.target.value)}
                  rows={3} placeholder="Enter reason…"
                  style={{width:'100%',background:C.parchment,border:`1px solid ${C.border}`,
                    padding:'10px 12px',fontFamily:"'Montserrat',sans-serif",fontSize:12,
                    color:C.ink,resize:'vertical',outline:'none',boxSizing:'border-box'}}/>
              </div>
            )}
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={onCancel}
                style={{padding:'9px 20px',border:`1px solid ${C.border}`,
                  background:'transparent',cursor:'pointer',
                  fontFamily:"'Montserrat',sans-serif",fontSize:8.5,
                  letterSpacing:'0.3em',color:C.muted,
                  textTransform:'uppercase',fontWeight:700}}>
                Cancel
              </button>
              <button onClick={onConfirm}
                style={{padding:'9px 20px',background:danger?C.maroon:C.teal,
                  border:'none',cursor:'pointer',
                  fontFamily:"'Montserrat',sans-serif",fontSize:8.5,
                  letterSpacing:'0.3em',color:'white',
                  textTransform:'uppercase',fontWeight:700}}>
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── STATUS UPDATE DROPDOWN ────────────────────────────────── */
function StatusDropdown({order, onUpdate}) {
  const [open, setOpen] = useState(false);

  const handleSelect = async (status) => {
    setOpen(false);
    await onUpdate(order._id, status, `Status updated to ${STATUS_LABEL[status]}`);
  };

  return (
    <div style={{position:'relative'}}>
      <motion.button whileTap={{scale:0.96}} onClick={()=>setOpen(v=>!v)}
        style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',
          background:'transparent',border:`1px solid ${C.border}`,cursor:'pointer',
          fontFamily:"'Montserrat',sans-serif",fontSize:8,letterSpacing:'0.25em',
          color:C.maroon,fontWeight:700,textTransform:'uppercase'}}>
        <FiEdit3 size={10}/>Update
        <motion.span animate={{rotate:open?180:0}} style={{display:'flex'}}>
          <FiChevronDown size={10}/>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-away backdrop */}
            <div style={{position:'fixed',inset:0,zIndex:49}}
              onClick={()=>setOpen(false)}/>

            <motion.div
              initial={{opacity:0,y:6,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
              exit={{opacity:0,y:4,scale:0.97}} transition={{duration:0.18}}
              style={{position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:50,
                background:C.white,border:`1px solid ${C.border}`,
                boxShadow:`0 12px 32px ${C.maroon}16`,
                minWidth:190,overflow:'hidden'}}>

              {/* Mini torana bells header */}
              <div style={{padding:'6px 10px 4px',background:C.parchment,
                borderBottom:`1px solid ${C.border}`}}>
                <svg width="100%" height="10" viewBox="0 0 170 10" preserveAspectRatio="none">
                  {Array.from({length:10}).map((_,i) => (
                    <g key={i}>
                      <line x1={i*18+8} y1="1" x2={i*18+8} y2="6"
                        stroke={C.gold} strokeWidth="0.7" opacity="0.5"/>
                      <ellipse cx={i*18+8} cy="8.5" rx="2" ry="2.5"
                        fill={i%2===0?`${C.maroon}50`:`${C.gold}40`}
                        stroke={C.gold} strokeWidth="0.3"/>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Status options — exclude CANCELLED (use Cancel button instead) */}
              {STATUSES.filter(s => s !== 'CANCELLED').map(s => {
                const m    = STATUS_META[s] || STATUS_META.ORDER_CREATED;
                const Icon = m.icon;
                const isActive = order.status === s;
                return (
                  <button key={s} onClick={()=>handleSelect(s)}
                    style={{display:'flex',alignItems:'center',gap:9,width:'100%',
                      padding:'9px 12px',background:isActive?`${m.color}10`:'transparent',
                      border:'none',cursor:'pointer',transition:'background 0.18s',
                      fontFamily:"'Montserrat',sans-serif",fontSize:8.5,
                      letterSpacing:'0.14em',textTransform:'uppercase',
                      borderLeft:isActive?`2px solid ${m.color}`:'2px solid transparent'}}
                    onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background=C.parchment; }}
                    onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent'; }}>
                    <Icon size={11} color={m.color}/>
                    <span style={{color:m.color,fontWeight:700}}>{STATUS_LABEL[s]}</span>
                    {isActive && (
                      <span style={{marginLeft:'auto',fontSize:7,letterSpacing:'0.25em',
                        color:m.color,opacity:0.65}}>CURRENT</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
═══════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const { user }  = useSelector(s => s.auth);
  const navigate  = useNavigate();

  const [data,         setData]         = useState({ stats:{}, users:[], orders:[] });
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('orders');
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal,        setModal]        = useState(null);
  const [modalInput,   setModalInput]   = useState('');

  /* Guard: admin / staff only */
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'staff') {
      navigate('/', {replace:true});
    }
  }, [user, navigate]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const {data:res} = await adminService.getDashboard();
      setData(res);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  /* ── Action handlers ── */
  const handleUpdateStatus = async (orderId, status, note) => {
    try {
      await adminService.updateOrderStatus(orderId, status, note);
      toast.success(`Updated → ${STATUS_LABEL[status]}`);
      fetchDashboard();
    } catch {
      toast.error('Failed to update order');
    }
  };

  const handleCancel = async () => {
    try {
      await adminService.cancelOrder(modal.payload.orderId,
        modalInput.trim() || 'Cancelled by admin');
      toast.success('Order cancelled');
      setModal(null); setModalInput('');
      fetchDashboard();
    } catch {
      toast.error('Failed to cancel order');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await adminService.deleteUser(modal.payload.userId);
      toast.success('User deleted');
      setModal(null);
      fetchDashboard();
    } catch (e) {
      toast.error(e.message || 'Failed to delete user');
    }
  };

  /* ── Derived data ── */
  const { stats={}, users=[], orders=[] } = data;

  const filteredOrders = orders.filter(o => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      o._id?.slice(-6).toLowerCase().includes(q) ||
      o.userId?.name?.toLowerCase().includes(q) ||
      o.userId?.email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredUsers = users.filter(u => {
    const q = search.trim().toLowerCase();
    return !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
  });

  /* ── Stat cards ── */
  const STAT_CARDS = [
    { label:'Total Orders', value:stats.totalOrders||0, icon:FiShoppingBag, color:C.maroon  },
    { label:'New',          value:stats.newOrders||0,   icon:FiClock,       color:C.goldB   },
    { label:'Verified',     value:stats.verified||0,    icon:FiCheck,       color:C.teal    },
    { label:'Stitching',    value:stats.stitching||0,   icon:FiPackage,     color:'#7A4A1A' },
    { label:'Completed',    value:stats.completed||0,   icon:FiTrendingUp,  color:C.green   },
    { label:'Cancelled',    value:stats.cancelled||0,   icon:FiX,           color:C.red     },
    { label:'Total Users',  value:stats.totalUsers||0,  icon:FiUsers,       color:'#2A4A7A' },
  ];

  /* ── Loading screen ── */
  if (loading) return (
    <div style={{minHeight:'100vh',background:C.page,display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',gap:16}}>
      <motion.div animate={{rotate:360}} transition={{duration:3,repeat:Infinity,ease:'linear'}}>
        <Rangoli s={56}/>
      </motion.div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,
        color:C.muted,letterSpacing:'0.2em'}}>Loading Dashboard…</div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:C.page,
      fontFamily:"'Montserrat',sans-serif",color:C.ink}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;}
        .adm-tr:hover{background:${C.parchment}!important;}
        .adm-tab{transition:color .25s,border-color .25s;}
        @media(max-width:900px){
          .stats-grid{grid-template-columns:repeat(4,1fr)!important;}
        }
        @media(max-width:600px){
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .adm-table-wrap{overflow-x:auto;}
          .adm-controls{flex-direction:column!important;}
        }
        @media(max-width:380px){
          .stats-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* ══ PAGE HEADER ══ */}
      <div style={{background:C.maroon,position:'relative',overflow:'hidden',
        padding:'26px 24px 20px'}}>
        <ToranaStrip/>

        {/* Italic watermark */}
        <div style={{position:'absolute',right:-16,bottom:-24,
          fontFamily:"'Cormorant Garamond',serif",fontSize:'13vw',
          color:'rgba(255,255,255,0.04)',lineHeight:1,fontStyle:'italic',
          userSelect:'none',pointerEvents:'none',whiteSpace:'nowrap'}}>Admin</div>

        <div style={{maxWidth:1280,margin:'0 auto',display:'flex',
          alignItems:'center',justifyContent:'space-between',
          flexWrap:'wrap',gap:12,position:'relative',zIndex:2,paddingTop:8}}>

          {/* Left — title */}
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <Rangoli s={44}/>
            <div>
              <div style={{fontSize:7.5,letterSpacing:'0.55em',color:`${C.goldL}75`,
                textTransform:'uppercase',marginBottom:4}}>Tailor24 · Control Centre</div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",
                fontSize:'clamp(22px,3vw,34px)',color:'white',
                fontWeight:700,lineHeight:1,margin:0}}>
                Admin <em style={{color:C.goldL,fontStyle:'italic'}}>Dashboard</em>
              </h1>
            </div>
          </div>

          {/* Right — user + refresh */}
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,
                color:'white',fontWeight:600}}>{user?.name}</div>
              <div style={{fontSize:7,letterSpacing:'0.4em',color:`${C.goldL}75`,
                textTransform:'uppercase',marginTop:2}}>{user?.role}</div>
            </div>
            <motion.button whileTap={{scale:0.93}} onClick={fetchDashboard}
              style={{padding:9,background:'rgba(255,255,255,0.08)',
                border:`1px solid ${C.goldL}38`,cursor:'pointer',
                display:'flex',alignItems:'center'}}>
              <FiRefreshCw size={15} color={C.goldL}/>
            </motion.button>
          </div>
        </div>
      </div>

      <Stitch c1={C.maroon} c2={C.goldB}/>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'26px 24px'}}>

        {/* ══ STAT CARDS ══ */}
        <div className="stats-grid"
          style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',
            gap:12,marginBottom:28}}>
          {STAT_CARDS.map((s,i) => (
            <motion.div key={i}
              initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.06,duration:0.5,ease:[0.22,1,0.36,1]}}
              style={{background:C.white,border:`1px solid ${C.border}`,
                padding:'16px 14px',position:'relative',overflow:'hidden'}}>
              {/* Coloured top stripe */}
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,
                background:s.color,opacity:0.38}}/>
              <s.icon size={16} color={s.color}
                style={{display:'block',marginBottom:8,marginTop:4}}/>
              <div style={{fontFamily:"'Cormorant Garamond',serif",
                fontSize:30,color:s.color,fontWeight:700,lineHeight:1}}>
                {s.value}
              </div>
              <div style={{fontSize:7.5,letterSpacing:'0.25em',color:C.muted,
                textTransform:'uppercase',marginTop:5,lineHeight:1.5}}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══ TABS ══ */}
        <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:20,
          borderBottom:`2px solid ${C.border}`,flexWrap:'wrap'}}>
          {[
            {id:'orders',label:'Orders',count:orders.length,  icon:FiShoppingBag},
            {id:'users', label:'Users', count:users.length,   icon:FiUsers},
          ].map(tab => (
            <button key={tab.id} className="adm-tab"
              onClick={()=>{setActiveTab(tab.id);setSearch('');setStatusFilter('All');}}
              style={{display:'flex',alignItems:'center',gap:7,padding:'11px 22px',
                background:'transparent',border:'none',cursor:'pointer',
                borderBottom:`2px solid ${activeTab===tab.id?C.maroon:'transparent'}`,
                marginBottom:-2,fontFamily:"'Montserrat',sans-serif",
                fontSize:9,letterSpacing:'0.35em',fontWeight:700,
                textTransform:'uppercase',
                color:activeTab===tab.id?C.maroon:C.muted}}>
              <tab.icon size={13}/>
              {tab.label}
              <span style={{
                background:activeTab===tab.id?`${C.maroon}18`:`${C.muted}10`,
                color:activeTab===tab.id?C.maroon:C.muted,
                fontSize:8,padding:'2px 7px',fontWeight:700}}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ══ CONTROLS ══ */}
        <div className="adm-controls"
          style={{display:'flex',gap:10,marginBottom:18,
            flexWrap:'wrap',alignItems:'center'}}>

          {/* Search input */}
          <div style={{flex:1,minWidth:200,position:'relative',
            display:'flex',alignItems:'center'}}>
            <FiSearch size={13} color={C.muted}
              style={{position:'absolute',left:11,pointerEvents:'none'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={activeTab==='orders'
                ?'Search order ID, patron name, email…'
                :'Search patron name or email…'}
              style={{width:'100%',background:C.white,border:`1px solid ${C.border}`,
                padding:'9px 12px 9px 32px',
                fontFamily:"'Montserrat',sans-serif",fontSize:11,
                color:C.ink,outline:'none'}}/>
          </div>

          {/* Status filter (orders tab only) */}
          {activeTab==='orders' && (
            <div style={{position:'relative',display:'flex',alignItems:'center'}}>
              <FiFilter size={12} color={C.muted}
                style={{position:'absolute',left:11,pointerEvents:'none'}}/>
              <select value={statusFilter}
                onChange={e=>{setStatusFilter(e.target.value);setSearch('');}}
                style={{appearance:'none',background:C.white,
                  border:`1px solid ${C.border}`,
                  padding:'9px 32px 9px 30px',
                  fontFamily:"'Montserrat',sans-serif",fontSize:9,
                  color:C.ink,cursor:'pointer',outline:'none',
                  letterSpacing:'0.18em',textTransform:'uppercase'}}>
                <option value="All">All Statuses</option>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
              <FiChevronDown size={11} color={C.muted}
                style={{position:'absolute',right:10,pointerEvents:'none'}}/>
            </div>
          )}

          {/* Results count pill */}
          <div style={{fontSize:9,letterSpacing:'0.25em',color:C.muted,
            textTransform:'uppercase',padding:'9px 14px',
            background:C.parchment,border:`1px solid ${C.border}`}}>
            {activeTab==='orders'
              ? `${filteredOrders.length} result${filteredOrders.length!==1?'s':''}`
              : `${filteredUsers.length} user${filteredUsers.length!==1?'s':''}`}
          </div>
        </div>

        <Stitch c1={C.goldB} c2={C.maroon}/>
        <div style={{height:14}}/>

        {/* ══ TABLES ══ */}
        <AnimatePresence mode="wait">

          {/* ── ORDERS TABLE ── */}
          {activeTab==='orders' && (
            <motion.div key="orders"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}}
              transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>
              <div className="adm-table-wrap">
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:C.parchment,
                      borderBottom:`2px solid ${C.border}`}}>
                      {['Order ID','Patron','Items','Status','Actions'].map(h => (
                        <th key={h} style={{padding:'11px 14px',textAlign:'left',
                          fontFamily:"'Montserrat',sans-serif",fontSize:8,
                          letterSpacing:'0.38em',color:C.muted,fontWeight:700,
                          textTransform:'uppercase',whiteSpace:'nowrap'}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{padding:'52px',textAlign:'center'}}>
                          <div style={{display:'flex',flexDirection:'column',
                            alignItems:'center',gap:10}}>
                            <Rangoli s={38}/>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",
                              fontSize:18,color:C.muted}}>No orders found</div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.map((o,i) => (
                      <motion.tr key={o._id}
                        initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                        transition={{delay:i*0.025,duration:0.28}}
                        className="adm-tr"
                        style={{borderBottom:`1px solid ${C.border}`,
                          background:i%2===0?C.white:C.page,
                          transition:'background .18s'}}>

                        {/* Order ID + date */}
                        <td style={{padding:'13px 14px',whiteSpace:'nowrap'}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",
                            fontSize:15,color:C.maroon,fontWeight:700}}>
                            #{o._id?.slice(-6).toUpperCase()}
                          </div>
                          <div style={{fontSize:8,color:C.muted,
                            letterSpacing:'0.15em',marginTop:3}}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN',
                              {day:'2-digit',month:'short',year:'numeric'})}
                          </div>
                        </td>

                        {/* Patron info */}
                        <td style={{padding:'13px 14px'}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",
                            fontSize:15,color:C.ink,fontWeight:600}}>
                            {o.userId?.name || '—'}
                          </div>
                          <div style={{fontSize:9,color:C.muted,marginTop:2}}>
                            {o.userId?.email || '—'}
                          </div>
                          {o.userId?.city && (
                            <div style={{fontSize:8,letterSpacing:'0.2em',
                              color:C.gold,textTransform:'uppercase',marginTop:2}}>
                              {o.userId.city}
                            </div>
                          )}
                        </td>

                        {/* Items */}
                        <td style={{padding:'13px 14px'}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",
                            fontSize:18,color:C.ink,fontWeight:600}}>
                            {o.items?.length || 0}
                          </div>
                          <div style={{fontSize:8,color:C.muted}}>
                            item{o.items?.length !== 1 ? 's' : ''}
                          </div>
                        </td>

                        {/* Status badge */}
                        <td style={{padding:'13px 14px'}}>
                          <Badge status={o.status}/>
                        </td>

                        {/* Actions */}
                        <td style={{padding:'13px 14px'}}>
                          <div style={{display:'flex',alignItems:'center',
                            gap:7,flexWrap:'wrap'}}>
                            {!TERMINAL.includes(o.status) && (
                              <StatusDropdown order={o}
                                onUpdate={handleUpdateStatus}/>
                            )}
                            {!TERMINAL.includes(o.status) && (
                              <motion.button whileTap={{scale:0.95}}
                                onClick={()=>{
                                  setModal({type:'cancel',
                                    payload:{orderId:o._id}});
                                  setModalInput('');
                                }}
                                style={{display:'flex',alignItems:'center',gap:5,
                                  padding:'6px 11px',
                                  background:`${C.red}10`,
                                  border:`1px solid ${C.red}40`,
                                  cursor:'pointer',
                                  fontFamily:"'Montserrat',sans-serif",
                                  fontSize:8,letterSpacing:'0.2em',
                                  color:C.red,fontWeight:700,
                                  textTransform:'uppercase'}}>
                                <FiX size={9}/>Cancel
                              </motion.button>
                            )}
                            {TERMINAL.includes(o.status) && (
                              <span style={{fontSize:8,letterSpacing:'0.2em',
                                color:C.muted,textTransform:'uppercase'}}>—</span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── USERS TABLE ── */}
          {activeTab==='users' && (
            <motion.div key="users"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}}
              transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>
              <div className="adm-table-wrap">
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:C.parchment,
                      borderBottom:`2px solid ${C.border}`}}>
                      {['Patron','Contact','City','Role','Joined','Orders','Actions'].map(h => (
                        <th key={h} style={{padding:'11px 14px',textAlign:'left',
                          fontFamily:"'Montserrat',sans-serif",fontSize:8,
                          letterSpacing:'0.38em',color:C.muted,fontWeight:700,
                          textTransform:'uppercase',whiteSpace:'nowrap'}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{padding:'52px',textAlign:'center'}}>
                          <div style={{display:'flex',flexDirection:'column',
                            alignItems:'center',gap:10}}>
                            <Rangoli s={38}/>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",
                              fontSize:18,color:C.muted}}>No users found</div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.map((u,i) => {
                      const orderCount  = orders.filter(o =>
                        (o.userId?._id || o.userId) === u._id).length;
                      const isProtected = u._id === user?._id || u.role === 'admin';
                      return (
                        <motion.tr key={u._id}
                          initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                          transition={{delay:i*0.025,duration:0.28}}
                          className="adm-tr"
                          style={{borderBottom:`1px solid ${C.border}`,
                            background:i%2===0?C.white:C.page,
                            transition:'background .18s'}}>

                          {/* Patron + avatar */}
                          <td style={{padding:'13px 14px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                              <div style={{width:32,height:32,borderRadius:'50%',
                                flexShrink:0,
                                background:`linear-gradient(135deg,${C.maroon},${C.maroonL})`,
                                border:`1.5px solid ${C.gold}50`,
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontFamily:"'Cormorant Garamond',serif",
                                fontSize:15,color:C.goldL,fontWeight:700}}>
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",
                                fontSize:15,color:C.ink,fontWeight:600}}>
                                {u.name}
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td style={{padding:'13px 14px'}}>
                            <div style={{fontSize:10,color:C.ink}}>{u.email}</div>
                            <div style={{fontSize:9,color:C.muted,marginTop:2}}>
                              {u.phone || '—'}
                            </div>
                          </td>

                          {/* City */}
                          <td style={{padding:'13px 14px'}}>
                            <div style={{fontSize:9,letterSpacing:'0.2em',
                              color:C.gold,textTransform:'uppercase'}}>
                              {u.city || '—'}
                            </div>
                          </td>

                          {/* Role badge */}
                          <td style={{padding:'13px 14px'}}>
                            <span style={{padding:'3px 9px',
                              background:
                                u.role==='admin' ? `${C.maroon}18` :
                                u.role==='staff' ? `${C.teal}18`   : `${C.gold}18`,
                              color:
                                u.role==='admin' ? C.maroon :
                                u.role==='staff' ? C.teal   : C.muted,
                              fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
                              letterSpacing:'0.25em',fontWeight:700,
                              textTransform:'uppercase'}}>
                              {u.role}
                            </span>
                          </td>

                          {/* Joined */}
                          <td style={{padding:'13px 14px',whiteSpace:'nowrap'}}>
                            <div style={{fontSize:10,color:C.muted}}>
                              {new Date(u.createdAt).toLocaleDateString('en-IN',
                                {day:'2-digit',month:'short',year:'numeric'})}
                            </div>
                          </td>

                          {/* Order count */}
                          <td style={{padding:'13px 14px'}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",
                              fontSize:20,color:C.maroon,fontWeight:700}}>
                              {orderCount}
                            </div>
                          </td>

                          {/* Delete */}
                          <td style={{padding:'13px 14px'}}>
                            {isProtected ? (
                              <span style={{fontSize:8,letterSpacing:'0.2em',
                                color:C.muted,textTransform:'uppercase'}}>
                                Protected
                              </span>
                            ) : (
                              <motion.button whileTap={{scale:0.93}}
                                onClick={()=>setModal({type:'deleteUser',
                                  payload:{userId:u._id,userName:u.name}})}
                                style={{display:'flex',alignItems:'center',gap:5,
                                  padding:'6px 11px',
                                  background:`${C.red}10`,
                                  border:`1px solid ${C.red}40`,
                                  cursor:'pointer',
                                  fontFamily:"'Montserrat',sans-serif",
                                  fontSize:8,letterSpacing:'0.2em',
                                  color:C.red,fontWeight:700,
                                  textTransform:'uppercase'}}>
                                <FiTrash2 size={10}/> Delete
                              </motion.button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer decoration ── */}
        <div style={{marginTop:32}}>
          <Stitch c1={C.maroon} c2={C.teal}/>
          <div style={{display:'flex',alignItems:'center',
            justifyContent:'center',gap:8,padding:'14px 0'}}>
            {[0,1,2,1,0].map((s,i) => (
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
            Tailor24 Admin Suite · {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* ══ MODALS ══ */}
      <ConfirmModal
        isOpen={modal?.type==='cancel'}
        danger
        title="Cancel Order"
        message="This will mark the order as cancelled. This action cannot be undone."
        hasInput inputLabel="Cancellation Reason"
        inputValue={modalInput} onInputChange={setModalInput}
        onConfirm={handleCancel}
        onCancel={()=>{setModal(null);setModalInput('');}}
      />

      <ConfirmModal
        isOpen={modal?.type==='deleteUser'}
        danger
        title={`Delete "${modal?.payload?.userName}"?`}
        message="Permanently deletes this user account and all their orders. Cannot be undone."
        onConfirm={handleDeleteUser}
        onCancel={()=>setModal(null)}
      />
    </div>
  );
}