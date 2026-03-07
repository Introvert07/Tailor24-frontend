import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Instagram, 
  Clock, 
  Scissors,
  Loader2
} from "lucide-react";
// Import your central API service
import { submitContactInquiry } from '../../services/api'; 

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'General Design Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Using the service function that pulls from your environment variables
      await submitContactInquiry(formData);

      toast.success("Message received. Our lead designer will be in touch.");
      
      // Reset form on success
      setFormData({
        name: '',
        phone: '',
        subject: 'General Design Inquiry',
        message: ''
      });
    } catch (error) {
      // Error message is extracted by your Axios interceptor in api.js
      toast.error(error.message || "Could not connect to the atelier server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-heritage-plum text-heritage-sand">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Editorial Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-[1px] w-12 bg-heritage-gold/60"></span>
            <Scissors className="text-heritage-gold" size={22} />
            <span className="h-[1px] w-12 bg-heritage-gold/60"></span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-serif text-heritage-gold italic"
          >
            The Concierge
          </motion.h1>
          <p className="mt-6 text-heritage-sand/80 font-light max-w-xl mx-auto italic leading-relaxed text-lg">
            From fitting inquiries to grand celebrations, our master tailors are at your service.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-heritage-gold/20 p-8 backdrop-blur-sm">
              <Phone className="text-heritage-gold mb-4" size={24} />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-heritage-gold mb-2">Voice Consultation</h3>
              <p className="text-white font-serif text-2xl">+91 98765 43210</p>
            </div>

            <div className="bg-white/5 border border-heritage-gold/20 p-8 backdrop-blur-sm">
              <Mail className="text-heritage-gold mb-4" size={24} />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-heritage-gold mb-2">Digital Inquiry</h3>
              <p className="text-white font-serif text-2xl">concierge@tailor24.com</p>
            </div>

            <div className="bg-heritage-gold p-8 text-heritage-plum relative overflow-hidden">
               <div className="relative z-10">
                <Clock className="mb-4" size={24} />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Measurement Visits</h3>
                <p className="font-medium text-sm leading-relaxed italic">
                  Our traveling tailors bring the atelier to your doorstep. Available 7 days a week.
                </p>
               </div>
               <Scissors className="absolute -bottom-8 -right-8 text-heritage-plum opacity-10" size={140} />
            </div>
          </div>

          {/* Right: The Inquiry Form */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-heritage-sand p-1 border border-heritage-gold/30 shadow-2xl"
            >
              <div className="border border-heritage-gold/20 p-8 md:p-12">
                <h2 className="text-3xl font-serif text-heritage-plum mb-8">Direct Inquiry</h2>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                  
                  <div className="relative">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-heritage-plum/60 block mb-1">Identity</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Full Name"
                      className="w-full bg-transparent border-b-2 border-heritage-plum/10 py-2 text-heritage-plum font-medium focus:border-heritage-plum outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-heritage-plum/60 block mb-1">Connection</label>
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel" 
                      placeholder="Phone Number"
                      className="w-full bg-transparent border-b-2 border-heritage-plum/10 py-2 text-heritage-plum font-medium focus:border-heritage-plum outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="md:col-span-2 relative">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-heritage-plum/60 block mb-1">Nature of Inquiry</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-heritage-plum/10 py-2 text-heritage-plum font-medium focus:border-heritage-plum outline-none cursor-pointer"
                    >
                      <option>General Design Inquiry</option>
                      <option>Bridal & Wedding Trousseau</option>
                      <option>Corporate & Executive Tailoring</option>
                      <option>Alteration & Fitting Support</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 relative">
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-heritage-plum/60 block mb-1">Your Requirements</label>
                    <textarea 
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Please share details regarding your bespoke needs..."
                      className="w-full bg-transparent border-b-2 border-heritage-plum/10 py-2 text-heritage-plum font-medium focus:border-heritage-plum outline-none transition-all resize-none placeholder:text-gray-400"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-heritage-plum text-heritage-gold px-12 py-4 rounded-none font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Sending Inquiry...
                        </>
                      ) : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Icons */}
        <div className="mt-24 text-center">
          <div className="flex justify-center gap-12 border-t border-heritage-gold/20 pt-12">
            <a href="#" className="group flex flex-col items-center gap-2">
              <Instagram className="text-heritage-gold group-hover:scale-110 transition-transform" size={28} />
              <span className="text-[9px] uppercase tracking-widest text-heritage-gold/60">Instagram</span>
            </a>
            <a href="#" className="group flex flex-col items-center gap-2">
              <MessageSquare className="text-heritage-gold group-hover:scale-110 transition-transform" size={28} />
              <span className="text-[9px] uppercase tracking-widest text-heritage-gold/60">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}