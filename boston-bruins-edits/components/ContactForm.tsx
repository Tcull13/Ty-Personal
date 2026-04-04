"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Send, CheckCircle } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Silently handle for now
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <SectionHeading
          title="GET IN TOUCH"
          subtitle="Brands, creators, and collaborators — let's talk"
        />

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 text-center"
          >
            <CheckCircle size={64} className="mx-auto text-bruins-gold" />
            <h3 className="mt-4 text-2xl font-bold text-white">
              Message Sent!
            </h3>
            <p className="mt-2 text-gray-400">
              We&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-12 space-y-5"
          >
            <motion.div variants={fadeUp}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 rounded-xl bg-bruins-gray-light border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-bruins-gold/50 transition-colors"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-xl bg-bruins-gray-light border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-bruins-gold/50 transition-colors"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <select
                name="subject"
                required
                defaultValue=""
                className="w-full px-4 py-3 rounded-xl bg-bruins-gray-light border border-gray-800 text-white focus:outline-none focus:border-bruins-gold/50 transition-colors appearance-none"
              >
                <option value="" disabled className="text-gray-500">
                  What&apos;s this about?
                </option>
                <option value="sponsorship">Sponsorship</option>
                <option value="collaboration">Collaboration</option>
                <option value="shoutout">Shoutout</option>
                <option value="custom-edit">Custom Edit</option>
                <option value="other">Other</option>
              </select>
            </motion.div>

            <motion.div variants={fadeUp}>
              <textarea
                name="message"
                placeholder="Tell us more..."
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-bruins-gray-light border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-bruins-gold/50 transition-colors resize-none"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-bruins-gold text-black font-bold text-lg rounded-full transition-all hover:bg-bruins-gold-dark hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
