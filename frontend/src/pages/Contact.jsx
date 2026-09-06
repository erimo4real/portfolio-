import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { submitContact } from "../store/slices/contact.js";
import PageHero from "../shared/components/PageHero.jsx";
import SectionHeading from "../shared/components/SectionHeading.jsx";
import { Mail, Phone, MapPin, AlertTriangle } from "../shared/components/Icons.jsx";
import { fadeUp, scaleIn, viewPort } from "../lib/animations.js";

export default function Contact() {
  const dispatch = useDispatch();
  const [contactStatus, setContactStatus] = useState("idle");

  async function onSubmit(e) {
    e.preventDefault();
    setContactStatus("loading");
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await dispatch(submitContact(data)).unwrap();
      setContactStatus("success");
      e.target.reset();
      setTimeout(() => setContactStatus("idle"), 5000);
    } catch (error) {
      setContactStatus("error");
      setTimeout(() => setContactStatus("idle"), 5000);
    }
  }

  const contactItems = [
    { icon: <Mail width="24" height="24" />, label: "Email", value: "eromoxlx@gmail.com", href: "mailto:eromoxlx@gmail.com" },
    { icon: <Phone width="24" height="24" />, label: "Phone", value: "08138213326", href: "tel:08138213326" },
    { icon: <MapPin width="24" height="24" />, label: "Location", value: "Lagos, LA", href: null }
  ];

  return (
    <div>
      <PageHero
        badge="Contact"
        title="Get In Touch"
        subtitle="Have a project in mind? Let's create something amazing together!"
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 md:gap-14 items-start">
            {/* Contact Info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewPort}>
              <SectionHeading
                title="Let's Work Together"
                subtitle="I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!"
                align="left"
              />

              <div className="flex flex-col gap-5">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-slate-900">{item.label}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-slate-600 hover:text-primary-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-slate-600">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a
                  href="mailto:eromoxlx@gmail.com"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  Email Me <span>→</span>
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewPort}>
              {contactStatus === "success" ? (
                <div className="card p-8 md:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                  >
                    <span className="text-5xl">✓</span>
                  </motion.div>
                  <h3 className="mb-3 text-emerald-600 text-2xl">Message Sent Successfully!</h3>
                  <p className="text-slate-600 text-lg mb-8">
                    Thanks for reaching out! I'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setContactStatus("idle")}
                    className="btn bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="card p-6 md:p-10">
                  <h3 className="mb-6 text-2xl font-bold text-slate-900">Send Me a Message</h3>

                  {contactStatus === "error" && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-4 rounded-xl border border-red-200 mb-6">
                      <AlertTriangle width="20" height="20" />
                      Failed to send message. Please try again.
                    </div>
                  )}

                  <div className="mb-5">
                    <label className="block mb-2 font-semibold text-slate-800">Your Name</label>
                    <input name="name" placeholder="John Doe" required className="w-full" />
                  </div>

                  <div className="mb-5">
                    <label className="block mb-2 font-semibold text-slate-800">Email Address</label>
                    <input name="email" type="email" placeholder="john@example.com" required className="w-full" />
                  </div>

                  <div className="mb-7">
                    <label className="block mb-2 font-semibold text-slate-800">Message</label>
                    <textarea name="message" placeholder="Tell me about your project or just say hi!" rows={6} required className="w-full" />
                  </div>

                  <button
                    type="submit"
                    disabled={contactStatus === "loading"}
                    className={`w-full px-6 py-4 text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                      contactStatus === "loading"
                        ? "bg-slate-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
                    }`}
                  >
                    {contactStatus === "loading" ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Sending...
                      </>
                    ) : (
                      <>Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}