import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { Link } from "react-router-dom";

export default function ProjectsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({ 
    title: "", 
    descriptionMarkdown: "", 
    techStack: "",
    status: "idea",
    githubUrl: "",
    demoUrl: "",
    featured: false,
    published: true
  });

  async function load() {
    try {
      const res = await api.get("/projects/admin/all");
      setList(res.data.docs || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const clearImagePreviews = () => {
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setSelectedFiles([]);
  };

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      
      // Add text fields
      fd.append("title", formData.title);
      fd.append("descriptionMarkdown", formData.descriptionMarkdown);
      fd.append("techStack", formData.techStack);
      fd.append("status", formData.status);
      fd.append("githubUrl", formData.githubUrl);
      fd.append("demoUrl", formData.demoUrl);
      fd.append("featured", formData.featured);
      fd.append("published", formData.published);
      
      // Add existing images as JSON (for keep/delete logic)
      if (editingId && existingImages.length > 0) {
        fd.append("existingImages", JSON.stringify(existingImages));
      }
      
      // Add new image files
      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          fd.append("images", selectedFiles[i]);
        }
      }
      
      if (editingId) {
        await api.put(`/projects/admin/${editingId}`, fd);
      } else {
        await api.post("/projects/admin", fd);
      }
      
      setEditingId(null);
      setFormData({ 
        title: "", 
        descriptionMarkdown: "", 
        techStack: "",
        status: "idea",
        githubUrl: "",
        demoUrl: "",
        featured: false,
        published: true
      });
      setExistingImages([]);
      setImagePreviews([]);
      setSelectedFiles([]);
      await load();
      alert(editingId ? "Project updated successfully!" : "Project created successfully!");
    } catch (err) {
      alert("Failed to save project: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(project) {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      descriptionMarkdown: project.descriptionMarkdown || "",
      techStack: project.techStack ? JSON.stringify(project.techStack) : "",
      status: project.status || "idea",
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      featured: project.featured || false,
      published: project.published || false
    });
    setExistingImages(project.images || []);
    setImagePreviews([]);
    setSelectedFiles([]);
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ 
      title: "", 
      descriptionMarkdown: "", 
      techStack: "",
      status: "idea",
      githubUrl: "",
      demoUrl: "",
      featured: false,
      published: true
    });
    setExistingImages([]);
    setImagePreviews([]);
    setSelectedFiles([]);
  }

  async function onDelete(id) {
    if (confirm("Are you sure you want to delete this project?")) {
      await api.delete(`/projects/admin/${id}`);
      await load();
    }
  }

  async function togglePublish(id, currentStatus) {
    await api.put(`/projects/admin/${id}`, { published: !currentStatus });
    await load();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Projects Management</h1>
          <Link 
            to="/admin" 
            className="px-4 py-2 border-2 border-slate-200 rounded-xl text-slate-600 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Create/Edit Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            {editingId ? "Edit Project" : "Create New Project"}
          </h2>
          <form onSubmit={onCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title *</label>
                <input 
                  name="title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="My Awesome Project" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Markdown)</label>
                <textarea 
                  name="descriptionMarkdown" 
                  value={formData.descriptionMarkdown}
                  onChange={(e) => setFormData({...formData, descriptionMarkdown: e.target.value})}
                  placeholder="## About the project&#10;&#10;Describe what this project does..." 
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-sm"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tech Stack (JSON array)</label>
                <input 
                  name="techStack" 
                  value={formData.techStack}
                  onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                  placeholder='["React", "Node.js", "MongoDB"]'
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                >
                  <option value="idea">Idea</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">GitHub URL</label>
                <input 
                  name="githubUrl" 
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Demo URL</label>
                <input 
                  name="demoUrl" 
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                  placeholder="https://demo.example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Images</label>
                
                {/* Show existing images if editing */}
                {editingId && existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Current images (click X to remove):</p>
                    <div className="flex flex-wrap gap-3">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200 group">
                          <img src={img.path} alt={`Project ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = existingImages.filter((_, i) => i !== idx);
                              setExistingImages(newImages);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Show new image previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">New images:</p>
                    <div className="flex flex-wrap gap-3">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200">
                          <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hide upload when there are previews */}
                {(imagePreviews.length === 0) && (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                    <input 
                      name="images" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      id="project-images"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="project-images" className="cursor-pointer">
                      <div className="text-4xl mb-2">🖼️</div>
                      <div className="text-sm font-medium text-slate-600">Click to upload images</div>
                      <div className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB each</div>
                    </label>
                  </div>
                )}
                
                {(imagePreviews.length > 0 || existingImages.length > 0) && (
                  <button
                    type="button"
                    onClick={() => { clearImagePreviews(); setExistingImages([]); }}
                    className="mt-2 text-sm text-red-500 hover:text-red-600"
                  >
                    Clear all images
                  </button>
                )}
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    name="featured" 
                    type="checkbox" 
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" 
                  />
                  <span className="text-sm font-medium text-slate-700">⭐ Featured Project</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    name="published" 
                    type="checkbox" 
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" 
                  />
                  <span className="text-sm font-medium text-slate-700">Published</span>
                </label>
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {editingId ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editingId ? "Update Project" : "Create Project"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Projects List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Existing Projects ({list.length})</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-12 text-center">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-slate-500 text-lg">No projects yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {list.map((p, idx) => (
              <div key={`project-${p.id}-${idx}`} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-primary-200 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {p.images && p.images[0] ? (
                      <img src={p.images[0].path} alt={p.title} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">📷</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                      {p.featured && <span className="text-amber-500">⭐</span>}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "completed" ? "bg-emerald-100 text-emerald-700" : 
                        p.status === "in_progress" ? "bg-amber-100 text-amber-700" : 
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {p.status}
                        {p.status?.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>/{p.slug}</span>
                      {p.techStack && p.techStack.length > 0 && (
                        <span>🛠️ {p.techStack.slice(0, 4).join(", ")}{p.techStack.length > 4 ? "..." : ""}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => togglePublish(p.id, p.published)} 
                      className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)} 
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
  );
}
