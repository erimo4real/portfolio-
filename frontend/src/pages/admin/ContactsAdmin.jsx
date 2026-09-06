import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { AdminHeader, AdminStat, EmptyState, Badge } from "../../features/admin/ui/adminKit.jsx";
import { MessageSquare } from "../../shared/components/Icons.jsx";

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

  useEffect(() => { load(); }, []);

  async function onDelete(id) {
    if (confirm("Delete this message?")) {
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

  return (
    <>
      <AdminHeader
        icon={<MessageSquare width="24" height="24" />}
        title="Contact Messages"
        subtitle="Manage incoming contact form submissions"
        actions={
          <div className="flex gap-3">
            <AdminStat icon={<MessageSquare width="18" height="18" />} label="Total" value={stats.total} tone="indigo" loading={loading} />
            <AdminStat icon={<MessageSquare width="18" height="18" />} label="Unread" value={stats.unread} tone="amber" loading={loading} />
            <AdminStat icon={<MessageSquare width="18" height="18" />} label="Today" value={stats.today} tone="emerald" loading={loading} />
          </div>
        }
      />

      {list.length === 0 ? (
        <EmptyState icon={<MessageSquare width="32" height="32" />} title="No messages yet" subtitle="Contact form submissions will appear here" />
      ) : (
        <div className="space-y-4">
          {list.map((c) => (
            <div key={c.id} className={`admin-card overflow-hidden ${!c.read ? "border-indigo-500/30 bg-indigo-500/5" : ""}`}>
              {/* Header */}
              <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${!c.read ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-300"}`}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <a href={`mailto:${c.email}`} className="text-sm text-indigo-400 hover:underline">{c.email}</a>
                    {!c.read && <Badge tone="indigo" className="ml-2">New</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button onClick={() => toggleRead(c.id, c.read)} className={`p-2 rounded-lg transition-all ${c.read ? "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10" : "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"}`} title={c.read ? "Mark unread" : "Mark read"}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {c.read ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      )}
                    </svg>
                  </button>
                  <button onClick={() => onDelete(c.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Body */}
              <div className="px-6 py-4">
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}