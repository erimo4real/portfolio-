import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../../lib/api.js";
import { AdminHeader, AdminStat } from "../../features/admin/ui/adminKit.jsx";
import { BarChart, FileText, Star, Code, User, File, MessageSquare, Eye } from "../../shared/components/Icons.jsx";

export default function AdminDashboard() {
  const { admin } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    messages: { total: 0, unread: 0 },
    views: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/analytics/admin/stats');
      const d = response.data;
      setStats({
        projects: d?.projects || 0,
        blogs: d?.blogs || 0,
        skills: d?.skills || 0,
        messages: d?.messages || { total: 0, unread: 0 },
        views: d?.page_view || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    { label: "Total Views", value: stats.views, tone: "indigo", icon: <Eye width="24" height="24" /> },
    { label: "Projects", value: stats.projects, tone: "pink", icon: <Star width="24" height="24" /> },
    { label: "Blog Posts", value: stats.blogs, tone: "amber", icon: <FileText width="24" height="24" /> },
    { label: "Messages", value: stats.messages.total, tone: "red", icon: <MessageSquare width="24" height="24" /> }
  ];

  const sections = [
    { title: "Profile", path: "/admin/profile", description: "Manage your profile information", tone: "indigo", icon: <User width="24" height="24" />, count: undefined },
    { title: "Skills", path: "/admin/skills", description: "Add and organize your skills", tone: "violet", icon: <Code width="24" height="24" />, count: stats.skills },
    { title: "Projects", path: "/admin/projects", description: "Showcase your work", tone: "pink", icon: <Star width="24" height="24" />, count: stats.projects },
    { title: "Blog", path: "/admin/blogs", description: "Write and publish blog posts", tone: "amber", icon: <FileText width="24" height="24" />, count: stats.blogs },
    { title: "Resume", path: "/admin/resume", description: "Upload and manage resumes", tone: "emerald", icon: <File width="24" height="24" />, count: undefined },
    { title: "Contacts", path: "/admin/contacts", description: "View and manage contact messages", tone: "blue", icon: <MessageSquare width="24" height="24" />, count: stats.messages.total }
  ];

  return (
    <>
      <AdminHeader
        icon={<BarChart width="24" height="24" />}
        title={`Welcome back, ${admin?.name || "Admin"}`}
        subtitle="Manage your portfolio content"
        actions={
          <>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 cursor-pointer transition-all duration-200 bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              View Site
            </Link>
            <Link
              to="/admin/contacts"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer transition-all duration-200 hover:brightness-110"
            >
              Messages
              {stats.messages.unread > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">{stats.messages.unread}</span>
              )}
            </Link>
          </>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat) => (
          <AdminStat key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} tone={stat.tone} loading={loading} />
        ))}
      </div>

      {/* Management Sections */}
      <h2 className="text-lg font-bold text-white mb-4">Management Sections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link key={section.path} to={section.path} className="no-underline">
            <div className="admin-card admin-card-hover group p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="admin-chip bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-slate-700 transition-colors">
                  {section.icon}
                </div>
                {section.count !== undefined && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {section.count}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mb-1">{section.title}</h3>
              <p className="text-sm text-slate-400">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}