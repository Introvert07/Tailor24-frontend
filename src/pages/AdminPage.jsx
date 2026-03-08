import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';
import {
  FiUsers, FiShoppingBag, FiCheck, FiX, FiRefreshCw, FiTrash2,
  FiEdit3, FiChevronDown, FiSearch, FiClock, FiPackage,
  FiTrendingUp, FiMail, FiCalendar, FiPhone, FiMapPin,
} from 'react-icons/fi';

/* ─── THEME ─── */
const C = {
  page:'#FAF3E4', parchment:'#F2E5CA', white:'#FFFDF7',
  maroon:'#6B0F1A', gold:'#B5892E', goldL:'#F0C040',
  teal:'#1A5C5C', ink:'#1A0800', muted:'#7A6040',
  border:'#D4BC94', borderL:'#EDE0C8',
  green:'#1A5C2A', red:'#7A0A0A', goldB:'#D4A017',
};

/* ─── ORDER META ─── */
const STATUS_LABEL = {
  ORDER_CREATED:'Created', ORDER_VERIFIED:'Verified',
  FABRIC_PICKUP_SCHEDULED:'Pickup Scheduled', FABRIC_RECEIVED:'Fabric Received',
  STITCHING_IN_PROGRESS:'Stitching', TRIAL_READY:'Trial Ready',
  QC_PASSED:'QC Passed', READY_FOR_PICKUP:'Ready for Pickup',
  OUT_FOR_DELIVERY:'Out for Delivery', COMPLETED:'Completed', CANCELLED:'Cancelled',
};
const SM = {
  ORDER_CREATED:{c:C.goldB,i:FiClock}, ORDER_VERIFIED:{c:C.teal,i:FiCheck},
  FABRIC_PICKUP_SCHEDULED:{c:'#5A3A1A',i:FiPackage}, FABRIC_RECEIVED:{c:'#7A4A1A',i:FiPackage},
  STITCHING_IN_PROGRESS:{c:C.maroon,i:FiPackage}, TRIAL_READY:{c:'#2A4A7A',i:FiRefreshCw},
  QC_PASSED:{c:C.teal,i:FiCheck}, READY_FOR_PICKUP:{c:C.goldB,i:FiTrendingUp},
  OUT_FOR_DELIVERY:{c:'#4A2A7A',i:FiTrendingUp}, COMPLETED:{c:C.green,i:FiCheck},
  CANCELLED:{c:C.red,i:FiX},
};
const ALL_STATUSES = Object.keys(SM);
const TERMINAL = ['COMPLETED','CANCELLED'];
const CONSULT_S = {
  Pending:   {c:C.goldB, l:'Pending'},
  Confirmed: {c:C.teal,  l:'Confirmed'},
  Completed: {c:C.green, l:'Completed'},
};

/* ─── TINY HELPERS ─── */
const Lbl = ({t,c=C.muted}) => (
  <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
    letterSpacing:'0.45em',textTransform:'uppercase',fontWeight:700,color:c}}>{t}</span>
);

const Pill = ({status,map}) => {
  const m=map[status]||map[Object.keys(map)[0]];
  const Icon=m.i||FiClock;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',
      background:`${m.c}15`,fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
      letterSpacing:'0.2em',color:m.c,fontWeight:700,textTransform:'uppercase',whiteSpace:'nowrap'}}>
      {m.i && <Icon size={9}/>}{m.l||STATUS_LABEL[status]||status}
    </span>
  );
};

const Rangoli = ({s=36}) => (
  <svg width={s} height={s} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" stroke={C.gold} strokeWidth="0.7" fill="none" opacity="0.35"/>
    <circle cx="22" cy="22" r="12" stroke={C.gold} strokeWidth="0.5" fill="none" opacity="0.28"/>
    <circle cx="22" cy="22" r="6"  stroke={C.maroon} strokeWidth="0.7" fill="none" opacity="0.35"/>
    <circle cx="22" cy="22" r="2.5" fill={C.gold} opacity="0.5"/>
    <circle cx="22" cy="22" r="1.2" fill={C.maroon} opacity="0.8"/>
    {[...Array(6)].map((_,i)=>{
      const a=(i/6)*Math.PI*2,px=22+19*Math.cos(a),py=22+19*Math.sin(a);
      return <ellipse key={i} cx={px} cy={py} rx="1.8" ry="3"
        transform={`rotate(${i*60+90},${px},${py})`} fill={`${C.maroon}40`} stroke={C.gold} strokeWidth="0.4"/>;
    })}
  </svg>
);

const TH = ({cols}) => (
  <thead>
    <tr style={{background:C.parchment,borderBottom:`2px solid ${C.border}`}}>
      {cols.map(h=>(
        <th key={h} style={{padding:'10px 14px',textAlign:'left',
          fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
          letterSpacing:'0.38em',color:C.muted,fontWeight:700,
          textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>
      ))}
    </tr>
  </thead>
);

const EmptyRow = ({cols,label}) => (
  <tr><td colSpan={cols} style={{padding:'48px',textAlign:'center'}}>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
      <Rangoli s={36}/>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.muted}}>{label}</span>
    </div>
  </td></tr>
);

/* ─── CONFIRM MODAL ─── */
function ConfirmModal({open,title,msg,onOk,onClose,danger=false,input='',onInput}) {
  if (!open) return null;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:500,background:`${C.maroon}40`,
        backdropFilter:'blur(6px)',display:'flex',alignItems:'center',
        justifyContent:'center',padding:20}}>
      <motion.div initial={{scale:.93,y:16}} animate={{scale:1,y:0}}
        transition={{duration:.25,ease:[.22,1,.36,1]}}
        style={{background:C.white,maxWidth:400,width:'100%',
          border:`1px solid ${C.border}`,boxShadow:`0 20px 60px ${C.maroon}22`}}>
        <div style={{background:danger?C.maroon:C.parchment,padding:'20px 24px 16px'}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,
            color:danger?'white':C.ink,fontWeight:700,marginBottom:4}}>{title}</div>
          <p style={{fontSize:12,color:danger?'rgba(255,255,255,0.6)':C.muted,
            lineHeight:1.7,margin:0}}>{msg}</p>
        </div>
        <div style={{padding:'16px 24px 20px'}}>
          {onInput!==undefined && (
            <textarea value={input} onChange={e=>onInput(e.target.value)} rows={3}
              placeholder="Enter reason…"
              style={{width:'100%',background:C.parchment,border:`1px solid ${C.border}`,
                padding:'10px 12px',fontFamily:"'Montserrat',sans-serif",fontSize:12,
                color:C.ink,resize:'vertical',outline:'none',boxSizing:'border-box',marginBottom:14}}/>
          )}
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button onClick={onClose} style={{padding:'8px 18px',border:`1px solid ${C.border}`,
              background:'transparent',cursor:'pointer',fontFamily:"'Montserrat',sans-serif",
              fontSize:8,letterSpacing:'0.3em',color:C.muted,textTransform:'uppercase',fontWeight:700}}>
              Cancel
            </button>
            <button onClick={onOk} style={{padding:'8px 18px',
              background:danger?C.maroon:C.teal,border:'none',cursor:'pointer',
              fontFamily:"'Montserrat',sans-serif",fontSize:8,letterSpacing:'0.3em',
              color:'white',textTransform:'uppercase',fontWeight:700}}>
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── STATUS DROPDOWN ─── */
function StatusDrop({order,onUpdate}) {
  const [open,setOpen] = useState(false);
  return (
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(v=>!v)}
        style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',
          background:'transparent',border:`1px solid ${C.border}`,cursor:'pointer',
          fontFamily:"'Montserrat',sans-serif",fontSize:7.5,letterSpacing:'0.25em',
          color:C.maroon,fontWeight:700,textTransform:'uppercase'}}>
        <FiEdit3 size={9}/>Update<FiChevronDown size={9} style={{transform:open?'rotate(180deg)':'none'}}/>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{position:'fixed',inset:0,zIndex:49}} onClick={()=>setOpen(false)}/>
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}}
              style={{position:'absolute',top:'calc(100% + 4px)',left:0,zIndex:50,
                background:C.white,border:`1px solid ${C.border}`,
                boxShadow:`0 10px 28px ${C.maroon}14`,minWidth:180,overflow:'hidden'}}>
              {ALL_STATUSES.filter(s=>s!=='CANCELLED').map(s=>{
                const m=SM[s]; const Icon=m.i; const active=order.status===s;
                return (
                  <button key={s} onClick={()=>{setOpen(false);onUpdate(order._id,s,`→ ${STATUS_LABEL[s]}`);}}
                    style={{display:'flex',alignItems:'center',gap:8,width:'100%',
                      padding:'8px 12px',background:active?`${m.c}10`:'transparent',
                      border:'none',cursor:'pointer',borderLeft:`2px solid ${active?m.c:'transparent'}`,
                      fontFamily:"'Montserrat',sans-serif",fontSize:8,letterSpacing:'0.12em',
                      textTransform:'uppercase',color:m.c,fontWeight:700}}
                    onMouseEnter={e=>{if(!active)e.currentTarget.style.background=C.parchment;}}
                    onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent';}}>
                    <Icon size={10}/>{STATUS_LABEL[s]}
                    {active&&<span style={{marginLeft:'auto',fontSize:7,opacity:.6}}>CURRENT</span>}
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

/* ─── SEARCH BAR ─── */
const SearchBar = ({val,onChange,ph}) => (
  <div style={{flex:1,minWidth:0,display:'flex',alignItems:'center',
    background:C.white,border:`1px solid ${C.border}`,padding:'8px 12px',gap:8}}>
    <FiSearch size={13} color={C.muted} style={{flexShrink:0}}/>
    <input value={val} onChange={e=>onChange(e.target.value)} placeholder={ph}
      style={{background:'none',border:'none',outline:'none',width:'100%',minWidth:0,
        fontFamily:"'Montserrat',sans-serif",fontSize:11,color:C.ink}}/>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function AdminPage() {
  const {user} = useSelector(s=>s.auth);
  const navigate = useNavigate();

  const [data,        setData]        = useState({stats:{},users:[],orders:[],consultations:[]});
  const [inquiries,   setInquiries]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('orders');
  const [search,      setSearch]      = useState('');
  const [statusF,     setStatusF]     = useState('All');
  const [inqSearch,   setInqSearch]   = useState('');
  const [inqF,        setInqF]        = useState('All');
  const [cSearch,     setCSearch]     = useState('');
  const [cF,          setCF]          = useState('All');
  const [modal,       setModal]       = useState(null);
  const [mInput,      setMInput]      = useState('');

  useEffect(()=>{
    if(user&&user.role!=='admin'&&user.role!=='staff') navigate('/',{replace:true});
  },[user,navigate]);

  const load = useCallback(async()=>{
    try {
      setLoading(true);
      const [{data:res},{data:inqRes}] = await Promise.all([
        adminService.getDashboard(),
        adminService.getInquiries(),
      ]);
      setData({
        stats:res.stats||{}, users:res.users||[],
        orders:res.orders||[], consultations:res.consultations||[],
      });
      setInquiries(inqRes.inquiries||[]);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{load();},[load]);

  /* ── handlers ── */
  const updateStatus = async(orderId,status,note)=>{
    try { await adminService.updateOrderStatus(orderId,status,note);
      toast.success(`→ ${STATUS_LABEL[status]}`); load(); }
    catch { toast.error('Failed'); }
  };
  const doModal = async()=>{
    const {type,id,name}=modal;
    try {
      if(type==='cancelOrder')  { await adminService.cancelOrder(id,mInput||'Cancelled by admin'); toast.success('Order cancelled'); }
      if(type==='deleteUser')   { await adminService.deleteUser(id); toast.success('User deleted'); }
      if(type==='deleteInquiry'){ await adminService.deleteInquiry(id); toast.success('Inquiry deleted'); }
      if(type==='deleteConsult'){ await adminService.deleteConsultation(id); toast.success('Consultation deleted'); }
      setModal(null); setMInput(''); load();
    } catch(e) { toast.error(e.message||'Failed'); }
  };
  const updateInqStatus = async(inquiryId,status)=>{
    try { await adminService.updateInquiryStatus(inquiryId,status);
      toast.success(`Marked ${status}`); load(); }
    catch { toast.error('Failed'); }
  };
  const updateConsultStatus = async(id,status)=>{
    try { await adminService.updateConsultationStatus(id,status);
      toast.success(`Marked ${CONSULT_S[status]?.l||status}`); load(); }
    catch { toast.error('Failed'); }
  };

  const {stats={},users=[],orders=[],consultations=[]} = data;

  /* ── filtered lists ── */
  const fOrders = orders.filter(o=>{
    const q=search.toLowerCase();
    return (!q||o._id?.slice(-6).toLowerCase().includes(q)||
      o.userId?.name?.toLowerCase().includes(q)||
      o.userId?.email?.toLowerCase().includes(q))&&
      (statusF==='All'||o.status===statusF);
  });
  const fUsers = users.filter(u=>{
    const q=search.toLowerCase();
    return !q||u.name?.toLowerCase().includes(q)||u.email?.toLowerCase().includes(q);
  });
  const fInquiries = inquiries.filter(i=>{
    const q=inqSearch.toLowerCase();
    return (!q||i.name?.toLowerCase().includes(q)||i.phone?.toLowerCase().includes(q)||
      i.subject?.toLowerCase().includes(q))&&(inqF==='All'||i.status===inqF);
  });
  const fConsults = consultations.filter(c=>{
    const q=cSearch.toLowerCase();
    return (!q||c.name?.toLowerCase().includes(q)||
      c.mobileNumber?.toLowerCase().includes(q)||
      c.address?.toLowerCase().includes(q)||
      c.timeSlot?.toLowerCase().includes(q))&&
      (cF==='All'||c.status===cF);
  });

  const STAT_CARDS = [
    {l:'Orders',       v:stats.totalOrders||0,     icon:FiShoppingBag, c:C.maroon},
    {l:'New',          v:stats.newOrders||0,        icon:FiClock,       c:C.goldB},
    {l:'Stitching',    v:stats.stitching||0,        icon:FiPackage,     c:'#7A4A1A'},
    {l:'Completed',    v:stats.completed||0,        icon:FiTrendingUp,  c:C.green},
    {l:'Cancelled',    v:stats.cancelled||0,        icon:FiX,           c:C.red},
    {l:'Users',        v:stats.totalUsers||0,       icon:FiUsers,       c:'#2A4A7A'},
    {l:'Inquiries',    v:inquiries.length,          icon:FiMail,        c:'#4A2A7A'},
    {l:'Consultations',v:consultations.length,      icon:FiCalendar,    c:'#5A1A6B'},
  ];

  const TABS = [
    {id:'orders',        label:'Orders',        count:orders.length,        icon:FiShoppingBag},
    {id:'users',         label:'Users',         count:users.length,         icon:FiUsers},
    {id:'inquiries',     label:'Inquiries',     count:inquiries.length,     icon:FiMail},
    {id:'consultations', label:'Consultations', count:consultations.length, icon:FiCalendar},
  ];

  if(loading) return (
    <div style={{minHeight:'100vh',background:C.page,display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',gap:14,paddingTop:64}}>
      <motion.div animate={{rotate:360}} transition={{duration:3,repeat:Infinity,ease:'linear'}}>
        <Rangoli s={52}/>
      </motion.div>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.muted,letterSpacing:'0.2em'}}>
        Loading Dashboard…
      </span>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:C.page,fontFamily:"'Montserrat',sans-serif",
      color:C.ink,
      /* ── NAVBAR OFFSET: change 64px to match your actual navbar height ── */
      paddingTop:64}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;}
        .atr:hover{background:${C.parchment}!important;}

        /* ── STAT GRID ── */
        .admin-stat-grid{
          display:grid;
          grid-template-columns:repeat(8,1fr);
          gap:10px;
          margin-bottom:24px;
        }
        @media(max-width:1100px){
          .admin-stat-grid{grid-template-columns:repeat(4,1fr);}
        }
        @media(max-width:640px){
          .admin-stat-grid{grid-template-columns:repeat(2,1fr);gap:8px;}
        }

        /* ── TABS ── */
        .admin-tabs{
          display:flex;
          border-bottom:2px solid ${C.borderL};
          margin-bottom:18px;
          flex-wrap:wrap;
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
        }
        .admin-tab-btn{
          display:flex;
          align-items:center;
          gap:6px;
          padding:10px 16px;
          background:transparent;
          border:none;
          cursor:pointer;
          border-bottom:2px solid transparent;
          margin-bottom:-2px;
          font-family:'Montserrat',sans-serif;
          font-size:8.5px;
          letter-spacing:0.3em;
          font-weight:700;
          text-transform:uppercase;
          transition:color .2s;
          white-space:nowrap;
          flex-shrink:0;
        }
        @media(max-width:480px){
          .admin-tab-btn{padding:10px 10px;font-size:7.5px;gap:4px;}
        }

        /* ── TABLE WRAPPER ── */
        .admin-table-wrap{
          background:${C.white};
          border:1px solid ${C.borderL};
          width:100%;
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
        }
        .admin-table-wrap table{
          width:100%;
          min-width:600px;
          border-collapse:collapse;
        }

        /* ── FILTERS ROW ── */
        .admin-filters{
          display:flex;
          gap:8px;
          margin-bottom:16px;
          flex-wrap:wrap;
          align-items:center;
        }
        .admin-filters select{
          padding:9px 12px;
          background:${C.white};
          border:1px solid ${C.border};
          font-family:'Montserrat',sans-serif;
          font-size:8.5px;
          color:${C.ink};
          cursor:pointer;
          outline:none;
          letter-spacing:0.15em;
          text-transform:uppercase;
          max-width:100%;
        }
        @media(max-width:480px){
          .admin-filters{gap:6px;}
          .admin-filters select{font-size:8px;padding:8px 10px;}
        }

        /* ── HEADER ── */
        .admin-header-inner{
          max-width:1280px;
          margin:0 auto;
          display:flex;
          align-items:center;
          justify-content:space-between;
          flex-wrap:wrap;
          gap:12px;
          position:relative;
          z-index:2;
          padding:0 4px;
        }
        @media(max-width:480px){
          .admin-header-inner{gap:8px;}
        }

        /* ── CONTENT PAD ── */
        .admin-content{
          max-width:1280px;
          margin:0 auto;
          padding:20px 24px;
        }
        @media(max-width:768px){
          .admin-content{padding:16px 14px;}
        }
        @media(max-width:480px){
          .admin-content{padding:12px 10px;}
        }

        /* ── CONSULT SUMMARY STRIP ── */
        .consult-summary{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:10px;
          margin-bottom:18px;
        }
        @media(max-width:640px){
          .consult-summary{grid-template-columns:repeat(2,1fr);gap:8px;}
        }

        /* ── CONSULT CARD FIELDS GRID ── */
        .consult-fields{
          padding:16px 20px;
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
          gap:0 28px;
        }
        @media(max-width:480px){
          .consult-fields{
            grid-template-columns:1fr;
            padding:12px 14px;
          }
        }

        /* ── USER TABLE: hide city col on small ── */
        @media(max-width:640px){
          .col-city{display:none;}
        }

        /* ── INQUIRY STATUS FILTER BTNS ── */
        .inq-filter-btn{
          padding:8px 12px;
          border-width:1px;
          border-style:solid;
          cursor:pointer;
          font-family:'Montserrat',sans-serif;
          font-size:8px;
          letter-spacing:0.3em;
          text-transform:uppercase;
          font-weight:700;
          white-space:nowrap;
          flex-shrink:0;
        }
        @media(max-width:480px){
          .inq-filter-btn{padding:7px 8px;font-size:7px;letter-spacing:0.2em;}
        }

        /* ── ACTION BTNS ── */
        .action-area{
          display:flex;
          gap:6px;
          flex-wrap:wrap;
        }

        /* ── HEADER responsive title ── */
        .admin-title{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(18px,3vw,32px);
          color:white;
          font-weight:700;
          margin:0;
          line-height:1;
        }
        .admin-subtitle{
          font-size:7px;
          letter-spacing:0.5em;
          color:rgba(240,192,64,0.7);
          text-transform:uppercase;
          margin-bottom:3px;
        }
        @media(max-width:380px){
          .admin-subtitle{display:none;}
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:C.maroon,padding:'20px 24px 16px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-10,bottom:-20,fontFamily:"'Cormorant Garamond',serif",
          fontSize:'12vw',color:'rgba(255,255,255,0.04)',lineHeight:1,fontStyle:'italic',
          userSelect:'none',pointerEvents:'none'}}>Admin</div>
        <div className="admin-header-inner">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Rangoli s={38}/>
            <div>
              <div className="admin-subtitle">Tailor24 · Control Centre</div>
              <h1 className="admin-title">
                Admin <em style={{color:C.goldL}}>Dashboard</em>
              </h1>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:'white',fontWeight:600}}>
                {user?.name}
              </div>
              <div style={{fontSize:7,letterSpacing:'0.4em',color:`${C.goldL}70`,textTransform:'uppercase',marginTop:1}}>
                {user?.role}
              </div>
            </div>
            <button onClick={load} style={{padding:9,background:'rgba(255,255,255,0.08)',
              border:`1px solid ${C.goldL}35`,cursor:'pointer',display:'flex',alignItems:'center',
              flexShrink:0}}>
              <FiRefreshCw size={14} color={C.goldL}/>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">

        {/* ── STAT CARDS ── */}
        <div className="admin-stat-grid">
          {STAT_CARDS.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
              transition={{delay:i*.05,duration:.4,ease:[.22,1,.36,1]}}
              style={{background:C.white,border:`1px solid ${C.borderL}`,padding:'14px 12px',
                position:'relative',overflow:'hidden',boxShadow:`0 2px 8px ${C.ink}06`}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:2.5,background:s.c,opacity:.4}}/>
              <s.icon size={14} color={s.c} style={{display:'block',marginBottom:8,marginTop:2}}/>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,
                color:s.c,fontWeight:700,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:7,letterSpacing:'0.22em',color:C.muted,
                textTransform:'uppercase',marginTop:4,lineHeight:1.4}}>{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="admin-tabs">
          {TABS.map(t=>(
            <button key={t.id}
              className="admin-tab-btn"
              onClick={()=>{setTab(t.id);setSearch('');setStatusF('All');}}
              style={{
                borderBottomColor:tab===t.id?C.maroon:'transparent',
                color:tab===t.id?C.maroon:C.muted,
              }}>
              <t.icon size={12}/>
              {t.label}
              <span style={{padding:'1px 6px',background:tab===t.id?`${C.maroon}15`:`${C.muted}10`,
                color:tab===t.id?C.maroon:C.muted,fontSize:7.5,fontWeight:700}}>{t.count}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ══ ORDERS ══ */}
          {tab==='orders' && (
            <motion.div key="orders" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:.3}}>
              <div className="admin-filters">
                <SearchBar val={search} onChange={setSearch} ph="Search ID, patron, email…"/>
                <select value={statusF} onChange={e=>setStatusF(e.target.value)}>
                  <option value="All">All Statuses</option>
                  {ALL_STATUSES.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
                <div style={{padding:'9px 12px',background:C.parchment,border:`1px solid ${C.borderL}`,
                  fontSize:8.5,color:C.muted,letterSpacing:'0.2em',textTransform:'uppercase',
                  whiteSpace:'nowrap',flexShrink:0}}>
                  {fOrders.length} result{fOrders.length!==1?'s':''}
                </div>
              </div>
              <div className="admin-table-wrap">
                <table>
                  <TH cols={['Order ID','Patron','Status','Actions']}/>
                  <tbody>
                    {fOrders.length===0 ? <EmptyRow cols={4} label="No orders found"/>
                    : fOrders.map((o,i)=>(
                      <tr key={o._id} className="atr"
                        style={{borderBottom:`1px solid ${C.borderL}`,
                          background:i%2===0?C.white:C.page,transition:'background .15s'}}>
                        <td style={{padding:'12px 14px'}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,
                            color:C.maroon,fontWeight:700}}>#{o._id?.slice(-6).toUpperCase()}</div>
                          <div style={{fontSize:8,color:C.muted,marginTop:2}}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                          </div>
                        </td>
                        <td style={{padding:'12px 14px'}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,
                            color:C.ink,fontWeight:600}}>{o.userId?.name||'—'}</div>
                          <div style={{fontSize:9,color:C.muted,marginTop:2}}>{o.userId?.email}</div>
                          {o.userId?.city&&<div style={{fontSize:7.5,color:C.gold,letterSpacing:'0.2em',
                            textTransform:'uppercase',marginTop:2}}>{o.userId.city}</div>}
                        </td>
                        <td style={{padding:'12px 14px'}}>
                          <Pill status={o.status} map={Object.fromEntries(
                            Object.entries(SM).map(([k,v])=>[k,{...v,l:STATUS_LABEL[k]}]))}/>
                        </td>
                        <td style={{padding:'12px 14px'}}>
                          <div className="action-area">
                            {!TERMINAL.includes(o.status)&&<StatusDrop order={o} onUpdate={updateStatus}/>}
                            {!TERMINAL.includes(o.status)&&(
                              <button onClick={()=>{setModal({type:'cancelOrder',id:o._id});setMInput('');}}
                                style={{display:'flex',alignItems:'center',gap:4,padding:'5px 10px',
                                  background:`${C.red}0D`,border:`1px solid ${C.red}38`,cursor:'pointer',
                                  fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
                                  letterSpacing:'0.2em',color:C.red,fontWeight:700,textTransform:'uppercase',
                                  whiteSpace:'nowrap'}}>
                                <FiX size={9}/>Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ══ USERS ══ */}
          {tab==='users' && (
            <motion.div key="users" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:.3}}>
              <div className="admin-filters">
                <SearchBar val={search} onChange={setSearch} ph="Search name or email…"/>
              </div>
              <div className="admin-table-wrap">
                <table style={{minWidth:520}}>
                  <TH cols={['Patron','Contact','City','Role','Orders','Action']}/>
                  <tbody>
                    {fUsers.length===0 ? <EmptyRow cols={6} label="No users found"/>
                    : fUsers.map((u,i)=>{
                      const oCount=orders.filter(o=>(o.userId?._id||o.userId)===u._id).length;
                      const prot=u._id===user?._id||u.role==='admin';
                      return (
                        <tr key={u._id} className="atr"
                          style={{borderBottom:`1px solid ${C.borderL}`,
                            background:i%2===0?C.white:C.page,transition:'background .15s'}}>
                          <td style={{padding:'12px 14px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                              <div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,
                                background:`linear-gradient(135deg,${C.maroon},${C.maroon}CC)`,
                                border:`1.5px solid ${C.gold}45`,display:'flex',alignItems:'center',
                                justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",
                                fontSize:14,color:C.goldL,fontWeight:700}}>
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span style={{fontFamily:"'Cormorant Garamond',serif",
                                fontSize:15,color:C.ink,fontWeight:600}}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{padding:'12px 14px'}}>
                            <div style={{fontSize:10,color:C.ink}}>{u.email}</div>
                            <div style={{fontSize:9,color:C.muted,marginTop:2}}>{u.phone||'—'}</div>
                          </td>
                          <td className="col-city" style={{padding:'12px 14px',fontSize:9,color:C.gold,
                            letterSpacing:'0.2em',textTransform:'uppercase'}}>{u.city||'—'}</td>
                          <td style={{padding:'12px 14px'}}>
                            <span style={{padding:'3px 8px',fontSize:7.5,fontWeight:700,
                              letterSpacing:'0.2em',textTransform:'uppercase',
                              background:u.role==='admin'?`${C.maroon}15`:u.role==='staff'?`${C.teal}15`:`${C.gold}15`,
                              color:u.role==='admin'?C.maroon:u.role==='staff'?C.teal:C.muted,
                              whiteSpace:'nowrap'}}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{padding:'12px 14px',fontFamily:"'Cormorant Garamond',serif",
                            fontSize:20,color:C.maroon,fontWeight:700}}>{oCount}</td>
                          <td style={{padding:'12px 14px'}}>
                            {prot ? <Lbl t="Protected"/>
                            : <button onClick={()=>setModal({type:'deleteUser',id:u._id,name:u.name})}
                                style={{display:'flex',alignItems:'center',gap:4,padding:'5px 10px',
                                  background:`${C.red}0D`,border:`1px solid ${C.red}38`,cursor:'pointer',
                                  fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
                                  letterSpacing:'0.2em',color:C.red,fontWeight:700,textTransform:'uppercase',
                                  whiteSpace:'nowrap'}}>
                                <FiTrash2 size={9}/>Delete
                              </button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ══ INQUIRIES ══ */}
          {tab==='inquiries' && (
            <motion.div key="inq" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:.3}}>
              <div className="admin-filters">
                <SearchBar val={inqSearch} onChange={setInqSearch} ph="Search name, phone, subject…"/>
                {['All','new','read','replied'].map(f=>(
                  <button key={f} onClick={()=>setInqF(f)}
                    className="inq-filter-btn"
                    style={{borderColor:inqF===f?C.maroon:C.borderL,
                      background:inqF===f?C.maroon:'transparent',
                      color:inqF===f?'white':C.muted}}>{f}</button>
                ))}
              </div>
              <div className="admin-table-wrap">
                <table style={{minWidth:700}}>
                  <TH cols={['Name','Phone','Subject','Message','Status','Date','Actions']}/>
                  <tbody>
                    {fInquiries.length===0 ? <EmptyRow cols={7} label="No inquiries"/>
                    : fInquiries.map((inq,i)=>{
                      const sc=inq.status==='new'?C.goldB:inq.status==='read'?C.teal:C.green;
                      return (
                        <tr key={inq._id} className="atr"
                          style={{borderBottom:`1px solid ${C.borderL}`,
                            background:inq.status==='new'?`${C.goldB}05`:i%2===0?C.white:C.page}}>
                          <td style={{padding:'12px 14px',whiteSpace:'nowrap'}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,
                              fontWeight:700,color:C.ink}}>{inq.name}</div>
                            {inq.status==='new'&&<span style={{fontSize:7,color:C.goldB,
                              letterSpacing:'0.3em',fontWeight:700}}>● NEW</span>}
                          </td>
                          <td style={{padding:'12px 14px',fontSize:11,color:C.muted,whiteSpace:'nowrap'}}>{inq.phone}</td>
                          <td style={{padding:'12px 14px',maxWidth:150}}>
                            <span style={{fontSize:9,color:C.maroon,fontWeight:700,
                              letterSpacing:'0.1em',textTransform:'uppercase'}}>{inq.subject}</span>
                          </td>
                          <td style={{padding:'12px 14px',maxWidth:200}}>
                            <p style={{margin:0,fontSize:11,color:C.ink,lineHeight:1.6,
                              display:'-webkit-box',WebkitLineClamp:2,
                              WebkitBoxOrient:'vertical',overflow:'hidden'}}>{inq.message}</p>
                          </td>
                          <td style={{padding:'12px 14px'}}>
                            <span style={{display:'inline-flex',alignItems:'center',padding:'3px 9px',
                              background:`${sc}15`,fontSize:7.5,letterSpacing:'0.2em',
                              color:sc,fontWeight:700,textTransform:'uppercase'}}>{inq.status}</span>
                          </td>
                          <td style={{padding:'12px 14px',fontSize:10,color:C.muted,whiteSpace:'nowrap'}}>
                            {new Date(inq.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                          </td>
                          <td style={{padding:'12px 14px'}}>
                            <div className="action-area">
                              {inq.status==='new'&&<button onClick={()=>updateInqStatus(inq._id,'read')}
                                style={actionBtn(C.teal)}>Read</button>}
                              {inq.status!=='replied'&&<button onClick={()=>updateInqStatus(inq._id,'replied')}
                                style={actionBtn(C.green)}>Replied</button>}
                              <button onClick={()=>setModal({type:'deleteInquiry',id:inq._id,name:inq.name})}
                                style={actionBtn(C.red)}><FiTrash2 size={9}/></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ══ CONSULTATIONS ══ */}
          {tab==='consultations' && (
            <motion.div key="cons" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:.3}}>
              {/* Summary strip */}
              <div className="consult-summary">
                {Object.entries(CONSULT_S).map(([k,m])=>(
                  <div key={k} style={{background:C.white,border:`1px solid ${C.borderL}`,
                    borderTop:`3px solid ${m.c}`,padding:'12px 16px',
                    display:'flex',alignItems:'center',gap:10}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,
                      color:m.c,fontWeight:700,lineHeight:1}}>
                      {consultations.filter(c=>c.status===k).length}
                    </div>
                    <Lbl t={m.l} c={C.muted}/>
                  </div>
                ))}
              </div>

              <div className="admin-filters">
                <SearchBar val={cSearch} onChange={setCSearch} ph="Search name, mobile, address…"/>
                {['All','Pending','Confirmed','Completed'].map(f=>(
                  <button key={f} onClick={()=>setCF(f)}
                    className="inq-filter-btn"
                    style={{borderColor:cF===f?C.maroon:C.borderL,
                      background:cF===f?C.maroon:'transparent',
                      color:cF===f?'white':C.muted}}>{f}</button>
                ))}
              </div>

              {fConsults.length===0 ? (
                <div style={{padding:'48px',textAlign:'center',background:C.white,border:`1px solid ${C.borderL}`}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
                    <Rangoli s={36}/>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.muted}}>No consultations</span>
                  </div>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {fConsults.map((c,i)=>{
                    const sm=CONSULT_S[c.status]||CONSULT_S.Pending;
                    return (
                      <motion.div key={c._id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                        transition={{delay:i*.04}}
                        style={{background:C.white,border:`1px solid ${C.borderL}`,
                          borderLeft:`3px solid ${sm.c}`,overflow:'hidden'}}>
                        {/* Card header */}
                        <div style={{padding:'14px 20px',background:C.parchment,
                          borderBottom:`1px solid ${C.borderL}`,
                          display:'flex',justifyContent:'space-between',alignItems:'center',
                          flexWrap:'wrap',gap:10}}>
                          <div style={{display:'flex',alignItems:'center',gap:12}}>
                            <div style={{width:36,height:36,borderRadius:'50%',
                              background:`${C.maroon}10`,border:`1px solid ${C.border}`,
                              display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                              fontFamily:"'Cormorant Garamond',serif",fontSize:17,
                              color:C.maroon,fontWeight:700}}>
                              {c.name?.charAt(0)?.toUpperCase()||'?'}
                            </div>
                            <div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,
                                color:C.ink,fontWeight:700,lineHeight:1}}>
                                {c.name||'—'}
                              </div>
                              <div style={{fontSize:9,color:C.muted,marginTop:3,
                                display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
                                <FiPhone size={9}/>{c.mobileNumber}
                                &nbsp;·&nbsp;
                                {new Date(c.createdAt).toLocaleDateString('en-IN',
                                  {day:'2-digit',month:'short',year:'numeric'})}
                              </div>
                            </div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                            <span style={{display:'inline-flex',alignItems:'center',padding:'3px 9px',
                              background:`${sm.c}15`,fontSize:7.5,letterSpacing:'0.2em',
                              color:sm.c,fontWeight:700,textTransform:'uppercase'}}>{sm.l}</span>
                            {Object.entries(CONSULT_S).filter(([k])=>k!==c.status).map(([k,m])=>(
                              <button key={k} onClick={()=>updateConsultStatus(c._id,k)}
                                style={{padding:'3px 9px',border:`1px solid ${m.c}40`,
                                  background:`${m.c}08`,cursor:'pointer',
                                  fontFamily:"'Montserrat',sans-serif",fontSize:7,
                                  letterSpacing:'0.25em',textTransform:'uppercase',
                                  fontWeight:700,color:m.c,whiteSpace:'nowrap'}}>
                                {m.l}
                              </button>
                            ))}
                            <button onClick={()=>setModal({type:'deleteConsult',id:c._id,name:c.name||c.mobileNumber})}
                              style={{padding:'5px 8px',background:`${C.red}0D`,
                                border:`1px solid ${C.red}35`,cursor:'pointer',
                                display:'flex',alignItems:'center',color:C.red,flexShrink:0}}>
                              <FiTrash2 size={12}/>
                            </button>
                          </div>
                        </div>

                        {/* All form fields */}
                        <div className="consult-fields">
                          <div style={{padding:'10px 0',borderBottom:`1px solid ${C.borderL}`,
                            display:'flex',gap:10,alignItems:'flex-start'}}>
                            <FiUsers size={13} color={C.gold} style={{marginTop:3,flexShrink:0}}/>
                            <div>
                              <div style={{marginBottom:3}}><Lbl t="Full Name"/></div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",
                                fontSize:18,color:C.ink,fontWeight:600}}>
                                {c.name||'—'}
                              </div>
                            </div>
                          </div>

                          <div style={{padding:'10px 0',borderBottom:`1px solid ${C.borderL}`,
                            display:'flex',gap:10,alignItems:'flex-start'}}>
                            <FiPhone size={13} color={C.gold} style={{marginTop:3,flexShrink:0}}/>
                            <div>
                              <div style={{marginBottom:3}}><Lbl t="Mobile Number"/></div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",
                                fontSize:18,color:C.ink,fontWeight:600,letterSpacing:'0.04em'}}>
                                {c.mobileNumber||'—'}
                              </div>
                            </div>
                          </div>

                          <div style={{padding:'10px 0',borderBottom:`1px solid ${C.borderL}`,
                            display:'flex',gap:10,alignItems:'flex-start'}}>
                            <FiClock size={13} color={C.gold} style={{marginTop:3,flexShrink:0}}/>
                            <div>
                              <div style={{marginBottom:3}}><Lbl t="Time Slot"/></div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",
                                fontSize:18,color:C.ink,fontWeight:600}}>
                                {c.timeSlot||'—'}
                              </div>
                            </div>
                          </div>

                          <div style={{gridColumn:'1/-1',padding:'10px 0',
                            borderBottom:`1px solid ${C.borderL}`,
                            display:'flex',gap:10,alignItems:'flex-start'}}>
                            <FiMapPin size={13} color={C.gold} style={{marginTop:3,flexShrink:0}}/>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{marginBottom:3}}><Lbl t="Home Address"/></div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",
                                fontSize:16,color:C.ink,fontWeight:600,lineHeight:1.6,
                                wordBreak:'break-word'}}>
                                {c.address||'—'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── FOOTER ── */}
        <div style={{marginTop:28,paddingTop:16,borderTop:`1px solid ${C.borderL}`,
          textAlign:'center',fontSize:7.5,letterSpacing:'0.4em',color:C.muted,textTransform:'uppercase'}}>
          Tailor24 Admin Suite · {new Date().getFullYear()}
        </div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        <ConfirmModal
          open={!!modal}
          danger
          title={
            modal?.type==='cancelOrder'  ? 'Cancel Order' :
            modal?.type==='deleteUser'   ? `Delete "${modal?.name}"?` :
            modal?.type==='deleteInquiry'? 'Delete Inquiry' : 'Delete Consultation'
          }
          msg={
            modal?.type==='cancelOrder'  ? 'Mark this order as cancelled. Cannot be undone.' :
            modal?.type==='deleteUser'   ? 'Permanently deletes this user and all their orders.' :
            `Remove "${modal?.name}" permanently?`
          }
          onInput={modal?.type==='cancelOrder' ? setMInput : undefined}
          input={mInput}
          onOk={doModal}
          onClose={()=>{setModal(null);setMInput('');}}
        />
      </AnimatePresence>
    </div>
  );
}

/* ── action button style helper ── */
const actionBtn = (c) => ({
  display:'flex',alignItems:'center',gap:4,padding:'5px 10px',
  background:`${c}0D`,border:`1px solid ${c}35`,cursor:'pointer',
  fontFamily:"'Montserrat',sans-serif",fontSize:7.5,
  letterSpacing:'0.2em',color:c,fontWeight:700,textTransform:'uppercase',
  whiteSpace:'nowrap',flexShrink:0,
});