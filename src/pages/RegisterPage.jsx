import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiArrowRight, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';

/* ─── TAILOR24 BRAND CONFIG ──────────────────────────────── */
const C = {
  bg:      "#FBF4E8", // Cream
  parchment: "#F4E8D0",
  maroon:  "#6B0F1A",
  gold:    "#B5892E",
  ink:     "#1A0800",
  border:  "#D4BC94",
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [show, setShow] = useState(false);

  useEffect(() => { if (token) navigate('/catalog', { replace: true }); }, [token, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password)
      return toast.error('Please complete your profile details');
    if (form.phone.length < 10)
      return toast.error('A valid 10-digit number is required');
    if (form.password !== form.confirmPassword)
      return toast.error('Password confirmation does not match');
    
    dispatch(register({
      name: form.name, email: form.email, phone: form.phone, password: form.password,
    }));
  };

  return (
    <div className="min-h-screen flex selection:bg-maroon-700/10" style={{ backgroundColor: C.bg }}>
      {/* ── LEFT: IMMERSIVE BRANDING ── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-[#1A0800] p-16 flex-col justify-between">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill={C.gold}/></pattern><rect width="100%" height="100%" fill="url(#grid)"/></svg>
        </div>
        
        <img
          src="https://images.unsplash.com/photo-1598462047020-d9ea050795f4?w=1000&q=80"
          alt="Bespoke Tailoring"
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale mix-blend-overlay"
        />
        
        <Link to="/" className="relative z-10 font-display text-3xl tracking-tighter text-white">
          Tailor<span style={{ color: C.gold }}>24</span>
        </Link>

        <div className="relative z-10">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold-500 mb-4 block">The First Stitch</span>
            <h2 className="font-display text-6xl text-white leading-[1.1] mb-6 font-light">
              Crafting Your <br /><span className="italic" style={{ color: C.parchment }}>Digital Profile.</span>
            </h2>
            <div className="h-[1px] w-24 bg-gold-600/40 mb-8" />
            <p className="font-sans text-xs text-white/50 max-w-xs leading-relaxed tracking-wide">
              Enroll in our digital atelier to access bespoke measurement tracking, 
              curated fabric selections, and your personal commission history.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 text-[9px] uppercase tracking-[0.2em] text-white/30 font-sans">
          Est. 2024 • Central India
        </div>
      </div>

      {/* ── RIGHT: ELEGANT FORM ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <header className="mb-12">
            <h1 className="font-display text-5xl text-charcoal mb-3">Begin Enrollment</h1>
            <p className="font-sans text-xs text-charcoal/40 tracking-wider">
              ALREADY A PATRON?{' '}
              <Link to="/login" className="text-maroon-700 font-bold hover:tracking-widest transition-all">SIGN IN</Link>
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <CustomInput label="Full Name" icon={<FiUser />} value={form.name} onChange={set('name')} placeholder="e.g. Vikramaditya" />
                {/* Email */}
                <CustomInput label="Email Address" icon={<FiMail />} value={form.email} onChange={set('email')} placeholder="vikram@tailor24.com" type="email" />
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/40 block mb-2 font-bold">Mobile Connection</label>
              <div className="flex group">
                <span className="flex items-center px-4 bg-white border border-r-0 border-gold-500/20 font-sans text-xs text-charcoal/40 transition-all group-within:border-maroon-700/40">
                  +91
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full p-4 bg-white border border-gold-500/20 font-sans text-sm focus:outline-none focus:border-maroon-700 transition-all placeholder:text-charcoal/20"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <CustomInput 
                    label="Secret Password" 
                    icon={<FiLock />} 
                    value={form.password} 
                    onChange={set('password')} 
                    placeholder="••••••••" 
                    type={show ? 'text' : 'password'} 
                  />
                  <button
                    type="button"
                    onClick={() => setShow(p => !p)}
                    className="absolute right-4 bottom-4 text-charcoal/20 hover:text-maroon-700 transition-colors"
                  >
                    {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                <CustomInput 
                    label="Confirm Secret" 
                    icon={<FiLock />} 
                    value={form.confirmPassword} 
                    onChange={set('confirmPassword')} 
                    placeholder="••••••••" 
                    type="password" 
                />
            </div>

            <div className="pt-4">
                <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#6B0F1A] text-white font-sans text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 group hover:bg-[#1A0800] transition-all duration-500 shadow-xl disabled:opacity-50"
                >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                    <> Create Your Profile <FiArrowRight className="group-hover:translate-x-2 transition-transform" /> </>
                )}
                </button>
            </div>
            
            <p className="text-center font-sans text-[10px] text-charcoal/30 leading-relaxed px-8">
                By enrolling, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Bespoke Privacy Protocol</span>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── HELPER COMPONENT: ELEGANT INPUT ─── */
function CustomInput({ label, icon, ...props }) {
  return (
    <div className="relative group">
      <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/40 block mb-2 font-bold">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-600/40 group-focus-within:text-maroon-700 transition-colors">
            {icon}
        </div>
        <input
          {...props}
          className="w-full p-4 pl-12 bg-white border border-gold-500/20 font-sans text-sm focus:outline-none focus:border-maroon-700 transition-all placeholder:text-charcoal/20"
        />
      </div>
    </div>
  );
}