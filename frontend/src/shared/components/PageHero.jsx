import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../lib/animations.js";

export default function PageHero({ badge, title, subtitle, backLink, compact = false }) {
  return (
    <section
      className={`flex items-center bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 relative overflow-hidden ${
        compact ? "min-h-[45vh]" : "min-h-[55vh]"
      }`}
    >
      {/* Floating circles */}
      <div className="absolute w-48 md:w-96 h-48 md:h-96 bg-white/10 rounded-full -top-24 md:-top-48 -right-24 md:-right-48 animate-float"></div>
      <div className="absolute w-36 md:w-72 h-36 md:h-72 bg-white/10 rounded-full -bottom-18 md:-bottom-36 -left-18 md:-left-36 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="hidden md:block absolute w-48 h-48 bg-white/5 rounded-full top-1/2 left-1/2 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container relative z-10 py-14 md:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto"
        >
          {backLink && (
            <motion.div variants={fadeUp}>
              <Link
                to={backLink.to}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold mb-6 transition-colors"
              >
                <span>←</span> {backLink.label}
              </Link>
            </motion.div>
          )}

          {badge && (
            <motion.span
              variants={fadeUp}
              className="inline-block bg-white/20 px-4 py-2 rounded-full text-white text-xs md:text-sm font-bold mb-6 backdrop-blur-sm uppercase tracking-wide"
            >
              {badge}
            </motion.span>
          )}

          <motion.h1
            variants={fadeUp}
            className="text-white mb-4 font-bold leading-tight"
            style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)" }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              variants={fadeUp}
              className="text-white/90 leading-relaxed"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}