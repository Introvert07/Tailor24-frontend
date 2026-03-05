import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { login, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiArrowRight, FiLock, FiMail } from 'react-icons/fi';

/* ─── BRAND CONFIG ─── */
const C = {
  bg:      "#FBF4E8", // Cream
  ink:     "#1A0800", // Deep Charcoal/Brown
  maroon:  "#6B0F1A", // Brand Rouge
  gold:    "#B5892E", // Gold accent
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token } = useSelector(s => s.auth);

  const from = location.state?.from?.pathname || '/catalog';

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  useEffect(() => { if (token) navigate(from, { replace: true }); }, [token, navigate, from]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please enter your credentials');
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen flex selection:bg-maroon-700/10" style={{ backgroundColor: C.bg }}>
      
      {/* ── LEFT: ATELIER AMBIANCE ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1A0800] p-20 flex-col justify-between">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80"
          alt="Bespoke Suit"
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale mix-blend-luminosity"
        />

        <Link to="/" className="relative z-10 font-display text-3xl tracking-tighter text-white">
          Tailor<span style={{ color: C.gold }}>24</span>
        </Link>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-gold-500 mb-4 block italic">Continuing Excellence</span>
            <h2 className="font-display text-7xl text-white leading-none mb-6 font-light">
              Welcome <br /><span className="italic" style={{ color: "#F4E8D0" }}>Back.</span>
            </h2>
            <div className="h-[1px] w-32 bg-gold-600/30 mb-8" />
            <p className="font-sans text-xs text-white/40 max-w-xs leading-relaxed tracking-widest uppercase">
              Access your saved measurements and bespoke commissions.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 text-[9px] uppercase tracking-[0.3em] text-white/20 font-sans">
          Bespoke Digital Suite v2.0
        </div>
      </div>

      {/* ── RIGHT: PATRON LOGIN ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <header className="mb-12">
            <h1 className="font-display text-5xl text-charcoal mb-4">Patron Login</h1>
            <p className="font-sans text-xs text-charcoal/40 tracking-wider">
              NEW TO THE ATELIER?{' '}
              <Link to="/register" className="text-maroon-700 font-bold hover:tracking-[0.2em] transition-all underline-offset-4 underline">ENROLL NOW</Link>
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="group relative border-b border-gold-500/20 focus-within:border-maroon-700 transition-all pb-2">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/40 block mb-1 font-bold">Patron Email</label>
              <div className="flex items-center">
                <FiMail className="text-gold-600/30 group-focus-within:text-maroon-700 mr-3" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="patron@example.com"
                  className="w-full bg-transparent font-sans text-sm outline-none placeholder:opacity-20"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group relative border-b border-gold-500/20 focus-within:border-maroon-700 transition-all pb-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/40 font-bold">Security Key</label>
                <button type="button" className="text-[9px] uppercase tracking-widest text-maroon-700/60 hover:text-maroon-700 transition-colors">Forgot?</button>
              </div>
              <div className="flex items-center">
                <FiLock className="text-gold-600/30 group-focus-within:text-maroon-700 mr-3" />
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-transparent font-sans text-sm outline-none placeholder:opacity-20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(p => !p)}
                  className="text-charcoal/20 hover:text-maroon-700 transition-colors ml-2"
                >
                  {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#6B0F1A] text-white font-sans text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 group hover:bg-[#1A0800] transition-all duration-500 shadow-2xl disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <> Enter Atelier <FiArrowRight className="group-hover:translate-x-2 transition-transform" /> </>
              )}
            </button>
          </form>

          {/* Demo Access Card */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 border border-dashed border-gold-500/30 bg-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none italic font-display text-4xl">Demo</div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-3 font-bold">Patron Access Credentials</p>
            <div className="space-y-1">
                <div className="flex justify-between font-sans text-[11px]">
                    <span className="opacity-40 uppercase">Login</span>
                    <span className="text-charcoal font-medium">demo@tailor24.com</span>
                </div>
                <div className="flex justify-between font-sans text-[11px]">
                    <span className="opacity-40 uppercase">Secret</span>
                    <span className="text-charcoal font-medium">demo1234</span>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}