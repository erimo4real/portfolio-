import React, { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api.js";
import { Link } from "react-router-dom";

export default function ResumeAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const fileInputRef = useRef(null);

  async function load() {
    try {
      const res = await api.get("/resume/admin");
      setList(res.data.docs || []);
    } catch (err) {
      console.error("Failed to load resumes", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  async function onUpload(e) {
    e.preventDefault();
    setUploading(true);
    const fd = new FormData(e.target);
    try {
      await api.post("/resume/admin", fd);
      e.target.reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await load();
      alert("Resume uploaded!");
    } catch (err) {
      alert("Error uploading resume");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id) {
    if (confirm("Delete this resume?")) {
      await api.delete(`/resume/admin/${id}`);
      if (previewResume?.id === id) {
        setPreviewResume(null);
      }
      await load();
    }
  }

  async function setActive(id) {
    await api.post(`/resume/admin/${id}/activate`);
    await load();
  }

  function openPreview(resume) {
    setPreviewResume(resume);
  }

  function closePreview() {
    setPreviewResume(null);
  }

  const activeResume = list.find(r => r.active);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading resumes...</p>
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
            <h1 className="text-2xl font-bold text-slate-900">Resume Management</h1>
            <p className="text-slate-500 text-sm">Manage your resume versions</p>
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
            <div className="text-3xl font-bold text-indigo-600">{list.length}</div>
            <div className="text-slate-500">Total Resumes</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-3xl font-bold text-emerald-600">{activeResume ? "1" : "0"}</div>
            <div className="text-slate-500">Active Resume</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-3xl font-bold text-slate-400">{activeResume?.version || "-"}</div>
            <div className="text-slate-500">Current Version</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
                ⬆️
              </div>
              <h2 className="text-xl font-bold text-slate-800">Upload New Resume</h2>
            </div>
            <form onSubmit={onUpload} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Version Name</label>
                <input 
                  name="version" 
                  placeholder="e.g., 2024-v1, Senior-Dev-2024" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">PDF File</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer bg-slate-50 ${selectedFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-indigo-400'}`}>
                  <input 
                    name="file" 
                    type="file" 
                    accept=".pdf" 
                    required 
                    className="hidden" 
                    id="resume-upload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-3">
                          ✅
                        </div>
                        <div className="text-sm font-semibold text-emerald-700">{selectedFile.name}</div>
                        <div className="text-xs text-emerald-600 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to change</div>
                      </div>
                      ) : (
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-sm font-medium text-slate-600">Click to upload PDF</div>
                        <div className="text-xs text-slate-400 mt-1">PDF files only, up to 5MB</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  "Upload Resume"
                )}
              </button>
            </form>
          </div>

          {/* Existing Resumes */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Existing Resumes</h2>
            {list.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📁</div>
                <p className="text-slate-500">No resumes uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {list.map((r, idx) => (
                  <div key={`resume-${r.id}-${idx}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xl">
                        📄
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{r.version}</div>
                        <div className="text-sm text-slate-500">
                          {r.active ? (
                            <span className="text-emerald-600 font-medium">● Active</span>
                          ) : (
                            "Inactive"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openPreview(r)}
                        className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Preview
                      </button>
                      <a 
                        href={r.path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        View
                      </a>
                      {!r.active && (
                        <button 
                          onClick={() => setActive(r.id)}
                          className="px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          Set Active
                        </button>
                      )}
                      <button 
                        onClick={() => onDelete(r.id)}
                        className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xl">
                  📄
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{previewResume.version}</div>
                  <div className="text-sm text-slate-500">
                    {previewResume.active ? (
                      <span className="text-emerald-600 font-medium">● Active</span>
                    ) : (
                      "Inactive"
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={closePreview}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe 
                src={previewResume.path} 
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button 
                onClick={closePreview}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              {!previewResume.active && (
                <button 
                  onClick={() => {
                    setActive(previewResume.id);
                    closePreview();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Set as Active
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
