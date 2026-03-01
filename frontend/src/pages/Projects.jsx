// Projects page component
// Displays all projects in a grid layout with stats and filtering
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProjects } from "../store/slices/projects.js";

// Projects page - displays project portfolio
// Fetches projects from store and renders them in a grid
export default function Projects() {
  // State management
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.projects.list); // Get projects from store
  const status = useSelector((s) => s.projects.status); // Get loading status

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Helper function to get status badge styling
  // Maps project status to appropriate colors and labels
  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: "bg-emerald-500", color: "text-white", label: "Completed" },
      in_progress: { bg: "bg-amber-500", color: "text-white", label: "In Progress" },
      idea: { bg: "bg-purple-500", color: "text-white", label: "Idea" }
    };
    // Default to 'idea' badge if status not recognized
    return badges[status] || badges.idea;
  };

  // Calculate project statistics
  // total: all projects
  // featured: projects marked as featured
  // completed: projects with 'completed' status
  const stats = {
    total: projects?.length || 0,
    featured: projects?.filter(p => p.featured).length || 0,
    completed: projects?.filter(p => p.status === "completed").length || 0
  };

  // Render the projects page
  // Shows stats, loading state, empty state, or project grid
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
      {/* Stats Bar - Show project statistics */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-slate-500">Total Projects</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
            <div className="text-slate-500">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-3xl font-bold text-amber-600">{stats.featured}</div>
            <div className="text-slate-500">Featured</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-20 pt-6">
        {/* Conditional rendering based on status */}
        {status === "loading" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-96">
                <div className="w-full h-52 bg-slate-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-20 bg-slate-100 rounded mb-4 animate-pulse"></div>
                  <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center text-5xl">
              📁
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No projects yet</h2>
            <p className="text-slate-500 text-lg">Check back later for exciting projects!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const badge = getStatusBadge(project.status);
              return (
                <Link 
                  key={project.id} 
                  to={`/projects/${project.slug}`} 
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all h-full">
                    {/* Project Image - fallback to gradient if no image */}
                    <div 
                      className="w-full h-52 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: project.images?.[0]?.path 
                          ? `url(${project.images[0].path})` 
                          : `linear-gradient(135deg, ${index % 2 === 0 ? '#667eea' : '#f093fb'} 0%, ${index % 2 === 0 ? '#764ba2' : '#f5576c'} 100%)`
                      }}
                    >
                      <div className={`absolute top-4 left-4 ${badge.bg} ${badge.color} px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm`}>
                        {badge.label}
                      </div>
                      {project.featured && (
                        <div className="absolute top-4 right-4 bg-amber-400 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                    
                    {/* Project Content - title, description, tech stack */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3">
                        {project.descriptionMarkdown?.replace(/[#*\-\[\]()]/g, '').substring(0, 140) || 'No description available'}...
                      </p>
                      
                      {/* Tech Stack - show first 3 technologies */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.techStack.slice(0, 3).map((tech, i) => (
                            <span 
                              key={i} 
                              className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-medium">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                          View Details
                        </div>
                        <span className="text-slate-400">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}