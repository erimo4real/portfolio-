import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectBySlug } from '../application/projectsSlice';
import { trackEvent } from '../../../shared/utils/analytics';

const ProjectDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentProject: project, status, error } = useSelector((state) => state.projects);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProjectBySlug(slug));
      trackEvent('project_view', slug);
    }
  }, [slug, dispatch]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Project</h2>
      <p className="text-slate-600 mb-8">{error}</p>
      <Link to="/projects" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Back to Projects</Link>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-4xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
      <p className="text-slate-600 mb-8">The project you're looking for doesn't exist or has been moved.</p>
      <Link to="/projects" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Back to Projects</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      <Link to="/projects" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-medium mb-12 group transition-colors">
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
        Back to all projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
              project.status === 'completed' ? 'bg-green-100 text-green-700' : 
              project.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 
              'bg-slate-100 text-slate-700'
            }`}>
              {project.status?.replace('_', ' ')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            {project.techStack?.map(tech => (
              <span key={tech} className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-xl text-sm font-bold border border-slate-200/50 shadow-sm">
                {tech}
              </span>
            ))}
          </div>

          <div className="prose prose-slate prose-lg max-w-none mb-12">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {project.descriptionMarkdown}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-100">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <span>View Code</span>
                <span className="text-xl">↗</span>
              </a>
            )}
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
              >
                <span>Live Demo</span>
                <span className="text-xl">↗</span>
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {project.images && project.images.length > 0 ? (
            project.images.map((img, index) => (
              <div key={index} className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
                <img 
                  src={img.path} 
                  alt={`${project.title} screenshot ${index + 1}`} 
                  className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            ))
          ) : (
            <div className="aspect-square bg-slate-50 rounded-3xl flex flex-col items-center justify-center text-slate-300 border border-dashed border-slate-200">
              <span className="text-6xl mb-2">🖼️</span>
              <span className="font-medium">No screenshots available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
