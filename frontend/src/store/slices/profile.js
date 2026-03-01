import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api.js";

export const fetchProfile = createAsyncThunk("profile/fetch", async () => {
  const res = await api.get("/profile");
  return res.data;
});

const slice = createSlice({
  name: "profile",
  initialState: { data: null, status: "idle" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProfile.pending, (s) => {
      s.status = "loading";
    }).addCase(fetchProfile.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.data = a.payload;
    }).addCase(fetchProfile.rejected, (s) => {
      s.status = "failed";
    });
  }
});

export default slice.reducer;
