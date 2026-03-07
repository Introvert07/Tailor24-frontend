import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookHomeConsultation } from '../../services/api'; 
import { FiX } from 'react-icons/fi';

const C = {
  parchment: "#F4E8D0", maroon: "#6B0F1A", gold: "#B5892E", ink: "#1A0800", border: "#D4BC94"
};

export default function ConsultationModal({ isOpen, onClose }) {
  // Added 'name' to the state
  const [formData, setFormData] = useState({ name: '', mobileNumber: '', address: '', timeSlot: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await bookHomeConsultation(formData);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', mobileNumber: '', address: '', timeSlot: '' });
      }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-8 shadow-2xl"
          style={{ backgroundColor: C.parchment, border: `1px solid ${C.border}` }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100">
            <FiX size={20} style={{ color: C.ink }} />
          </button>

          <h2 className="font-display text-3xl mb-2 italic text-center" style={{ color: C.ink }}>
            Book a Master Tailor
          </h2>
          <p className="font-sans text-[10px] uppercase tracking-widest text-center mb-6 opacity-60">
            Home Measurement & Consultation
          </p>

          {status === 'success' ? (
            <div className="text-center py-8 font-sans text-sm" style={{ color: C.maroon }}>
              Your appointment is booked. Our master tailor will contact you shortly!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- NEW NAME FIELD --- */}
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border p-3 text-sm outline-none focus:border-maroon-700 transition-colors"
                  style={{ borderColor: C.border }} placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider mb-1">Mobile Number</label>
                <input 
                  type="tel" required
                  value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
                  className="w-full bg-transparent border p-3 text-sm outline-none focus:border-maroon-700 transition-colors"
                  style={{ borderColor: C.border }} placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider mb-1">Full Address</label>
                <textarea 
                  required rows="2"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-transparent border p-3 text-sm outline-none focus:border-maroon-700 transition-colors resize-none"
                  style={{ borderColor: C.border }} placeholder="Enter your home or office address"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider mb-1">Preferred Time Slot</label>
                <select 
                  required
                  value={formData.timeSlot} onChange={e => setFormData({...formData, timeSlot: e.target.value})}
                  className="w-full bg-transparent border p-3 text-sm outline-none focus:border-maroon-700 transition-colors cursor-pointer"
                  style={{ borderColor: C.border }}
                >
                  <option value="" disabled>Select a time</option>
                  <option value="Morning (10AM - 1PM)">Morning (10 AM - 1 PM)</option>
                  <option value="Afternoon (1PM - 4PM)">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening (4PM - 7PM)">Evening (4 PM - 7 PM)</option>
                </select>
              </div>

              {status === 'error' && <p className="text-red-500 text-xs text-center">Something went wrong. Please try again.</p>}

              <button 
                type="submit" disabled={status === 'loading'}
                className="w-full mt-4 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.3em] transition-all active:scale-95"
                style={{ backgroundColor: C.maroon, color: 'white' }}
              >
                {status === 'loading' ? 'Booking...' : 'Confirm Request'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}