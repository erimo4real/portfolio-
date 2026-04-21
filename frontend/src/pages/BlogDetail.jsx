import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchBlogDetail } from "../store/slices/blog.js";
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
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        paddingTop: "6rem"
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Cover Image */}
      {detail.image && (
        <div style={{
          height: "500px",
          overflow: "hidden",
          position: "relative"
        }}>
          <img 
            src={detail.image} 
            alt={detail.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7))"
          }}></div>
          {/* Image badge */}
          <div style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            color: "white",
            fontSize: "0.85rem"
          }}>
            Cover Image
          </div>
        </div>
      )}

      {/* Hero Section */}
      {!detail.image && (
      <section style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "6rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          top: "-250px",
          right: "-250px"
        }}></div>
        
        <div className="container" style={{ maxWidth: "900px", position: "relative", zIndex: 1 }}>
          <Link to="/blog" style={{ 
            color: "rgba(255,255,255,0.9)", 
            marginBottom: "2rem", 
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "600",
            textDecoration: "none"
          }}>
            <span>←</span> Back to Blog
          </Link>
          <div>
            <div style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              padding: "0.5rem 1rem",
              borderRadius: "50px",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              backdropFilter: "blur(10px)",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              📝 Blog Post
            </div>
            <h1 style={{ 
              color: "white", 
              marginBottom: "1.5rem",
              fontSize: "3.5rem",
              lineHeight: "1.1"
            }}>
              {detail.title}
            </h1>
            {detail.createdAt && (
              <div style={{ 
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                color: "rgba(255,255,255,0.9)",
                fontSize: "1rem"
              }}>
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
      )}

      {/* Title bar when there's a cover image */}
      {detail.image && (
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "3rem 0 4rem"
        }}>
          <div className="container" style={{ maxWidth: "900px", position: "relative", zIndex: 1, padding: "0 1.5rem" }}>
            <Link to="/blog" style={{ 
              color: "rgba(255,255,255,0.9)", 
              marginBottom: "1.5rem", 
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              <span>←</span> Back to Blog
            </Link>
            <h1 style={{ 
              color: "white", 
              fontSize: "3rem",
              lineHeight: "1.1"
            }}>
              {detail.title}
            </h1>
            {detail.createdAt && (
              <div style={{ 
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                color: "rgba(255,255,255,0.9)",
                fontSize: "1rem",
                marginTop: "1rem"
              }}>
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
      )}

      {/* Video Embed */}
      {detail.videoEmbedUrl && (
        <div style={{ 
          maxWidth: "900px", 
          margin: "-4rem auto 3rem", 
          position: "relative", 
          zIndex: 10,
          padding: "0 1.5rem"
        }}>
          <div style={{
            background: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)"
          }}>
            {/* Video Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.5rem",
              borderBottom: "1px solid #e2e8f0",
              background: "linear-gradient(to right, #f8fafc, #ffffff)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.25rem"
                }}>
                  ▶
                </div>
                <div>
                  <div style={{
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "0.95rem"
                  }}>Video</div>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "#64748b"
                  }}>Watch the video below</div>
                </div>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#f1f5f9",
                borderRadius: "20px",
                fontSize: "0.8rem",
                color: "#64748b"
              }}>
                <span>🎬</span>
                <span>Embedded Video</span>
              </div>
            </div>
            {/* Video Container */}
            <div className="video-wrapper" style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              background: "#000"
            }}>
              <iframe 
                src={detail.videoEmbedUrl}
                title="Video embed"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none"
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <section style={{ background: "#f8fafc", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <article className="card" style={{
            padding: "4rem",
            fontSize: "1.125rem",
            lineHeight: "1.9"
          }}>
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
              }
              
              article h3 {
                margin-top: 2rem;
                margin-bottom: 0.75rem;
                color: #0f172a;
              }
              
              article ul, article ol {
                margin: 1.5rem 0;
                padding-left: 2rem;
              }
              
              article li {
                margin: 0.5rem 0;
              }
              
              article blockquote {
                border-left: 4px solid #667eea;
                padding-left: 1.5rem;
                margin: 2rem 0;
                font-style: italic;
                color: #64748b;
              }
              
              article a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
              }
              
              article a:hover {
                text-decoration: underline;
              }
              
              /* Responsive video wrapper */
              article .video-wrapper {
                position: relative;
                padding-bottom: 56.25%; /* 16:9 aspect ratio */
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
              style={{ 
                color: "#475569"
              }}
              dangerouslySetInnerHTML={{ __html: marked.parse(detail.markdown || "") }} 
            />
          </article>

          {/* Back to Blog */}
          <div style={{ 
            marginTop: "4rem", 
            textAlign: "center",
            padding: "3rem",
            background: "white",
            borderRadius: "20px"
          }}>
            <h3 style={{ marginBottom: "1rem" }}>
              Enjoyed this article?
            </h3>
            <p style={{ marginBottom: "2rem", color: "#64748b" }}>
              Check out more posts on my blog
            </p>
            <Link 
              to="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "12px",
                fontWeight: "600",
                textDecoration: "none",
                transition: "all 0.3s"
              }}
            >
              <span>←</span> Back to All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
