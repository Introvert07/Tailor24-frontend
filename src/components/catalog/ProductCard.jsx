import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const FALLBACK_IMGS = {
  Womenswear: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
  Menswear:   'https://images.unsplash.com/photo-1594938298603-c8148c4b4646?w=400&q=80',
  Kids:       'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80',
};

export default function ProductCard({ product, index = 0 }) {
  const imgSrc = FALLBACK_IMGS[product.category] || FALLBACK_IMGS.Womenswear;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link to={`/catalog/${product._id}`} className="group block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-cream-200">
          <img
            src={product.image || imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.src = imgSrc; }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-all duration-500" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge-rouge text-[10px]">{product.category}</span>
          </div>

          {/* CTA */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm px-4 py-2.5">
              <span className="font-sans text-xs font-medium tracking-wider uppercase text-charcoal">Customize Now</span>
              <FiArrowRight size={14} className="text-rouge-700" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 px-1">
          <h3 className="font-display text-lg text-charcoal group-hover:text-rouge-700 transition-colors duration-200 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            <p className="font-sans text-sm text-charcoal/50">Starting at</p>
            <p className="font-display text-xl text-rouge-700 font-medium">₹{product.basePrice?.toLocaleString()}</p>
          </div>
          {/* Options preview */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {product.customizationOptions?.necklines?.slice(0, 2).map(n => (
              <span key={n} className="text-[10px] font-sans text-charcoal/50 bg-cream-100 px-2 py-0.5">{n}</span>
            ))}
            {product.customizationOptions?.necklines?.length > 2 && (
              <span className="text-[10px] font-sans text-charcoal/40">+{product.customizationOptions.necklines.length - 2} more</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
