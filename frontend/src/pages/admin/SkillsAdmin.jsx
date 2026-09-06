import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { AdminHeader, Field, EmptyState, Badge } from "../../features/admin/ui/adminKit.jsx";
import { Code, Plus, X } from "../../shared/components/Icons.jsx";

export default function SkillsAdmin() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "", published: true });

  async function load() {
    try {
      const res = await api.get("/skills/admin");
      setList(res.data.docs || []);
    } catch (err) {
      console.error("Failed to load skills", err);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.published = data.published === "on";
    await api.post("/skills/admin", data);
    e.target.reset();
    await load();
  }

  async function onUpdate(e) {
    e.preventDefault();
    await api.put(`/skills/admin/${editingId}`, formData);
    setEditingId(null);
    setFormData({ name: "", category: "", published: true });
    await load();
  }

  async function onDelete(id) {
    if (confirm("Delete this skill?")) {
      try {
        await api.delete(`/skills/admin/${id}`);
        await load();
      } catch (err) {
        alert("Error: " + (err.response?.data?.message || err.message));
      }
    }
  }

  async function togglePublish(id, currentStatus) {
    await api.put(`/skills/admin/${id}`, { published: !currentStatus });
    await load();
  }

  function handleEdit(skill) {
    setEditingId(skill.id);
    setFormData({ name: skill.name, category: skill.category, published: skill.published });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ name: "", category: "", published: true });
  }

  const grouped = list.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <>
      <AdminHeader
        icon={<Code width="24" height="24" />}
        title="Skills Admin"
        subtitle="Manage your technical skills"
      />

      <div className="admin-card p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="admin-chip bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            {editingId ? <X width="18" height="18" /> : <Plus width="18" height="18" />}
          </div>
          <h2 className="admin-section-title">{editingId ? "Edit Skill" : "Add Skill"}</h2>
        </div>
        <form onSubmit={editingId ? onUpdate : onCreate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Skill Name">
              <input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Skill name" required className="admin-input" />
            </Field>
            <Field label="Category">
              <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="admin-select">
                <option value="">Select category</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">Mobile</option>
                <option value="Tooling">Tooling</option>
              </select>
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input name="published" type="checkbox" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-300">Published</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="admin-btn-primary flex-1 py-3">{editingId ? "Update" : "Add"}</button>
            {editingId && <button type="button" onClick={handleCancel} className="admin-btn-ghost px-5 py-3">Cancel</button>}
          </div>
        </form>
      </div>

      <h2 className="admin-section-title mb-4">Existing Skills</h2>
      {list.length === 0 ? (
        <EmptyState title="No skills yet" subtitle="Add your first skill above" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{category}</h3>
              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.id} className="admin-card admin-card-hover p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.published ? "bg-emerald-400" : "bg-slate-500"}`}></div>
                      <span className="font-medium text-white text-sm">{s.name}</span>
                      <Badge tone={s.published ? "emerald" : "slate"}>{s.published ? "Published" : "Draft"}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(s)} className="admin-btn-ghost admin-btn-sm">Edit</button>
                      <button onClick={() => togglePublish(s.id, s.published)} className="admin-btn-ghost admin-btn-sm">{s.published ? "Unpublish" : "Publish"}</button>
                      <button onClick={() => onDelete(s.id)} className="admin-btn-danger admin-btn-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}