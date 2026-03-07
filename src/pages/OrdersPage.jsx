// ── OrdersPage ──────────────────────────────────────────────
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { InlineLoader, Badge } from '../components/ui/Atoms';
import { C, fadeUp, stagger } from '../theme';
import { FiPackage } from 'react-icons/fi';

function statusVariant(status) {
  if (!status) return 'gold';
  const s = status.toLowerCase();
  if (s.includes('deliver')) return 'maroon';
  if (s.includes('cancel'))  return 'maroon';
  return 'gold';
}

export function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(st => st.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: 80 }}>
      <div style={{ background: C.ink, padding: '52px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: 'clamp(28px,4vw,44px)', color: C.white, fontWeight: 300 }}>My Orders</h1>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {loading ? <InlineLoader /> : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <FiPackage size={48} color={C.border} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontFamily: 'serif', fontSize: 22, color: C.muted }}>No orders yet</p>
            <Link to="/catalog" style={{ display: 'inline-block', marginTop: 20, background: C.maroon, color: C.white, padding: '12px 28px', fontSize: 12, letterSpacing: 2, textDecoration: 'none', fontWeight: 600, textTransform: 'uppercase' }}>
              Browse Collection
            </Link>
          </div>
        ) : (
          <motion.div variants={stagger()} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence>
              {orders.map(order => (
                <motion.div key={order._id} variants={fadeUp}
                  style={{ background: C.white, border: `1px solid ${C.border}`, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: 2, color: C.gold, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Order #{order._id.slice(-8)}</p>
                    <p style={{ fontFamily: 'serif', fontSize: 18, color: C.ink }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{order.items?.length} item(s) · ₹{order.total?.toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Badge variant={statusVariant(order.status)}>{order.status || 'Processing'}</Badge>
                    <Link to={`/orders/${order._id}`} style={{ fontSize: 11, letterSpacing: 2, color: C.maroon, fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>View →</Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;