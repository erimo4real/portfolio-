import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { submitContact } from "../store/slices/contact.js";

export default function Contact() {
  const dispatch = useDispatch();
  const [contactStatus, setContactStatus] = useState("idle");

  async function onSubmit(e) {
    e.preventDefault();
    setContactStatus("loading");
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await dispatch(submitContact(data)).unwrap();
      setContactStatus("success");
      e.target.reset();
      setTimeout(() => setContactStatus("idle"), 5000);
    } catch (error) {
      setContactStatus("error");
      setTimeout(() => setContactStatus("idle"), 5000);
    }
  }

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

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ color: "white", marginBottom: "1.5rem" }}>
              Get In Touch
            </h1>
            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.9)", lineHeight: "1.8" }}>
              Have a project in mind? Let's create something amazing together!
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
            alignItems: "start"
          }}>
            <div>
              <h2 style={{ marginBottom: "1.5rem" }}>
                <span className="text-gradient">Let's Work Together</span>
              </h2>
              <p style={{ fontSize: "1.125rem", color: "#64748b", marginBottom: "2rem", lineHeight: "1.8" }}>
                I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0
                  }}>
                    
                  </div>
                  <div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>Email</h3>
                    <p style={{ color: "#64748b" }}>eromoxlx@gmail.com</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0
                  }}>
                    
                  </div>
                  <div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>Phone</h3>
                    <p style={{ color: "#64748b" }}>08138213326</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0
                  }}>
                    📍
                  </div>
                  <div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>Location</h3>
                    <p style={{ color: "#64748b" }}>Lagos, LA</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "3rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Contact</h3>
                <a
                  href="mailto:eromoxlx@gmail.com"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem 2rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontSize: "1.125rem",
                    fontWeight: "600"
                  }}
                >
                  Email Me
                </a>
              </div>
            </div>

            <div>
              {contactStatus === "success" ? (
                <div className="card scale-in" style={{ padding: "4rem 3rem", textAlign: "center" }}>
                  <div style={{
                    width: "100px",
                    height: "100px",
                    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 2rem",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
                    animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}>
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0iIzEwYjk4MSI+PHBhdGggZD0iTTE2IDJjNi42NyAwIDExLjMzIDUuNjMgMTEuMzMgMTIuMDBMMTYgMjJsLTUuMzMtNS4zM0gxNi41NkMxMC42NyAyNi41NiA2LjMzIDIwLjY3IDYgMTRDMCA3LjMzIDQuMzMgNS42NyA1LjMzIDRWNEM1LjMzIDIgNi42NyAxIDEuMzMgMUMxMCAxIDIuNjcgMi41NiA0LjMzIDQuNTdMMTYgMTJjNy4zNyAwIDEzLjY3IDYuMzAgMTMuNjcgMTMuMDBMMTYgMjJ6Ii8+PC9zdmc+" 
                      alt="Success"
                      style={{ width: "50px", height: "50px", objectFit: "contain" }}
                    />
                  </div>
                  <h3 style={{ marginBottom: "1rem", color: "#10b981" }}>Message Sent Successfully!</h3>
                  <p style={{ color: "#64748b", fontSize: "1.125rem", marginBottom: "2rem" }}>
                    Thanks for reaching out! I'll get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setContactStatus("idle")}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 10px 20px rgba(102, 126, 234, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="card fade-in-up" style={{ padding: "clamp(2rem, 5vw, 3rem)" }}>
                  <h3 style={{ marginBottom: "1.5rem" }}>Send Me a Message</h3>
                  
                  {contactStatus === "error" && (
                    <div style={{
                      background: "#fee2e2",
                      color: "#991b1b",
                      padding: "1rem",
                      borderRadius: "12px",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      animation: "shake 0.5s ease-in-out"
                    }}>
                      
                      Failed to send message. Please try again.
                    </div>
                  )}
                  
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label>Your Name</label>
                    <input name="name" placeholder="John Doe" required />
                  </div>
                  
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label>Email Address</label>
                    <input name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  
                  <div style={{ marginBottom: "2rem" }}>
                    <label>Message</label>
                    <textarea name="message" placeholder="Tell me about your project or just say hi! 👋" rows={6} required />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={contactStatus === "loading"}
                    style={{ 
                      width: "100%", 
                      padding: "1.25rem", 
                      fontSize: "1.125rem",
                      background: contactStatus === "loading" ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      cursor: contactStatus === "loading" ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {contactStatus === "loading" ? (
                      <>
                        <div style={{
                          width: "20px",
                          height: "20px",
                          border: "3px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite"
                        }}></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
