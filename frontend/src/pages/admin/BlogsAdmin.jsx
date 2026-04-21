import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    load();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
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
        if (fileInput && fileInput.files[0]) {
          fd.append("image", fileInput.files[0]);
        }
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
      alert(editingId ? "Blog post updated!" : "Blog post created!");
    } catch (err) {
      alert("Error saving blog post: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(blog) {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      markdown: blog.markdown || "",
      videoUrl: blog.videoUrl || "",
      published: blog.published || false
    });
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
    if (confirm("Delete this blog post?")) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
            <p className="text-slate-500 text-sm">Create and manage your blog posts</p>
          </div>
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-3xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-slate-500">Total Posts</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-3xl font-bold text-emerald-600">{stats.published}</div>
            <div className="text-slate-500">Published</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-3xl font-bold text-amber-600">{stats.draft}</div>
            <div className="text-slate-500">Drafts</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create/Edit Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
                {editingId ? 'Edit' : 'Write'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{editingId ? "Edit Post" : "Create New Post"}</h2>
            </div>
            <form onSubmit={onCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter blog post title" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content (Markdown)</label>
                <textarea 
                  value={formData.markdown}
                  onChange={(e) => setFormData({...formData, markdown: e.target.value})}
                  placeholder="Write your blog post in markdown..." 
                  rows={12}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Image</label>
                {imagePreview ? (
                  <div className="mb-3">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                    <button type="button" onClick={() => setImagePreview(null)} className="text-sm text-red-500 mt-1">Remove</button>
                  </div>
                ) : existingImage ? (
                  <div className="mb-3">
                    <img src={existingImage} alt="Current" className="w-full h-40 object-cover rounded-xl" />
                  </div>
                ) : null}
                <input 
                  type="file" 
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Video URL (YouTube, TikTok, Vimeo, etc.)</label>
                <input 
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  placeholder="https://youtube.com/watch?v=... or https://tiktok.com/..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Recommended: videos under 10 minutes. Supports YouTube, TikTok, Vimeo, Twitter, Instagram</p>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <input 
                  type="checkbox" 
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">
                  {editingId ? "Published" : "Publish immediately"}
                </label>
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {editingId ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editingId ? "Update Post" : "Create Post"
                  )}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Blogs */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Existing Posts</h2>
            {list.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-slate-500">No blog posts yet</p>
                <p className="text-slate-400 text-sm mt-2">Create your first post using the form</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {list.map((b, idx) => (
                  <div key={`blog-${b.id}-${idx}`} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{b.title}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            b.published 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {b.published ? "Published" : "Draft"}
                          </span>
                          <span className="truncate">/{b.slug}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(b)}
                          className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => togglePublish(b.id, b.published)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            b.published 
                              ? "text-amber-600 bg-amber-50 hover:bg-amber-100" 
                              : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          {b.published ? "Unpublish" : "Publish"}
                        </button>
                        <button 
                          onClick={() => onDelete(b.id)}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
