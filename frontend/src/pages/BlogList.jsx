import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchBlogs } from "../store/slices/blog.js";
import { Link } from "react-router-dom";
import PageHero from "../shared/components/PageHero.jsx";
import { ArrowRight } from "../shared/components/Icons.jsx";
import { fadeUp, scaleIn, staggerContainer, viewPort } from "../lib/animations.js";

const bgGradients = [
  "from-primary-600 via-purple-600 to-pink-500",
  "from-pink-500 via-fuchsia-500 to-purple-600",
  "from-purple-600 via-indigo-600 to-cyan-500"
];

export default function BlogList() {
  const dispatch = useDispatch();
  const list = useSelector((s) => s.blog.list);
  const status = useSelector((s) => s.blog.status);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <div>
      <PageHero
        badge="Blog"
        title="Thoughts & Insights"
        subtitle="Exploring web development, design patterns, and everything in between"
      />

      {/* Blog Posts */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container max-w-5xl">
          {status === "loading" && (
            <div className="text-center py-16">
              <div className="spinner"></div>
            </div>
          )}

          {status === "succeeded" && list.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-4xl">
              </div>
              <h3 className="mb-2 text-slate-900">No posts yet</h3>
              <p className="text-slate-500">Check back soon for new content!</p>
            </div>
          )}

          {status === "succeeded" && list.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className="flex flex-col gap-8"
            >
              {list.map((b, index) => (
                <motion.article
                  key={b.id}
                  variants={fadeUp}
                  className={`card grid gap-0 overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all ${
                    index % 2 === 0 ? "md:grid-cols-[2fr_1fr]" : "md:grid-cols-[1fr_2fr]"
                  }`}
                >
                  <Link to={`/blog/${b.slug}`} className="block h-full">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Text */}
                      <div className={`p-6 md:p-10 flex-1 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                          <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                            Article
                          </span>
                          {b.createdAt && (
                            <span className="text-sm text-slate-400">
                              {new Date(b.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                        <h2 className="text-slate-900 mb-4 leading-tight font-bold hover:text-primary-600 transition-colors"
                          style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}>
                          {b.title}
                        </h2>
                        <p className="text-slate-600 mb-6 leading-relaxed"
                          style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)" }}>
                          {b.markdown?.substring(0, 180)}...
                        </p>
                        <div className="text-primary-600 font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                          Read Article <ArrowRight width="16" height="16" />
                        </div>
                      </div>

                      {/* Image */}
                      <div
                        className={`relative flex-[0_0_auto] md:flex-1 md:w-[30%] min-h-[200px] md:min-h-[250px] bg-gradient-to-br ${
                          bgGradients[index % bgGradients.length]
                        } overflow-hidden ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}
                      >
                        {b.image ? (
                          <img
                            src={b.image}
                            alt={b.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover img-hover-zoom"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white text-6xl opacity-60">
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}