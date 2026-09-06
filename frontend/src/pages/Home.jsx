import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProfile } from "../store/slices/profile.js";
import { getSkills } from "../features/skills/application/getSkills.ts";
import { fetchProjects } from "../store/slices/projects.js";
import { fetchResume } from "../store/slices/resume.js";
import { fetchBlogs } from "../store/slices/blog.js";
import { Link } from "react-router-dom";
import { getApiUrl } from "../lib/api.js";
import { FileText, ArrowRight, Code, Monitor, Zap, Star, Check } from "../shared/components/Icons.jsx";
import CodeBlock from "../shared/components/CodeBlock.jsx";
import ProjectCard from "../shared/components/ProjectCard.jsx";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewPort
} from "../lib/animations.js";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return getApiUrl() + path;
};

const typingRoles = [
  "Backend & API Dev",
  "React , Vue & Node.js Dev",
  "Debugging & Problem Solver",
  "Web Application Builder"
];

export default function Home() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.data);
  const [skills, setSkills] = useState(null);
  const [skillsStatus, setSkillsStatus] = useState("idle");
  const projects = useSelector((s) => s.projects.list);
  const projectsStatus = useSelector((s) => s.projects.status);
  const blogs = useSelector((s) => s.blog.list);
  const resume = useSelector((s) => s.resume.data);
  const [activeSkillCategory, setActiveSkillCategory] = useState("Frontend");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const services = [
    {
      title: "Web Development",
      description: "Custom websites & web apps built with modern technologies",
      icon: Code
    },
    {
      title: "Responsive Design",
      description: "Beautiful experiences that work on any device",
      icon: Monitor
    },
    {
      title: "Performance Optimization",
      description: "Fast, efficient applications that delight users",
      icon: Zap
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "Tech Corp",
      text: "Outstanding work! The attention to detail and commitment to quality was exceptional. Delivered ahead of schedule and exceeded expectations."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      company: "StartupXYZ",
      text: "A true professional who brings both technical expertise and creative problem-solving. Would highly recommend for any project."
    },
    {
      name: "Emily Rodriguez",
      role: "Design Lead",
      company: "Creative Studio",
      text: "Fantastic collaboration! Great communication skills and ability to translate design concepts into pixel-perfect implementations."
    },
    {
      name: "David Park",
      role: "Founder",
      company: "InnovateLabs",
      text: "Exceptional developer with a keen eye for detail. The project was completed on time and the code quality was top-notch."
    },
    {
      name: "Lisa Anderson",
      role: "Marketing Director",
      company: "Digital Agency",
      text: "Working together was a pleasure! Professional, responsive, and delivered exactly what we needed. Highly recommended!"
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchProjects());
    dispatch(fetchResume());
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

  useEffect(() => {
    const role = typingRoles[currentRole];
    if (isTyping) {
      if (roleText.length < role.length) {
        const timer = setTimeout(() => {
          setRoleText(role.slice(0, roleText.length + 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (roleText.length > 0) {
        const timer = setTimeout(() => {
          setRoleText(roleText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        setCurrentRole((prev) => (prev + 1) % typingRoles.length);
        setIsTyping(true);
      }
    }
  }, [roleText, isTyping, currentRole]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleProjects = projects?.filter(p =>
    (p.published === true || p.published === undefined) &&
    (p.status === "completed" || p.status === "in_progress")
  ) || [];

  const headline = profile?.headline?.split('|')[0] || "Creative Developer";
  const firstName = profile?.name?.split(' ')[0] || "there";

  return (
    <div>
      {/* Floating Let's Talk Button */}
      <Link
        to="/contact"
        className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center gap-2 animate-bounce text-sm md:text-base"
      >
        <span className="hidden sm:inline">Let's Talk</span>
      </Link>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute w-48 md:w-96 h-48 md:h-96 bg-white/10 rounded-full -top-24 md:-top-48 -right-24 md:-right-48 animate-float"></div>
        <div className="absolute w-36 md:w-72 h-36 md:h-72 bg-white/10 rounded-full -bottom-18 md:-bottom-36 -left-18 md:-left-36 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="hidden md:block absolute w-48 h-48 bg-white/5 rounded-full top-1/2 left-1/2 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: staggered text entrance */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="inline-block bg-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold mb-6 backdrop-blur-sm">
                Hey, I'm {firstName}!
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="glitch text-white mb-2 leading-tight font-bold"
                data-text={headline}
                style={{ fontSize: "clamp(1.8rem, 8vw, 4rem)" }}
              >
                {headline}
              </motion.h1>

              {/* Typing Animation */}
              <motion.div variants={fadeUp} className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 h-12 flex items-center">
                <span className="mr-2">I'm a</span>
                <span className="text-amber-300 font-semibold">
                  {roleText}
                  <span className="animate-pulse">|</span>
                </span>
              </motion.div>

              <motion.p variants={fadeUp} className="text-base md:text-lg text-white/90 mb-6 md:mb-8 leading-relaxed">
                {profile?.bioMarkdown?.substring(0, 150) || "I craft beautiful digital experiences that make a difference. Let's build something amazing together!"}
              </motion.p>

              {/* Social Proof Badges */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Star width="18" height="18" />
                  <span className="text-white font-semibold">5+ Projects Completed</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Check width="18" height="18" />
                  <span className="text-white font-semibold">Clean Code</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-3 md:gap-4 flex-wrap">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="bg-white text-primary-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all text-sm md:text-base"
                >
                  View My Work <ArrowRight width="16" height="16" />
                </button>
                <Link
                  to="/contact"
                  className="bg-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold border-2 border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all text-sm md:text-base"
                >
                  Hire Me
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: floating profile + code window */}
            <div className="relative flex flex-col items-center gap-8 lg:gap-10">
              {profile?.imagePath ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-48 sm:w-56 md:w-64"
                >
                  <div className="absolute inset-0 -m-5 bg-gradient-to-br from-white/30 to-white/10 rounded-full animate-pulse-slow"></div>
                  <img
                    src={getImageUrl(profile.imagePath)}
                    alt="Profile"
                    loading="lazy"
                    className="w-full h-auto aspect-square rounded-full object-cover border-8 border-white/20 relative z-10 shadow-2xl animate-float"
                  />

                  {/* Floating status card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute -right-6 top-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl animate-float"
                    style={{ animationDelay: '1s' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-slate-800">Available for work</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">React • Node • Mongo</div>
                  </motion.div>

                  {/* Floating stats chip */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute -left-8 bottom-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl animate-float"
                    style={{ animationDelay: '2s' }}
                  >
                    <div className="text-base font-extrabold text-slate-800">2+ Years</div>
                    <div className="text-[11px] text-slate-500">Coding Experience</div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-48 sm:w-56 md:w-64 aspect-square bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <span className="text-6xl">Profile</span>
                </motion.div>
              )}

              {/* Syntax-highlighted code window */}
              <div className="w-full max-w-md lg:-mt-4 animate-code-float">
                <CodeBlock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewPort}
        className="py-20 bg-white"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4">
              <span className="gradient-text">What I Do</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Specializing in building digital products that drive results
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewPort}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-transparent hover:border-primary-200 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="text-primary-600 mb-4 transform group-hover:scale-110 transition-transform">
                  <service.icon width="32" height="32" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewPort}
        className="bg-white py-20 border-t border-slate-100"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4">
              <span className="gradient-text">Skills & Expertise</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {skillsStatus === "loading" ? (
            <div className="text-center py-12">
              <div className="spinner"></div>
            </div>
          ) : skills && Object.keys(skills).length > 0 ? (
            <>
              <div className="flex gap-2 md:gap-4 justify-center mb-8 md:mb-12 flex-wrap">
                {["Frontend", "Backend", "Mobile", "DevOps", "Tooling"].map((category) => (
                  skills[category] && skills[category].length > 0 && (
                    <button
                      key={category}
                      onClick={() => setActiveSkillCategory(category)}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all text-sm md:text-base ${
                        activeSkillCategory === category
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-transparent text-slate-600 border-2 border-slate-200 hover:border-primary-600'
                      }`}
                    >
                      {category}
                    </button>
                  )
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkillCategory}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto"
                >
                  {skills[activeSkillCategory]?.map((skill) => (
                    <motion.span
                      key={skill.id}
                      whileHover={{ y: -4, scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-5 md:px-8 py-2 md:py-4 rounded-full text-sm md:text-base font-semibold shadow-lg hover:shadow-xl cursor-default"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center py-12 text-slate-600">
              <p>No skills added yet. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewPort}
        className="bg-slate-50 py-20"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4">
              <span className="gradient-text">Featured Projects</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A showcase of my recent work and creative experiments
            </p>
          </div>

          {projectsStatus === "loading" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-96 p-0 overflow-hidden">
                  <div className="w-full h-64 bg-slate-200 animate-pulse"></div>
                  <div className="p-8">
                    <div className="h-6 bg-slate-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-16 bg-slate-100 rounded mb-4 animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="h-7 w-16 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-7 w-20 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : visibleProjects && visibleProjects.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {visibleProjects.slice(0, 6).map((p, index) => (
                  <motion.div key={p.id} variants={scaleIn}>
                    <ProjectCard project={p} index={index} />
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"></div>
              <h3 className="mb-2">No projects yet</h3>
              <p className="text-lg text-slate-600">
                Add your first project from the admin panel!
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Resume Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewPort}
        className="bg-white"
      >
        <div className="container">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-36 -right-36 animate-float"></div>
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-24 -left-24 animate-float" style={{ animationDelay: '2s' }}></div>

            {resume?.path ? (
              <>
                <h2 className="text-white mb-4 relative z-10 text-2xl md:text-3xl lg:text-4xl font-bold">
                  Download My Resume
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
                  Get a detailed look at my experience, skills, and qualifications
                </p>
                <motion.a
                  href={resume.path}
                  download
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="inline-flex items-center gap-2 md:gap-3 bg-white text-primary-600 px-4 sm:px-6 md:px-10 py-3 md:py-5 rounded-xl font-bold text-sm md:text-lg shadow-2xl relative z-10"
                >
                  <FileText width="24" height="24" />
                  Download Resume
                </motion.a>
              </>
            ) : (
              <>
                <h2 className="text-white mb-4 relative z-10 text-3xl font-bold">
                  Resume Coming Soon
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
                  I'm currently updating my resume. Check back soon or feel free to reach out!
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 bg-white text-primary-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl relative z-10"
                >
                  Contact Me
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.section>

      {/* Blog Preview Section */}
      {blogs && blogs.length > 0 && (
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewPort}
          className="bg-slate-50"
        >
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-4">
                <span className="gradient-text">Latest from the Blog</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Thoughts, tutorials, and insights on web development
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewPort}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12"
            >
              {blogs.slice(0, 3).map((blog, index) => (
                <motion.div key={blog.id} variants={scaleIn}>
                  <Link to={`/blog/${blog.slug}`} className="group block h-full">
                    <article className="card h-full hover:shadow-2xl">
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${
                          index % 3 === 0 ? 'from-primary-600 to-purple-600' :
                          index % 3 === 1 ? 'from-pink-500 to-red-500' :
                          'from-cyan-500 to-blue-500'
                        } rounded-xl flex items-center justify-center mb-4`}
                      >
                        <FileText width="20" height="20" />
                      </div>
                      {blog.createdAt && (
                        <div className="text-sm text-slate-500 mb-4">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                      <h3 className="text-slate-900 mb-2 md:mb-4 text-lg md:text-xl leading-tight group-hover:text-primary-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                        {blog.markdown?.substring(0, 120)}...
                      </p>
                      <div className="text-primary-600 font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                        Read More <ArrowRight width="16" height="16" />
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-primary-600 rounded-xl font-semibold border-2 border-slate-200 hover:border-primary-600 hover:shadow-lg transition-all text-sm md:text-base"
              >
                View All Posts <ArrowRight width="16" height="16" />
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Testimonials Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewPort}
        className="bg-white py-20"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4">
              <span className="gradient-text">What People Say</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Feedback from clients and colleagues I've worked with
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Testimonial Card */}
            <div className="card min-h-[250px] md:min-h-[350px] flex flex-col justify-center text-center relative overflow-hidden">
              <div className="absolute top-8 left-8 text-7xl text-slate-100 leading-none">"</div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-2xl md:text-4xl mx-auto mb-4 md:mb-8 shadow-xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>

                  <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8 italic max-w-3xl mx-auto">
                    {testimonials[currentTestimonial].text}
                  </p>

                  <div>
                    <div className="font-bold text-slate-900 mb-2 text-xl">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-base text-slate-600">
                      {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border-2 border-slate-200 items-center justify-center text-2xl transition-all hover:bg-gradient-to-br hover:from-primary-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-110 shadow-lg z-20"
              aria-label="Previous testimonial"
            >
              ←
            </button>

            <button
              onClick={nextTestimonial}
              className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border-2 border-slate-200 items-center justify-center text-2xl transition-all hover:bg-gradient-to-br hover:from-primary-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-110 shadow-lg z-20"
              aria-label="Next testimonial"
            >
              →
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-md transition-all ${
                    currentTestimonial === index
                      ? 'w-10 bg-gradient-to-r from-primary-600 to-purple-600'
                      : 'w-3 bg-slate-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-2xl shadow-lg"
                aria-label="Previous testimonial"
              >
                ←
              </button>
              <button
                onClick={nextTestimonial}
                className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-2xl shadow-lg"
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewPort}
        className="bg-slate-50 py-20"
      >
        <div className="container">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-36 -right-36"></div>
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-24 -left-24"></div>

            <h2 className="text-white mb-4 relative z-10 text-4xl font-bold">
              Let's Build Something Amazing Together!
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto relative z-10 leading-relaxed">
              Have a project in mind? I'd love to hear about it. Let's discuss how I can help bring your vision to life.
            </p>
            <div className="flex gap-4 justify-center flex-wrap relative z-10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-4 sm:px-6 md:px-10 py-3 md:py-5 rounded-xl font-bold text-sm md:text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
              >
                Start a Conversation
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-4 sm:px-6 md:px-10 py-3 md:py-5 rounded-xl font-bold text-sm md:text-lg border-2 border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                See My Work
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}