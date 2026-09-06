import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchProjects } from "../store/slices/projects.js";
import PageHero from "../shared/components/PageHero.jsx";
import ProjectCard from "../shared/components/ProjectCard.jsx";
import { fadeUp, scaleIn, staggerContainer, viewPort } from "../lib/animations.js";

export default function Projects() {
  const dispatch = useDispatch();
  const projects = useSelector((s) => s.projects.list);
  const status = useSelector((s) => s.projects.status);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const stats = {
    total: projects?.length || 0,
    featured: projects?.filter(p => p.featured).length || 0,
    completed: projects?.filter(p => p.status === "completed").length || 0
  };

  const statCards = [
    { value: stats.total, label: "Total Projects", gradient: "from-primary-600 to-purple-600" },
    { value: stats.completed, label: "Completed", gradient: "from-emerald-500 to-teal-600" },
    { value: stats.featured, label: "Featured", gradient: "from-amber-500 to-orange-600" }
  ];

  return (
    <div>
      <PageHero
        badge="Projects"
        title="My Work"
        subtitle="A showcase of projects built with care — from concept to production"
      />

      {/* Stats Bar */}
      <section className="bg-white py-12 md:py-16 pb-0">
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewPort}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          >
            {statCards.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} p-6 md:p-8 rounded-2xl shadow-xl text-white`}
              >
                <div className="text-3xl md:text-4xl font-extrabold mb-1">{stat.value}</div>
                <div className="text-white/90 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container">
          {status === "loading" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-96">
                  <div className="w-full h-52 bg-slate-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-slate-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-20 bg-slate-100 rounded mb-4 animate-pulse"></div>
                    <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !projects || projects.length === 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center text-5xl">
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No projects yet</h2>
              <p className="text-slate-500 text-lg">Check back later for exciting projects!</p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {projects.map((project, index) => (
                <motion.div key={project.id} variants={scaleIn}>
                  <ProjectCard project={project} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}