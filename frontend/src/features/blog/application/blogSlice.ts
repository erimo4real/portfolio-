import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogRepository } from '../infra/blogRepository';
import { trackEvent } from '../../../shared/analytics/trackEvent';

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async () => {
    return await blogRepository.getAll();
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  'blog/fetchBlogBySlug',
  async (slug: string) => {
    const data = await blogRepository.getBySlug(slug);
    trackEvent('blog_read', slug); 
    return data;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    posts: [],
    currentPost: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      });
  }
});

export default blogSlice.reducer;
