import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/auth.js";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    messages: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/analytics/admin/stats');
      setStats({
        projects: response.data?.projects || 0,
        blogs: response.data?.blogs || 0,
        skills: response.data?.skills || 0,
        messages: response.data?.messages || 0,
        views: response.data?.page_view || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/admin/login");
  };

const sections = [
    { 
      title: "Profile", 
      path: "/admin/profile", 
      description: "Manage your profile information",
      color: "#6366f1",
      bgColor: "#e0e7ff"
    },
    { 
      title: "Skills", 
      path: "/admin/skills", 
      description: "Add and organize your skills",
      color: "#8b5cf6",
      bgColor: "#ede9fe",
      count: stats.skills
    },
    { 
      title: "Projects", 
      path: "/admin/projects", 
      description: "Showcase your work",
      color: "#ec4899",
      bgColor: "#fce7f3",
      count: stats.projects
    },
    { 
      title: "Blog", 
      path: "/admin/blogs", 
      description: "Write and publish blog posts",
      color: "#f59e0b",
      bgColor: "#fef3c7",
      count: stats.blogs
    },
    { 
      title: "Resume", 
      path: "/admin/resume", 
      description: "Upload and manage resumes",
      color: "#10b981",
      bgColor: "#d1fae5"
    },
    { 
      title: "Contacts", 
      path: "/admin/contacts", 
      description: "View and manage contact messages",
      color: "#3b82f6",
      bgColor: "#dbeafe",
      count: stats.messages
    }
  ];

  const quickStats = [
    { label: "Total Views", value: stats.views, color: "#6366f1" },
    { label: "Projects", value: stats.projects, color: "#ec4899" },
    { label: "Blog Posts", value: stats.blogs, color: "#f59e0b" },
    { label: "Messages", value: stats.messages, color: "#ef4444" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
      {/* Header */}
<div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: stat.color + "20"
              }}>
              </div>
              <div>
            <h1 style={{ marginBottom: "0.25rem", color: "white", fontSize: "2rem" }}>
              Welcome back, {admin?.name || 'Admin'}! 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>
              Manage your portfolio content and track your progress
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/" style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "600",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              textDecoration: "none",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              transition: "all 0.3s ease"
            }}>
              View Site
            </Link>
            <button 
              onClick={handleLogout}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                fontWeight: "600",
                background: "rgba(239, 68, 68, 0.9)",
                color: "white",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container" style={{ marginTop: "-2rem", position: "relative", zIndex: 2 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem"
        }}>
          {quickStats.map((stat, index) => (
            <div key={stat.label} style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: `${stat.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem"
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>{stat.label}</p>
                <p style={{ 
                  color: "#0f172a", 
                  fontSize: "1.75rem", 
                  fontWeight: "800",
                  margin: "0.25rem 0 0 0"
                }}>
                  {loading ? '...' : stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="container" style={{ padding: "3rem 0" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>
          Management Sections
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem"
        }}>
          {sections.map((section, index) => (
            <Link 
              key={section.path}
              to={section.path}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "1.75rem",
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.04)",
                animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`,
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
              >
                {/* Background Gradient on Hover */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: section.color,
                  opacity: 0.8
                }}></div>

                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: section.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.75rem"
                  }}>
                  </div>
                  {section.count !== undefined && (
                    <span style={{
                      background: section.bgColor,
                      color: section.color,
                      padding: "0.375rem 0.875rem",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "700"
                    }}>
                      {section.count}
                    </span>
                  )}
                </div>
                <h3 style={{ marginBottom: "0.5rem", color: "#0f172a", fontSize: "1.25rem", fontWeight: "700" }}>
                  {section.title}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9375rem", lineHeight: "1.5" }}>
                  {section.description}
                </p>
                <div style={{
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: section.color,
                  fontWeight: "600",
                  fontSize: "0.875rem"
                }}>
                  Manage {section.title}
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
