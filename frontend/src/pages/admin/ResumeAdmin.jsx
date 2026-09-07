import React, { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api.js";
import { AdminHeader, AdminStat, EmptyState, Badge } from "../../features/admin/ui/adminKit.jsx";
import { File, Plus, X } from "../../shared/components/Icons.jsx";

export default function ResumeAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  function revokePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }

  async function openPreview(r) {
    setPreviewResume(r);
    setPreviewUrl(null);
    setPreviewError(false);
    if (/\.pdf(\?|$)/i.test(r.path)) {
      setPreviewUrl(r.path);
      return;
    }
    setPreviewLoading(true);
    try {
      const res = await fetch(r.path);
      if (!res.ok) throw new Error("fetch failed");
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: "application/pdf" });
      revokePreview();
      previewUrlRef.current = URL.createObjectURL(blob);
      setPreviewUrl(previewUrlRef.current);
    } catch (err) {
      console.error("Failed to load resume preview", err);
      setPreviewError(true);
    } finally {
      setPreviewLoading(false);
    }
  }

  function closePreview() {
    revokePreview();
    setPreviewUrl(null);
    setPreviewError(false);
    setPreviewResume(null);
  }

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

  useEffect(() => { load(); }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  }

  async function onUpload(e) {
    e.preventDefault();
    setUploading(true);
    const fd = new FormData(e.target);
    try {
      await api.post("/resume/admin", fd);
      e.target.reset();
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      if (previewResume?.id === id) closePreview();
      await load();
    }
  }

  async function setActive(id) {
    await api.post(`/resume/admin/${id}/activate`);
    await load();
  }

  const activeResume = list.find(r => r.active);

  return (
    <>
      <AdminHeader
        icon={<File width="24" height="24" />}
        title="Resume Management"
        subtitle="Manage your resume versions"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStat icon={<File width="20" height="20" />} label="Total Resumes" value={list.length} tone="indigo" loading={loading} />
        <AdminStat icon={<File width="20" height="20" />} label="Active" value={activeResume ? "1" : "0"} tone="emerald" loading={loading} />
        <AdminStat icon={<File width="20" height="20" />} label="Version" value={activeResume?.version || "\u2014"} tone="slate" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="admin-chip bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <Plus width="20" height="20" />
            </div>
            <h2 className="admin-section-title">Upload New Resume</h2>
          </div>
          <form onSubmit={onUpload} className="space-y-5">
            <div>
              <label className="admin-label">Version Name</label>
              <input name="version" placeholder="e.g., 2024-v1, Senior-Dev-2024" required className="admin-input" />
            </div>
            <div>
              <label className="admin-label">PDF File</label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${selectedFile ? "border-emerald-400/40 bg-emerald-500/5" : "border-slate-600 hover:border-indigo-500/40 bg-slate-800/30"}`}>
                <input name="file" type="file" accept=".pdf" required className="hidden" id="resume-upload" ref={fileInputRef} onChange={handleFileChange} />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                        <File width="24" height="24" />
                      </div>
                      <div className="text-sm font-semibold text-emerald-300">{selectedFile.name}</div>
                      <div className="text-xs text-emerald-400/60 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB \u2022 Click to change</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-2 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-slate-400">
                        <Plus width="20" height="20" />
                      </div>
                      <div className="text-sm font-medium text-slate-300">Click to upload PDF</div>
                      <div className="text-xs text-slate-500 mt-1">PDF only, up to 5MB</div>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <button type="submit" disabled={uploading} className="admin-btn-primary w-full py-4">
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </span>
              ) : "Upload Resume"}
            </button>
          </form>
        </div>

        {/* Existing Resumes */}
        <div className="admin-card p-6">
          <h2 className="admin-section-title mb-6">Existing Resumes</h2>
          {list.length === 0 ? (
            <EmptyState title="No resumes uploaded yet" />
          ) : (
            <div className="space-y-3">
              {list.map((r, idx) => (
                <div key={`resume-${r.id}-${idx}`} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                      <File width="18" height="18" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{r.version}</div>
                      <div className="text-sm">
                        {r.active ? <Badge tone="emerald">Active</Badge> : <span className="text-slate-400">Inactive</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openPreview(r)} className="admin-btn-ghost admin-btn-sm">Preview</button>
                    <a href={r.path} target="_blank" rel="noreferrer" className="admin-btn-ghost admin-btn-sm">View</a>
                    {!r.active && <button onClick={() => setActive(r.id)} className="admin-btn-primary admin-btn-sm">Set Active</button>}
                    <button onClick={() => onDelete(r.id)} className="admin-btn-danger admin-btn-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <File width="18" height="18" />
                </div>
                <div>
                  <div className="font-semibold text-white">{previewResume.version}</div>
                  <div className="text-sm">
                    {previewResume.active ? <Badge tone="emerald">Active</Badge> : <span className="text-slate-400">Inactive</span>}
                  </div>
                </div>
              </div>
              <button onClick={closePreview} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X width="24" height="24" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-white">
              {previewLoading ? (
                <div className="flex flex-col items-center justify-center h-full bg-slate-100">
                  <div className="w-10 h-10 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="text-sm text-slate-500 mt-3">Loading preview...</div>
                </div>
              ) : previewError ? (
                <div className="flex flex-col items-center justify-center h-full bg-slate-100">
                  <div className="text-amber-600 font-medium">Could not load preview inline</div>
                  <a href={previewResume.path} target="_blank" rel="noreferrer" className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors">Open PDF in new tab</a>
                </div>
              ) : (
                <iframe src={previewUrl} className="w-full h-full" title="Resume Preview" />
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700 bg-slate-900">
              <button onClick={closePreview} className="admin-btn-ghost">Close</button>
              {!previewResume.active && (
                <button onClick={() => { setActive(previewResume.id); closePreview(); }} className="admin-btn-primary bg-emerald-600 hover:bg-emerald-500">
                  Set as Active
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}