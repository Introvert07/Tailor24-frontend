import { motion } from 'framer-motion';

import HomePage         from './HomePage';
import AboutPage        from './AboutPage';
import VarietyPage      from './VarietyPage';
import TestimonialsPage from './TestimonialsPage';

const SectionWrapper = ({ id, children }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.section>
);

export default function MainLandingPage() {
  return (
    <div style={{ backgroundColor: "#FBF4E8", overflowX: "hidden" }}>
      <SectionWrapper id="home">
        <HomePage />
      </SectionWrapper>
      <SectionWrapper id="variety">
        <VarietyPage />
      </SectionWrapper>
      <SectionWrapper id="about">
        <AboutPage />
      </SectionWrapper>
      <SectionWrapper id="testimonials">
        <TestimonialsPage />
      </SectionWrapper>
    </div>
  );
}