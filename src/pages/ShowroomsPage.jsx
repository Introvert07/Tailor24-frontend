import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchShowrooms, setActiveCity } from '../store/slices/showroomSlice';
import { InlineLoader } from '../components/ui/Atoms';
import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { C, fadeUp, stagger } from '../theme';

export default function ShowroomsPage() {
  const dispatch = useDispatch();
  const { showrooms, cities, activeCity, loading } = useSelector(st => st.showrooms);

  useEffect(() => { dispatch(fetchShowrooms()); }, [dispatch]);

  const filtered = activeCity ? showrooms.filter(s => s.city === activeCity) : showrooms;

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: 80 }}>
      <div style={{ background: C.ink, padding: '52px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 10, letterSpacing: 4, color: C.gold, fontWeight: 700, textTransform: 'uppercase' }}>Showrooms</span>
        <h1 style={{ fontFamily: 'serif', fontSize: 'clamp(28px,4vw,48px)', color: C.white, fontWeight: 300, marginTop: 10 }}>
          Visit Us In Person
        </h1>
      </div>

      {/* City filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '32px 24px 0', flexWrap: 'wrap' }}>
        {['All', ...(cities || [])].map(city => {
          const active = (city === 'All' && !activeCity) || city === activeCity;
          return (
            <motion.button key={city} whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setActiveCity(city === 'All' ? null : city))}
              style={{ border: `1px solid ${active ? C.maroon : C.border}`, background: active ? C.maroon : 'transparent', color: active ? C.white : C.ink, padding: '8px 22px', fontSize: 11, letterSpacing: 2, fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
              {city}
            </motion.button>
          );
        })}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {loading ? <InlineLoader /> : (
          <motion.div variants={stagger(0.1)} initial="hidden" animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 24 }}>
            <AnimatePresence>
              {filtered.map(shop => (
                <motion.div key={shop._id} variants={fadeUp} layout whileHover={{ y: -4 }}
                  style={{ background: C.white, border: `1px solid ${C.border}`, padding: 32 }}>
                  <span style={{ fontSize: 10, letterSpacing: 3, color: C.gold, fontWeight: 700, textTransform: 'uppercase' }}>{shop.city}</span>
                  <p style={{ fontFamily: 'serif', fontSize: 22, color: C.ink, fontWeight: 600, marginTop: 8, marginBottom: 20 }}>{shop.name}</p>
                  {[
                    { Icon: FiMapPin, text: shop.address },
                    { Icon: FiPhone,  text: shop.phone   },
                    { Icon: FiClock,  text: shop.hours   },
                  ].map(({ Icon, text }) => text && (
                    <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, color: C.muted, fontSize: 13 }}>
                      <Icon size={13} style={{ marginTop: 2, flexShrink: 0, color: C.gold }} />
                      <span>{text}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}