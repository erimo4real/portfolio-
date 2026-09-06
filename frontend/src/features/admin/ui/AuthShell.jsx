import React from "react";

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-950 via-[#0b1120] to-slate-950">
      {/* Ambient gradient glows */}
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute -bottom-48 -left-40 w-[32rem] h-[32rem] rounded-full bg-purple-600/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 w-80 h-80 rounded-full bg-pink-500/10 blur-[110px] pointer-events-none"></div>

      {/* Floating decorative circles */}
      <div className="absolute top-24 right-16 w-24 h-24 rounded-full border border-indigo-400/20 animate-float pointer-events-none"></div>
      <div className="absolute bottom-28 left-14 w-16 h-16 rounded-full border border-purple-400/20 animate-float [animation-delay:2s] pointer-events-none"></div>
      <div className="absolute top-1/2 -left-10 w-20 h-20 rounded-full border border-pink-400/10 animate-float [animation-delay:3.5s] pointer-events-none"></div>
      <div className="absolute bottom-16 right-24 w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-400/20 animate-float [animation-delay:1.2s] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-900/50">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}