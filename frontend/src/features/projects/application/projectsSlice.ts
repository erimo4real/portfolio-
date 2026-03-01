import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectRepository } from '../infra/projectRepository';
import { trackEvent } from '../../../shared/analytics/trackEvent';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    return await projectRepository.getAll();
  }
);

export const fetchProjectBySlug = createAsyncThunk(
  'projects/fetchProjectBySlug',
  async (slug: string) => {
    const data = await projectRepository.getBySlug(slug);
    trackEvent('project_view', slug);
    return data;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    currentProject: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      });
  }
});

export default projectsSlice.reducer;
