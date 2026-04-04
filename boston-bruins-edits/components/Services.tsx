"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { SERVICES } from "@/lib/constants";
import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function Services() {
  return (
    <section id="services" className="py-20 bg-bruins-gray">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="WORK WITH US"
          subtitle="Turn your brand into must-see content"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              className={`relative group rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.03] ${
                i === 2
                  ? "bg-gradient-to-b from-bruins-gold/10 to-transparent border-bruins-gold/50 hover:border-bruins-gold"
                  : "bg-bruins-gray-light border-gray-800 hover:border-bruins-gold/40"
              }`}
            >
              {i === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-bruins-gold text-black text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-white">{service.title}</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6">
                <span
                  className={`text-3xl font-black ${
                    service.price === "Contact Us"
                      ? "text-bruins-gold"
                      : "text-white"
                  }`}
                >
                  {service.price}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-bruins-gold mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 block w-full text-center py-3 rounded-full font-bold text-sm transition-all ${
                  i === 2
                    ? "bg-bruins-gold text-black hover:bg-bruins-gold-dark"
                    : "border border-bruins-gold/50 text-bruins-gold hover:bg-bruins-gold hover:text-black"
                }`}
              >
                {service.price === "Contact Us" ? "Get in Touch" : "Book Now"}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
