import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchBlogDetail } from "../../../store/slices/blog.js";
import { marked } from "marked";

export default function BlogDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((s) => s.blog.detail);

  useEffect(() => {
    dispatch(fetchBlogDetail(slug));
  }, [dispatch, slug]);

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center bg-gradient-to-br from-primary-600 to-indigo-700 pt-24 relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full -top-[250px] -right-[250px]"></div>
        
        <div className="container max-w-4xl relative z-10 px-4">
          <Link to="/blog" className="text-white/90 mb-8 inline-flex items-center gap-2 font-semibold hover:text-white transition-colors">
            <span>←</span> Back to Blog
          </Link>
          <div>
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-white text-xs font-bold mb-6 backdrop-blur-md uppercase tracking-wider">
              📝 Blog Post
            </div>
            <h1 className="text-white mb-6 text-4xl md:text-6xl font-bold leading-tight">
              {detail.title}
            </h1>
            {detail.createdAt && (
              <div className="flex items-center gap-4 text-white/90 text-lg">
                <span>📅</span>
                <span>
                  {new Date(detail.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="container max-w-3xl">
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-16 text-lg leading-relaxed text-slate-700 prose prose-slate max-w-none">
            <style>{`
              article iframe {
                max-width: 100%;
                border-radius: 12px;
                margin: 2rem 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              }
              
              article img {
                max-width: 100%;
                border-radius: 12px;
                margin: 2rem 0;
              }
              
              article pre {
                background: #f1f5f9;
                padding: 1.5rem;
                border-radius: 12px;
                overflow-x: auto;
                margin: 2rem 0;
              }
              
              article code {
                background: #f1f5f9;
                padding: 0.25rem 0.5rem;
                border-radius: 6px;
                font-size: 0.9em;
                font-family: 'Courier New', monospace;
              }
              
              article pre code {
                background: transparent;
                padding: 0;
              }
              
              article h2 {
                margin-top: 3rem;
                margin-bottom: 1rem;
                color: #0f172a;
                font-weight: 700;
                font-size: 1.875rem;
              }
              
              article h3 {
                margin-top: 2rem;
                margin-bottom: 0.75rem;
                color: #0f172a;
                font-weight: 600;
                font-size: 1.5rem;
              }
              
              article ul, article ol {
                margin: 1.5rem 0;
                padding-left: 2rem;
              }
              
              article li {
                margin: 0.5rem 0;
              }
              
              article blockquote {
                border-left: 4px solid #4f46e5;
                padding-left: 1.5rem;
                margin: 2rem 0;
                font-style: italic;
                color: #64748b;
              }
              
              article a {
                color: #4f46e5;
                text-decoration: none;
                font-weight: 600;
              }
              
              article a:hover {
                text-decoration: underline;
              }
              
              article .video-wrapper {
                position: relative;
                padding-bottom: 56.25%;
                height: 0;
                overflow: hidden;
                margin: 2rem 0;
                border-radius: 12px;
              }
              
              article .video-wrapper iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                margin: 0;
              }
            `}</style>
            <div 
              dangerouslySetInnerHTML={{ __html: marked.parse(detail.markdown || "") }} 
            />
          </article>

          {/* Back to Blog */}
          <div className="mt-16 text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Enjoyed this article?
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Check out more posts on my blog where I share insights on development and design.
            </p>
            <Link 
              to="/blog"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <span>←</span> Back to All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
