import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { login, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiArrowRight, FiLock, FiMail, FiShield } from 'react-icons/fi';

/* ─── PALETTE ─────────────────────────────────────────────── */
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
};

/* ─── SVG ORNAMENTS ─────────────────────────────────────────── */

/* Rotating diamond mark */
const Mark = ({ s = 38, dark = false }) => (
  <svg width={s} height={s} viewBox="0 0 38 38">
    <polygon points="19,2 36,19 19,36 2,19"
      stroke={dark ? C.goldL : C.gold} strokeWidth="1.2" fill="none" />
    <polygon points="19,8 30,19 19,30 8,19"
      stroke={dark ? C.goldL : C.maroon} strokeWidth="0.7" fill="none" opacity="0.5" />
    <circle cx="19" cy="19" r="4"
      fill={dark ? 'rgba(255,255,255,0.15)' : C.maroon} opacity="0.85" />
    <circle cx="19" cy="19" r="1.8"
      fill={dark ? C.goldL : C.gold} />
    {[0, 90, 180, 270].map(a => {
      const r = (a * Math.PI) / 180;
      return <circle key={a}
        cx={19 + 13 * Math.cos(r)} cy={19 + 13 * Math.sin(r)}
        r="1.3" fill={dark ? C.goldL : C.gold} opacity="0.28" />;
    })}
  </svg>
);

/* Full-width torana bead strip */
const ToranaStrip = ({ dark = false }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5,
    overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
    <svg width="100%" height="5" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tgL" x1="0%" x2="100%">
          <stop offset="0%"   stopColor={C.maroon} stopOpacity="0.5" />
          <stop offset="50%"  stopColor={C.goldB}  stopOpacity="0.9" />
          <stop offset="100%" stopColor={C.maroon} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="100%" height="5" fill="url(#tgL)" />
      {Array.from({ length: 120 }).map((_, i) => (
        <circle key={i} cx={`${i * 0.87 + 0.43}%`} cy="2.5" r="1"
          fill={i % 5 === 2 ? C.maroon : (dark ? C.goldL : C.goldB)}
          opacity={i % 5 === 2 ? 0.8 : 0.35} />
      ))}
    </svg>
  </div>
);

/* Hanging-bell torana row — full width */
const ToranaBells = ({ dark = false }) => (
  <div style={{ overflow: 'hidden', height: 36 }}>
    <svg width="100%" height="36" viewBox="0 0 800 36" preserveAspectRatio="none">
      <path d="M0 6 Q200 22 400 6 Q600 -10 800 6"
        stroke={dark ? C.goldL : C.gold} strokeWidth="0.8" fill="none" opacity="0.45" />
      <line x1="0" y1="6" x2="800" y2="6"
        stroke={dark ? C.goldL : C.gold} strokeWidth="0.4" opacity="0.25" />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = i * 37 + 18;
        const sy = 6 + 9 * Math.sin((i / 21) * Math.PI);
        return (
          <g key={i} transform={`translate(${x},${sy})`}>
            <line x1="0" y1="0" x2="0" y2="10"
              stroke={dark ? C.goldL : C.gold} strokeWidth="0.7" opacity="0.5" />
            <ellipse cx="0" cy="14" rx="3.2" ry="4.5"
              fill={i % 3 === 0 ? (dark ? 'rgba(255,255,255,0.15)' : `${C.maroon}55`)
                               : (dark ? `${C.goldL}40` : `${C.goldB}40`)}
              stroke={dark ? C.goldL : C.gold} strokeWidth="0.5" />
          </g>
        );
      })}
    </svg>
  </div>
);

/* Scalloped arch separator */
const Scallop = ({ flip = false, dark = false }) => (
  <div style={{ height: 10, overflow: 'hidden',
    transform: flip ? 'scaleY(-1)' : 'none' }}>
    <svg width="100%" height="10" viewBox="0 0 600 10" preserveAspectRatio="none">
      {Array.from({ length: 20 }).map((_, i) => (
        <path key={i}
          d={`M${i * 30} 0 Q${i * 30 + 15} 12 ${i * 30 + 30} 0`}
          stroke={dark ? `${C.goldL}50` : `${C.gold}50`}
          strokeWidth="0.7" fill="none" />
      ))}
    </svg>
  </div>
);

/* Thread stitch line */
const Stitch = ({ dark = false }) => (
  <div style={{ height: 8, overflow: 'hidden' }}>
    <svg width="100%" height="8" preserveAspectRatio="none">
      {Array.from({ length: 55 }).map((_, i) => (
        <line key={i} x1={`${i * 1.9}%`} y1="2.5" x2={`${i * 1.9 + 0.9}%`} y2="2.5"
          stroke={dark ? `${C.goldL}70` : `${C.gold}70`}
          strokeWidth="1.5" strokeLinecap="round" />
      ))}
    </svg>
  </div>
);

/* Rangoli mandala */
const Rangoli = ({ s = 48, dark = false }) => (
  <svg width={s} height={s} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" stroke={dark ? C.goldL : C.gold}
      strokeWidth="0.6" fill="none" opacity="0.3" />
    <circle cx="24" cy="24" r="15" stroke={dark ? C.goldL : C.gold}
      strokeWidth="0.4" fill="none" opacity="0.22" />
    <circle cx="24" cy="24" r="8" stroke={C.maroon}
      strokeWidth="0.6" fill="none" opacity="0.3" />
    <circle cx="24" cy="24" r="3.5" fill={dark ? C.goldL : C.gold} opacity="0.38" />
    <circle cx="24" cy="24" r="1.5" fill={C.maroon} opacity="0.65" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const px = 24 + 21 * Math.cos(a), py = 24 + 21 * Math.sin(a);
      return <ellipse key={i} cx={px} cy={py} rx="2" ry="3.8"
        transform={`rotate(${i * 45 + 90},${px},${py})`}
        fill={`${C.maroon}40`} stroke={dark ? C.goldL : C.gold} strokeWidth="0.35" />;
    })}
  </svg>
);

/* ─── INPUT FIELD ─────────────────────────────────────────── */
function Field({ label, type, value, onChange, placeholder, icon: Icon,
  autoComplete, rightSlot, isAdmin }) {
  const [focused, setFocused] = useState(false);
  const accentColor = isAdmin ? C.goldB : C.maroon;
  return (
    <div style={{ paddingBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8,
          letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 700,
          color: focused ? accentColor : C.muted }}>
          {label}
        </label>
        {rightSlot}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1.5px solid ${focused ? accentColor : C.border}`,
        paddingBottom: 8, transition: 'border-color 0.3s' }}>
        <Icon size={14} color={focused ? accentColor : C.border} style={{ flexShrink: 0 }} />
        <input type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: "'Montserrat', sans-serif", fontSize: 13,
            color: C.ink }} />
        {rightSlot === undefined ? null : null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { loading, error, token, user } = useSelector(s => s.auth);

  const from = location.state?.from?.pathname || '/catalog';

  const [mode,    setMode]    = useState('patron');  // 'patron' | 'admin'
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  // Redirect after login
  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin' || user.role === 'staff') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [token, user, navigate, from]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  // Reset form on mode switch
  const switchMode = (m) => {
    setMode(m);
    setForm({ email: '', password: '' });
    setShowPwd(false);
    dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error('Please enter your credentials');
    dispatch(login(form));
  };

  const isAdmin = mode === 'admin';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.page,
      fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: ${C.border}; }
        .t24-mode-btn { transition: all .3s; cursor: pointer; }
        .t24-mode-btn:hover { opacity: 0.85; }
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div style={{ display: 'none', width: '48%', position: 'relative',
        overflow: 'hidden', flexDirection: 'column', justifyContent: 'space-between',
        background: C.maroonD }}
        className="left-panel">
        <style>{`.left-panel { display: none; } @media(min-width:1024px){.left-panel{display:flex!important;}} `}</style>

        {/* Background image */}
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
          alt="Atelier" style={{ position: 'absolute', inset: 0, width: '100%',
            height: '100%', objectFit: 'cover', opacity: 0.22,
            filter: 'grayscale(40%)' }} />

        {/* Radial gradient overlay */}
        <div style={{ position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, ${C.maroon}88 0%, ${C.maroonD}EE 70%)` }} />

        <ToranaStrip dark />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2, padding: '40px 44px 0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12,
            textDecoration: 'none' }}>
            <motion.div whileHover={{ rotate: 90 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Mark dark s={34} />
            </motion.div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
                letterSpacing: '0.14em', color: 'white', fontWeight: 700, lineHeight: 1 }}>
                Tailor<em style={{ color: C.goldL, fontStyle: 'italic' }}>24</em>
              </div>
              <div style={{ fontSize: 6, letterSpacing: '0.5em', color: `${C.goldL}70`,
                textTransform: 'uppercase', marginTop: 3 }}>
                Central India · Est. 1997
              </div>
            </div>
          </Link>
        </div>

        {/* Centred hero copy */}
        <div style={{ position: 'relative', zIndex: 2, padding: '0 44px', flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <ToranaBells dark />

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>

            <div style={{ fontSize: 8, letterSpacing: '0.6em', color: `${C.goldL}80`,
              textTransform: 'uppercase', marginBottom: 14, fontStyle: 'italic' }}>
              {isAdmin ? 'Admin Control Centre' : 'Continuing Excellence'}
            </div>

            <AnimatePresence mode="wait">
              <motion.h2 key={mode}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
                style={{ fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(44px,5.5vw,72px)', color: 'white',
                  lineHeight: 1, fontWeight: 700, marginBottom: 20 }}>
                {isAdmin ? (
                  <>Admin<br />
                    <em style={{ color: C.goldL, fontStyle: 'italic' }}>Access.</em>
                  </>
                ) : (
                  <>Welcome<br />
                    <em style={{ color: `${C.parchment}CC`, fontStyle: 'italic' }}>Back.</em>
                  </>
                )}
              </motion.h2>
            </AnimatePresence>

            {/* Gold stitch rule */}
            <div style={{ height: 1, width: 100,
              background: `linear-gradient(90deg,${C.goldB},transparent)`,
              marginBottom: 18, opacity: 0.5 }} />

            <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.38)',
              maxWidth: 260, lineHeight: 1.9, letterSpacing: '0.18em',
              textTransform: 'uppercase' }}>
              {isAdmin
                ? 'Manage orders, patrons, and atelier operations from one command centre.'
                : 'Access your saved measurements and bespoke commissions.'}
            </p>
          </motion.div>

          <div style={{ marginTop: 40 }}>
            <Scallop dark />
            <Stitch dark />
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 2, padding: '20px 44px 32px' }}>
          <div style={{ fontSize: 7, letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
            Bespoke Digital Suite v2.0
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 'clamp(24px,5vw,64px)',
        position: 'relative', overflow: 'hidden' }}>

        {/* Watermark rangoli */}
        <div style={{ position: 'absolute', right: -40, bottom: -40,
          opacity: 0.05, pointerEvents: 'none' }}>
          <Rangoli s={240} />
        </div>

        <ToranaStrip />

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {/* ── Top Logo (mobile only) ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 32, justifyContent: 'center' }}
            className="mobile-logo">
            <style>{`.mobile-logo{display:flex;} @media(min-width:1024px){.mobile-logo{display:none!important;}}`}</style>
            <Mark s={28} />
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
              letterSpacing: '0.14em', color: C.ink, fontWeight: 700 }}>
              Tailor<em style={{ color: C.maroon, fontStyle: 'italic' }}>24</em>
            </div>
          </div>

          {/* ── Mode Toggle ── */}
          <div style={{ display: 'flex', marginBottom: 32, position: 'relative',
            background: C.parchment, border: `1px solid ${C.border}`, padding: 4 }}>

            {/* Arch top decoration */}
            <div style={{ position: 'absolute', top: -8, left: 0, right: 0,
              height: 8, overflow: 'hidden', pointerEvents: 'none' }}>
              <svg width="100%" height="8" viewBox="0 0 400 8" preserveAspectRatio="none">
                <path d="M0 8 L0 5 Q200 -3 400 5 L400 8Z" fill={`${C.maroon}12`} />
                <path d="M0 8 L0 6 Q200 0 400 6"
                  stroke={C.gold} strokeWidth="0.7" fill="none" opacity="0.4" />
                {[60, 120, 200, 280, 340].map((x, i) => (
                  <g key={i}>
                    <line x1={x} y1="0" x2={x} y2="5"
                      stroke={C.gold} strokeWidth="0.6" opacity="0.35" />
                    <ellipse cx={x} cy="6" rx="1.8" ry="2.5"
                      fill={`${C.maroon}40`} stroke={C.gold} strokeWidth="0.3" />
                  </g>
                ))}
              </svg>
            </div>

            {[
              { id: 'patron', label: 'Patron Login', icon: null },
              { id: 'admin',  label: 'Admin Access', icon: FiShield },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button key={id}
                onClick={() => switchMode(id)}
                whileTap={{ scale: 0.97 }}
                className="t24-mode-btn"
                style={{ flex: 1, padding: '11px 12px', border: 'none',
                  background: mode === id ? C.maroon : 'transparent',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  transition: 'background .35s' }}>
                {mode === id && (
                  <motion.div layoutId="tabBg"
                    style={{ position: 'absolute', inset: 0, background: C.maroon,
                      zIndex: 0 }} />
                )}
                <span style={{ position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: "'Montserrat', sans-serif", fontSize: 8.5,
                  letterSpacing: '0.35em', fontWeight: 700, textTransform: 'uppercase',
                  color: mode === id ? 'white' : C.muted }}>
                  {Icon && <Icon size={10} />}
                  {label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* ── Form header ── */}
          <AnimatePresence mode="wait">
            <motion.div key={`header-${mode}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
              style={{ marginBottom: 28 }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Rangoli s={36} />
                <div>
                  <h1 style={{ fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(28px,4vw,40px)', color: C.ink,
                    fontWeight: 700, lineHeight: 1, margin: 0 }}>
                    {isAdmin ? 'Admin' : 'Patron'}
                    <em style={{ color: C.maroon, fontStyle: 'italic' }}> Login</em>
                  </h1>
                </div>
              </div>

              <Stitch />

              {!isAdmin && (
                <p style={{ fontSize: 9, letterSpacing: '0.25em', color: C.muted,
                  textTransform: 'uppercase', marginTop: 10 }}>
                  New to the atelier?{' '}
                  <Link to="/register"
                    style={{ color: C.maroon, fontWeight: 700, textDecoration: 'underline',
                      textUnderlineOffset: 3 }}>
                    Enroll Now
                  </Link>
                </p>
              )}
              {isAdmin && (
                <p style={{ fontSize: 9, letterSpacing: '0.22em', color: C.muted,
                  textTransform: 'uppercase', marginTop: 10, display: 'flex',
                  alignItems: 'center', gap: 6 }}>
                  <FiShield size={10} color={C.gold} />
                  Restricted access — authorised staff only
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Form ── */}
          <AnimatePresence mode="wait">
            <motion.form key={`form-${mode}`}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: isAdmin ? 16 : -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAdmin ? -16 : 16 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Email */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8,
                    letterSpacing: '0.4em', textTransform: 'uppercase',
                    fontWeight: 700, color: C.muted }}>
                    {isAdmin ? 'Staff Email' : 'Patron Email'}
                  </label>
                </div>
                <EmailField form={form} setForm={setForm} isAdmin={isAdmin} />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8,
                    letterSpacing: '0.4em', textTransform: 'uppercase',
                    fontWeight: 700, color: C.muted }}>
                    {isAdmin ? 'Security Key' : 'Security Key'}
                  </label>
                  {!isAdmin && (
                    <button type="button"
                      style={{ fontSize: 8, letterSpacing: '0.25em', color: `${C.maroon}80`,
                        textTransform: 'uppercase', background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
                      Forgot?
                    </button>
                  )}
                </div>
                <PasswordField form={form} setForm={setForm}
                  show={showPwd} setShow={setShowPwd} isAdmin={isAdmin} />
              </div>

              {/* Submit button */}
              <SubmitBtn loading={loading} isAdmin={isAdmin} />
            </motion.form>
          </AnimatePresence>

          {/* ── Credential cards ── */}
          <div style={{ marginTop: 28 }}>
            <Scallop />

            <AnimatePresence mode="wait">
              {isAdmin ? (
                <motion.div key="admin-cred"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ delay: 0.2 }}
                  style={{ marginTop: 4, padding: '16px 18px',
                    border: `1px dashed ${C.maroon}40`,
                    background: `${C.maroon}06`, position: 'relative', overflow: 'hidden' }}>
                  {/* Watermark */}
                  <div style={{ position: 'absolute', right: 6, bottom: -4,
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 42,
                    color: `${C.maroon}07`, fontStyle: 'italic',
                    pointerEvents: 'none', lineHeight: 1 }}>Admin</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                    <FiShield size={11} color={C.maroon} />
                    <span style={{ fontSize: 8, letterSpacing: '0.4em',
                      color: C.maroon, textTransform: 'uppercase', fontWeight: 700 }}>
                      Admin Access Credentials
                    </span>
                  </div>
                  <CredRow label="Email" value="admin@tailor24.com" />
                  <CredRow label="Pass"  value="admin1234" />
                </motion.div>
              ) : (
                <motion.div key="patron-cred"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ delay: 0.2 }}
                  style={{ marginTop: 4, padding: '16px 18px',
                    border: `1px dashed ${C.gold}45`,
                    background: `${C.white}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: 6, bottom: -4,
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 42,
                    color: `${C.gold}08`, fontStyle: 'italic',
                    pointerEvents: 'none', lineHeight: 1 }}>Demo</div>
                  <div style={{ fontSize: 8, letterSpacing: '0.4em',
                    color: C.gold, textTransform: 'uppercase',
                    fontWeight: 700, marginBottom: 12 }}>
                    Patron Access Credentials
                  </div>
                  <CredRow label="Login"  value="demo@tailor24.com" />
                  <CredRow label="Secret" value="demo1234" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom rangoli dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 7, marginTop: 28 }}>
            {[0, 1, 2, 1, 0].map((s, i) => (
              <div key={i} style={{
                width:  s === 2 ? 8 : s === 1 ? 5 : 3,
                height: s === 2 ? 8 : s === 1 ? 5 : 3,
                borderRadius: '50%',
                background: s === 2 ? C.maroon : C.gold,
                opacity: s === 2 ? 0.7 : 0.3,
              }} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function EmailField({ form, setForm, isAdmin }) {
  const [focused, setFocused] = useState(false);
  const accent = isAdmin ? C.maroon : C.maroon;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: `1.5px solid ${focused ? accent : C.border}`,
      paddingBottom: 8, transition: 'border-color 0.3s' }}>
      <FiMail size={14} color={focused ? accent : C.border} style={{ flexShrink: 0 }} />
      <input type="email" value={form.email} autoComplete="email"
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        placeholder={isAdmin ? 'admin@tailor24.com' : 'patron@example.com'}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.ink }} />
    </div>
  );
}

function PasswordField({ form, setForm, show, setShow, isAdmin }) {
  const [focused, setFocused] = useState(false);
  const accent = isAdmin ? C.maroon : C.maroon;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: `1.5px solid ${focused ? accent : C.border}`,
      paddingBottom: 8, transition: 'border-color 0.3s' }}>
      <FiLock size={14} color={focused ? accent : C.border} style={{ flexShrink: 0 }} />
      <input type={show ? 'text' : 'password'} value={form.password}
        autoComplete="current-password"
        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
        placeholder="••••••••"
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.ink }} />
      <motion.button type="button" onClick={() => setShow(p => !p)} whileTap={{ scale: 0.9 }}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: C.border, display: 'flex', padding: 0 }}>
        {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
      </motion.button>
    </div>
  );
}

function SubmitBtn({ loading, isAdmin }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button type="submit" disabled={loading}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      whileTap={{ scale: 0.98 }}
      style={{ width: '100%', padding: '16px', background: C.maroon,
        border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        position: 'relative', overflow: 'hidden', marginTop: 4,
        opacity: loading ? 0.65 : 1 }}>

      {/* Arch top on button */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18,
        pointerEvents: 'none', overflow: 'hidden' }}>
        <svg width="100%" height="18" viewBox="0 0 400 18" preserveAspectRatio="none">
          <path d="M0 18 L0 10 Q200 -4 400 10 L400 18Z"
            fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>

      {/* Sweep hover fill */}
      <motion.div animate={{ x: hov && !loading ? '0%' : '-101%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', inset: 0, background: C.maroonD }} />

      {/* Stitch bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 }}>
        <svg width="100%" height="2" preserveAspectRatio="none">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={`${i * 7.5}%`} y1="1" x2={`${i * 7.5 + 4}%`} y2="1"
              stroke={C.goldL} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
          ))}
        </svg>
      </div>

      <span style={{ position: 'relative', zIndex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {loading ? (
          <div style={{ width: 16, height: 16, border: `2px solid rgba(255,255,255,0.25)`,
            borderTop: `2px solid white`, borderRadius: '50%',
            animation: 'spin 0.8s linear infinite' }} />
        ) : (
          <>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9,
              letterSpacing: '0.5em', fontWeight: 700, color: 'white',
              textTransform: 'uppercase' }}>
              {isAdmin ? 'Enter Admin Suite' : 'Enter Atelier'}
            </span>
            <motion.span animate={{ x: hov ? 5 : 0 }} transition={{ duration: 0.3 }}>
              {isAdmin ? <FiShield size={14} color="white" />
                       : <FiArrowRight size={14} color="white" />}
            </motion.span>
          </>
        )}
      </span>

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </motion.button>
  );
}

function CredRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '4px 0' }}>
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9,
        letterSpacing: '0.3em', color: C.muted, textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11,
        color: C.ink, fontWeight: 600 }}>{value}</span>
    </div>
  );
}