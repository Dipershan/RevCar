import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import sosReducer from './sosSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    sos: sosReducer, 
  },
});
