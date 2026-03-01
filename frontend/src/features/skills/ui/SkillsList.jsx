import React, { useEffect, useState } from "react";
import { getSkills } from "../application/getSkills.ts";

const CATEGORY_ICONS = {
  Frontend: "🎨",
  Backend: "⚙️",
  DevOps: "☁️",
  Tooling: "🛠️"
};

export default function SkillsList() {
  const [groups, setGroups] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const skillsData = await getSkills();
        
        // Check if skillsData is already grouped (object) or needs grouping (array)
        let groupedSkills = {};
        if (Array.isArray(skillsData)) {
          // Group skills by category
          groupedSkills = skillsData.reduce((acc, skill) => {
            if (!acc[skill.category]) {
              acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
          }, {});
        } else if (typeof skillsData === 'object' && skillsData !== null) {
          // Already grouped by the backend
          groupedSkills = skillsData;
        } else {
          console.error("Expected skillsData to be an array or object, got:", typeof skillsData, skillsData);
        }
        setGroups(groupedSkills);
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
        Failed to load skills.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Technical Expertise</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          A comprehensive overview of my technical skills and the technologies I work with daily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.entries(groups).map(([cat, items]) => (
          <div key={cat} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{CATEGORY_ICONS[cat] || "🚀"}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              {cat}
              <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </h3>
            <ul className="space-y-3">
              {items.map((s) => (
                <li key={s.id || s.name} className="flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:scale-150 transition-transform"></span>
                  <span className="text-slate-600 font-medium group-hover:text-primary-600 transition-colors">
                    {s.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Always Learning</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            The tech world moves fast. I'm constantly exploring new tools, frameworks, and patterns to stay at the forefront of modern web development.
          </p>
        </div>
      </div>
    </div>
  );
}
