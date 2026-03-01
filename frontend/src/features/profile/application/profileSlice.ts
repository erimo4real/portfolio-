import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileRepository } from '../infra/profileRepository';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    return await profileRepository.get();
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default profileSlice.reducer;
