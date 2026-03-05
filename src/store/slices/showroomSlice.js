import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getShowrooms } from '../../services/showroomService';

export const fetchShowrooms = createAsyncThunk(
  'showrooms/fetchShowrooms',
  async (params = {}, { rejectWithValue }) => {
    try { return await getShowrooms(params); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

const showroomSlice = createSlice({
  name: 'showrooms',
  initialState: {
    showrooms:   [],
    loading:     false,
    error:       null,
    activeCity:  'All',
  },
  reducers: {
    setActiveCity: (state, action) => { state.activeCity = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowrooms.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchShowrooms.fulfilled, (s, a) => {
        s.loading   = false;
        s.showrooms = a.payload.showrooms || a.payload;
      })
      .addCase(fetchShowrooms.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setActiveCity } = showroomSlice.actions;
export default showroomSlice.reducer;
