import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api.js";
import { trackEvent } from "../../lib/analytics.js";

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  const res = await api.get("/projects");
  return res.data;
});

export const fetchProjectDetail = createAsyncThunk("projects/detail", async (slug) => {
  const res = await api.get(`/projects/${slug}`);
  trackEvent("project_view", slug);
  return res.data;
});

const slice = createSlice({
  name: "projects",
  initialState: { list: [], detail: null, status: "idle" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProjects.pending, (s) => {
      s.status = "loading";
    }).addCase(fetchProjects.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.list = a.payload;
    }).addCase(fetchProjectDetail.fulfilled, (s, a) => {
      s.detail = a.payload;
    });
  }
});

export default slice.reducer;
