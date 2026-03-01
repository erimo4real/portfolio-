import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicLayout from "../shared/components/PublicLayout.jsx";
import ProjectsList from "../features/projects/ui/ProjectsList.jsx";
import ProjectDetail from "../features/projects/ui/ProjectDetail.jsx";
import ResumeView from "../features/resume/ui/ResumeView.jsx";
import ProfileView from "../features/profile/ui/ProfileView.jsx";
import SkillsList from "../features/skills/ui/SkillsList.jsx";
import BlogList from "../features/blog/ui/BlogList.jsx";
import BlogDetail from "../features/blog/ui/BlogDetail.jsx";
import ContactForm from "../features/contact/ui/ContactForm.jsx";

// Admin imports
import AdminLayout from "../features/admin/ui/AdminLayout.jsx";
import AdminDashboard from "../features/admin/ui/AdminDashboard.jsx";
import ProjectManagement from "../features/admin/ui/ProjectManagement.jsx";
import BlogManagement from "../features/admin/ui/BlogManagement.jsx";
import SkillsManagement from "../features/admin/ui/SkillsManagement.jsx";
import LoginForm from "../features/auth/ui/LoginForm.jsx";
import ProtectedRoute from "../shared/components/ProtectedRoute.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Router() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<ProjectsList />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="project/:slug" element={<ProjectDetail />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="resume" element={<ResumeView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="skills" element={<SkillsList />} />
        <Route path="contact" element={<ContactForm />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginForm />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="skills" element={<SkillsManagement />} />
        <Route path="profile" element={<div>Profile Management (TBD)</div>} />
        <Route path="resume" element={<div>Resume Management (TBD)</div>} />
        <Route path="contacts" element={<div>Messages Management (TBD)</div>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
