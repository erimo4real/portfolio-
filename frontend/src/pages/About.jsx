import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchProfile } from "../store/slices/profile.js";
import { getSkills } from "../features/skills/application/getSkills.ts";
import { fetchProjects } from "../store/slices/projects.js";
import { fetchBlogs } from "../store/slices/blog.js";
import { getApiUrl } from "../lib/api.js";
import PageHero from "../shared/components/PageHero.jsx";
import SectionHeading from "../shared/components/SectionHeading.jsx";
import { fadeUp, scaleIn, staggerContainer, viewPort } from "../lib/animations.js";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return getApiUrl() + path;
};

export default function About() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.data);
  const [skills, setSkills] = useState(null);
  const [skillsStatus, setSkillsStatus] = useState("idle");
  const projects = useSelector((s) => s.projects.list);
  const blogs = useSelector((s) => s.blog.list);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchProjects());
    dispatch(fetchBlogs());

    (async () => {
      try {
        setSkillsStatus("loading");
        const skillsData = await getSkills();

        let groupedSkills = {};
        if (Array.isArray(skillsData)) {
          groupedSkills = skillsData.reduce((acc, skill) => {
            if (!acc[skill.category]) {
              acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
          }, {});
        } else if (typeof skillsData === 'object' && skillsData !== null) {
          groupedSkills = skillsData;
        } else {
          console.error("Expected skillsData to be an array or object, got:", typeof skillsData, skillsData);
        }
        setSkills(groupedSkills);
        setSkillsStatus("succeeded");
      } catch (error) {
        setSkillsStatus("failed");
        console.error("Failed to fetch skills:", error);
      }
    })();
  }, [dispatch]);

  const visibleProjects = projects?.filter(p =>
    (p.published === true || p.published === undefined) &&
    (p.status === "completed" || p.status === "in_progress")
  ) || [];

  return (
    <div>
      <PageHero
        badge="About Me"
        title="About Me"
        subtitle="Get to know more about my journey, skills, and what drives me"
      />

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className="flex justify-center"
            >
              {profile?.imagePath ? (
                <div className="relative w-64 md:w-80">
                  <div className="absolute inset-0 -m-5 bg-gradient-to-br from-primary-200 to-purple-200 rounded-full"></div>
                  <div className="absolute inset-0 -m-2 bg-gradient-to-br from-primary-400/50 to-purple-400/50 rounded-full animate-pulse-slow"></div>
                  <img
                    src={getImageUrl(profile.imagePath)}
                    alt="Profile"
                    loading="lazy"
                    className="w-full h-auto aspect-square rounded-full object-cover border-8 border-white relative z-10 shadow-2xl hover-scale"
                  />
                </div>
              ) : (
                <div className="w-64 md:w-80 aspect-square bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-6xl md:text-8xl">Developer</span>
                </div>
              )}
            </motion.div>

            <div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewPort}>
                <span className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                  My Story
                </span>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewPort}>
                <h2 className="mb-6">
                  <span className="gradient-text">Passionate About Building Great Software</span>
                </h2>
              </motion.div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewPort}
                className="text-slate-600 mb-6 leading-relaxed text-base md:text-lg"
              >
                {profile?.bioMarkdown || "I'm a full-stack developer who loves creating elegant solutions to complex problems. With a focus on clean code and user experience, I bring ideas to life through modern web technologies."}
              </motion.p>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewPort}
                className="text-slate-600 mb-10 leading-relaxed text-base md:text-lg"
              >
                When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.
              </motion.p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewPort}
                className="flex flex-wrap gap-10 md:gap-16"
              >
                {[
                  { value: `${visibleProjects.length}+`, label: "Projects Completed" },
                  { value: `${Object.values(skills || {}).flat().length}+`, label: "Technologies" },
                  { value: `${blogs?.length || 0}+`, label: "Blog Posts" }
                ].map((stat) => (
                  <motion.div key={stat.label} variants={fadeUp}>
                    <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-slate-500 font-semibold">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="container">
          <SectionHeading
            title="Skills & Expertise"
            subtitle="Technologies and tools I use to bring ideas to life"
          />

          {skillsStatus === "loading" ? (
            <div className="text-center py-12">
              <div className="spinner"></div>
            </div>
          ) : skills && Object.keys(skills).length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {["Frontend", "Backend", "Mobile", "DevOps", "Tooling"].map((category) =>
                skills[category] && skills[category].length > 0 && (
                  <motion.div
                    key={category}
                    variants={scaleIn}
                    className="card hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <h3 className="mb-6 flex items-center gap-3">
                      <span className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        {category[0]}
                      </span>
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {skills[category].map((skill) => (
                        <span
                          key={skill.id}
                          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-slate-600">
              <p>No skills added yet. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewPort}
        className="bg-white py-20"
      >
        <div className="container">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-36 -right-36 animate-float"></div>
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-24 -left-24 animate-float" style={{ animationDelay: '2s' }}></div>

            <h2 className="text-white mb-4 relative z-10 text-3xl md:text-4xl font-bold">
              Let's Build Something Amazing
            </h2>
            <p className="text-white/90 mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed text-lg">
              I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-white text-primary-600 px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all relative z-10"
            >
              Get In Touch <span>→</span>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}