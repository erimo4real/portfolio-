import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const ref = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    try {
      const [statsRes, msgsRes] = await Promise.all([
        api.get("/analytics/admin/stats"),
        api.get("/contact/admin/unread")
      ]);
      setUnreadCount(statsRes.data?.messages?.unread ?? 0);
      setMessages(msgsRes.data || []);
    } catch (err) {
      console.error("Notification fetch failed", err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!selectedMsg) return;
    function handleModalClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) setSelectedMsg(null);
    }
    function handleKey(e) {
      if (e.key === "Escape") setSelectedMsg(null);
    }
    document.addEventListener("mousedown", handleModalClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleModalClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [selectedMsg]);

  async function markRead(id) {
    try {
      await api.put(`/contact/admin/${id}`, { read: true });
      await fetchAll();
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  }

  async function markAllRead() {
    try {
      await Promise.all(messages.map(m => api.put(`/contact/admin/${m.id}`, { read: true })));
      await fetchAll();
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  }

  return (
    <><div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          padding: "0.75rem",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontSize: "1.25rem",
          lineHeight: 1
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            background: "#ef4444",
            color: "white",
            fontSize: "0.65rem",
            fontWeight: "700",
            minWidth: "18px",
            height: "18px",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #764ba2"
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: "360px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "1px solid #e2e8f0",
          zIndex: 1000,
          overflow: "hidden"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc"
          }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: "0.5rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  background: "#ef4444",
                  color: "white"
                }}>
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "#6366f1",
                  background: "#eef2ff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {messages.length === 0 ? (
              <div style={{ padding: "2.5rem 1.25rem", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
                <p style={{ margin: 0, fontWeight: "500" }}>All caught up!</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>No unread messages</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    background: "#fefce8"
                  }}
                  onClick={() => { setOpen(false); setSelectedMsg(msg); }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fefce8"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: "#6366f1",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          flexShrink: 0
                        }}>
                          {msg.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                        <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#0f172a" }}>
                          {msg.name}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "auto", whiteSpace: "nowrap" }}>
                          {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p style={{
                        margin: "0.375rem 0 0 2.25rem",
                        fontSize: "0.8rem",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{
            padding: "0.75rem 1.25rem",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center"
          }}>
            <button
              onClick={() => { setOpen(false); navigate("/admin/contacts"); }}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#6366f1",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#eef2ff"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              View all messages →
            </button>
          </div>
        </div>
      )}
    </div>

      {selectedMsg && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "1rem"
        }}>
          <div ref={modalRef} style={{
            background: "white",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "520px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 25px 80px rgba(0,0,0,0.3)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #e2e8f0"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#6366f1",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: "700"
                }}>
                  {selectedMsg.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>
                    {selectedMsg.name}
                  </h3>
                  <a href={`mailto:${selectedMsg.email}`} style={{ fontSize: "0.85rem", color: "#6366f1", textDecoration: "none" }}>
                    {selectedMsg.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#f1f5f9",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.25rem",
                fontSize: "0.85rem",
                color: "#64748b"
              }}>
                <span>{new Date(selectedMsg.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</span>
                <span>•</span>
                <span>{new Date(selectedMsg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              <div style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "1.25rem",
                marginBottom: "1.5rem",
                whiteSpace: "pre-wrap",
                lineHeight: "1.7",
                fontSize: "0.95rem",
                color: "#1e293b"
              }}>
                {selectedMsg.message}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {!selectedMsg.read && (
                  <button
                    onClick={async () => {
                      await markRead(selectedMsg.id);
                      setSelectedMsg(null);
                    }}
                    style={{
                      padding: "0.625rem 1.25rem",
                      background: "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      cursor: "pointer"
                    }}
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => { setSelectedMsg(null); navigate("/admin/contacts"); }}
                  style={{
                    padding: "0.625rem 1.25rem",
                    background: "#eef2ff",
                    color: "#6366f1",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    cursor: "pointer"
                  }}
                >
                  View in Messages →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
