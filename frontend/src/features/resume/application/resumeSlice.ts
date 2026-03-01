import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeRepository } from '../infra/resumeRepository';
import { trackEvent } from '../../../shared/analytics/trackEvent';

export const fetchResumes = createAsyncThunk(
  'resume/fetchResumes',
  async () => {
    return await resumeRepository.getAll();
  }
);

export const fetchActiveResume = createAsyncThunk(
  'resume/fetchActiveResume',
  async () => {
    return await resumeRepository.getActive();
  }
);

export const trackResumeDownload = createAsyncThunk(
  'resume/trackDownload',
  async (version: string) => {
    trackEvent('resume_download', version);
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    list: [],
    active: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchActiveResume.fulfilled, (state, action) => {
        state.active = action.payload;
      });
  }
});

export default resumeSlice.reducer;
