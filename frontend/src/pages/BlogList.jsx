import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/slices/blog.js";
import { Link } from "react-router-dom";

export default function BlogList() {
  const dispatch = useDispatch();
  const list = useSelector((s) => s.blog.list);
  const status = useSelector((s) => s.blog.status);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <div>
      <style>{`
        .blog-card-grid { padding: clamp(1.5rem, 3vw, 3rem); display: grid; gap: clamp(1rem, 3vw, 3rem); align-items: center; }
        @media (max-width: 768px) { .blog-card-grid { grid-template-columns: 1fr; } }
      `}</style>
      {/* Hero Section */}
      <section style={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "4rem"
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.2)",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            backdropFilter: "blur(10px)"
          }}>
            Blog
          </div>
          <h1 style={{ color: "white", marginBottom: "1.5rem", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Thoughts & Insights
          </h1>
          <p style={{ 
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)", 
            color: "rgba(255,255,255,0.9)",
            maxWidth: "700px",
            margin: "0 auto",
            padding: "0 1rem"
          }}>
            Exploring web development, design patterns, and everything in between
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section style={{ background: "#f8fafc", padding: "clamp(3rem, 8vw, 5rem) 0" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          {status === "loading" && (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div className="spinner"></div>
            </div>
          )}
          
          {status === "succeeded" && list.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "4rem 0",
              background: "white",
              borderRadius: "24px"
            }}>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-4xl"></div>
              <h3 style={{ marginBottom: "0.5rem" }}>No posts yet</h3>
              <p style={{ color: "#64748b" }}>
                Check back soon for new content!
              </p>
            </div>
          )}

          {status === "succeeded" && list.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {list.map((b, index) => (
                <Link 
                  key={b.id} 
                  to={`/blog/${b.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <article className="card blog-card-grid" style={{
                    gridTemplateColumns: index % 2 === 0 ? "2fr 1fr" : "1fr 2fr"
                  }}>
                    <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "1rem", 
                        marginBottom: "1rem" 
                      }}>
                        <span style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          padding: "0.375rem 1rem",
                          borderRadius: "50px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em"
                        }}>
                          Article
                        </span>
                        {b.createdAt && (
                          <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                            {new Date(b.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                      <h2 style={{ 
                        color: "#0f172a",
                        marginBottom: "1rem",
                        fontSize: "clamp(1.25rem, 3vw, 2rem)",
                        lineHeight: "1.2"
                      }}>
                        {b.title}
                      </h2>
                      <p style={{ 
                        color: "#64748b", 
                        marginBottom: "1.5rem",
                          fontSize: "clamp(0.95rem, 2.5vw, 1.125rem)",
                        lineHeight: "1.7"
                      }}>
                        {b.markdown?.substring(0, 180)}...
                      </p>
                      <div style={{
                        color: "#6366f1",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "1rem"
                      }}>
                        Read Article →
                      </div>
                    </div>
                    <div style={{ 
                      order: index % 2 === 0 ? 2 : 1,
                      height: "clamp(180px, 30vw, 250px)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(2.5rem, 8vw, 4rem)",
                      background: b.image ? 'none' : `linear-gradient(135deg, ${index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#f093fb' : '#4facfe'} 0%, ${index % 3 === 0 ? '#764ba2' : index % 3 === 1 ? '#f5576c' : '#00f2fe'} 100%)`
                    }}>
                      {b.image ? (
                        <img 
                          src={b.image} 
                          alt={b.title}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-purple-100"></div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
