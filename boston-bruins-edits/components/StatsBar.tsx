"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { STATS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";

function AnimatedCounter({
  value,
  display,
  isSpecial,
}: {
  value: number;
  display: string;
  isSpecial: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!inView) return;

    if (isSpecial) {
      // For "#1" just show it immediately
      setDisplayValue(display);
      return;
    }

    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (value >= 1000000) {
          setDisplayValue(`${(v / 1000000).toFixed(1)}M+`);
        } else if (value >= 1000) {
          setDisplayValue(`${(v / 1000).toFixed(1)}K+`);
        } else {
          setDisplayValue(`${Math.round(v)}+`);
        }
      },
    });

    return () => controls.stop();
  }, [inView, value, display, isSpecial]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function StatsBar() {
  return (
    <section id="stats" className="relative py-16 bg-bruins-gray">
      {/* Gold line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bruins-gold/40 to-transparent" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="text-center"
          >
            <div className="text-4xl sm:text-5xl font-black text-bruins-gold">
              <AnimatedCounter
                value={stat.value}
                display={stat.display}
                isSpecial={stat.label === "On TikTok"}
              />
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-widest text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Gold line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bruins-gold/40 to-transparent" />
    </section>
  );
}
