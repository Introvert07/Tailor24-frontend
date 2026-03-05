import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../../services/orderService';

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try { return await createOrder(orderData); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (params = {}, { rejectWithValue }) => {
    try { return await getMyOrders(params); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (id, { rejectWithValue }) => {
    try { return await getOrderById(id); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

export const cancelMyOrder = createAsyncThunk(
  'orders/cancelMyOrder',
  async (id, { rejectWithValue }) => {
    try { return await cancelOrder(id); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:        [],
    selectedOrder: null,
    loading:       false,
    placing:       false,
    error:         null,
    successMsg:    null,

    // Customization builder (before placing)
    customization: {
      productId:  null,
      fabricId:   null,
      neckline:   '',
      sleeve:     '',
      back:       '',
      measurements: {},
      quantity:   1,
      showroomId: null,
    },
  },
  reducers: {
    setCustomization: (state, action) => {
      state.customization = { ...state.customization, ...action.payload };
    },
    resetCustomization: (state) => {
      state.customization = {
        productId: null, fabricId: null,
        neckline: '', sleeve: '', back: '',
        measurements: {}, quantity: 1, showroomId: null,
      };
    },
    clearOrderError: (state) => { state.error = null; state.successMsg = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,   (s) => { s.placing = true;  s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => {
        s.placing = false;
        s.successMsg = 'Order placed successfully!';
        s.orders.unshift(a.payload.order || a.payload);
      })
      .addCase(placeOrder.rejected,  (s, a) => { s.placing = false; s.error = a.payload; })

      .addCase(fetchMyOrders.pending,   (s) => { s.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.orders  = a.payload.orders || a.payload;
      })
      .addCase(fetchMyOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchOrderDetail.fulfilled, (s, a) => {
        s.selectedOrder = a.payload.order || a.payload;
      })

      .addCase(cancelMyOrder.fulfilled, (s, a) => {
        const updated = a.payload.order || a.payload;
        const idx = s.orders.findIndex(o => o._id === updated._id);
        if (idx !== -1) s.orders[idx] = updated;
        if (s.selectedOrder?._id === updated._id) s.selectedOrder = updated;
      });
  },
});

export const { setCustomization, resetCustomization, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
