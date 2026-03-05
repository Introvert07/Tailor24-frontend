import API from './api';

// GET /api/catalog/products/:category  OR  /api/catalog/products/All
export const getProducts = async (params = {}) => {
  const category = params.category || 'All';
  // If All, fetch each category and merge
  if (category === 'All') {
    const [w, m, k] = await Promise.all([
      API.get('/catalog/products/Womenswear'),
      API.get('/catalog/products/Menswear'),
      API.get('/catalog/products/Kids'),
    ]);
    const all = [
      ...(w.data.products || w.data),
      ...(m.data.products || m.data),
      ...(k.data.products || k.data),
    ];
    return { products: all, total: all.length };
  }
  const { data } = await API.get(`/catalog/products/${category}`);
  return { products: data.products || data, total: (data.products || data).length };
};

// GET /api/catalog/product/:id  (singular!)
export const getProductById = async (id) => {
  const { data } = await API.get(`/catalog/product/${id}`);
  return data;
};

// GET /api/catalog/fabrics
export const getFabrics = async (params = {}) => {
  const { data } = await API.get('/catalog/fabrics', { params });
  return data;
};

export const getFabricById = async (id) => {
  const { data } = await API.get(`/catalog/fabrics/${id}`);
  return data;
};