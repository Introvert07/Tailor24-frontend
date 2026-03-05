import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const FABRIC_COLORS = {
  'Premium Cotton':    ['#f0e6d3', '#d4b896'],
  'Chanderi Silk':     ['#e8d5f5', '#c4a0e8'],
  'Linen Pro':         ['#d5e8d4', '#9dc39c'],
  'Banarasi Brocade':  ['#f5e6d0', '#e0b96a'],
  'Soft Velvet':       ['#d5d5e8', '#8080c4'],
};

export default function FabricCard({ fabric, selected, onSelect, index = 0 }) {
  const colors = FABRIC_COLORS[fabric.name] || ['#e8e8e8', '#c0c0c0'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onSelect?.(fabric)}
      className={`cursor-pointer border-2 transition-all duration-200 p-4 group ${
        selected
          ? 'border-rouge-700 bg-rouge-50'
          : 'border-cream-200 bg-white hover:border-gold-400'
      }`}
    >
      {/* Fabric swatch */}
      <div
        className="w-full aspect-[4/3] mb-3 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}
      >
        {/* Weave texture overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 10px),
                              repeating-linear-gradient(-45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 10px)`
          }}
        />
        {selected && (
          <div className="absolute top-2 right-2 bg-rouge-700 text-white w-6 h-6 rounded-full flex items-center justify-center">
            <FiCheck size={12} />
          </div>
        )}
      </div>

      <h4 className={`font-display text-base leading-snug transition-colors ${selected ? 'text-rouge-700' : 'text-charcoal group-hover:text-rouge-700'}`}>
        {fabric.name}
      </h4>
      <p className="font-sans text-sm text-gold-600 font-medium mt-0.5">
        ₹{fabric.pricePerMeter}/m
      </p>
      <p className="font-sans text-xs text-charcoal/40 mt-1">
        {fabric.availableCities?.includes('ALL')
          ? 'Available Everywhere'
          : fabric.availableCities?.join(' · ')}
      </p>
    </motion.div>
  );
}
