import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import ProjectsList from "./features/projects/ui/ProjectsList.jsx";
import BlogList from "./pages/BlogList.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import AdminLogin from "./pages/admin/Login.jsx";
import Register from "./pages/admin/Register.jsx";
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
import { ProtectedRoute } from "./shared/components/ProtectedRoute.jsx";
import { trackEvent } from "./lib/analytics.js";
import { checkAuth } from "./store/slices/auth.js";

function Layout({ children }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY < 50) {
        // At the top of the page, always show navbar
        setScrolled(false);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down and past threshold - hide navbar visually (scrolled = true)
        setScrolled(true);
      } else if (currentScrollY < lastScrollY.current - 10) {
        // Scrolling up by at least 10px - show navbar visually (scrolled = false)
        setScrolled(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Loading timer for page refresh/navigation
    const timer = setTimeout(() => setLoading(false), 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="relative w-20 h-20 mb-6 mx-auto">
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-2 border-4 border-purple-600 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-slate-600 font-medium animate-pulse text-lg">Loading...</p>
          </div>
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm -z-10"></div>
        </div>
      )}
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container">
          <div className="flex justify-between items-center py-6">
            <Link 
              to="/" 
              className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              Portfolio
            </Link>
          
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              <Link 
                to="/" 
                className="font-semibold text-slate-900 transition-colors hover:text-primary-600"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="font-semibold text-slate-900 transition-colors hover:text-primary-600"
              >
                About
              </Link>
              <Link 
                to="/blog" 
                className="font-semibold text-slate-900 transition-colors hover:text-primary-600"
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className="font-semibold text-slate-900 transition-colors hover:text-primary-600"
              >
                Contact
              </Link>
              <Link 
                to="/admin" 
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden text-3xl transition-colors ${
                !scrolled ? 'text-slate-900' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-white/98 backdrop-blur-lg p-8 z-40 shadow-xl animate-slideInFromTop md:hidden">
          <div className="flex flex-col gap-6">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors"
            >
              About
            </Link>
            <Link 
              to="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors"
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
      
      <main className={`pt-0 transition-all duration-300 ${loading ? 'blur-sm opacity-50' : ''}`}>{children}</main>
      
      <footer className="bg-slate-900 text-white py-16">
        <div className="container">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            {[
              { icon: "💼", label: "LinkedIn", url: "https://linkedin.com" },
              { icon: "🐙", label: "GitHub", url: "https://github.com" },
              { icon: "🐦", label: "Twitter", url: "https://twitter.com" },
              { icon: "📧", label: "Email", url: "mailto:hello@example.com" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-2xl transition-all duration-300 border-2 border-transparent hover:bg-white/20 hover:border-white/30 hover:-translate-y-1"
              >
                {social.icon}
              </a>
            ))}
          </div>
          
          {/* Quick Links */}
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <Link to="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-white/70 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/blog" className="text-white/70 hover:text-white transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/projects" className="text-white/70 hover:text-white transition-colors">
              Projects
            </Link>
          </div>

          <p className="text-center text-white/50 text-sm">
            © {new Date().getFullYear()} Portfolio. Crafted with ❤️ and ☕
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
