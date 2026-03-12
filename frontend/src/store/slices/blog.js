import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api.js";
import { trackEvent } from "../../lib/analytics.js";

export const fetchBlogs = createAsyncThunk("blog/fetch", async () => {
  const res = await api.get("/blog");
  return res.data;
});

export const fetchBlogDetail = createAsyncThunk("blog/detail", async (slug) => {
  const res = await api.get(`/blog/${slug}`);
  trackEvent("blog_read", slug);
  return res.data;
});

const slice = createSlice({
  name: "blog",
  initialState: { list: [], detail: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBlogs.pending, (s) => {
      s.status = "loading";
    }).addCase(fetchBlogs.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.list = a.payload || [];
    }).addCase(fetchBlogs.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.error.message;
    }).addCase(fetchBlogDetail.fulfilled, (s, a) => {
      s.detail = a.payload;
    });
  }
});

export default slice.reducer;
