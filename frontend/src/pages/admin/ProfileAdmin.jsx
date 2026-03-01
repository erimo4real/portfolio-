import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { Link } from "react-router-dom";

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
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

  useEffect(() => {
    load();
  }, []);

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
    if (!imageInput.files[0]) {
      fd.delete('image');
    }
    
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
      console.error("Error saving profile:", err);
      alert(`Error saving profile: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading profile...</p>
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
            <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
            <p className="text-slate-500 text-sm">Manage your portfolio profile</p>
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
        <form onSubmit={onSubmit} key={profile?.id || 'new'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input 
                    name="name" 
                    value={profile?.name || ""} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">This appears in the hero section</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Headline</label>
                  <input 
                    name="headline" 
                    value={profile?.headline || ""} 
                    onChange={(e) => setProfile({...profile, headline: e.target.value})}
                    placeholder="e.g., Full Stack Developer | UI/UX Designer"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">This appears as your main title</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bio (Markdown)</label>
                  <textarea 
                    name="bioMarkdown" 
                    value={profile?.bioMarkdown || ""} 
                    onChange={(e) => setProfile({...profile, bioMarkdown: e.target.value})}
                    rows={8} 
                    placeholder="Write your bio in markdown..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use markdown for formatting</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select 
                    name="status" 
                    value={profile?.status || "draft"}
                    onChange={(e) => setProfile({...profile, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </span>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Image Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Image</h2>
              
              <div className="space-y-5">
                {/* Current Image Preview or Preview of New Image */}
                {imagePreview ? (
                  <div className="relative">
                    <div className="aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-slate-100">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center mt-4 text-sm text-slate-500">
                      New image preview
                    </div>
                  </div>
                ) : profile?.imagePath ? (
                  <div className="relative">
                    <div className="aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-slate-100">
                      <img 
                        src={profile.imagePath} 
                        alt="Current profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center mt-4 text-sm text-slate-500">
                      Current profile image
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square max-w-xs mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <div className="text-6xl mb-2">👤</div>
                      <div className="text-sm">No image uploaded</div>
                    </div>
                  </div>
                )}

                {/* Upload New Image */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Upload New Image</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                    <input 
                      name="image" 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      id="profile-image-upload"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="profile-image-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📁</div>
                      <div className="text-sm font-medium text-slate-600">Click to upload</div>
                      <div className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB</div>
                    </label>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">💡 Tips for a great photo</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Use a clear, well-lit photo</li>
                    <li>• Show your face clearly</li>
                    <li>• Use a square or 1:1 aspect ratio</li>
                    <li>• Professional but friendly appearance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}