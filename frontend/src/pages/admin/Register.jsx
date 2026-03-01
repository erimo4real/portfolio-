import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setStatus("loading");

    try {
      await api.post("/auth/register", {
        identifier: formData.identifier,
        password: formData.password,
        name: formData.name
      });
      alert("Registration successful! Please login.");
      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setStatus("idle");
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
      <div style={{
        maxWidth: "450px",
        width: "100%",
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        position: "relative",
        zIndex: 1,
        padding: "2.5rem",
        borderRadius: "24px",
        boxShadow: "0 25px 80px rgba(0,0,0,0.35)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "70px",
            height: "70px",
            margin: "0 auto 1rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem"
          }}>
            👤
          </div>
          <h1 style={{ 
            fontSize: "1.75rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Create Admin Account
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
            Register with email or phone number
          </p>
        </div>

        <form onSubmit={onSubmit}>
          {/* Name Input */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
              Name (optional)
            </label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s"
              }}
            />
          </div>

          {/* Email/Phone Input */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
              Email or Phone Number *
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>👤</span>
              <input 
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                placeholder="email@example.com or +1234567890"
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s"
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
              Password *
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>🔒</span>
              <input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="At least 6 characters"
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s"
                }}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
              Confirm Password *
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>🔒</span>
              <input 
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s"
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "0.875rem",
              borderRadius: "12px",
              marginBottom: "1rem",
              fontSize: "0.875rem"
            }}>
              {error}
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
              transition: "all 0.3s"
            }}
          >
            {status === "loading" ? "Creating Account..." : "Register"}
          </button>

          {/* Login Link */}
          <div style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#64748b"
          }}>
            Already have an account?{" "}
            <Link to="/admin/login" style={{
              color: "#6366f1",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              Login here
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
