import React from "react";
import { motion } from "framer-motion";
import { fadeUp, viewPort } from "../../lib/animations.js";

export default function SectionHeading({ title, subtitle, align = "center" }) {
  const centered = align === "center";
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewPort}
      className={`mb-12 md:mb-16 ${centered ? "text-center" : "text-left"}`}
    >
      <h2 className="mb-4">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className={`text-lg text-slate-600 max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}