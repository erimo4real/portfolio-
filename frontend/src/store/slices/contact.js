import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api.js";

export const submitContact = createAsyncThunk("contact/submit", async (data) => {
  const res = await api.post("/contact", data);
  return res.data;
});

const slice = createSlice({
  name: "contact",
  initialState: { status: "idle" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(submitContact.pending, (s) => {
      s.status = "loading";
    }).addCase(submitContact.fulfilled, (s) => {
      s.status = "succeeded";
    }).addCase(submitContact.rejected, (s) => {
      s.status = "failed";
    });
  }
});

export default slice.reducer;
