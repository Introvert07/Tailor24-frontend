import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Instagram, Clock, Send, ShieldCheck } from 'lucide-react';
import { contactService } from '../services/api'; 
import { RoyalInput, RoyalBtn } from '../components/ui/Atoms';

const INFO = [
  { Icon: Phone,     label: 'Phone',     value: '+91 98765 43210' },
  { Icon: Mail,      label: 'Email',     value: 'care@shahikar.com' },
  { Icon: MapPin,    label: 'Flagship Presence', value: 'Vidisha · Bhopal · Indore' },
  { Icon: Clock,     label: 'Atelier Hours',    value: 'Mon–Sat 10am – 7pm' },
  { Icon: Instagram, label: 'Instagram', value: '@shahikar.official' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactService.sendMessage(form);
      toast.success("Our master tailor has received your inquiry.");
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error('Connection interrupted. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF4E8] pt-24 font-sans selection:bg-gold-500/30 relative">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
      
      {/* ── SIMPLE MAROON HERO ── */}
      <header className="bg-[#6B0F1A] py-28 px-6 text-center relative border-b-4 border-[#B5892E]">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="text-[10px] tracking-[0.5em] text-[#D4A017] font-bold uppercase mb-4 block">
            The House of Shahikar
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white font-light">
            Crafting <span className="text-[#D4A017] italic font-serif">Connections</span>
          </h1>
          <p className="text-white/60 font-serif text-lg mt-4 italic">Bespoke excellence across Madhya Pradesh</p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* ── INFO SECTION ── */}
          <section className="space-y-12">
            <div className="relative pl-6 border-l-4 border-[#6B0F1A]">
              <h2 className="font-serif text-4xl text-[#1A0800] mb-4">Heritage Centres</h2>
              <p className="text-[#1A0800]/70 leading-relaxed max-w-md text-lg font-light">
                From our roots in <span className="text-[#6B0F1A] font-semibold">Vidisha</span> to the hubs of 
                <span className="text-[#6B0F1A] font-semibold"> Bhopal</span> and Indore, we bring 24 years of tailoring mastery to you.
              </p>
            </div>

            <div className="space-y-6">
              {INFO.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-[#1A0800] flex items-center justify-center border border-[#B5892E]/30 rotate-45 group-hover:rotate-0 transition-all duration-500">
                    <Icon size={18} className="text-[#B5892E] -rotate-45 group-hover:rotate-0 transition-all" />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-[#B5892E] font-bold uppercase">{label}</p>
                    <p className="text-[#1A0800] text-lg font-serif">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── INQUIRY FORM ── */}
          <section className="bg-white border border-[#D4BC94] p-10 md:p-14 shadow-xl relative">
            <h2 className="font-serif text-3xl text-[#1A0800] mb-8">Private Inquiry</h2>
            <form onSubmit={submit} className="space-y-6">
              <RoyalInput label="Full Name" value={form.name} onChange={set('name')} placeholder="Mahesh Kushwah" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoyalInput label="Email" value={form.email} onChange={set('email')} type="email" required />
                <RoyalInput label="Phone" value={form.phone} onChange={set('phone')} type="tel" />
              </div>
              <textarea 
                value={form.message} 
                onChange={set('message')} 
                required 
                rows={4} 
                placeholder="Describe your bespoke requirements..."
                className="w-full bg-[#FBF4E8]/30 border-b border-[#D4BC94] p-3 focus:border-[#6B0F1A] outline-none transition-all font-serif italic"
              />
              <RoyalBtn type="submit" disabled={loading} className="w-full py-4 bg-[#1A0800] text-[#B5892E] hover:bg-[#B5892E] hover:text-white transition-all uppercase tracking-widest text-xs font-bold">
                {loading ? 'Submitting...' : 'Request Consultation'}
              </RoyalBtn>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}