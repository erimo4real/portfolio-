import React, { useEffect, useState } from "react";
import { api, getApiUrl } from "../../lib/api.js";
import { AdminHeader, Field } from "../../features/admin/ui/adminKit.jsx";
import { User } from "../../shared/components/Icons.jsx";

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [removedImage, setRemovedImage] = useState(false);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return getApiUrl() + path;
  };

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  async function load() {
    try {
      const res = await api.get("/profile/admin/main");
      setProfile(res.data || {});
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const formElement = e.target;
    const headlineValue = formElement.elements['headline']?.value;
    if (!headlineValue || headlineValue.trim() === '') {
      alert('Headline is required');
      setSaving(false);
      return;
    }
    const fd = new FormData(formElement);
    const imageInput = formElement.elements['image'];
    if (!imageInput.files[0]) fd.delete('image');
    if (removedImage && !imageInput.files[0]) fd.append('removeImage', 'true');
    try {
      if (profile?.id) {
        await api.put(`/profile/admin/${profile.id}`, fd);
      } else {
        await api.post("/profile/admin", fd);
      }
      await load();
      setImagePreview(null);
      alert("Profile saved!");
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <>
      <AdminHeader
        icon={<User width="24" height="24" />}
        title="Profile Settings"
        subtitle="Manage your portfolio profile"
      />

      <form onSubmit={onSubmit} key={profile?.id || 'new'}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Form */}
          <div className="admin-card p-6">
            <h2 className="admin-section-title mb-6">Profile Information</h2>
            <div className="space-y-5">
              <Field label="Name" hint="Appears in the hero section">
                <input name="name" value={profile?.name || ""} onChange={(e) => setProfile({...profile, name: e.target.value})} placeholder="e.g., John Doe" className="admin-input" />
              </Field>
              <Field label="Headline" hint="Your main title" required>
                <input name="headline" value={profile?.headline || ""} onChange={(e) => setProfile({...profile, headline: e.target.value})} placeholder="Full Stack Developer | UI/UX Designer" className="admin-input" />
              </Field>
              <Field label="Bio (Markdown)" hint="Use markdown for formatting">
                <textarea name="bioMarkdown" value={profile?.bioMarkdown || ""} onChange={(e) => setProfile({...profile, bioMarkdown: e.target.value})} rows={8} placeholder="Write your bio in markdown..." className="admin-textarea font-mono text-sm" />
              </Field>
              <Field label="Status">
                <select name="status" value={profile?.status || "draft"} onChange={(e) => setProfile({...profile, status: e.target.value})} className="admin-select">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>
              <button type="submit" disabled={saving} className="admin-btn-primary w-full py-4">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : "Save Profile"}
              </button>
            </div>
          </div>

          {/* Right - Image */}
          <div className="admin-card p-6">
            <h2 className="admin-section-title mb-6">Profile Image</h2>
            <div className="space-y-5">
              <div className="relative">
                <div className="aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : profile?.imagePath ? (
                    <img src={getImageUrl(profile.imagePath)} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <User width="64" height="64" />
                    </div>
                  )}
                </div>
                <input name="image" type="file" accept="image/*" className="hidden" id="profile-image-upload" onChange={handleImageChange} />
                <label htmlFor="profile-image-upload" className="absolute bottom-4 left-1/2 -translate-x-1/2 admin-btn-primary text-sm px-4 py-2 cursor-pointer">
                  {imagePreview || profile?.imagePath ? "Change Image" : "Upload Image"}
                </label>
              </div>
              <div className="text-center text-sm text-slate-400">
                {imagePreview ? <span className="text-emerald-400">New image selected</span> : profile?.imagePath ? <span>Current image loaded</span> : <span>No image uploaded yet</span>}
              </div>
              {(imagePreview || profile?.imagePath) && (
                <div className="text-center">
                  <button type="button" onClick={() => { setImagePreview(null); setRemovedImage(true); setProfile({ ...profile, imagePath: null }); }} className="text-sm text-red-400 hover:text-red-300">
                    Remove Image
                  </button>
                </div>
              )}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <h4 className="font-semibold text-amber-300 mb-2">Tips for a great photo</h4>
                <ul className="text-sm text-amber-200/70 space-y-1">
                  <li>Use a clear, well-lit photo</li>
                  <li>Show your face clearly</li>
                  <li>Square or 1:1 aspect ratio</li>
                  <li>Professional but friendly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}