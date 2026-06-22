import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GitHub, Mail, X, Menu } from "./shared/components/Icons.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import AdminLogin from "./pages/admin/Login.jsx";
import ForgotPassword from "./pages/admin/ForgotPassword.jsx";
import ResetPassword from "./pages/admin/ResetPassword.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin.jsx";
import BlogsAdmin from "./pages/admin/BlogsAdmin.jsx";
import ProfileAdmin from "./pages/admin/ProfileAdmin.jsx";
import ResumeAdmin from "./pages/admin/ResumeAdmin.jsx";
import SkillsManagement from "./features/admin/ui/SkillsManagement.jsx";
import SkillsList from "./features/skills/ui/SkillsList.jsx";
import ContactsAdmin from "./pages/admin/ContactsAdmin.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./shared/components/ProtectedRoute.jsx";
import { trackEvent } from "./lib/analytics.js";
import { checkAuth } from "./store/slices/auth.js";

function Layout({ children }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setScrolled(false);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setScrolled(true);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setScrolled(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:font-semibold">
        Skip to content
      </a>
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? '-translate-y-full' : 'translate-y-0'
      } bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm`}>
        <div className="container">
          <div className="flex justify-between items-center py-4 md:py-6">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              Portfolio
            </Link>
          
            <div className="hidden md:flex items-center gap-6 lg:gap-10">
              <Link to="/" className="font-semibold text-slate-900 transition-colors hover:text-primary-600">Home</Link>
              <Link to="/about" className="font-semibold text-slate-900 transition-colors hover:text-primary-600">About</Link>
              <Link to="/blog" className="font-semibold text-slate-900 transition-colors hover:text-primary-600">Blog</Link>
              <Link to="/contact" className="font-semibold text-slate-900 transition-colors hover:text-primary-600">Contact</Link>
              <Link to="/admin" className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">Admin</Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X width="22" height="22" /> : <Menu width="22" height="22" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed top-[60px] md:top-[72px] left-0 right-0 bottom-0 bg-white/98 backdrop-blur-lg z-40 shadow-xl animate-slideInFromTop md:hidden">
          <div className="flex flex-col gap-2 p-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-semibold text-slate-900 hover:bg-slate-100 transition-colors">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-semibold text-slate-900 hover:bg-slate-100 transition-colors">About</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-semibold text-slate-900 hover:bg-slate-100 transition-colors">Blog</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-semibold text-slate-900 hover:bg-slate-100 transition-colors">Contact</Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-lg font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">Admin</Link>
          </div>
        </div>
      )}
      
      <main id="main-content" className="pt-0 transition-all duration-300">{children}</main>
      
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container">
          <div className="flex justify-center gap-4 md:gap-6 mb-6 md:mb-8">
            {[
              { label: "GitHub", url: "https://github.com/erimo4real", icon: GitHub },
              { label: "Email", url: "mailto:eromoxlx@gmail.com", icon: Mail }
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-transparent hover:bg-white/20 hover:border-white/30 hover:-translate-y-1"
              >
                <social.icon width="20" height="20" />
              </a>
            ))}
          </div>
          
          <div className="flex justify-center gap-4 md:gap-8 mb-6 md:mb-8 flex-wrap">
            <Link to="/" className="text-sm md:text-base text-white/70 hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-sm md:text-base text-white/70 hover:text-white transition-colors">About</Link>
            <Link to="/blog" className="text-sm md:text-base text-white/70 hover:text-white transition-colors">Blog</Link>
            <Link to="/contact" className="text-sm md:text-base text-white/70 hover:text-white transition-colors">Contact</Link>
            <Link to="/projects" className="text-sm md:text-base text-white/70 hover:text-white transition-colors">Projects</Link>
          </div>

          <p className="text-center text-white/50 text-xs md:text-sm">
            © {new Date().getFullYear()} Portfolio. Crafted by Erimo
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check auth status on app load
    dispatch(checkAuth());
  }, [dispatch]);
  
  useEffect(() => {
    trackEvent("page_view");
  }, [location]);

  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/projects/:slug" element={<Layout><ProjectDetail /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/skills" element={<Layout><SkillsList /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/blog" element={<Layout><BlogList /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
      
      {/* Admin Auth Routes - No Layout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
      
      {/* Admin Protected Routes - No Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <ProjectsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs"
        element={
          <ProtectedRoute>
            <BlogsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <ProfileAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/resume"
        element={
          <ProtectedRoute>
            <ResumeAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <ProtectedRoute>
            <SkillsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contacts"
        element={
          <ProtectedRoute>
            <ContactsAdmin />
          </ProtectedRoute>
        }
      />
      
      {/* 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}
