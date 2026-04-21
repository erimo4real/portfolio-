import { useEffect, useState } from "react";
import { getProjects } from "../application/getProjects.ts";
import { Link } from "react-router-dom";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const list = await getProjects();
        setProjects(list);
        setStatus("succeeded");
      } catch {
        setStatus("failed");
      }
    })();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Selected Projects</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          A collection of my recent work, side projects, and open-source contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link 
            key={project.slug} 
            to={`/projects/${project.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              {project.images && project.images[0] ? (
                <img 
                  src={project.images[0].path} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  project.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  project.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 
                  'bg-slate-100 text-slate-700'
                }`}>
                  {project.status?.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 line-clamp-2 mb-6">
                {project.descriptionMarkdown}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.techStack?.slice(0, 3).map((tech) => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-lg border border-slate-100"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack?.length > 3 && (
                  <span className="px-3 py-1 text-slate-400 text-xs font-medium">
                    +{project.techStack.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && status === "succeeded" && (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          
          <h3 className="text-xl font-bold text-slate-900">No projects yet</h3>
          <p className="text-slate-500">The admin is currently working on some amazing things.</p>
        </div>
      )}
    </div>
  );
}
