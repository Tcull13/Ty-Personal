"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-center"
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white"
      >
        {title}
      </motion.h2>

      {/* Animated gold underline */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "4rem" }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        className="mx-auto mt-4 h-1 rounded-full bg-bruins-gold"
      />

      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-gray-400 text-lg max-w-md mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
