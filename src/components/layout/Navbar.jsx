import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { FiShoppingBag, FiX, FiLogOut, FiChevronDown, FiMapPin, FiUser } from 'react-icons/fi';

/* ─── PALETTE ─────────────────────────────────────────────── */
const C = {
  parchment: '#F4E8D0',
  white:     '#FFFDF5',
  maroon:    '#6B0F1A',
  maroonL:   '#8B1A28',
  gold:      '#B5892E',
  goldB:     '#D4A017',
  goldL:     '#F2C84B',
  teal:      '#1A5C5C',
  ink:       '#1A0800',
  muted:     '#7A6040',
  border:    '#D4BC94',
};

const NAV_LINKS = [
  { label: 'Collection', to: '/catalog'   },
  { label: 'Showrooms',  to: '/showrooms' },
  { label: 'My Orders',  to: '/orders'    },
];

/* ─── HELPERS ─────────────────────────────────────────────── */
const getAvatarUrl = (profileImage) => {
  if (!profileImage || profileImage === 'default-avatar.png') return null;
  // Handle both absolute URLs and relative paths from backend
  if (profileImage.startsWith('http')) return profileImage;
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
    .replace('/api', '');
  return `${base}${profileImage}`;
};

/* ─── SVG MICRO-COMPONENTS ────────────────────────────────── */
const Mark = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" style={{ display:'block' }}>
    <polygon points="16,2 30,16 16,30 2,16"
      stroke={C.gold} strokeWidth="1.2" fill="none" />
    <polygon points="16,7 25,16 16,25 7,16"
      stroke={C.maroon} strokeWidth="0.8" fill="none" opacity="0.5" />
    <circle cx="16" cy="16" r="3.5" fill={C.maroon} opacity="0.85" />
    <circle cx="16" cy="16" r="1.6" fill={C.gold} />
    {[0, 90, 180, 270].map(a => {
      const r = (a * Math.PI) / 180;
      return <circle key={a} cx={16 + 10 * Math.cos(r)} cy={16 + 10 * Math.sin(r)}
        r="1.1" fill={C.gold} opacity="0.3" />;
    })}
  </svg>
);

const ToranaStrip = () => (
  <div style={{ position:'absolute', top:0, left:0, right:0, height:5,
    overflow:'hidden', pointerEvents:'none', zIndex:1 }}>
    <svg width="100%" height="5" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={C.maroon} stopOpacity="0.6" />
          <stop offset="50%"  stopColor={C.goldB}  stopOpacity="0.8" />
          <stop offset="100%" stopColor={C.maroon} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="100%" height="5" fill="url(#tg)" opacity="0.4" />
      {Array.from({ length: 150 }).map((_, i) => (
        <circle key={i} cx={`${i * 0.68 + 0.34}%`} cy="2.5" r="1"
          fill={i % 5 === 2 ? C.maroon : C.goldB}
          opacity={i % 5 === 2 ? 0.7 : 0.28} />
      ))}
    </svg>
  </div>
);

const ScallopBorder = ({ visible }) => (
  <div style={{ position:'absolute', bottom:-7, left:0, right:0, height:7,
    overflow:'hidden', pointerEvents:'none',
    opacity: visible ? 1 : 0, transition:'opacity 0.5s' }}>
    <svg width="100%" height="7" viewBox="0 0 1440 7" preserveAspectRatio="none">
      {Array.from({ length: 48 }).map((_, i) => (
        <path key={i}
          d={`M${i * 30} 0 Q${i * 30 + 15} 9 ${i * 30 + 30} 0`}
          stroke={C.gold} strokeWidth="0.7" fill="none" opacity="0.35" />
      ))}
    </svg>
  </div>
);

const StitchUnderline = () => (
  <motion.div layoutId="nav-active"
    style={{ position:'absolute', bottom:-5, left:0, right:0, height:4 }}>
    <svg width="100%" height="4" preserveAspectRatio="none">
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i}
          x1={`${i * 11 + 1}%`} y1="2" x2={`${i * 11 + 7}%`} y2="2"
          stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" />
      ))}
    </svg>
  </motion.div>
);

const RangDot = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink:0 }}>
    <circle cx="7" cy="7" r="5.5" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.35" />
    <circle cx="7" cy="7" r="2"   fill={C.gold} opacity="0.35" />
    <circle cx="7" cy="7" r="0.8" fill={C.maroon} opacity="0.6" />
  </svg>
);

const ArchFrame = ({ size = 36 }) => {
  const w = size * 1.35;
  return (
    <svg width={w} height={size * 0.62}
      viewBox={`0 0 ${w} ${size * 0.62}`}
      style={{ position:'absolute', top: -size * 0.28, left:'50%',
        transform:'translateX(-50%)', zIndex:1, pointerEvents:'none' }}>
      <path d={`M3 ${size * 0.62} L3 ${size * 0.3} Q${w/2} ${-size*0.08} ${w-3} ${size*0.3} L${w-3} ${size*0.62}`}
        stroke={C.gold} strokeWidth="1" fill="none" opacity="0.65" />
      <circle cx={w/2} cy={size * 0.07} r="2" fill={C.gold} opacity="0.55" />
    </svg>
  );
};

const DrawerBells = () => (
  <svg width="100%" height="28" viewBox="0 0 360 28" preserveAspectRatio="none"
    style={{ display:'block', opacity:0.75 }}>
    <line x1="0" y1="6" x2="360" y2="6" stroke={C.gold} strokeWidth="0.5" opacity="0.4" />
    <path d="M0 3 Q90 14 180 3 Q270 -8 360 3"
      stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.4" />
    {Array.from({ length: 10 }).map((_, i) => {
      const x = i * 36 + 18;
      const sy = 3 + 10 * Math.sin((i / 9) * Math.PI);
      return (
        <g key={i} transform={`translate(${x},${sy})`}>
          <line x1="0" y1="0" x2="0" y2="9" stroke={C.gold} strokeWidth="0.7" opacity="0.5" />
          <ellipse cx="0" cy="12" rx="3" ry="4"
            fill={i % 2 === 0 ? `${C.maroon}70` : `${C.gold}50`}
            stroke={C.gold} strokeWidth="0.5" />
        </g>
      );
    })}
  </svg>
);

/* ─── AVATAR — shows real photo or initial ────────────────── */
const Avatar = ({ user, size = 36 }) => {
  const imgUrl = getAvatarUrl(user?.profileImage);
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <ArchFrame size={size} />
      <div style={{
        width:size, height:size, borderRadius:'50%',
        background:`linear-gradient(135deg, ${C.maroon}, ${C.maroonL})`,
        border:`1.5px solid ${C.gold}60`, overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:"'Cormorant Garamond', serif",
        fontSize:size * 0.44, color:C.goldL, fontWeight:700,
      }}>
        {imgUrl
          ? <img src={imgUrl} alt={user?.name}
              style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={e => { e.target.style.display='none'; }}/>
          : user?.name?.charAt(0).toUpperCase()
        }
      </div>
    </div>
  );
};

/* ─── DESKTOP CTA ─────────────────────────────────────────── */
function JoinBtn({ to, children }) {
  const [hov, setHov] = useState(false);
  return (
    <Link to={to} style={{ textDecoration:'none', display:'block', position:'relative', paddingTop:8 }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:8,
        overflow:'visible', pointerEvents:'none' }}>
        <svg width="100%" height="8" viewBox="0 0 120 8" preserveAspectRatio="none">
          <path d="M0 8 L0 5 Q60 -3 120 5 L120 8Z" fill={`${C.maroon}18`} />
          <path d="M0 8 L0 6 Q60 -1 120 6" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.5" />
          {[20, 40, 60, 80, 100].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="0" x2={x} y2="5" stroke={C.gold} strokeWidth="0.5" opacity="0.4" />
              <ellipse cx={x} cy="6" rx="1.5" ry="2"
                fill={`${C.maroon}45`} stroke={C.gold} strokeWidth="0.3" />
            </g>
          ))}
        </svg>
      </div>
      <motion.div
        onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
        whileTap={{ scale:0.97 }}
        style={{ position:'relative', overflow:'hidden', padding:'9px 20px',
          background:C.maroon, fontFamily:"'Montserrat', sans-serif",
          fontSize:8.5, letterSpacing:'0.4em', fontWeight:700,
          textTransform:'uppercase', color:'white' }}>
        <motion.div animate={{ x: hov ? '0%' : '-101%' }}
          transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
          style={{ position:'absolute', inset:0, background:C.maroonL }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2 }}>
          <svg width="100%" height="2" preserveAspectRatio="none">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1={`${i*9}%`} y1="1" x2={`${i*9+5}%`} y2="1"
                stroke={C.goldL} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            ))}
          </svg>
        </div>
        <span style={{ position:'relative', zIndex:1 }}>{children}</span>
      </motion.div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN NAVBAR
═══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const { user }   = useSelector(s => s.auth);
  const { orders } = useSelector(s => s.orders);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll   = () => setScrolled(window.scrollY > 24);
    const onClickOut = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    window.addEventListener('scroll', onScroll);
    document.addEventListener('mousedown', onClickOut);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', onClickOut);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
    setDropOpen(false);
    setMenuOpen(false);
  };

  const pending = orders.filter(o =>
    ['ORDER_CREATED','ORDER_VERIFIED','FABRIC_PICKUP_SCHEDULED',
     'FABRIC_RECEIVED','STITCHING_IN_PROGRESS'].includes(o.status)
  ).length;

  const avatarUrl = getAvatarUrl(user?.profileImage);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;700&display=swap');
        .t24-nl  { transition:color .28s; }
        .t24-nl:hover { color:${C.maroon}!important; }
        .t24-dr  { transition:background .18s; border-radius:2px; }
        .t24-dr:hover { background:${C.parchment}!important; }
        @media(max-width:768px){
          .t24-desk { display:none!important; }
          .t24-ham  { display:flex!important; }
        }
        @media(min-width:769px){
          .t24-ham  { display:none!important; }
        }
      `}</style>

      {/* ══ HEADER ══ */}
      <motion.header
        initial={{ opacity:0, y:-24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
        style={{
          position:'fixed', top:0, left:0, right:0, zIndex:100,
          background: scrolled ? `${C.white}F3` : C.parchment,
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom:`1px solid ${scrolled ? C.border : 'transparent'}`,
          boxShadow: scrolled ? `0 2px 18px ${C.maroon}0B` : 'none',
          transition:'background .5s, border-color .5s, box-shadow .5s, backdrop-filter .5s',
        }}
      >
        <ToranaStrip />
        <ScallopBorder visible={scrolled} />

        <div style={{ maxWidth:1280, margin:'0 auto',
          padding: scrolled ? '10px 28px' : '14px 28px',
          transition:'padding .45s',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          position:'relative', zIndex:2 }}>

          {/* ── LOGO ── */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10,
            textDecoration:'none', flexShrink:0 }}>
            <motion.div whileHover={{ rotate:90 }}
              transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>
              <Mark />
            </motion.div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:19,
                letterSpacing:'0.14em', color:C.ink, fontWeight:700, lineHeight:1 }}>
                Tailor<em style={{ color:C.maroon, fontStyle:'italic' }}>24</em>
              </div>
              <div style={{ fontSize:6, letterSpacing:'0.5em', color:C.gold,
                textTransform:'uppercase', marginTop:3, lineHeight:1 }}>
                Central India · Est. 1997
              </div>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="t24-desk"
            style={{ display:'flex', alignItems:'center', gap:6 }}>
            <RangDot />
            {NAV_LINKS.map(({ label, to }, i) => (
              <div key={to} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <NavLink to={to} className="t24-nl"
                  style={({ isActive }) => ({
                    position:'relative', padding:'7px 14px',
                    fontFamily:"'Montserrat', sans-serif",
                    fontSize:8.5, letterSpacing:'0.38em', fontWeight:700,
                    textTransform:'uppercase', textDecoration:'none',
                    color: isActive ? C.maroon : C.muted,
                  })}>
                  {({ isActive }) => (
                    <>{label}{isActive && <StitchUnderline />}</>
                  )}
                </NavLink>
                {i < NAV_LINKS.length - 1 && (
                  <div style={{ width:3, height:3, borderRadius:'50%',
                    background:C.gold, opacity:0.3 }} />
                )}
              </div>
            ))}
            <RangDot />
          </nav>

          {/* ── DESKTOP ACTIONS ── */}
          <div className="t24-desk"
            style={{ display:'flex', alignItems:'center', gap:14 }}>

            {user ? (
              /* ── USER DROPDOWN ── */
              <div ref={dropRef} style={{ position:'relative' }}>
                <motion.button onClick={() => setDropOpen(v => !v)}
                  whileTap={{ scale:0.97 }}
                  style={{ display:'flex', alignItems:'center', gap:9,
                    background:'none', border:'none', cursor:'pointer', padding:0 }}>

                  {/* Avatar — real photo or initial */}
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ position:'relative', width:36, height:36 }}>
                      {/* Arch halo */}
                      <ArchFrame size={36} />
                      <div style={{
                        width:36, height:36, borderRadius:'50%',
                        background:`linear-gradient(135deg,${C.maroon},${C.maroonL})`,
                        border:`1.5px solid ${C.gold}60`, overflow:'hidden',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:"'Cormorant Garamond',serif",
                        fontSize:16, color:C.goldL, fontWeight:700,
                      }}>
                        {avatarUrl
                          ? <img src={avatarUrl} alt={user.name}
                              style={{ width:'100%', height:'100%', objectFit:'cover' }}
                              onError={e => { e.target.style.display='none'; }}/>
                          : user.name?.charAt(0).toUpperCase()
                        }
                      </div>
                    </div>
                    {/* Pending badge */}
                    {pending > 0 && (
                      <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
                        style={{ position:'absolute', top:-2, right:-2, zIndex:2,
                          width:14, height:14, borderRadius:'50%', background:C.gold,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontFamily:"'Montserrat',sans-serif",
                          fontSize:6.5, fontWeight:700, color:C.ink,
                          border:`1.5px solid ${C.white}` }}>
                        {pending}
                      </motion.span>
                    )}
                  </div>

                  {/* Name + role */}
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14,
                      color:C.ink, fontWeight:600, lineHeight:1 }}>
                      {user.name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize:6.5, letterSpacing:'0.32em', color:C.muted,
                      textTransform:'uppercase', marginTop:2 }}>Patron</div>
                  </div>

                  <motion.div animate={{ rotate: dropOpen ? 180 : 0 }}
                    transition={{ duration:0.28 }}>
                    <FiChevronDown size={13} color={C.muted} />
                  </motion.div>
                </motion.button>

                {/* ── DROPDOWN PANEL ── */}
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity:0, y:10, scale:0.97 }}
                      animate={{ opacity:1, y:0,  scale:1   }}
                      exit={{  opacity:0, y:7,  scale:0.97 }}
                      transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
                      style={{ position:'absolute', right:0, top:'calc(100% + 12px)',
                        width:246, background:C.white,
                        border:`1px solid ${C.border}`,
                        boxShadow:`0 18px 48px ${C.maroon}12`,
                        overflow:'hidden' }}>

                      {/* Dropdown header — shows avatar + name */}
                      <div style={{ background:C.parchment, padding:'14px 16px 12px',
                        borderBottom:`1px solid ${C.border}` }}>
                        {/* Mini torana bells */}
                        <svg width="100%" height="12" viewBox="0 0 200 12"
                          preserveAspectRatio="none" style={{ display:'block', marginBottom:10 }}>
                          {Array.from({ length: 12 }).map((_, i) => (
                            <g key={i}>
                              <line x1={i*17+8} y1="1" x2={i*17+8} y2="7"
                                stroke={C.gold} strokeWidth="0.7" opacity="0.5" />
                              <ellipse cx={i*17+8} cy="10" rx="2.2" ry="2.8"
                                fill={i%2===0?`${C.maroon}50`:`${C.gold}40`}
                                stroke={C.gold} strokeWidth="0.4" />
                            </g>
                          ))}
                        </svg>

                        {/* Avatar + user info row */}
                        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                          {/* Profile image circle */}
                          <div style={{ width:42, height:42, borderRadius:'50%', flexShrink:0,
                            background:`linear-gradient(135deg,${C.maroon},${C.maroonL})`,
                            border:`2px solid ${C.gold}50`, overflow:'hidden',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontFamily:"'Cormorant Garamond',serif",
                            fontSize:20, color:C.goldL, fontWeight:700 }}>
                            {avatarUrl
                              ? <img src={avatarUrl} alt={user.name}
                                  style={{ width:'100%', height:'100%', objectFit:'cover' }}
                                  onError={e => { e.target.style.display='none'; }}/>
                              : user.name?.charAt(0).toUpperCase()
                            }
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:7, letterSpacing:'0.4em', color:C.muted,
                              textTransform:'uppercase', marginBottom:3 }}>Tailor24 Patron</div>
                            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17,
                              color:C.ink, fontWeight:600,
                              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown rows */}
                      <div style={{ padding:'5px' }}>

                        {/* ── My Profile (NEW) ── */}
                        <Link to="/profile" onClick={() => setDropOpen(false)}
                          className="t24-dr"
                          style={{ display:'flex', alignItems:'center', gap:9,
                            padding:'10px 11px', textDecoration:'none' }}>
                          <FiUser size={13} color={C.maroon} />
                          <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9.5,
                            letterSpacing:'0.08em', color:C.ink }}>My Profile</span>
                          {/* Small "new" indicator if no profile image yet */}
                          {!avatarUrl && (
                            <span style={{ marginLeft:'auto', background:`${C.gold}20`,
                              color:C.gold, fontFamily:"'Montserrat',sans-serif",
                              fontSize:6.5, padding:'2px 6px', fontWeight:700,
                              letterSpacing:'0.2em' }}>
                              SETUP
                            </span>
                          )}
                        </Link>

                        {/* ── Order History ── */}
                        <Link to="/orders" onClick={() => setDropOpen(false)}
                          className="t24-dr"
                          style={{ display:'flex', alignItems:'center',
                            justifyContent:'space-between',
                            padding:'10px 11px', textDecoration:'none' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <FiShoppingBag size={13} color={C.gold} />
                            <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9.5,
                              letterSpacing:'0.08em', color:C.ink }}>Order History</span>
                          </div>
                          {pending > 0 && (
                            <span style={{ background:`${C.maroon}14`, color:C.maroon,
                              fontFamily:"'Montserrat',sans-serif", fontSize:7,
                              padding:'2px 7px', fontWeight:700, letterSpacing:'0.18em' }}>
                              {pending} ACTIVE
                            </span>
                          )}
                        </Link>

                        {/* ── Visit Atelier ── */}
                        <Link to="/showrooms" onClick={() => setDropOpen(false)}
                          className="t24-dr"
                          style={{ display:'flex', alignItems:'center', gap:9,
                            padding:'10px 11px', textDecoration:'none' }}>
                          <FiMapPin size={13} color={C.gold} />
                          <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9.5,
                            letterSpacing:'0.08em', color:C.ink }}>Visit Atelier</span>
                        </Link>

                        {/* Stitch divider */}
                        <div style={{ margin:'3px 8px' }}>
                          <svg width="100%" height="5" preserveAspectRatio="none">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <line key={i} x1={`${i*6.5+0.5}%`} y1="2.5"
                                x2={`${i*6.5+3.5}%`} y2="2.5"
                                stroke={C.border} strokeWidth="1.2" strokeLinecap="round"/>
                            ))}
                          </svg>
                        </div>

                        {/* ── Sign Out ── */}
                        <button onClick={handleLogout} className="t24-dr"
                          style={{ display:'flex', alignItems:'center', gap:9,
                            width:'100%', padding:'10px 11px',
                            background:'none', border:'none', cursor:'pointer' }}>
                          <FiLogOut size={13} color={C.maroon} />
                          <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9.5,
                            letterSpacing:'0.08em', color:C.maroon }}>Sign Out</span>
                        </button>
                      </div>

                      {/* Scallop foot */}
                      <div style={{ height:5, overflow:'hidden' }}>
                        <svg width="100%" height="5" viewBox="0 0 200 5" preserveAspectRatio="none">
                          {Array.from({ length: 13 }).map((_, i) => (
                            <path key={i}
                              d={`M${i*16} 0 Q${i*16+8} 7 ${i*16+16} 0`}
                              stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.3"/>
                          ))}
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <Link to="/login" className="t24-nl"
                  style={{ fontFamily:"'Montserrat',sans-serif", fontSize:8.5,
                    letterSpacing:'0.38em', textTransform:'uppercase',
                    color:C.muted, textDecoration:'none' }}>
                  Login
                </Link>
                <JoinBtn to="/register">Join Studio</JoinBtn>
              </div>
            )}
          </div>

          {/* ── HAMBURGER ── */}
          <motion.button
            className="t24-ham"
            onClick={() => setMenuOpen(v => !v)}
            whileTap={{ scale:0.9 }}
            style={{ display:'none', padding:7, background:'none',
              border:`1px solid ${C.border}`, cursor:'pointer',
              alignItems:'center', justifyContent:'center' }}>
            <AnimatePresence mode="wait">
              {menuOpen
                ? <motion.span key="x"
                    initial={{ rotate:-80, opacity:0 }} animate={{ rotate:0, opacity:1 }}
                    exit={{ rotate:80, opacity:0 }} transition={{ duration:0.18 }}>
                    <FiX size={19} color={C.maroon} />
                  </motion.span>
                : <motion.span key="m"
                    initial={{ rotate:80, opacity:0 }} animate={{ rotate:0, opacity:1 }}
                    exit={{ rotate:-80, opacity:0 }} transition={{ duration:0.18 }}>
                    <svg width="20" height="14" viewBox="0 0 20 14">
                      <line x1="0" y1="1"  x2="20" y2="1"  stroke={C.ink}    strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="3" y1="7"  x2="20" y2="7"  stroke={C.maroon} strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="0" y1="13" x2="20" y2="13" stroke={C.ink}    strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* ══ MOBILE DRAWER ══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.3 }}
              onClick={() => setMenuOpen(false)}
              style={{ position:'fixed', inset:0, zIndex:110,
                background:`${C.maroon}38`, backdropFilter:'blur(5px)' }} />

            <motion.div
              initial={{ x:'100%' }} animate={{ x:'0%' }} exit={{ x:'100%' }}
              transition={{ type:'spring', damping:28, stiffness:230 }}
              style={{ position:'fixed', top:0, right:0, bottom:0,
                width:'min(300px, 86vw)', zIndex:111,
                background:C.parchment, display:'flex',
                flexDirection:'column', overflow:'hidden' }}>

              {/* Maroon header */}
              <div style={{ background:C.maroon, padding:'16px 18px 12px', flexShrink:0 }}>
                <DrawerBells />
                <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
                  <Mark />
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18,
                      letterSpacing:'0.14em', color:'#FFFDF5', fontWeight:700, lineHeight:1 }}>
                      Tailor<em style={{ color:C.goldL, fontStyle:'italic' }}>24</em>
                    </div>
                    <div style={{ fontSize:6, letterSpacing:'0.45em',
                      color:`${C.goldL}80`, textTransform:'uppercase', marginTop:3 }}>
                      Men · Women · Kids
                    </div>
                  </div>
                  <motion.button onClick={() => setMenuOpen(false)} whileTap={{ scale:0.9 }}
                    style={{ marginLeft:'auto', background:'none', border:'none',
                      cursor:'pointer', padding:4 }}>
                    <FiX size={18} color={C.goldL} />
                  </motion.button>
                </div>
              </div>

              {/* Nav links */}
              <div style={{ flex:1, overflowY:'auto', padding:'20px 18px' }}>
                {NAV_LINKS.map(({ label, to }, i) => (
                  <motion.div key={to}
                    initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.06*i, ease:[0.22,1,0.36,1] }}>
                    <NavLink to={to} onClick={() => setMenuOpen(false)}
                      style={({ isActive }) => ({
                        display:'flex', alignItems:'center', gap:12, padding:'14px 0',
                        borderBottom:`1px solid ${C.border}`, textDecoration:'none',
                      })}>
                      {({ isActive }) => (
                        <>
                          <div style={{ width:26, height:26, flexShrink:0 }}>
                            <svg width="26" height="26" viewBox="0 0 26 26">
                              <path d="M2 26 L2 13 Q13 1 24 13 L24 26"
                                stroke={isActive ? C.maroon : C.border}
                                strokeWidth="1"
                                fill={isActive ? `${C.maroon}10` : 'none'} />
                              <circle cx="13" cy="9" r="2.5"
                                fill={isActive ? C.maroon : C.muted}
                                opacity={isActive ? 0.85 : 0.35} />
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontFamily:"'Cormorant Garamond',serif",
                              fontSize:26, fontWeight:600, lineHeight:1,
                              color: isActive ? C.maroon : C.ink, transition:'color .25s' }}>
                              {label}
                            </div>
                            {isActive && (
                              <svg width="52" height="3" viewBox="0 0 52 3"
                                style={{ display:'block', marginTop:4 }}>
                                {Array.from({ length: 7 }).map((_, j) => (
                                  <line key={j} x1={j*8+1} y1="1.5" x2={j*8+5} y2="1.5"
                                    stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
                                ))}
                              </svg>
                            )}
                          </div>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Auth section */}
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ delay:0.28 }}
                  style={{ marginTop:22, paddingTop:18, borderTop:`1px solid ${C.border}` }}>

                  {user ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

                      {/* User card with real photo */}
                      <Link to="/profile" onClick={() => setMenuOpen(false)}
                        style={{ display:'flex', alignItems:'center', gap:12,
                          padding:'12px 14px', background:C.white,
                          border:`1px solid ${C.border}`, textDecoration:'none' }}>
                        {/* Photo circle */}
                        <div style={{ width:40, height:40, borderRadius:'50%', flexShrink:0,
                          background:`linear-gradient(135deg,${C.maroon},${C.maroonL})`,
                          border:`1.5px solid ${C.gold}55`, overflow:'hidden',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontFamily:"'Cormorant Garamond',serif",
                          fontSize:18, color:C.goldL, fontWeight:700 }}>
                          {avatarUrl
                            ? <img src={avatarUrl} alt={user.name}
                                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                                onError={e => { e.target.style.display='none'; }}/>
                            : user.name?.charAt(0).toUpperCase()
                          }
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif",
                            fontSize:17, color:C.ink, fontWeight:600,
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize:7, letterSpacing:'0.3em', color:C.maroon,
                            textTransform:'uppercase', marginTop:2, fontWeight:700 }}>
                            View Profile →
                          </div>
                        </div>
                        {pending > 0 && (
                          <div style={{ background:C.maroon, padding:'2px 7px', flexShrink:0 }}>
                            <span style={{ fontSize:7, letterSpacing:'0.2em',
                              color:'white', fontWeight:700 }}>{pending}</span>
                          </div>
                        )}
                      </Link>

                      <button onClick={handleLogout}
                        style={{ display:'flex', alignItems:'center', gap:10,
                          padding:'11px 14px', background:'none',
                          border:`1px solid ${C.maroon}40`,
                          cursor:'pointer', width:'100%' }}>
                        <FiLogOut size={13} color={C.maroon} />
                        <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9,
                          letterSpacing:'0.35em', color:C.maroon,
                          textTransform:'uppercase', fontWeight:700 }}>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      <Link to="/login" onClick={() => setMenuOpen(false)}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center',
                          padding:'12px', border:`1.5px solid ${C.maroon}`,
                          fontFamily:"'Montserrat',sans-serif", fontSize:9,
                          letterSpacing:'0.38em', fontWeight:700,
                          color:C.maroon, textTransform:'uppercase', textDecoration:'none' }}>
                        Client Login
                      </Link>
                      <Link to="/register" onClick={() => setMenuOpen(false)}
                        style={{ display:'flex', alignItems:'center', justifyContent:'center',
                          padding:'12px', background:C.maroon,
                          fontFamily:"'Montserrat',sans-serif", fontSize:9,
                          letterSpacing:'0.38em', fontWeight:700,
                          color:'white', textTransform:'uppercase', textDecoration:'none' }}>
                        Join Studio
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Drawer footer */}
              <div style={{ padding:'10px 18px 14px', flexShrink:0,
                borderTop:`1px solid ${C.border}`, background:C.white }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                  {[0,1,2,1,0].map((s, i) => (
                    <div key={i} style={{
                      width: s===2?8:s===1?5:3, height: s===2?8:s===1?5:3,
                      borderRadius:'50%', background: s===2?C.maroon:C.gold,
                      opacity: s===2?0.8:0.35 }} />
                  ))}
                </div>
                <div style={{ textAlign:'center', marginTop:7, fontSize:6.5,
                  letterSpacing:'0.5em', color:C.muted, textTransform:'uppercase' }}>
                  Central India · Est. 1997
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}