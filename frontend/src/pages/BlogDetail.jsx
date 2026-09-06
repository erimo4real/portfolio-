import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchBlogDetail } from "../store/slices/blog.js";
import { marked } from "marked";
import PageHero from "../shared/components/PageHero.jsx";
import { ArrowLeft } from "../shared/components/Icons.jsx";
import { fadeUp, viewPort } from "../lib/animations.js";

// Converts TAB-separated rows (Layer<TAB>Technology) into real pipe-markdown tables
// so `marked` renders them as aligned, styled table rows instead of a wall of text.
function tabsToMarkdown(input) {
  const lines = String(input || "").replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.includes("\t")) {
      const block = [];
      while (i < lines.length && lines[i].includes("\t")) {
        block.push(lines[i]);
        i++;
      }
      const rows = block.map((l) => l.split("\t"));
      const cols = Math.max(...rows.map((r) => r.length));
      const pad = (r) => {
        while (r.length < cols) r.push("");
        return r;
      };
      const norm = rows.map(pad);
      const renderRow = (r) => "| " + r.join(" | ") + " |";
      out.push(renderRow(norm[0]));
      out.push("| " + Array(cols).fill("---").join(" | ") + " |");
      norm.slice(1).forEach((r) => out.push(renderRow(r)));
      out.push("");
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join("\n");
}

// Wrap rendered <table> blocks in an overflow container so wide tables scroll on mobile.
function wrapTables(html) {
  return html
    .split("<table>")
    .join('<div class="blog-table-wrap"><table>')
    .split("</table>")
    .join("</table></div>");
}

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

  const hasCover = !!detail.image;
  const postDate = detail.createdAt
    ? new Date(detail.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  const renderMarkdown = (md) => (
    <div
      className="blog-article"
      dangerouslySetInnerHTML={{ __html: wrapTables(marked.parse(tabsToMarkdown(md))) }}
    />
  );

  return (
    <div>
      {/* Cover image with overlaid title (no second hero) */}
      {hasCover ? (
        <header className="relative overflow-hidden min-h-[55vh] md:min-h-[65vh] flex items-end">
          <img
            src={detail.image}
            alt={detail.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>

          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
            Cover Image
          </div>

          <div className="relative z-10 container pb-10 md:pb-14 pt-28">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold mb-6 transition-colors"
            >
              <ArrowLeft width="18" height="18" /> Back to Blog
            </Link>
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-white text-xs md:text-sm font-bold mb-4 backdrop-blur-sm uppercase tracking-wide">
              Blog Post
            </span>
            <h1
              className="text-white mb-4 font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 5.5vw, 3.75rem)" }}
            >
              {detail.title}
            </h1>
            {postDate && <div className="text-white/90 text-base md:text-lg">{postDate}</div>}
          </div>
        </header>
      ) : (
        <PageHero
          compact
          badge="Blog Post"
          title={detail.title}
          backLink={{ to: "/blog", label: "Back to Blog" }}
          subtitle={postDate || undefined}
        />
      )}

      {/* Video Embed */}
      {detail.videoEmbedUrl && (
        <div className="max-w-4xl mx-auto -mt-14 md:-mt-16 relative z-10 px-4 md:px-6">
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
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="container max-w-4xl">
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewPort}
            className="card p-6 sm:p-10 md:p-12"
          >
            {renderMarkdown(detail.markdown)}
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