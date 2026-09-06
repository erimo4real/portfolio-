import React, { useEffect, useState } from "react";
import { api } from "../../../lib/api.js";
import { AdminHeader, AdminStat, Field, EmptyState, Switch } from "./adminKit.jsx";
import { Code, Plus, X } from "../../../shared/components/Icons.jsx";

const CATEGORIES = ["Frontend", "Backend", "Mobile", "DevOps", "Tooling"];

const CATEGORY_TONES = {
  Frontend: { chip: "bg-pink-500/10 text-pink-300", badge: "admin-badge-pink", dot: "bg-pink-400" },
  Backend: { chip: "bg-blue-500/10 text-blue-300", badge: "admin-badge-blue", dot: "bg-blue-400" },
  Mobile: { chip: "bg-green-500/10 text-green-300", badge: "admin-badge-green", dot: "bg-green-400" },
  DevOps: { chip: "bg-purple-500/10 text-purple-300", badge: "admin-badge-purple", dot: "bg-purple-400" },
  Tooling: { chip: "bg-amber-500/10 text-amber-300", badge: "admin-badge-amber", dot: "bg-amber-400" }
};

export default function SkillsManagement() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "Frontend", published: true });
  const [expandedCategories, setExpandedCategories] = useState([...CATEGORIES]);

  const loadSkills = async () => {
    try {
      const res = await api.get("/skills/admin");
      setSkills(res.data.docs || []);
    } catch (err) {
      console.error("Failed to load skills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSkills(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/skills/admin/${editingId}`, formData);
      } else {
        await api.post("/skills/admin", formData);
      }
      setFormData({ name: "", category: "Frontend", published: true });
      setEditingId(null);
      await loadSkills();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setFormData({ name: skill.name, category: skill.category, published: skill.published });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/admin/${id}`);
      await loadSkills();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const skillsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  const stats = {
    total: skills.length,
    published: skills.filter(s => s.published).length,
    draft: skills.filter(s => !s.published).length
  };

  return (
    <>
      <AdminHeader
        icon={<Code width="24" height="24" />}
        title="Skills Management"
        subtitle="Manage your technical skills and expertise"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStat icon={<Code width="20" height="20" />} label="Total" value={stats.total} tone="indigo" loading={loading} />
        <AdminStat icon={<Code width="20" height="20" />} label="Published" value={stats.published} tone="emerald" loading={loading} />
        <AdminStat icon={<Code width="20" height="20" />} label="Drafts" value={stats.draft} tone="amber" loading={loading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="xl:col-span-1">
          <div className="admin-card p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="admin-chip bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {editingId ? <X width="18" height="18" /> : <Plus width="18" height="18" />}
              </div>
              <h2 className="admin-section-title">{editingId ? "Edit Skill" : "Add Skill"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Skill Name">
                <input type="text" required className="admin-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. React, Node.js, AWS" />
              </Field>
              <Field label="Category">
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} type="button" onClick={() => setFormData({ ...formData, category: cat })} className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${formData.category === cat ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </Field>
              <Switch checked={formData.published} onChange={(v) => setFormData({ ...formData, published: v })} label={formData.published ? "Published" : "Draft"} hint={formData.published ? "Visible on your portfolio" : "Hidden from public view"} />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="admin-btn-primary flex-1 py-3">
                  {editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData({ name: "", category: "Frontend", published: true }); }} className="admin-btn-ghost px-5 py-3">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="xl:col-span-2">
          <div className="space-y-3">
            {CATEGORIES.map((category) => {
              const categorySkills = skillsByCategory[category] || [];
              const isExpanded = expandedCategories.includes(category);
              const tones = CATEGORY_TONES[category];

              return (
                <div key={category} className="admin-card overflow-hidden">
                  <button onClick={() => toggleCategory(category)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`admin-chip ${tones.chip}`}>{category.charAt(0)}</div>
                      <div className="text-left">
                        <h3 className="font-bold text-white">{category}</h3>
                        <span className="text-xs text-slate-400">{categorySkills.length} skill{categorySkills.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {categorySkills.filter(s => s.published).length > 0 && (
                        <span className="px-2 py-1 bg-emerald-500/10 rounded-lg text-xs font-medium text-emerald-300 border border-emerald-500/20">
                          {categorySkills.filter(s => s.published).length} live
                        </span>
                      )}
                      <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && categorySkills.length > 0 && (
                    <div className="p-3 border-t border-slate-700/50">
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill, idx) => (
                          <div key={`${category}-${skill.id}-${idx}`} className={`group flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:shadow-md ${skill.published ? "bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30" : "bg-slate-800/30 border-slate-700/30 opacity-60"}`}>
                            <div className={`w-2 h-2 rounded-full ${skill.published ? "bg-emerald-400" : "bg-slate-500"}`}></div>
                            <span className="font-medium text-slate-200 text-sm">{skill.name}</span>
                            {!skill.published && <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">draft</span>}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                              <button onClick={() => handleEdit(skill)} className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="Edit">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={() => handleDelete(skill.id)} className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isExpanded && categorySkills.length === 0 && (
                    <div className="px-6 py-6 text-center text-slate-500 border-t border-slate-700/50">
                      <p className="text-xs">No {category.toLowerCase()} skills yet</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {skills.length === 0 && !loading && (
            <EmptyState title="No skills yet" subtitle="Add your first skill using the form on the left" />
          )}
        </div>
      </div>
    </>
  );
}