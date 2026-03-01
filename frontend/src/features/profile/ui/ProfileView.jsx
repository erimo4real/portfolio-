import React, { useEffect, useState } from "react";
import { getProfile } from "../application/getProfile.ts";
import { marked } from "marked";

export default function ProfileView() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const p = await getProfile();
        setData(p);
        setStatus("succeeded");
      } catch {
        setStatus("failed");
      }
    })();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600 font-bold">
        Failed to load profile. Please try again later.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold">
        Profile information is not available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="h-48 bg-gradient-to-r from-primary-600 to-indigo-600"></div>
        
        <div className="px-8 pb-12">
          <div className="relative -mt-24 mb-8 flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-48 h-48 rounded-3xl border-8 border-white bg-slate-200 overflow-hidden shadow-lg">
              {data.imagePath ? (
                <img 
                  alt="profile" 
                  src={data.imagePath} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
            <div className="flex-grow pb-4">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                About Me
              </h1>
              <p className="text-xl text-primary-600 font-semibold leading-tight">
                {data.headline}
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none prose-lg">
            <div 
              className="text-slate-600 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: marked.parse(data.bioMarkdown || "") }} 
            />
          </div>

          <div className="mt-12 pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-slate-900">Passion</h3>
              <p className="text-sm text-slate-500">Building scalable & beautiful web apps</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-bold text-slate-900">Innovation</h3>
              <p className="text-sm text-slate-500">Exploring new tech & patterns</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-bold text-slate-900">Collaboration</h3>
              <p className="text-sm text-slate-500">Team player with strong ownership</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
