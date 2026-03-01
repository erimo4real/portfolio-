import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api.js";
import { trackEvent } from "../../lib/analytics.js";

export const fetchResume = createAsyncThunk("resume/fetch", async () => {
  const res = await api.get("/resume");
  return res.data;
});

export const trackDownload = createAsyncThunk("resume/download", async () => {
  trackEvent("resume_download");
});

const slice = createSlice({
  name: "resume",
  initialState: { data: null, status: "idle" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchResume.pending, (s) => {
      s.status = "loading";
    }).addCase(fetchResume.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.data = a.payload;
    }).addCase(fetchResume.rejected, (s) => {
      s.status = "failed";
    });
  }
});

export default slice.reducer;
