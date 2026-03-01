// Authentication slice for managing admin login state
// Handles login, logout, and session verification
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api.js";

// Login action - authenticates admin and stores session info
// Parameters: identifier (email/phone), password, rememberMe (boolean)
export const login = createAsyncThunk("auth/login", async ({ identifier, password, rememberMe }) => {
  const res = await api.post("/auth/login", { identifier, password, rememberMe });
  return res.data;
});

// Logout action - clears admin session
export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});

// CheckAuth action - verifies current session validity
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const res = await api.get("/auth/me");
  return res.data;
});

// ForgotPassword action - requests password reset email
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (identifier) => {
  const res = await api.post("/auth/forgot-password", { identifier });
  return res.data;
});

// ResetPassword action - updates password with new value
export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, password }) => {
  const res = await api.post("/auth/reset-password", { token, password });
  return res.data;
});

const slice = createSlice({
  name: "auth",
  // Initial state for authentication
  // isAuthenticated: boolean - whether user is logged in
  // admin: object - admin user data
  // status: string - current request status (idle, loading, succeeded, failed)
  // error: string - error message if any
  // resetStatus: string - password reset request status
  // resetError: string - password reset error
  // resetMessage: string - password reset success message
  initialState: { 
    isAuthenticated: false, 
    admin: null,
    status: "idle", 
    error: null,
    resetStatus: "idle",
    resetError: null,
    resetMessage: null
  },
  reducers: {
    // Clear password reset state
    clearResetState(state) {
      state.resetStatus = "idle";
      state.resetError = null;
      state.resetMessage = null;
    }
  },
  // Handle async action states (pending, fulfilled, rejected)
  extraReducers: (builder) => {
    builder
      // Handle login action states
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
        state.error = "Invalid credentials";
        state.isAuthenticated = false;
      })
      // Handle logout action
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.admin = null;
      })
      // Handle checkAuth action states
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = action.payload.isAuthenticated;
        state.admin = action.payload.admin || null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.admin = null;
      })
      // Handle forgotPassword action states
      .addCase(forgotPassword.pending, (state) => {
        state.resetStatus = "loading";
        state.resetError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.resetStatus = "succeeded";
        state.resetMessage = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.resetStatus = "failed";
        state.resetError = "Failed to send reset email";
      })
      // Handle resetPassword action states
      .addCase(resetPassword.pending, (state) => {
        state.resetStatus = "loading";
        state.resetError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetStatus = "succeeded";
        state.resetMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.resetStatus = "failed";
        state.resetError = "Invalid or expired reset token";
      });
  }
});

export const { clearResetState } = slice.actions;
export default slice.reducer;
