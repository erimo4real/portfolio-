import React, { useEffect, useState } from "react";
import { api } from "../../../lib/api.js";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    markdown: "", 
    published: false,
    slug: "" 
  });

  const loadBlogs = async () => {
    try {
      const res = await api.get("/blog/admin/all");
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to load blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/blog/admin/${editingId}`, formData);
      } else {
        await api.post("/blog/admin", formData);
      }
      setFormData({ title: "", markdown: "", published: false, slug: "" });
      setEditingId(null);
      loadBlogs();
    } catch (err) {
      alert("Error saving blog post");
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({ 
      title: blog.title, 
      markdown: blog.markdown, 
      published: blog.published,
      slug: blog.slug 
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/blog/admin/${id}`);
      loadBlogs();
    } catch (err) {
      alert("Error deleting blog post");
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus ? "unpublish" : "publish";
      await api.post(`/blog/admin/${id}/${endpoint}`);
      loadBlogs();
    } catch (err) {
      alert("Error toggling publish status");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Editor Column */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
            <h2 className="text-xl font-bold mb-6 text-slate-800">
              {editingId ? "Edit Post" : "Create New Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Post Title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Custom Slug (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-if-empty"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Content (Markdown)</label>
                <textarea
                  required
                  rows={12}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-sm"
                  value={formData.markdown}
                  onChange={(e) => setFormData({ ...formData, markdown: e.target.value })}
                  placeholder="# Hello World..."
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="blog-published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="blog-published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-grow bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  {editingId ? "Update Post" : "Create Post"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: "", markdown: "", published: false, slug: "" });
                    }}
                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="xl:col-span-2 space-y-4">
          {blogs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-500">
              No blog posts yet.
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-primary-200 transition-colors group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{blog.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.published 
                          ? "bg-green-100 text-green-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm font-mono mb-4">/blog/{blog.slug}</p>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span>📝 {blog.markdown?.length || 0} characters</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-4 py-2 text-sm font-bold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublish(blog.id, blog.published)}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                        blog.published 
                          ? "text-slate-600 bg-slate-100 hover:bg-slate-200" 
                          : "text-green-600 bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      {blog.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
