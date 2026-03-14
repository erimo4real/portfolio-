import React, { useEffect, useState } from "react";
import { api } from "../../../lib/api.js";
import { Link } from "react-router-dom";

const CATEGORIES = ["Frontend", "Backend", "Mobile", "DevOps", "Tooling"];

const CATEGORY_ICONS = {
  Frontend: "🎨",
  Backend: "⚙️",
  Mobile: "📱",
  DevOps: "🚀",
  Tooling: "🛠️"
};

const CATEGORY_COLORS = {
  Frontend: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", icon: "bg-pink-100" },
  Backend: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "bg-blue-100" },
  Mobile: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "bg-green-100" },
  DevOps: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "bg-purple-100" },
  Tooling: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "bg-amber-100" }
};

export default function SkillsManagement() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "Frontend", published: true });
  const [expandedCategories, setExpandedCategories] = useState(["Frontend", "Backend", "Mobile", "DevOps", "Tooling"]);

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

  useEffect(() => {
    loadSkills();
  }, []);

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
      alert("Error saving skill: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setFormData({ name: skill.name, category: skill.category, published: skill.published });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/skills/admin/${id}`);
      await loadSkills();
    } catch (err) {
      alert("Error deleting skill: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading skills...</p>
        </div>
      </div>
    );
  }

  // Group skills by category
  const skillsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  const stats = {
    total: skills.length,
    published: skills.filter(s => s.published).length,
    draft: skills.filter(s => !s.published).length
  };

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Skills Management</h1>
            <p className="text-slate-500 text-sm">Manage your technical skills and expertise</p>
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
            <div className="text-slate-500">Total Skills</div>
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
                {editingId ? '✏️' : '➕'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Skill" : "Add New Skill"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Skill Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React, Node.js, AWS"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.category === cat
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.published ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, published: !formData.published })}
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                      formData.published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700">
                    {formData.published ? 'Published' : 'Draft'}
                  </span>
                  <p className="text-xs text-slate-500">
                    {formData.published ? 'Visible on your portfolio' : 'Hidden from public view'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-grow bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  {editingId ? "Update Skill" : "Create Skill"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: "", category: "Frontend", published: true });
                    }}
                    className="px-5 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

          {/* List Column */}
          <div className="xl:col-span-2">
          {/* Skills Categories */}
          <div className="space-y-4">
            {CATEGORIES.map((category) => {
              const categorySkills = skillsByCategory[category] || [];
              const isExpanded = expandedCategories.includes(category);
              const colors = CATEGORY_COLORS[category];
              
              return (
                <div key={category} className={`bg-white rounded-2xl shadow-sm border ${colors.border} overflow-hidden hover:shadow-md transition-shadow`}>
                  {/* Category Header */}
                  <button 
                    onClick={() => toggleCategory(category)}
                    className={`w-full px-5 py-4 ${colors.bg} flex items-center justify-between hover:brightness-95 transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl ${colors.icon} ${colors.text} flex items-center justify-center text-lg shadow-sm`}>
                        {CATEGORY_ICONS[category]}
                      </span>
                      <div className="text-left">
                        <h3 className={`font-bold ${colors.text}`}>{category}</h3>
                        <span className="text-xs text-slate-500">
                          {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {categorySkills.filter(s => s.published).length > 0 && (
                        <span className="px-2 py-1 bg-white/80 rounded-lg text-xs font-medium text-emerald-600 shadow-sm">
                          {categorySkills.filter(s => s.published).length} live
                        </span>
                      )}
                      <svg 
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {/* Skills List */}
                  {isExpanded && categorySkills.length > 0 && (
                    <div className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill, idx) => (
                          <div 
                            key={`${category}-${skill.id}-${idx}`} 
                            className={`group flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:shadow-md ${
                              skill.published 
                                ? 'bg-white border-slate-200 hover:border-emerald-300' 
                                : 'bg-slate-50 border-slate-200 opacity-75'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${skill.published ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <span className="font-medium text-slate-700 text-sm">{skill.name}</span>
                            {!skill.published && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded">
                                draft
                              </span>
                            )}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                              <button
                                onClick={() => handleEdit(skill)}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                title="Edit"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(skill.id)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                title="Delete"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Empty State for Category */}
                  {isExpanded && categorySkills.length === 0 && (
                    <div className="px-6 py-6 text-center text-slate-400">
                      <div className="text-2xl mb-1">📭</div>
                      <p className="text-xs">No {category.toLowerCase()} skills</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
                    
          {skills.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-4xl">
                🛠️
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No skills yet</h3>
              <p className="text-slate-500 mb-6">Add your first skill to showcase your expertise</p>
              <div className="text-sm text-slate-400">
                Use the form on the left to get started
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
