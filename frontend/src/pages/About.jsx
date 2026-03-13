import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProfile } from "../store/slices/profile.js";
import { getSkills } from "../features/skills/application/getSkills.ts";
import { fetchProjects } from "../store/slices/projects.js";
import { fetchBlogs } from "../store/slices/blog.js";

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/api$/, '');
  }
  return '';
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return getApiUrl() + path;
};

export default function About() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.data);
  const profileStatus = useSelector((s) => s.profile.status);
  const [skills, setSkills] = useState(null);
  const [skillsStatus, setSkillsStatus] = useState("idle");
  const projects = useSelector((s) => s.projects.list);
  const blogs = useSelector((s) => s.blog.list);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchProjects());
    dispatch(fetchBlogs());
    
    // Fetch skills using the new approach
    (async () => {
      try {
        setSkillsStatus("loading");
        const skillsData = await getSkills();
        
        // Check if skillsData is already grouped (object) or needs grouping (array)
        let groupedSkills = {};
        if (Array.isArray(skillsData)) {
          // Group skills by category
          groupedSkills = skillsData.reduce((acc, skill) => {
            if (!acc[skill.category]) {
              acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
          }, {});
        } else if (typeof skillsData === 'object' && skillsData !== null) {
          // Already grouped by the backend
          groupedSkills = skillsData;
        } else {
          console.error("Expected skillsData to be an array or object, got:", typeof skillsData, skillsData);
        }
        setSkills(groupedSkills);
        setSkillsStatus("succeeded");
      } catch (error) {
        setSkillsStatus("failed");
        console.error("Failed to fetch skills:", error);
      }
    })();
  }, [dispatch]);

  const visibleProjects = projects?.filter(p => 
    (p.published === true || p.published === undefined) &&
    (p.status === "completed" || p.status === "in_progress")
  ) || [];

  return (
    <div>
      <section style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        paddingTop: "80px"
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          top: "-250px",
          right: "-250px",
          animation: "float 6s ease-in-out infinite"
        }}></div>
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          bottom: "-150px",
          left: "-150px",
          animation: "float 8s ease-in-out infinite"
        }}></div>
        <div style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
          top: "50%",
          left: "20%",
          animation: "float 7s ease-in-out infinite",
          animationDelay: "2s"
        }}></div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ color: "white", marginBottom: "1.5rem" }}>
              About Me
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.9)", lineHeight: "1.8" }}>
              Get to know more about my journey, skills, and what drives me
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "white" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: "4rem",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="fade-in-scale">
              {profile?.imagePath ? (
                <div style={{ position: "relative", width: "min(400px, 90vw)", height: "min(400px, 90vw)", margin: "0 auto" }}>
                  <div style={{
                    position: "absolute",
                    inset: "-20px",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))",
                    borderRadius: "50%",
                    animation: "pulseRing 3s ease-in-out infinite"
                  }}></div>
                  <div style={{
                    position: "absolute",
                    inset: "-40px",
                    background: "rgba(102, 126, 234, 0.1)",
                    borderRadius: "50%",
                    animation: "pulseRing 3s ease-in-out infinite",
                    animationDelay: "1s"
                  }}></div>
                  <img src={getImageUrl(profile.imagePath)} alt="Profile" style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "10px solid white",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
                  }} className="hover-scale" />
                </div>
              ) : (
                <div style={{ position: "relative", width: "min(400px, 90vw)", height: "min(400px, 90vw)", margin: "0 auto" }}>
                  <div style={{
                    position: "absolute",
                    inset: "-20px",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))",
                    borderRadius: "50%",
                    animation: "pulseRing 3s ease-in-out infinite"
                  }}></div>
                  <div style={{
                    position: "absolute",
                    inset: "-40px",
                    background: "rgba(102, 126, 234, 0.1)",
                    borderRadius: "50%",
                    animation: "pulseRing 3s ease-in-out infinite",
                    animationDelay: "1s"
                  }}></div>
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
                  }}>
                    <img 
                      src="/images/about-profile.jpg" 
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      className="hover-scale"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.parentElement) {
                          e.target.parentElement.innerHTML = '<span style="font-size: clamp(4rem, 15vw, 8rem);">👨‍💻</span>';
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "50px",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "1.5rem"
              }}>
                👨‍💻 My Story
              </div>
              <h2 style={{ marginBottom: "1.5rem" }}>
                <span className="text-gradient">Passionate About Building Great Software</span>
              </h2>
              <p style={{ fontSize: "1.125rem", color: "#64748b", marginBottom: "1.5rem", lineHeight: "1.8" }}>
                {profile?.bioMarkdown || "I'm a full-stack developer who loves creating elegant solutions to complex problems. With a focus on clean code and user experience, I bring ideas to life through modern web technologies."}
              </p>
              <p style={{ fontSize: "1.125rem", color: "#64748b", marginBottom: "2rem", lineHeight: "1.8" }}>
                When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.
              </p>

              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                <div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#6366f1", marginBottom: "0.5rem" }}>
                    {visibleProjects.length}+
                  </div>
                  <div style={{ color: "#64748b", fontWeight: "600" }}>Projects Completed</div>
                </div>
                <div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#6366f1", marginBottom: "0.5rem" }}>
                    {Object.values(skills || {}).flat().length}+
                  </div>
                  <div style={{ color: "#64748b", fontWeight: "600" }}>Technologies</div>
                </div>
                <div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#6366f1", marginBottom: "0.5rem" }}>
                    {blogs?.length || 0}+
                  </div>
                  <div style={{ color: "#64748b", fontWeight: "600" }}>Blog Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#f8fafc" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>
              <span className="text-gradient">Skills & Expertise</span>
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {skillsStatus === "loading" ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div className="spinner"></div>
            </div>
          ) : skills && Object.keys(skills).length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "2rem" }}>
              {["Frontend", "Backend", "DevOps", "Tooling"].map((category, idx) =>
                skills[category] && skills[category].length > 0 && (
                  <div key={category} className="card hover-lift" style={{ padding: "2rem", animationDelay: `${idx * 0.1}s` }}>
                    <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem"
                      }}>
                        {category === "Frontend" ? "🎨" : category === "Backend" ? "⚙️" : category === "DevOps" ? "🚀" : "🛠️"}
                      </span>
                      {category}
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                      {skills[category].map((skill) => (
                        <span key={skill.id} style={{
                          background: "#f1f5f9",
                          color: "#475569",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          fontSize: "0.9375rem",
                          fontWeight: "500"
                        }}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              <p>No skills added yet. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      <section style={{ background: "white" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "24px",
            padding: "clamp(2rem, 5vw, 4rem)",
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              top: "-100px",
              right: "-100px"
            }}></div>
            <h2 style={{ color: "white", marginBottom: "1rem", position: "relative", zIndex: 1 }}>
              Let's Build Something Amazing
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "2rem", lineHeight: "1.8", position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto 2rem" }}>
              I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            <Link to="/contact" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "white",
              color: "#667eea",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontWeight: "700",
              textDecoration: "none",
              position: "relative",
              zIndex: 1
            }}>
              Get In Touch <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
