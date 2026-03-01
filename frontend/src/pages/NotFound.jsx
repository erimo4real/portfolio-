import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
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

      {/* Content */}
      <div style={{
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        maxWidth: "600px"
      }}>
        <div style={{
          fontSize: "clamp(6rem, 15vw, 10rem)",
          fontWeight: "900",
          color: "white",
          marginBottom: "1rem",
          lineHeight: "1",
          animation: "fadeInUp 0.6s ease-out"
        }}>
          404
        </div>
        
        <div style={{
          fontSize: "3rem",
          marginBottom: "1.5rem",
          animation: "fadeInUp 0.6s ease-out 0.2s both"
        }}>
          🤔
        </div>

        <h1 style={{
          color: "white",
          marginBottom: "1rem",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          animation: "fadeInUp 0.6s ease-out 0.3s both"
        }}>
          Page Not Found
        </h1>

        <p style={{
          fontSize: "1.25rem",
          color: "rgba(255,255,255,0.9)",
          marginBottom: "3rem",
          lineHeight: "1.8",
          animation: "fadeInUp 0.6s ease-out 0.4s both"
        }}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
          animation: "fadeInUp 0.6s ease-out 0.5s both"
        }}>
          <Link to="/" style={{
            background: "white",
            color: "#667eea",
            padding: "1rem 2rem",
            borderRadius: "12px",
            fontWeight: "700",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.125rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            transition: "all 0.3s"
          }}>
            <span>←</span> Back to Home
          </Link>

          <Link to="/blog" style={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "12px",
            fontWeight: "700",
            border: "2px solid rgba(255,255,255,0.3)",
            textDecoration: "none",
            backdropFilter: "blur(10px)",
            fontSize: "1.125rem",
            transition: "all 0.3s"
          }}>
            View Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
