import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export default function SkillsAdmin() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "", 
    published: true 
  });

  async function load() {
    try {
      const res = await api.get("/skills/admin");
      setList(res.data.docs || []);
    } catch (err) {
      console.error("Failed to load skills", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
        alert("Error deleting skill: " + (err.response?.data?.message || err.message));
      }
    }
  }

  async function togglePublish(id, currentStatus) {
    await api.put(`/skills/admin/${id}`, { published: !currentStatus });
    await load();
  }

  function handleEdit(skill) {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      published: skill.published
    });
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
    <div style={{ padding: 16 }}>
      <h1>Skills Admin</h1>
      
      {/* Add/Edit Form */}
      <form onSubmit={editingId ? onUpdate : onCreate} style={{ marginBottom: 24, padding: 16, border: "1px solid #ddd" }}>
        <h3>{editingId ? "Edit Skill" : "Add New Skill"}</h3>
        <div style={{ marginBottom: 8 }}>
          <input 
            name="name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Skill name" 
            required 
            style={{ padding: 8, width: "100%" }} 
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <select 
            name="category" 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required 
            style={{ padding: 8, width: "100%" }}
          >
            <option value="">Select category</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="DevOps">DevOps</option>
            <option value="Tooling">Tooling</option>
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            <input 
              name="published" 
              type="checkbox" 
              checked={formData.published}
              onChange={(e) => setFormData({...formData, published: e.target.checked})}
            /> Published
          </label>
        </div>
        <div>
          <button type="submit">{editingId ? "Update Skill" : "Add Skill"}</button>
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <h3>Existing Skills</h3>
      {Object.entries(grouped).map(([category, skills]) => (
        <div key={category} style={{ marginBottom: 24 }}>
          <h4>{category}</h4>
          <ul>
            {skills.map((s) => (
              <li key={s.id} style={{ marginBottom: 8, padding: 8, border: "1px solid #eee" }}>
                {s.name} - {s.published ? "Published" : "Draft"}
                {" "}
                <button 
                  onClick={() => handleEdit(s)} 
                  style={{ marginLeft: 8, padding: "4px 8px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Edit
                </button>
                {" "}
                <button 
                  onClick={() => togglePublish(s.id, s.published)} 
                  style={{ marginLeft: 4, padding: "4px 8px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}
                >
                  {s.published ? "Unpublish" : "Publish"}
                </button>
                {" "}
                <button 
                  onClick={() => onDelete(s.id)}
                  style={{ marginLeft: 4, padding: "4px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}