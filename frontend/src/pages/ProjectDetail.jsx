import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProjectDetail } from "../store/slices/projects.js";
import { marked } from "marked";

export default function ProjectDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((s) => s.projects.detail);

  useEffect(() => {
    dispatch(fetchProjectDetail(slug));
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
      {/* Hero Section */}
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
          width: "400px",
          height: "400px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          top: "-200px",
          right: "-200px"
        }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ 
            color: "rgba(255,255,255,0.9)", 
            marginBottom: "2rem", 
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "600",
            textDecoration: "none"
          }}>
            <span>←</span> Back to Home
          </Link>
          <div style={{ maxWidth: "800px" }}>
            <h1 style={{ 
              color: "white", 
              marginBottom: "1.5rem",
              fontSize: "3.5rem"
            }}>
              {detail.title}
            </h1>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              {detail.status && (
                <span style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "50px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  backdropFilter: "blur(10px)",
                  color: "white"
                }}>
                  {detail.status.replace("_", " ")}
                </span>
              )}
              {detail.featured && (
                <span style={{
                  background: "#fbbf24",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "50px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "white"
                }}>
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ background: "#f8fafc", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          {/* Images Gallery */}
          {detail.images && detail.images.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: detail.images.length === 1 ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "2rem",
              marginBottom: "4rem"
            }}>
              {detail.images.map((img, i) => (
                <div key={i} style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                  <img 
                    src={img.path} 
                    alt={`${detail.title} screenshot ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "3rem"
          }}>
            {/* Main Content */}
            <div>
              {/* Description */}
              <div className="card" style={{ padding: "3rem", marginBottom: "2rem" }}>
                <h2 style={{ 
                  marginBottom: "2rem",
                  fontSize: "2rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  About This Project
                </h2>
                <div 
                  style={{ 
                    lineHeight: "1.8",
                    color: "#475569",
                    fontSize: "1.125rem"
                  }}
                  dangerouslySetInnerHTML={{ __html: marked.parse(detail.descriptionMarkdown || "") }} 
                />
              </div>

              {/* Understanding */}
              {detail.understanding && (
                <div className="card" style={{ padding: "3rem", marginBottom: "2rem" }}>
                  <h2 style={{ 
                    marginBottom: "2rem",
                    fontSize: "2rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    Understanding
                  </h2>
                  <div 
                    style={{ 
                      lineHeight: "1.8",
                      color: "#475569",
                      fontSize: "1.125rem"
                    }}
                    dangerouslySetInnerHTML={{ __html: marked.parse(detail.understanding || "") }} 
                  />
                </div>
              )}

              {/* Contribution */}
              {detail.contribution && (
                <div className="card" style={{ padding: "3rem", marginBottom: "2rem" }}>
                  <h2 style={{ 
                    marginBottom: "2rem",
                    fontSize: "2rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    My Contribution
                  </h2>
                  <div 
                    style={{ 
                      lineHeight: "1.8",
                      color: "#475569",
                      fontSize: "1.125rem"
                    }}
                    dangerouslySetInnerHTML={{ __html: marked.parse(detail.contribution || "") }} 
                  />
                </div>
              )}

              {/* Links */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {detail.githubUrl && (
                  <a 
                    href={detail.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      background: "#0f172a",
                      color: "white",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontWeight: "600",
                      textDecoration: "none",
                      transition: "all 0.3s"
                    }}
                  >
                    View Code
                  </a>
                )}
                {detail.demoUrl && (
                  <a 
                    href={detail.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Tech Stack */}
              {detail.techStack && detail.techStack.length > 0 && (
                <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
                  <h3 style={{ 
                    marginBottom: "1.5rem",
                    fontSize: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    Tech Stack
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {detail.techStack.map((tech, i) => (
                      <div key={i} style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        fontWeight: "600",
                        textAlign: "center",
                        fontSize: "0.9375rem"
                      }}>
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Info */}
              <div className="card" style={{ 
                padding: "2rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }}>
                <h3 style={{ 
                  marginBottom: "1rem",
                  fontSize: "1.25rem",
                  color: "white"
                }}>
                  Project Info
                </h3>
                <div style={{ fontSize: "0.9375rem", lineHeight: "2" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Status:</strong> {detail.status?.replace("_", " ") || "N/A"}
                  </div>
                  {detail.featured && (
                    <div>
                      <strong>Featured:</strong> Yes
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
