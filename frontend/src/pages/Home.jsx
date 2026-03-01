import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../store/slices/profile.js";
import { getSkills } from "../features/skills/application/getSkills.ts";
import { fetchProjects } from "../store/slices/projects.js";
import { fetchResume } from "../store/slices/resume.js";
import { fetchBlogs } from "../store/slices/blog.js";
import { Link } from "react-router-dom";

// const typingRoles = [
//   "Full Stack Developer",
//   "UI/UX Designer",
//   "Problem Solver",
//   "Creative Builder"
// ];

const typingRoles = [
  "Full Stack Product Engineer",
  "Scalable System Architect",
  "API & Backend Specialist",
  "Performance Optimization Expert",
  "UI/UX Driven Developer",
  "Automation & DevOps Engineer",
  "AI Integration Builder",
  "MVP & Startup Tech Builder",
  "Clean Code & Software Craftsmanship Advocate"
];


function useScrollAnimation() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return [visibleSections, sectionRefs];
}

export default function Home() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile.data);
  const profileStatus = useSelector((s) => s.profile.status);
  const [skills, setSkills] = useState(null);
  const [skillsStatus, setSkillsStatus] = useState("idle");
  const projects = useSelector((s) => s.projects.list);
  const projectsStatus = useSelector((s) => s.projects.status);
  const blogs = useSelector((s) => s.blog.list);
  const blogsStatus = useSelector((s) => s.blog.status);
  const resume = useSelector((s) => s.resume.data);
  const [activeSkillCategory, setActiveSkillCategory] = useState("Frontend");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [visibleSections, sectionRefs] = useScrollAnimation();

  const services = [
    {
      icon: "🎨",
      title: "Web Development",
      description: "Custom websites & web apps built with modern technologies"
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Beautiful experiences that work on any device"
    },
    {
      icon: "⚡",
      title: "Performance Optimization",
      description: "Fast, efficient applications that delight users"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "Tech Corp",
      text: "Outstanding work! The attention to detail and commitment to quality was exceptional. Delivered ahead of schedule and exceeded expectations.",
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      company: "StartupXYZ",
      text: "A true professional who brings both technical expertise and creative problem-solving. Would highly recommend for any project.",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Rodriguez",
      role: "Design Lead",
      company: "Creative Studio",
      text: "Fantastic collaboration! Great communication skills and ability to translate design concepts into pixel-perfect implementations.",
      avatar: "👩‍🎨"
    },
    {
      name: "David Park",
      role: "Founder",
      company: "InnovateLabs",
      text: "Exceptional developer with a keen eye for detail. The project was completed on time and the code quality was top-notch.",
      avatar: "👨‍💼"
    },
    {
      name: "Lisa Anderson",
      role: "Marketing Director",
      company: "Digital Agency",
      text: "Working together was a pleasure! Professional, responsive, and delivered exactly what we needed. Highly recommended!",
      avatar: "👩‍💼"
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
    
    // Fetch skills using the new approach
    (async () => {
      try {
        setSkillsStatus("loading");
        const skillsData = await getSkills();
        
        // Check if skillsData is already grouped (object) or needs grouping (array)
        let groupedSkills = {};
        if (Array.isArray(skillsData)) {
          // Group skills by category
          groupedSkills = skillsData.reduce((acc, skill) => {
            if (!acc[skill.category]) {
              acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
          }, {});
        } else if (typeof skillsData === 'object' && skillsData !== null) {
          // Already grouped by the backend
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

  const getStatusBadge = (status) => {
    const badges = {
      completed: { label: "✓ Completed", color: "text-emerald-600", bg: "bg-emerald-50" },
      in_progress: { label: "⚡ In Progress", color: "text-amber-600", bg: "bg-amber-50" },
      idea: { label: "💡 Idea", color: "text-indigo-600", bg: "bg-indigo-50" }
    };
    return badges[status] || badges.completed;
  }

  const fadeInClass = (section) => 
    `transition-all duration-700 ${
      visibleSections[section] 
        ? "opacity-100 translate-y-0" 
        : "opacity-0 translate-y-8"
    }`;

  return (
    <div>
      {/* Floating Let's Talk Button */}
      <Link
        to="/contact"
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center gap-2 animate-bounce"
      >
        <span>💬</span>
        <span className="hidden sm:inline">Let's Talk</span>
      </Link>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -right-48 animate-float"></div>
        <div className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-36 -left-36 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-48 h-48 bg-white/5 rounded-full top-1/2 left-1/2 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="fade-in-up">
              <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold mb-6 backdrop-blur-sm">
                👋 Hey, I'm {profile?.name?.split(' ')[0] || "there"}!
              </div>
              
              <h1 className="text-white mb-2 leading-tight text-4xl md:text-5xl lg:text-6xl font-bold">
                {profile?.headline?.split('|')[0] || "Creative Developer"}
              </h1>
              
              {/* Typing Animation */}
              <div className="text-2xl md:text-3xl text-white/90 mb-6 h-12 flex items-center">
                <span className="mr-2">I'm a</span>
                <span className="text-amber-300 font-semibold">
                  {roleText}
                  <span className="animate-pulse">|</span>
                </span>
              </div>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {profile?.bioMarkdown?.substring(0, 150) || "I craft beautiful digital experiences that make a difference. Let's build something amazing together!"}
              </p>

              {/* Social Proof Badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <span className="text-white font-semibold">5+ Projects Completed</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-white font-semibold">Clean Code</span>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  View My Work <span>→</span>
                </button>
                <Link 
                  to="/contact" 
                  className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all"
                >
                  Hire Me
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              {profile?.imagePath ? (
                <div className="relative w-full max-w-md aspect-square">
                  <div className="absolute inset-0 -m-5 bg-gradient-to-br from-white/30 to-white/10 rounded-full animate-pulse-slow"></div>
                  <img 
                    src={profile.imagePath} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover border-8 border-white/20 relative z-10 shadow-2xl"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md aspect-square bg-white/10 rounded-full flex items-center justify-center text-8xl backdrop-blur-sm">
                  👨‍💻
                </div>
              )}
            </div>
          </div>
        </div>


      </section>

      {/* Services Section */}
      <section 
        ref={(el) => (sectionRefs.current.services = el)}
        data-section="services"
        className={`py-20 bg-white ${fadeInClass('services')}`}
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

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-transparent hover:border-primary-200 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section 
        ref={(el) => (sectionRefs.current.skills = el)}
        data-section="skills"
        className={`bg-white py-20 ${fadeInClass('skills')}`}
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
              <div className="flex gap-4 justify-center mb-12 flex-wrap">
                {["Frontend", "Backend", "DevOps", "Tooling"].map((category) => (
                  skills[category] && skills[category].length > 0 && (
                    <button
                      key={category}
                      onClick={() => setActiveSkillCategory(category)}
                      className={`px-6 py-3 rounded-full font-semibold transition-all ${
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

              <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
                {skills[activeSkillCategory]?.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-600">
              <p>No skills added yet. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        ref={(el) => (sectionRefs.current.projects = el)}
        data-section="projects"
        className={`bg-slate-50 py-20 ${fadeInClass('projects')}`}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleProjects.slice(0, 6).map((p, index) => {
                const badge = getStatusBadge(p.status);
                return (
                  <Link key={p.id} to={`/projects/${p.slug}`} className="group">
                    <div className="card h-full overflow-hidden p-0 hover:shadow-2xl">
                      <div 
                        className="w-full h-64 bg-cover bg-center relative"
                        style={{
                          backgroundImage: p.images?.[0]?.path 
                            ? `url(${p.images[0].path})` 
                            : `linear-gradient(135deg, ${index % 2 === 0 ? '#667eea' : '#f093fb'} 0%, ${index % 2 === 0 ? '#764ba2' : '#f5576c'} 100%)`
                        }}
                      >
                        <div className={`absolute top-4 left-4 ${badge.bg} ${badge.color} px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm`}>
                          {badge.label}
                        </div>
                        {p.featured && (
                          <div className="absolute top-4 right-4 bg-amber-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            ⭐ Featured
                          </div>
                        )}
                      </div>
                      <div className="p-8">
                        <h3 className="text-slate-900 mb-3 text-2xl group-hover:text-primary-600 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                          {p.descriptionMarkdown?.substring(0, 120)}...
                        </p>
                        {p.techStack && p.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {p.techStack.slice(0, 4).map((tech, i) => (
                              <span 
                                key={i} 
                                className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                          View Project <span>→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="mb-2">No projects yet</h3>
              <p className="text-lg text-slate-600">
                Add your first project from the admin panel!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Resume Section */}
      <section className="bg-white">
        <div className="container">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-36 -right-36"></div>
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-24 -left-24"></div>
            
            {resume?.path ? (
              <>
                <h2 className="text-white mb-4 relative z-10 text-3xl font-bold">
                  Download My Resume
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
                  Get a detailed look at my experience, skills, and qualifications
                </p>
                <a 
                  href={resume.path} 
                  download 
                  className="inline-flex items-center gap-3 bg-white text-primary-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all relative z-10"
                >
                  <span className="text-2xl">📄</span>
                  Download Resume
                </a>
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
                  className="inline-flex items-center gap-3 bg-white text-primary-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all relative z-10"
                >
                  <span className="text-2xl">✉️</span>
                  Contact Me
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      {blogs && blogs.length > 0 && (
        <section className="bg-slate-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-4">
                <span className="gradient-text">Latest from the Blog</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Thoughts, tutorials, and insights on web development
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.slice(0, 3).map((blog, index) => (
                <Link key={blog.id} to={`/blog/${blog.slug}`} className="group">
                  <article className="card h-full hover:shadow-2xl">
                    <div 
                      className={`w-16 h-16 bg-gradient-to-br ${
                        index % 3 === 0 ? 'from-primary-600 to-purple-600' : 
                        index % 3 === 1 ? 'from-pink-500 to-red-500' : 
                        'from-cyan-500 to-blue-500'
                      } rounded-xl flex items-center justify-center text-3xl mb-6`}
                    >
                      {index % 3 === 0 ? '💡' : index % 3 === 1 ? '🚀' : '⚡'}
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
                    <h3 className="text-slate-900 mb-4 text-2xl leading-tight group-hover:text-primary-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {blog.markdown?.substring(0, 120)}...
                    </p>
                    <div className="text-primary-600 font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                      Read More <span>→</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold border-2 border-slate-200 hover:border-primary-600 hover:shadow-lg transition-all"
              >
                View All Posts <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section 
        ref={(el) => (sectionRefs.current.testimonials = el)}
        data-section="testimonials"
        className={`bg-white py-20 ${fadeInClass('testimonials')}`}
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
            <div className="card min-h-[400px] flex flex-col justify-center text-center relative overflow-hidden">
              <div className="absolute top-8 left-8 text-7xl text-slate-100 leading-none">"</div>
              
              <div className="animate-fadeIn relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                
                <p className="text-slate-600 text-xl leading-relaxed mb-8 italic max-w-3xl mx-auto">
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
              </div>
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
      </section>

      {/* Call to Action Section */}
      <section 
        ref={(el) => (sectionRefs.current.cta = el)}
        data-section="cta"
        className={`bg-slate-50 py-20 ${fadeInClass('cta')}`}
      >
        <div className="container">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
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
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
              >
                Start a Conversation <span>💬</span>
              </Link>
              <Link 
                to="/projects" 
                className="inline-flex items-center gap-2 bg-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg border-2 border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                See My Work <span>🚀</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
