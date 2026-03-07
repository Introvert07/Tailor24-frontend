import { motion } from 'framer-motion';
import { C } from '../../theme';

/* ── Loaders ── */
export function InlineLoader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <motion.div
        className="w-8 h-8 rounded-full border-2"
        style={{ borderColor: C.border, borderTopColor: C.gold }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <p style={{ color: C.muted, fontFamily: 'serif', fontSize: 13, letterSpacing: 2 }}>
        {label.toUpperCase()}
      </p>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
         style={{ background: C.page }}>
      <InlineLoader label="Please wait" />
    </div>
  );
}

/* ── Ornamental divider ── */
export function GoldDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ color: C.gold, fontSize: 16 }}>✦</span>
      <span style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

/* ── Badge ── */
export function Badge({ children, variant = 'gold' }) {
  const styles = {
    gold:   { background: '#FEF3C7', color: C.gold,   border: `1px solid ${C.gold}` },
    maroon: { background: '#FDF2F4', color: C.maroon, border: `1px solid ${C.maroonL}` },
  };
  return (
    <span style={{ ...styles[variant], borderRadius: 2, padding: '2px 10px', fontSize: 11, letterSpacing: 2, fontWeight: 600, textTransform: 'uppercase' }}>
      {children}
    </span>
  );
}

/* ── Button ── */
export function RoyalBtn({ children, variant = 'maroon', onClick, type = 'button', disabled, className = '' }) {
  const base = { border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'sans-serif', fontSize: 13, letterSpacing: 2, fontWeight: 600, padding: '12px 28px', textTransform: 'uppercase', opacity: disabled ? 0.6 : 1, transition: 'all 0.25s' };
  const variants = {
    maroon: { background: C.maroon, color: C.white },
    gold:   { background: C.gold,   color: C.ink   },
    ghost:  { background: 'transparent', color: C.maroon, border: `1px solid ${C.maroon}` },
  };
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled   ? {} : { scale: 0.97 }}
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ── Input ── */
export function RoyalInput({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, letterSpacing: 2, color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>{label}</label>}
      <input
        style={{ background: C.parchment, border: `1px solid ${error ? C.maroon : C.border}`, padding: '10px 14px', fontSize: 14, color: C.ink, outline: 'none', fontFamily: 'sans-serif', transition: 'border 0.2s' }}
        {...props}
      />
      {error && <span style={{ fontSize: 11, color: C.maroon }}>{error}</span>}
    </div>
  );
}