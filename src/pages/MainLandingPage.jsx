import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import VarietyPage from './VarietyPage';
import TestimonialsPage from './TestimonialsPage.jsx';

export default function MainLandingPage() {
  const location = useLocation();

  // Handle smooth scrolling when navigating to hash links (e.g., /#about)
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="scroll-smooth">
      {/* Give each section an ID that matches your anchor links */}
      <section id="home">
        <HomePage />
      </section>
      
      <section id="about">
        <AboutPage />
      </section>
      
      <section id="variety">
        <VarietyPage />
      </section>
      
      <section id="testimonials">
        <TestimonialsPage />
      </section>
    </div>
  );
}