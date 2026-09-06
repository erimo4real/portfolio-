import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "./Icons.jsx";

const getStatusBadge = (status) => {
  const badges = {
    completed: { label: "✓ Completed", color: "text-emerald-700", bg: "bg-emerald-100" },
    in_progress: { label: "In Progress", color: "text-amber-700", bg: "bg-amber-100" },
    idea: { label: "Idea", color: "text-indigo-700", bg: "bg-indigo-100" }
  };
  return badges[status] || badges.completed;
};

export default function ProjectCard({ project, index = 0 }) {
  const badge = getStatusBadge(project.status);

  return (
    <Link to={`/projects/${project.slug}`} className="group block h-full">
      <div className="relative h-full rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md border border-white/60 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
        {/* gradient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-primary-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/20 transition-all duration-500 pointer-events-none z-10"></div>

        <div
          className="w-full h-56 md:h-64 bg-cover bg-center relative img-hover-zoom"
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
            <div className="absolute top-4 right-4 bg-amber-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          <h3 className="text-slate-900 mb-2 md:mb-3 text-lg md:text-xl group-hover:text-primary-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
            {project.descriptionMarkdown?.substring(0, 120)}...
          </p>
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="bg-white/80 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200/60 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
            View Project <ArrowRight width="16" height="16" />
          </div>
        </div>
      </div>
    </Link>
  );
}