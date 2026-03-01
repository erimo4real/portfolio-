import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { Link } from "react-router-dom";

export default function ContactsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/contact/admin");
      setList(res.data.docs || []);
    } catch (err) {
      console.error("Failed to load contacts", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    if (confirm("Delete this contact message?")) {
      await api.delete(`/contact/admin/${id}`);
      await load();
    }
  }

  async function toggleRead(id, currentReadStatus) {
    await api.put(`/contact/admin/${id}`, { read: !currentReadStatus });
    await load();
  }

  const stats = {
    total: list.length,
    unread: list.filter(c => !c.read).length,
    today: list.filter(c => {
      const msgDate = new Date(c.createdAt);
      const today = new Date();
      return msgDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
              <p className="text-slate-500 text-sm">Manage incoming contact form submissions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                  <span className="text-xl font-bold text-indigo-600">{stats.total}</span>
                  <span className="text-slate-500 text-sm ml-2">Total</span>
                </div>
                <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                  <span className="text-xl font-bold text-amber-600">{stats.unread}</span>
                  <span className="text-slate-500 text-sm ml-2">Unread</span>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                  <span className="text-xl font-bold text-emerald-600">{stats.today}</span>
                  <span className="text-slate-500 text-sm ml-2">Today</span>
                </div>
              </div>
              <Link 
                to="/admin" 
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-4xl">
              📭
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No messages yet</h3>
            <p className="text-slate-500">Contact form submissions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((c) => (
              <div 
                key={c.id} 
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                  !c.read ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200'
                }`}
              >
                {/* Message Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                      !c.read 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{c.name}</h3>
                      <a href={`mailto:${c.email}`} className="text-sm text-indigo-600 hover:underline">
                        {c.email}
                      </a>
                      {!c.read && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <button 
                      onClick={() => toggleRead(c.id, c.read)}
                      className={`p-2 rounded-lg transition-all ${
                        c.read 
                          ? 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50' 
                          : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100'
                      }`}
                      title={c.read ? "Mark as unread" : "Mark as read"}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {c.read ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        )}
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete(c.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Message Body */}
                <div className="px-6 py-4">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {c.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}