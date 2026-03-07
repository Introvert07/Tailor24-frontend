// src/theme.js

// 1. Define the Palette
export const C = {
  page:      '#FBF4E8',
  parchment: '#F4E8D0',
  white:     '#FFFDF5',
  maroon:    '#6B0F1A',
  maroonL:   '#8B1A28',
  gold:      '#B5892E',
  goldB:     '#D4A017',
  ink:       '#1A0800',
  border:    '#D4BC94',
  muted:     '#8B7355',
};

// 2. Define Animations
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show:   { transition: { staggerChildren: delay } },
});