import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { AdminHeader, AdminStat, Field, EmptyState, Badge } from "../../features/admin/ui/adminKit.jsx";
import { Star, Plus, X } from "../../shared/components/Icons.jsx";

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
    published: true,
    understanding: "",
    contribution: ""
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

  useEffect(() => { load(); }, []);

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
      fd.append("title", formData.title);
      fd.append("descriptionMarkdown", formData.descriptionMarkdown);
      fd.append("techStack", formData.techStack);
      fd.append("status", formData.status);
      fd.append("githubUrl", formData.githubUrl);
      fd.append("demoUrl", formData.demoUrl);
      fd.append("featured", formData.featured);
      fd.append("published", formData.published);
      fd.append("understanding", formData.understanding);
      fd.append("contribution", formData.contribution);
      if (editingId && existingImages.length > 0) {
        fd.append("existingImages", JSON.stringify(existingImages));
      }
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
      setFormData({ title: "", descriptionMarkdown: "", techStack: "", status: "idea", githubUrl: "", demoUrl: "", featured: false, published: true, understanding: "", contribution: "" });
      setExistingImages([]);
      setImagePreviews([]);
      setSelectedFiles([]);
      await load();
      alert(editingId ? "Project updated!" : "Project created!");
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
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
      published: project.published || false,
      understanding: project.understanding || "",
      contribution: project.contribution || ""
    });
    setExistingImages(project.images || []);
    setImagePreviews([]);
    setSelectedFiles([]);
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ title: "", descriptionMarkdown: "", techStack: "", status: "idea", githubUrl: "", demoUrl: "", featured: false, published: true, understanding: "", contribution: "" });
    setExistingImages([]);
    setImagePreviews([]);
    setSelectedFiles([]);
  }

  async function onDelete(id) {
    if (confirm("Delete this project?")) {
      await api.delete(`/projects/admin/${id}`);
      await load();
    }
  }

  async function togglePublish(id, currentStatus) {
    await api.put(`/projects/admin/${id}`, { published: !currentStatus });
    await load();
  }

  const statusBadge = (s) => {
    if (s === "completed") return "emerald";
    if (s === "in_progress") return "amber";
    return "purple";
  };

  return (
    <>
      <AdminHeader
        icon={<Star width="24" height="24" />}
        title="Projects"
        subtitle="Manage your portfolio projects"
        actions={
          editingId ? (
            <button onClick={handleCancel} className="admin-btn-ghost">
              <X width="16" height="16" /> Cancel Edit
            </button>
          ) : null
        }
      />

      {/* Create / Edit Form */}
      <div className="admin-card p-6 mb-8">
        <h2 className="admin-section-title mb-6">
          {editingId ? "Edit Project" : "New Project"}
        </h2>
        <form onSubmit={onCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Field label="Project Title *">
                <input name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="My Awesome Project" required className="admin-input" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Description (Markdown)">
                <textarea name="descriptionMarkdown" value={formData.descriptionMarkdown} onChange={(e) => setFormData({...formData, descriptionMarkdown: e.target.value})} placeholder="## About the project&#10;&#10;Describe what this project does..." rows={6} className="admin-textarea font-mono text-sm" />
              </Field>
            </div>
            <div>
              <Field label="Tech Stack (JSON array)">
                <input name="techStack" value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} placeholder='["React", "Node.js"]' className="admin-input font-mono text-sm" />
              </Field>
            </div>
            <div>
              <Field label="Status">
                <select name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="admin-select">
                  <option value="idea">Idea</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            </div>
            <div>
              <Field label="GitHub URL">
                <input name="githubUrl" value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} placeholder="https://github.com/..." className="admin-input" />
              </Field>
            </div>
            <div>
              <Field label="Demo URL">
                <input name="demoUrl" value={formData.demoUrl} onChange={(e) => setFormData({...formData, demoUrl: e.target.value})} placeholder="https://demo.example.com" className="admin-input" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Understanding">
                <textarea name="understanding" value={formData.understanding} onChange={(e) => setFormData({...formData, understanding: e.target.value})} placeholder="What you learned..." rows={3} className="admin-textarea" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Contribution">
                <textarea name="contribution" value={formData.contribution} onChange={(e) => setFormData({...formData, contribution: e.target.value})} placeholder="Your contributions..." rows={3} className="admin-textarea" />
              </Field>
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <Field label="Project Images">
                {editingId && existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-2">Current images (click X to remove):</p>
                    <div className="flex flex-wrap gap-3">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-700 group">
                          <img src={img.path} alt={`Project ${idx}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))} className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <X width="12" height="12" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-2">New images:</p>
                    <div className="flex flex-wrap gap-3">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-700">
                          <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {imagePreviews.length === 0 && (
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-indigo-500/40 transition-colors">
                    <input name="images" type="file" multiple accept="image/*" className="hidden" id="project-images" onChange={handleImageChange} />
                    <label htmlFor="project-images" className="cursor-pointer">
                      <div className="text-sm font-medium text-slate-300">Click to upload images</div>
                      <div className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB each</div>
                    </label>
                  </div>
                )}
                {(imagePreviews.length > 0 || existingImages.length > 0) && (
                  <button type="button" onClick={() => { clearImagePreviews(); setExistingImages([]); }} className="mt-2 text-sm text-red-400 hover:text-red-300">
                    Clear all images
                  </button>
                )}
              </Field>
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input name="featured" type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-300">Featured</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input name="published" type="checkbox" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-300">Published</span>
              </label>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="admin-btn-primary w-full py-4">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {editingId ? "Updating..." : "Creating..."}
                  </span>
                ) : editingId ? "Update Project" : "Create Project"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Projects List */}
      <h2 className="admin-section-title mb-4">Existing Projects ({list.length})</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : list.length === 0 ? (
        <EmptyState icon={<Star width="32" height="32" />} title="No projects yet" subtitle="Create your first one above!" />
      ) : (
        <div className="space-y-3">
          {list.map((p, idx) => (
            <div key={`project-${p.id}-${idx}`} className="admin-card admin-card-hover p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {p.images && p.images[0] ? (
                    <img src={p.images[0].path} alt={p.title} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                      <Star width="20" height="20" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                      {p.featured && <Badge tone="amber">Featured</Badge>}
                      <Badge tone={p.published ? "emerald" : "slate"}>{p.published ? "Published" : "Draft"}</Badge>
                      <Badge tone={statusBadge(p.status)}>{(p.status || "idea").replace("_", " ")}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>/{p.slug}</span>
                      {p.techStack && p.techStack.length > 0 && (
                        <span>{p.techStack.slice(0, 4).join(", ")}{p.techStack.length > 4 ? "..." : ""}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(p)} className="admin-btn-ghost admin-btn-sm">Edit</button>
                  <button onClick={() => togglePublish(p.id, p.published)} className="admin-btn-ghost admin-btn-sm">
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => onDelete(p.id)} className="admin-btn-danger admin-btn-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}