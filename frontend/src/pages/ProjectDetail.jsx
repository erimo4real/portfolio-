import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProjectDetail } from "../store/slices/projects.js";
import { marked } from "marked";
import PageHero from "../shared/components/PageHero.jsx";
import { ArrowLeft, GitHub, ExternalLink } from "../shared/components/Icons.jsx";
import { fadeUp, scaleIn, staggerContainer, viewPort } from "../lib/animations.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((s) => s.projects.detail);

  useEffect(() => {
    dispatch(fetchProjectDetail(slug));
  }, [dispatch, slug]);

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="spinner"></div>
      </div>
    );
  }

  const renderMarkdown = (md) => (
    <div
      className="blog-article"
      dangerouslySetInnerHTML={{ __html: marked.parse(md || "") }}
    />
  );

  return (
    <div>
      <PageHero
        badge="Project"
        title={detail.title}
        backLink={{ to: "/", label: "Back to Home" }}
        subtitle={detail.status && (
          detail.status
            .replace("_", " ")
            .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1))
        )}
      />

      {/* Content Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container max-w-6xl">
          {/* Badges */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-3 flex-wrap -mt-4 mb-10"
          >
            {detail.status && (
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                {detail.status.replace("_", " ").replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1))}
              </span>
            )}
            {detail.featured && (
              <span className="bg-amber-400 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                ★ Featured
              </span>
            )}
          </motion.div>

          {/* Images Gallery */}
          {detail.images && detail.images.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className={`grid gap-6 md:gap-8 mb-12 ${
                detail.images.length === 1 ? "grid-cols-1" : "md:grid-cols-2"
              }`}
            >
              {detail.images.map((img, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <img
                    src={img.path}
                    alt={`${detail.title} screenshot ${i + 1}`}
                    loading="lazy"
                    className="w-full object-cover block img-hover-zoom"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="grid lg:grid-cols-[2fr_1fr] gap-8 lg:gap-10">
            {/* Main Content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="mb-6">
                  <span className="gradient-text">About This Project</span>
                </h2>
                {renderMarkdown(detail.descriptionMarkdown)}
              </div>

              {detail.understanding && (
                <div className="card">
                  <h2 className="mb-6">
                    <span className="gradient-text">Understanding</span>
                  </h2>
                  {renderMarkdown(detail.understanding)}
                </div>
              )}

              {detail.contribution && (
                <div className="card">
                  <h2 className="mb-6">
                    <span className="gradient-text">My Contribution</span>
                  </h2>
                  {renderMarkdown(detail.contribution)}
                </div>
              )}

              {/* Links */}
              <div className="flex gap-4 flex-wrap pt-2">
                {detail.githubUrl && (
                  <a
                    href={detail.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    <GitHub width="20" height="20" /> View Code
                  </a>
                )}
                {detail.demoUrl && (
                  <a
                    href={detail.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    <ExternalLink width="20" height="20" /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className="space-y-6 lg:sticky lg:top-24 self-start"
            >
              {detail.techStack && detail.techStack.length > 0 && (
                <motion.div variants={scaleIn} className="card">
                  <h3 className="mb-5 flex items-center gap-2.5">
                    Tech Stack
                  </h3>
                  <div className="flex flex-col gap-3">
                    {detail.techStack.map((tech, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-md"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={scaleIn}
                className="card bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white border-0"
              >
                <h3 className="mb-4 text-white">Project Info</h3>
                <div className="text-sm md:text-base space-y-2">
                  <div className="flex items-center justify-between py-2 border-t border-white/20">
                    <span className="text-white/80 font-medium">Status</span>
                    <strong className="capitalize">{detail.status?.replace("_", " ") || "N/A"}</strong>
                  </div>
                  {detail.featured && (
                    <div className="flex items-center justify-between py-2 border-t border-white/20">
                      <span className="text-white/80 font-medium">Featured</span>
                      <strong>Yes</strong>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Back to Home */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewPort}
            className="mt-12 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-primary-600 hover:text-primary-700 font-bold text-lg transition-colors"
            >
              <ArrowLeft width="20" height="20" /> Back to All Projects
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}