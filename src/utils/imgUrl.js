const FALLBACKS = {
  men:   'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
  women: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
  kids:  'https://images.unsplash.com/photo-1503919919749-640141b1d9b2?w=600',
  default: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
};

export function safeImg(url, category = 'default') {
  if (!url) return FALLBACKS[category] || FALLBACKS.default;
  if (url.includes('images.tailor24.com')) return FALLBACKS[category] || FALLBACKS.default;
  return url;
}