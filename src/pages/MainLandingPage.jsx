import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import HomePage         from './HomePage';
import AboutPage        from './AboutPage';
import VarietyPage      from './VarietyPage';
import TestimonialsPage from './TestimonialsPage';

/* ─── REUSABLE ANIMATION WRAPPER ─────────────────────────── */
// This creates a smooth fade-and-slide up effect as the section enters the viewport
const SectionWrapper = ({ id, children }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    // "once: true" ensures it doesn't replay annoyingly if they scroll up and down
    // "margin" triggers the animation slightly before the section fully enters the screen
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.section>
);

export default function MainLandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    // A slight delay ensures Framer Motion has mounted the DOM nodes 
    // before we try to calculate their position for scrolling.
    const scrollTimeout = setTimeout(() => {
      if (hash) {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [hash]);

  return (
    // Set the overall background to your heritage page color (#FBF4E8) 
    // to prevent any harsh white flashes between the animated sections
    <div style={{ backgroundColor: "#FBF4E8", overflowX: "hidden" }}>
      <SectionWrapper id="home">
        <HomePage />
      </SectionWrapper>
      
      <SectionWrapper id="about">
        <AboutPage />
      </SectionWrapper>
      
      <SectionWrapper id="variety">
        <VarietyPage />
      </SectionWrapper>
      
      <SectionWrapper id="testimonials">
        <TestimonialsPage />
      </SectionWrapper>
    </div>
  );
}