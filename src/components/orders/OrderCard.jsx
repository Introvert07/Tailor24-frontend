import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock } from 'react-icons/fi';

// Status values from your ORDER_STATUS constants
const STATUS_CONFIG = {
  CREATED:         { color: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-400' },
  VERIFIED:        { color: 'bg-blue-50 text-blue-700 border-blue-200',        dot: 'bg-blue-400' },
  STITCHING:       { color: 'bg-violet-50 text-violet-700 border-violet-200',  dot: 'bg-violet-400' },
  READY:           { color: 'bg-emerald-50 text-emerald-700 border-emerald-200',dot: 'bg-emerald-400' },
  DELIVERED:       { color: 'bg-green-50 text-green-700 border-green-200',     dot: 'bg-green-500' },
  CANCELLED:       { color: 'bg-red-50 text-red-700 border-red-200',           dot: 'bg-red-400' },
  ORDER_VERIFIED:  { color: 'bg-blue-50 text-blue-700 border-blue-200',        dot: 'bg-blue-400' },
};

export default function OrderCard({ order, index = 0 }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.CREATED;

  // Order model fields: garmentType, totalPrice, customization.frontDesign.neckline
  const neckline = order.customization?.frontDesign?.neckline;
  const fabric   = order.fabric?.fabricId?.name || null;
  const city     = order.city;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="card p-5 hover:border-gold-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">

          {/* ID + Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-xs text-charcoal/40 font-medium tracking-wider uppercase">
              #{order._id?.slice(-8).toUpperCase()}
            </span>
            <span className={`badge border text-[10px] flex items-center gap-1 ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {order.status}
            </span>
          </div>

          {/* Garment name — model uses garmentType not product.name */}
          <h3 className="font-display text-lg text-charcoal mt-2 truncate">
            {order.garmentType || 'Custom Order'}
          </h3>

          {/* Details */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
            {neckline && (
              <p className="font-sans text-xs text-charcoal/50">
                <span className="text-charcoal/30">Neckline:</span> {neckline}
              </p>
            )}
            {city && (
              <p className="font-sans text-xs text-charcoal/50">
                <span className="text-charcoal/30">City:</span> {city}
              </p>
            )}
            {order.fabric?.source && (
              <p className="font-sans text-xs text-charcoal/50">
                <span className="text-charcoal/30">Fabric:</span> {order.fabric.source}
              </p>
            )}
            {order.measurements?.method && (
              <p className="font-sans text-xs text-charcoal/50">
                <span className="text-charcoal/30">Fitting:</span> {order.measurements.method}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 mt-3">
            <FiClock size={11} className="text-charcoal/30" />
            <p className="font-sans text-xs text-charcoal/40">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Price + Link — model uses totalPrice not totalAmount */}
        <div className="flex flex-col items-end gap-3">
          <p className="font-display text-xl text-rouge-700 whitespace-nowrap">
            {order.totalPrice ? `₹${order.totalPrice.toLocaleString()}` : '—'}
          </p>
          <Link
            to={`/orders/${order._id}`}
            className="flex items-center gap-1 font-sans text-xs text-rouge-700 hover:text-rouge-800 transition-colors"
          >
            View Details <FiArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}