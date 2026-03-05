import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getMe, logoutUser } from '../../services/authService';

// ─── THUNKS ───────────────────────────────────────────────────────────────────

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginUser(credentials);
    localStorage.setItem('tailor24_token', data.token);
    localStorage.setItem('tailor24_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await registerUser(userData);
    localStorage.setItem('tailor24_token', data.token);
    localStorage.setItem('tailor24_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await getMe();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutUser();
});

// ─── SLICE ────────────────────────────────────────────────────────────────────

const storedUser = localStorage.getItem('tailor24_user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    storedUser ? JSON.parse(storedUser) : null,
    token:   localStorage.getItem('tailor24_token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(login.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
    // Register
      .addCase(register.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(register.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
    // FetchMe
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload.user || a.payload; })
    // Logout
      .addCase(logout.fulfilled, (s) => { s.user = null; s.token = null; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
