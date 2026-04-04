"use client";

import { motion } from "framer-motion";
import { staggerContainer, heroWord } from "@/lib/animations";
import IceParticles from "./IceParticles";

const HEADLINE_WORDS = ["THE", "#1", "BRUINS", "EDITS", "PAGE"];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-bruins-gray" />

      {/* Subtle gold radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(252,181,20,0.08)_0%,transparent_70%)]" />

      {/* Ice particles */}
      <IceParticles />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Headline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={heroWord}
              className={`text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter ${
                word === "#1" ? "text-bruins-gold" : "text-white"
              }`}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Handles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
        >
          <span className="text-gray-400 text-lg font-mono tracking-wide">
            @boston.bruins.edits
          </span>
          <span className="hidden sm:inline text-bruins-gold">|</span>
          <span className="text-gray-400 text-lg font-mono tracking-wide">
            @_bruinsedits_
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-6 text-gray-500 text-lg max-w-xl mx-auto"
        >
          Premium hockey edits. Highlights. Hype.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-10"
        >
          <a
            href="#videos"
            className="inline-block px-8 py-4 bg-bruins-gold text-black font-bold text-lg rounded-full transition-all hover:bg-bruins-gold-dark hover:scale-105 active:scale-95"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          >
            Watch Our Edits
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-bruins-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
