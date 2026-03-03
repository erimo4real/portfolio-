import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/auth.js";
import { Navigate, Link } from "react-router-dom";
import { api } from "../../lib/api.js";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Register form state
  const [registerData, setRegisterData] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [registerStatus, setRegisterStatus] = useState("idle");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  function onSubmit(e) {
    e.preventDefault();
    const { identifier, password } = Object.fromEntries(new FormData(e.target));
    dispatch(login({ identifier, password, rememberMe }));
  }

  async function onRegisterSubmit(e) {
    e.preventDefault();
    setRegisterError("");
    
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords don't match");
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters");
      return;
    }

    if (!registerData.identifier) {
      setRegisterError("Email or phone number is required");
      return;
    }

    setRegisterStatus("loading");

    try {
      await api.post("/auth/register", {
        identifier: registerData.identifier,
        password: registerData.password,
        name: registerData.name
      });
      alert("Registration successful! Please login.");
      setShowRegister(false);
      setRegisterData({ identifier: "", password: "", confirmPassword: "", name: "" });
    } catch (err) {
      setRegisterError(err.response?.data?.message || "Registration failed");
      setRegisterStatus("idle");
    }
  }

  const isLoading = status === "loading";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      backgroundSize: "200% 200%",
      animation: "gradientShift 15s ease infinite",
      padding: "4rem 2rem 2rem 2rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        top: "-300px",
        right: "-300px",
        animation: "float 8s ease-in-out infinite",
        filter: "blur(40px)"
      }}></div>
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "50%",
        bottom: "-200px",
        left: "-200px",
        animation: "float 6s ease-in-out infinite reverse",
        filter: "blur(30px)"
      }}></div>
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "50%",
        top: "50%",
        left: "10%",
        animation: "float 10s ease-in-out infinite",
        animationDelay: "2s",
        filter: "blur(20px)"
      }}></div>
      
      {/* Interactive Glow Effect */}
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
        transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
        transition: "transform 0.3s ease-out",
        filter: "blur(60px)"
      }}></div>

      {/* Login Card - Side by Side Layout */}
      <div 
        style={{
          maxWidth: "1000px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1,
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
          animation: "slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "480px"
        }}>
          {/* Left Side - Lock Character / Image */}
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientShift 10s ease infinite",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Animated Decorative circles */}
            <div style={{
              position: "absolute",
              width: "250px",
              height: "250px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
              top: "-80px",
              left: "-80px",
              animation: "pulseRing 4s ease-in-out infinite"
            }}></div>
            <div style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "50%",
              bottom: "-50px",
              right: "-50px",
              animation: "pulseRing 5s ease-in-out infinite",
              animationDelay: "1s"
            }}></div>
            <div style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              top: "40%",
              right: "10%",
              animation: "float 6s ease-in-out infinite"
            }}></div>

            {/* Lock Character with Enhanced Animation */}
            <div style={{
              width: "120px",
              height: "140px",
              position: "relative",
              animation: "fadeInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both"
            }}>
              {/* Lock Body */}
              <div style={{
                width: "70px",
                height: "80px",
                background: "white",
                borderRadius: "12px",
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                width: "20px",
                height: "26px",
                background: isPasswordFocused ? "#10b981" : "#fbbf24",
                borderRadius: "5px",
                transition: "all 0.3s ease",
                boxShadow: isPasswordFocused ? "0 0 20px #10b981" : "none"
              }}></div>
              </div>

              {/* Lock Shackle */}
              <div style={{
                position: "absolute",
                top: "5px",
                left: "50%",
                transform: `translateX(-50%) ${isPasswordFocused ? 'translateY(-10px)' : 'translateY(0)'}`,
                width: "44px",
                height: "35px",
                border: "9px solid white",
                borderBottom: "none",
                borderRadius: "22px 22px 0 0",
                transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                boxShadow: isPasswordFocused ? "0 0 20px rgba(16, 185, 129, 0.5)" : "none"
              }}></div>

              {/* Unlocked indicator */}
              {isPasswordFocused && (
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  right: "0",
                  background: "#10b981",
                  color: "white",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  animation: "slideInRight 0.3s ease-out",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                }}>
                  🔓 Unlocked
                </div>
              )}
            </div>

            <h2 style={{
              color: "white",
              fontSize: "1.25rem",
              fontWeight: "700",
              marginTop: "1rem",
              textAlign: "center",
              animation: "fadeIn 0.8s ease-out 0.5s both"
            }}>
              Welcome Back!
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.8)",
              marginTop: "0.25rem",
              fontSize: "0.875rem",
              textAlign: "center",
              animation: "fadeIn 0.8s ease-out 0.6s both"
            }}>
              Manage your portfolio with ease
            </p>
            <Link to="/" style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "0.8rem",
              textDecoration: "none",
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s ease",
              animation: "fadeIn 0.8s ease-out 0.7s both"
            }} onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.15)";
              e.target.style.borderColor = "rgba(255,255,255,0.5)";
            }} onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "rgba(255,255,255,0.3)";
            }}>
              ← Back to Portfolio
            </Link>
          </div>

          {/* Right Side - Form */}
          <div style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <div style={{
              animation: "fadeIn 0.8s ease-out 0.4s both"
            }}>
              <h1 style={{ 
                marginBottom: "0.5rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "1.75rem",
                fontWeight: "800"
              }}>
                Portfolio Admin
              </h1>
              <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                {showRegister ? "Create your admin account" : isPasswordFocused ? "🔓 Access granted! Unlocking..." : "🔐 Sign in to continue"}
              </p>
            </div>
            
            {showRegister ? (
              // REGISTER FORM
              <form onSubmit={onRegisterSubmit} style={{ animation: "fadeIn 0.8s ease-out 0.5s both" }}>
                {/* Name Input */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
                    Name (optional)
                  </label>
                  <input 
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    placeholder="Your name"
                    style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                  />
                </div>

                {/* Email/Phone Input */}
                <div style={{ marginBottom: "1rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>👤</span>
                  <input 
                    value={registerData.identifier}
                    onChange={(e) => setRegisterData({...registerData, identifier: e.target.value})}
                    placeholder="Email or Phone Number *"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem 0.875rem 3rem",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Password Input */}
                <div style={{ marginBottom: "1rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>🔒</span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    placeholder="Password *"
                    required
                    minLength={6}
                    style={{
                      width: "100%",
                      padding: "0.875rem 3rem 0.875rem 3rem",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                {/* Confirm Password Input */}
                <div style={{ marginBottom: "1.5rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>🔒</span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    placeholder="Confirm Password *"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem 3rem 0.875rem 3rem",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Error Message */}
                {registerError && (
                  <div style={{ background: "#fee2e2", color: "#991b1b", padding: "0.875rem", borderRadius: "12px", marginBottom: "1rem", fontSize: "0.875rem" }}>
                    {registerError}
                  </div>
                )}

                <button type="submit" disabled={registerStatus === "loading"} style={{ width: "100%", padding: "1rem", fontSize: "1rem", fontWeight: "700", background: registerStatus === "loading" ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none", borderRadius: "12px", color: "white", cursor: registerStatus === "loading" ? "not-allowed" : "pointer" }}>
                  {registerStatus === "loading" ? "Creating Account..." : "Register"}
                </button>

                {/* Toggle to Login */}
                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                  Already have an account?{" "}
                  <button type="button" onClick={() => setShowRegister(false)} style={{ color: "#6366f1", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }}>
                    Login here
                  </button>
                </div>
              </form>
            ) : (
              // LOGIN FORM
              <form onSubmit={onSubmit} style={{
              animation: "fadeIn 0.8s ease-out 0.5s both"
            }}>
              {/* Email/Phone Input */}
              <div style={{ marginBottom: "1rem", position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.1rem",
                  zIndex: 1
                }}>👤</span>
                <input 
                  name="identifier" 
                  placeholder="Email or Phone"
                  required
                  autoComplete="username"
                  style={{
                    width: "100%",
                    padding: "1rem 1rem 1rem 3rem",
                    borderRadius: "12px",
                    border: `2px solid ${isEmailFocused ? '#667eea' : '#e2e8f0'}`,
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s",
                    boxShadow: isEmailFocused ? "0 0 0 3px rgba(102, 126, 234, 0.1)" : "none"
                  }}
                  onFocus={() => {
                    setIsEmailFocused(true);
                    setIsPasswordFocused(false);
                  }}
                  onBlur={() => setIsEmailFocused(false)}
                />
              </div>
              
              {/* Password Input */}
              <div style={{ marginBottom: "1rem", position: "relative" }}>
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "1rem 3rem 1rem 3rem",
                    borderRadius: "12px",
                    border: `2px solid ${isPasswordFocused ? '#667eea' : '#e2e8f0'}`,
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s",
                    boxShadow: isPasswordFocused ? "0 0 0 3px rgba(102, 126, 234, 0.1)" : "none"
                  }}
                  onFocus={() => {
                    setIsPasswordFocused(true);
                    setIsEmailFocused(false);
                  }}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <span style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.1rem"
                }}>🔒</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    padding: "0.25rem"
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem"
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "0.5rem"
                }}>
                  <div style={{
                    width: "44px",
                    height: "24px",
                    background: rememberMe ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e2e8f0",
                    borderRadius: "12px",
                    position: "relative",
                    transition: "all 0.3s ease"
                  }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      background: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: rememberMe ? "22px" : "2px",
                      transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}></div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ display: "none" }}
                  />
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Remember me</span>
                </label>

                <Link to="/admin/forgot-password" style={{
                  color: "#6366f1",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  fontWeight: "600"
                }}>
                  Forgot password?
                </Link>
              </div>

              {/* Warning for Remember Me */}
              {rememberMe && (
                <div style={{
                  background: "#fef3c7",
                  border: "1px solid #f59e0b",
                  color: "#92400e",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1rem" }}>⚠️</span>
                  <div>
                    <strong>Stay logged in for 7 days</strong>
                    <p style={{ margin: "0.25rem 0 0", opacity: 0.9 }}>
                      Only check this if you're on a private device. Don't use on shared computers.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
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
                  {error}
                </div>
              )}
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                style={{ 
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1rem",
                  fontWeight: "700",
                  background: isLoading
                    ? "#94a3b8" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 10px 20px rgba(102, 126, 234, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      border: "3px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite"
                    }}></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </form>
            )}

            {/* Social Login */}
            <div style={{
              marginTop: "1.5rem",
              animation: "fadeIn 0.8s ease-out 0.7s both"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.75rem"
              }}>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
                <span style={{ color: "#64748b", fontSize: "0.875rem" }}>or continue with</span>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "white",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    color: "#334155",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "#0f172a",
                    border: "2px solid #0f172a",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#64748b",
              animation: "fadeIn 0.8s ease-out 0.8s both"
            }}>
              <p>🔐 Secure portfolio management</p>
            </div>

            {/* Toggle to Register */}
            <div style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#64748b"
            }}>
              Don't have an account?{" "}
              <button type="button" onClick={() => setShowRegister(true)} style={{
                color: "#6366f1",
                fontWeight: "600",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}>
                Register here
              </button>
            </div>
          </div>
        </div>
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
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

        @keyframes successPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="min-height: 600px"] {
            min-height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
