import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axiosInstance';

export const sendSOSAlert = createAsyncThunk(
  'sos/send',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/sos', data);
      return response.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Something went wrong');
    }
  }
);

const sosSlice = createSlice({
  name: 'sos',
  initialState: {
    loading: false,
    message: null,
    error: null,
  },
  reducers: {
    clearSOSStatus: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSOSAlert.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(sendSOSAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(sendSOSAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSOSStatus } = sosSlice.actions;
export default sosSlice.reducer;
