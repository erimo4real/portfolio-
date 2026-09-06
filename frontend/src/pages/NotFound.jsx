import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../lib/animations.js";
import { ArrowLeft } from "../shared/components/Icons.jsx";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 p-8 relative overflow-hidden">
      {/* Floating circles */}
      <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full -top-72 -right-72 animate-float"></div>
      <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full -bottom-48 -left-48 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="hidden md:block absolute w-64 h-64 bg-white/5 rounded-full top-1/3 left-1/4 animate-float" style={{ animationDelay: '4s' }}></div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center relative z-10 max-w-xl"
      >
        <motion.div
          variants={fadeUp}
          className="text-white font-black leading-none mb-4"
          style={{ fontSize: "clamp(6rem, 15vw, 10rem)" }}
        >
          404
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-4xl"
        >
          ⚠
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-white mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed"
        >
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </motion.p>

        <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:-translate-y-1 transition-all"
          >
            <ArrowLeft width="20" height="20" /> Back to Home
          </Link>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2.5 bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            View Blog
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}