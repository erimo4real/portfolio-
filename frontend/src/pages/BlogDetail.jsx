import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchBlogDetail } from "../store/slices/blog.js";
import { marked } from "marked";
import PageHero from "../shared/components/PageHero.jsx";
import { ArrowLeft } from "../shared/components/Icons.jsx";
import { fadeUp, viewPort } from "../lib/animations.js";

export default function BlogDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((s) => s.blog.detail);

  useEffect(() => {
    dispatch(fetchBlogDetail(slug));
  }, [dispatch, slug]);

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Cover Image */}
      {detail.image && (
        <div className="h-[38vh] md:h-[50vh] overflow-hidden relative">
          <img
            src={detail.image}
            alt={detail.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent/10 via-black/20 to-black/70"></div>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
            Cover Image
          </div>
        </div>
      )}

      {/* Hero */}
      <PageHero
        compact
        badge="Blog Post"
        title={detail.title}
        backLink={{ to: "/blog", label: "Back to Blog" }}
        subtitle={detail.createdAt
          ? new Date(detail.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : undefined}
      />

      {/* Video Embed */}
      {detail.videoEmbedUrl && (
        <div className="max-w-3xl mx-auto -mt-16 relative z-10 px-4 md:px-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-lg shadow-lg">
                  ▶
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Video</div>
                  <div className="text-xs text-slate-500">Watch the video below</div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-500">
                Embedded Video
              </div>
            </div>
            <div className="video-wrapper relative pb-[56.25%] h-0 overflow-hidden bg-black">
              <iframe
                src={detail.videoEmbedUrl}
                title="Video embed"
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container max-w-3xl">
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewPort}
            className="card p-6 md:p-12 md:p-16"
          >
            <div
              className="blog-article"
              dangerouslySetInnerHTML={{ __html: marked.parse(detail.markdown || "") }}
            />
          </motion.article>

          {/* Back to Blog */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewPort}
            className="mt-10 md:mt-14 text-center bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12"
          >
            <h3 className="mb-2">Enjoyed this article?</h3>
            <p className="mb-8 text-slate-500">Check out more posts on my blog</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <ArrowLeft width="18" height="18" /> Back to All Posts
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}