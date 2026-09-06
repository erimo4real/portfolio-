import React from "react";

const STAT_TONES = {
  indigo: { chip: "bg-indigo-500/10 text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white" },
  pink: { chip: "bg-pink-500/10 text-pink-300 group-hover:bg-pink-500 group-hover:text-white" },
  amber: { chip: "bg-amber-500/10 text-amber-300 group-hover:bg-amber-500 group-hover:text-white" },
  emerald: { chip: "bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white" },
  violet: { chip: "bg-violet-500/10 text-violet-300 group-hover:bg-violet-500 group-hover:text-white" },
  red: { chip: "bg-red-500/10 text-red-300 group-hover:bg-red-500 group-hover:text-white" },
  blue: { chip: "bg-blue-500/10 text-blue-300 group-hover:bg-blue-500 group-hover:text-white" },
  cyan: { chip: "bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white" }
};

const BADGE_TONES = {
  emerald: "admin-badge-emerald",
  amber: "admin-badge-amber",
  red: "admin-badge-red",
  indigo: "admin-badge-indigo",
  purple: "admin-badge-purple",
  blue: "admin-badge-blue",
  pink: "admin-badge-pink",
  green: "admin-badge-green",
  slate: "admin-badge-slate"
};

export function AdminHeader({ icon, title, subtitle, actions, iconClass = "from-indigo-600 via-purple-600 to-pink-500" }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        {icon && (
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconClass} flex items-center justify-center text-white shadow-lg shadow-indigo-900/30`}>
            {icon}
          </div>
        )}
        <div>
          <h1 className="admin-page-title">{title}</h1>
          {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}

export function AdminStat({ icon, label, value, tone = "indigo", loading }) {
  const toneStyle = STAT_TONES[tone] || STAT_TONES.indigo;
  return (
    <div className="admin-card admin-card-hover group p-5">
      <div className="flex items-center gap-4">
        <div className={`admin-chip ${toneStyle.chip}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="text-2xl font-extrabold text-white mt-0.5">{loading ? "..." : value}</p>
        </div>
      </div>
    </div>
  );
}

export function Badge({ children, tone = "slate", className = "" }) {
  return <span className={`admin-badge ${BADGE_TONES[tone] || BADGE_TONES.slate} ${className}`}>{children}</span>;
}

export function Field({ label, hint, children }) {
  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
    </div>
  );
}

export function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="min-h-[55vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon = null, title, subtitle, children }) {
  return (
    <div className="admin-card p-12 text-center">
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export function Switch({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-slate-600"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        ></span>
      </button>
      <div>
        <span className="text-sm font-semibold text-slate-200">{label}</span>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}