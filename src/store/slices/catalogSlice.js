import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductById, getFabrics } from '../../services/catalogService';

export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try { return await getProducts(params); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'catalog/fetchProductDetail',
  async (id, { rejectWithValue }) => {
    try { return await getProductById(id); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const fetchFabrics = createAsyncThunk(
  'catalog/fetchFabrics',
  async (params = {}, { rejectWithValue }) => {
    try { return await getFabrics(params); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    products:        [],
    selectedProduct: null,
    fabrics:         [],
    totalProducts:   0,
    loading:         false,
    fabricLoading:   false,
    error:           null,
    activeCategory:  'All',
  },
  reducers: {
    setActiveCategory: (state, action) => { state.activeCategory = action.payload; },
    clearSelectedProduct: (state) => { state.selectedProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      // Products list
      .addCase(fetchProducts.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading  = false;
        s.products = a.payload.products || a.payload;
        s.totalProducts = a.payload.total || (a.payload.products || a.payload).length;
      })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // Product detail
      .addCase(fetchProductDetail.pending,   (s) => { s.loading = true; })
      .addCase(fetchProductDetail.fulfilled, (s, a) => { s.loading = false; s.selectedProduct = a.payload.product || a.payload; })
      .addCase(fetchProductDetail.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      // Fabrics
      .addCase(fetchFabrics.pending,   (s) => { s.fabricLoading = true; })
      .addCase(fetchFabrics.fulfilled, (s, a) => { s.fabricLoading = false; s.fabrics = a.payload.fabrics || a.payload; })
      .addCase(fetchFabrics.rejected,  (s, a) => { s.fabricLoading = false; s.error = a.payload; });
  },
});

export const { setActiveCategory, clearSelectedProduct } = catalogSlice.actions;
export default catalogSlice.reducer;
