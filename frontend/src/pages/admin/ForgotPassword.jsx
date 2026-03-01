import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setMessage("Password reset link sent! Check your email.");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to send reset link");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "50%",
        top: "-300px",
        right: "-300px",
        animation: "float 8s ease-in-out infinite"
      }}></div>
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "50%",
        bottom: "-200px",
        left: "-200px",
        animation: "float 6s ease-in-out infinite reverse"
      }}></div>

      {/* Card */}
      <div 
        className="card" 
        style={{
          maxWidth: "450px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1,
          padding: "3rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideInUp 0.6s ease-out"
        }}
      >
        {/* Icon */}
        <div style={{
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)"
          }}>
            🔑
          </div>
          
          <h1 style={{ 
            marginBottom: "0.5rem",
            fontSize: "2rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Forgot Password?
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9375rem" }}>
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {status === "success" ? (
          <div style={{
            textAlign: "center",
            animation: "fadeIn 0.5s ease-out"
          }}>
            <div style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              justifyContent: "center"
            }}>
              <span>✅</span>
              {message}
            </div>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              Check your inbox and follow the instructions to reset your password.
            </p>
            <Link to="/admin/login" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#6366f1",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            {/* Email Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#0f172a",
                fontWeight: "600",
                fontSize: "0.875rem"
              }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.25rem"
                }}>
                  📧
                </span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com" 
                  required
                  autoComplete="email"
                  style={{
                    paddingLeft: "3rem",
                    transition: "all 0.3s",
                    border: "2px solid #e2e8f0"
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {status === "error" && (
              <div style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "0.875rem",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                animation: "shake 0.5s ease-in-out"
              }}>
                <span>⚠️</span>
                {message}
              </div>
            )}
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={status === "loading"}
              style={{ 
                width: "100%",
                padding: "1rem",
                fontSize: "1rem",
                fontWeight: "700",
                background: status === "loading" 
                  ? "#94a3b8" 
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: "0 10px 20px rgba(102, 126, 234, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              {status === "loading" ? (
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
                  Send Reset Link
                </>
              )}
            </button>

            {/* Back to Login */}
            <div style={{
              marginTop: "1.5rem",
              textAlign: "center"
            }}>
              <Link to="/admin/login" style={{
                color: "#6366f1",
                fontSize: "0.875rem",
                textDecoration: "none",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
