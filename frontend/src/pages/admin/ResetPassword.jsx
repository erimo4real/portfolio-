import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters");
      return;
    }

    setStatus("loading");
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setMessage("Password reset successful!");
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to reset password");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (!token) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem"
      }}>
        <div className="card" style={{
          maxWidth: "450px",
          textAlign: "center",
          padding: "3rem"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}></div>
          <h2 style={{ marginBottom: "1rem" }}>Invalid Reset Link</h2>
          <p style={{ color: "#64748b", marginBottom: "2rem" }}>
            This password reset link is invalid or has expired.
          </p>
          <Link to="/admin/forgot-password" style={{
            display: "inline-block",
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px",
            fontWeight: "600",
            textDecoration: "none"
          }}>
            Request New Link
          </Link>
        </div>
      </div>
    );
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
            🔐
          </div>
          
          <h1 style={{ 
            marginBottom: "0.5rem",
            fontSize: "2rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Reset Password
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9375rem" }}>
            Enter your new password below
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
              
              {message}
            </div>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            {/* New Password Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#0f172a",
                fontWeight: "600",
                fontSize: "0.875rem"
              }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.25rem"
                }}>
                  🔒
                </span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{
                    paddingLeft: "3rem",
                    transition: "all 0.3s",
                    border: "2px solid #e2e8f0"
                  }}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#0f172a",
                fontWeight: "600",
                fontSize: "0.875rem"
              }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.25rem"
                }}>
                  🔒
                </span>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{
                    paddingLeft: "3rem",
                    transition: "all 0.3s",
                    border: "2px solid #e2e8f0"
                  }}
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div style={{
              background: "#f1f5f9",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              color: "#475569"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Password must:</div>
              <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                <li style={{ color: password.length >= 6 ? "#10b981" : "#475569" }}>
                  Be at least 6 characters long
                </li>
                <li style={{ color: password && confirmPassword && password === confirmPassword ? "#10b981" : "#475569" }}>
                  Match the confirmation
                </li>
              </ul>
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
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
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
