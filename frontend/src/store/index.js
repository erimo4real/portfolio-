import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.js";
import profileReducer from "./slices/profile.js";

import projectsReducer from "./slices/projects.js";
import blogReducer from "./slices/blog.js";
import resumeReducer from "./slices/resume.js";
import contactReducer from "./slices/contact.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    projects: projectsReducer,
    blog: blogReducer,
    resume: resumeReducer,
    contact: contactReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 100 }
    })
});
