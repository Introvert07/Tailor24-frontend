import { configureStore } from '@reduxjs/toolkit';
import authReducer      from './slices/authSlice';
import catalogReducer   from './slices/catalogSlice';
import orderReducer     from './slices/orderSlice';
import showroomReducer  from './slices/showroomSlice';

const store = configureStore({
  reducer: {
    auth:      authReducer,
    catalog:   catalogReducer,
    orders:    orderReducer,
    showrooms: showroomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
