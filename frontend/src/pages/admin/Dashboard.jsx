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
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h1 style={{ color: "white", fontSize: "2rem", margin: 0 }}>
              Welcome back, {admin?.name || 'Admin'}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.5rem" }}>
              Manage your portfolio content
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/" style={{
              padding: "0.75rem 1.5rem",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              color: "white",
              textDecoration: "none"
            }}>
              View Site
            </Link>
            <button onClick={handleLogout} style={{
              padding: "0.75rem 1.5rem",
              background: "#ef4444",
              borderRadius: "12px",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ maxWidth: "1200px", margin: "-2rem auto 2rem", padding: "0 2rem", position: "relative", zIndex: 2 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem"
        }}>
          {quickStats.map((stat) => (
            <div key={stat.label} style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: stat.color + "20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}></div>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>{stat.label}</p>
                <p style={{ color: "#0f172a", fontSize: "1.75rem", fontWeight: "800", margin: 0 }}>
                  {loading ? '...' : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management Sections */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 3rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>
          Management Sections
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem"
        }}>
          {sections.map((section) => (
            <Link key={section.path} to={section.path} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "1.75rem",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
              }}>
                <div style={{
                  height: "4px",
                  background: section.color,
                  borderRadius: "4px",
                  marginBottom: "1rem"
                }}></div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: section.bgColor
                  }}></div>
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
                <h3 style={{ color: "#0f172a", fontSize: "1.25rem", fontWeight: "700", margin: "0 0 0.5rem" }}>
                  {section.title}
                </h3>
                <p style={{ color: "#64748b", margin: 0 }}>{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}