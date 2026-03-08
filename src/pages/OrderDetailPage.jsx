import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchOrderDetail } from '../store/slices/orderSlice';
import { InlineLoader, Badge } from '../components/ui/Atoms';
import { C, fadeUp, stagger } from '../theme';
import { FiArrowLeft, FiMapPin, FiTruck } from 'react-icons/fi';

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder: order, loading } = useSelector(st => st.orders);

  useEffect(() => {
    dispatch(fetchOrderDetail(id));
  }, [id, dispatch]);

  if (loading) return <div style={{ paddingTop: 80 }}><InlineLoader /></div>;
  if (!order) return null;

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: 80 }}>
      {/* Page Header */}
      <div style={{ background: C.ink, padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => navigate('/orders')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 style={{ fontFamily: 'serif', fontSize: 28, color: C.white, fontWeight: 300 }}>
            Order Details
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div variants={stagger()} initial="hidden" animate="show">
          
          {/* Order Summary Header */}
          <motion.div variants={fadeUp} style={{ 
            background: C.white, 
            border: `1px solid ${C.border}`, 
            padding: '24px 28px', 
            marginBottom: 20, 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 12 
          }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: 2, color: C.gold, fontWeight: 700, textTransform: 'uppercase' }}>
                Order #{order._id.slice(-8)}
              </p>
              <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </p>
            </div>
            <Badge variant="gold">{order.status || 'Processing'}</Badge>
          </motion.div>

          {/* Logistics & Address Section */}
          <motion.div variants={fadeUp} style={{ 
            background: C.white, 
            border: `1px solid ${C.border}`, 
            padding: '24px 28px', 
            marginBottom: 20 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <FiMapPin size={16} color={C.gold} />
              <p style={{ fontSize: 11, letterSpacing: 2, color: C.ink, fontWeight: 700, textTransform: 'uppercase' }}>
                Shipping & Pickup Details
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {/* Address Details */}
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6 }}>
                <p style={{ fontWeight: 600, color: C.muted, fontSize: 12, marginBottom: 4 }}>Delivery Address</p>
                {order.address ? (
                  <>
                    <p>{order.address.street}</p>
                    {order.address.landmark && <p style={{ fontSize: 13, color: C.muted }}>Ref: {order.address.landmark}</p>}
                    <p>{order.city} - {order.address.pincode}</p>
                  </>
                ) : (
                  <p style={{ fontStyle: 'italic', color: C.muted }}>No address provided</p>
                )}
              </div>

              {/* Measurement/Fabric Method */}
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6 }}>
                <p style={{ fontWeight: 600, color: C.muted, fontSize: 12, marginBottom: 4 }}>Service Method</p>
                <p>Fabric: <span style={{ textTransform: 'capitalize' }}>{order.fabric?.source?.replace('_', ' ') || 'Not Specified'}</span></p>
                <p>Fit: <span style={{ textTransform: 'capitalize' }}>{order.measurements?.method || 'Standard'}</span></p>
              </div>
            </div>
          </motion.div>

          {/* Items Section */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, paddingLeft: 4 }}>
              Design Selection
            </p>
            {order.items?.length > 0 ? (
              order.items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ 
                  background: C.white, 
                  border: `1px solid ${C.border}`, 
                  padding: '20px 28px', 
                  marginBottom: 12, 
                  display: 'flex', 
                  gap: 20, 
                  alignItems: 'center' 
                }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: 64, height: 80, objectFit: 'cover', flexShrink: 0, borderRadius: 2 }} />}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'serif', fontSize: 17, color: C.ink, fontWeight: 500 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                      Qty: {item.quantity} · Style: {order.garmentType || 'Custom'}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'serif', fontSize: 18, color: C.maroon }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </motion.div>
              ))
            ) : (
              /* Fallback for Custom Orders where items might be nested differently */
              <motion.div variants={fadeUp} style={{ 
                background: C.white, 
                border: `1px solid ${C.border}`, 
                padding: '20px 28px', 
                marginBottom: 12, 
                display: 'flex', 
                justifyContent: 'space-between' 
              }}>
                <div>
                  <p style={{ fontFamily: 'serif', fontSize: 17, color: C.ink }}>{order.garmentType}</p>
                  <p style={{ fontSize: 12, color: C.muted }}>Bespoke Tailoring Service</p>
                </div>
                <p style={{ fontFamily: 'serif', fontSize: 18, color: C.maroon }}>
                  ₹{order.totalPrice?.toLocaleString() || '---'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Total Calculation Card */}
          <motion.div variants={fadeUp} style={{ 
            background: C.parchment, 
            border: `1px solid ${C.border}`, 
            padding: '24px 28px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, color: C.muted, fontWeight: 700, textTransform: 'uppercase' }}>Total Amount</p>
              <p style={{ fontSize: 12, color: C.gold, marginTop: 4 }}>Incl. Luxury Packaging</p>
            </div>
            <p style={{ fontFamily: 'serif', fontSize: 28, color: C.maroon, fontWeight: 700 }}>
              ₹{(order.totalPrice || order.total)?.toLocaleString()}
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}