import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { AdminHeader, AdminStat, Field, EmptyState, Badge } from "../../features/admin/ui/adminKit.jsx";
import { FileText, Plus, X } from "../../shared/components/Icons.jsx";

export default function BlogsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", markdown: "", videoUrl: "", published: false });
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  async function load() {
    try {
      const res = await api.get("/blog/admin/all");
      setList(res.data.docs || []);
    } catch (err) {
      console.error("Failed to load blogs", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("markdown", formData.markdown);
      fd.append("videoUrl", formData.videoUrl);
      fd.append("published", formData.published);
      if (imagePreview) {
        const fileInput = e.target.querySelector('input[name="image"]');
        if (fileInput && fileInput.files[0]) fd.append("image", fileInput.files[0]);
      }
      if (editingId) {
        await api.put(`/blog/admin/${editingId}`, fd);
        setEditingId(null);
      } else {
        await api.post("/blog/admin", fd);
      }
      setFormData({ title: "", markdown: "", videoUrl: "", published: false });
      setImagePreview(null);
      setExistingImage(null);
      await load();
      alert(editingId ? "Blog updated!" : "Blog created!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(blog) {
    setEditingId(blog.id);
    setFormData({ title: blog.title, markdown: blog.markdown || "", videoUrl: blog.videoUrl || "", published: blog.published || false });
    setExistingImage(blog.image || null);
    setImagePreview(null);
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ title: "", markdown: "", videoUrl: "", published: false });
    setImagePreview(null);
    setExistingImage(null);
  }

  async function onDelete(id) {
    if (confirm("Delete this post?")) {
      await api.delete(`/blog/admin/${id}`);
      await load();
    }
  }

  async function togglePublish(id, currentStatus) {
    await api.put(`/blog/admin/${id}`, { published: !currentStatus });
    await load();
  }

  const stats = {
    total: list.length,
    published: list.filter(b => b.published).length,
    draft: list.filter(b => !b.published).length
  };

  return (
    <>
      <AdminHeader
        icon={<FileText width="24" height="24" />}
        title="Blog Management"
        subtitle="Write and manage blog posts"
        actions={
          editingId ? (
            <button onClick={handleCancel} className="admin-btn-ghost"><X width="16" height="16" /> Cancel Edit</button>
          ) : null
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStat icon={<FileText width="20" height="20" />} label="Total Posts" value={stats.total} tone="indigo" loading={loading} />
        <AdminStat icon={<FileText width="20" height="20" />} label="Published" value={stats.published} tone="emerald" loading={loading} />
        <AdminStat icon={<FileText width="20" height="20" />} label="Drafts" value={stats.draft} tone="amber" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="admin-chip bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {editingId ? <FileText width="20" height="20" /> : <Plus width="20" height="20" />}
            </div>
            <h2 className="admin-section-title">{editingId ? "Edit Post" : "New Post"}</h2>
          </div>
          <form onSubmit={onCreate} className="space-y-5">
            <Field label="Title">
              <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Enter blog title" required className="admin-input" />
            </Field>
            <Field label="Content (Markdown)">
              <textarea value={formData.markdown} onChange={(e) => setFormData({...formData, markdown: e.target.value})} placeholder="Write your post in markdown..." rows={12} required className="admin-textarea font-mono text-sm" />
            </Field>
            <Field label="Cover Image">
              {imagePreview && (
                <div className="mb-3">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-slate-700" />
                  <button type="button" onClick={() => setImagePreview(null)} className="text-sm text-red-400 hover:text-red-300 mt-1">Remove</button>
                </div>
              )}
              {!imagePreview && existingImage && (
                <div className="mb-3">
                  <img src={existingImage} alt="Current" className="w-full h-40 object-cover rounded-xl border border-slate-700" />
                </div>
              )}
              <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="admin-input file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20 file:cursor-pointer cursor-pointer" />
            </Field>
            <Field label="Video URL">
              <input value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} placeholder="YouTube, TikTok, Vimeo..." className="admin-input" />
              <p className="text-xs text-slate-500 mt-1">YouTube, TikTok, Vimeo, Twitter, Instagram</p>
            </Field>
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
              <label htmlFor="published" className="text-sm font-medium text-slate-300">
                {editingId ? "Published" : "Publish immediately"}
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="admin-btn-primary flex-1 py-4">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {editingId ? "Updating..." : "Creating..."}
                  </span>
                ) : editingId ? "Update Post" : "Create Post"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="admin-btn-ghost px-6 py-4">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="admin-card p-6">
          <h2 className="admin-section-title mb-6">Existing Posts</h2>
          {list.length === 0 ? (
            <EmptyState title="No posts yet" subtitle="Create your first post using the form" />
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600">
              {list.map((b, idx) => (
                <div key={`blog-${b.id}-${idx}`} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{b.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <Badge tone={b.published ? "emerald" : "amber"}>{b.published ? "Published" : "Draft"}</Badge>
                        <span className="text-slate-400 truncate">/{b.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleEdit(b)} className="admin-btn-ghost admin-btn-sm">Edit</button>
                      <button onClick={() => togglePublish(b.id, b.published)} className="admin-btn-ghost admin-btn-sm">
                        {b.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => onDelete(b.id)} className="admin-btn-danger admin-btn-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}