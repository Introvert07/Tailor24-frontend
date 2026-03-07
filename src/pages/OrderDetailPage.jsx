import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchOrderDetail } from '../store/slices/orderSlice';
import { InlineLoader, Badge } from '../components/ui/Atoms';
import { C, fadeUp, stagger } from '../theme';
import { FiArrowLeft } from 'react-icons/fi';

export default function OrderDetailPage() {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { currentOrder: order, loading } = useSelector(st => st.orders);

  useEffect(() => { dispatch(fetchOrderDetail(id)); }, [id, dispatch]);

  if (loading) return <div style={{ paddingTop: 80 }}><InlineLoader /></div>;
  if (!order)  return null;

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: 80 }}>
      <div style={{ background: C.ink, padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
            <FiArrowLeft size={20} />
          </button>
          <h1 style={{ fontFamily: 'serif', fontSize: 28, color: C.white, fontWeight: 300 }}>Order Details</h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div variants={stagger()} initial="hidden" animate="show">
          {/* Header */}
          <motion.div variants={fadeUp} style={{ background: C.white, border: `1px solid ${C.border}`, padding: '24px 28px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: 2, color: C.gold, fontWeight: 700, textTransform: 'uppercase' }}>Order #{order._id.slice(-8)}</p>
              <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>
            <Badge variant="gold">{order.status || 'Processing'}</Badge>
          </motion.div>

          {/* Items */}
          {order.items?.map((item, i) => (
            <motion.div key={i} variants={fadeUp}
              style={{ background: C.white, border: `1px solid ${C.border}`, padding: '20px 28px', marginBottom: 12, display: 'flex', gap: 20, alignItems: 'center' }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: 64, height: 80, objectFit: 'cover', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'serif', fontSize: 17, color: C.ink, fontWeight: 500 }}>{item.name}</p>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Qty: {item.quantity} · Size: {item.size || 'Custom'}</p>
              </div>
              <p style={{ fontFamily: 'serif', fontSize: 18, color: C.maroon }}>₹{(item.price * item.quantity).toLocaleString()}</p>
            </motion.div>
          ))}

          {/* Total */}
          <motion.div variants={fadeUp} style={{ background: C.parchment, border: `1px solid ${C.border}`, padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 11, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: 'uppercase' }}>Total</p>
            <p style={{ fontFamily: 'serif', fontSize: 24, color: C.maroon, fontWeight: 700 }}>₹{order.total?.toLocaleString()}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}