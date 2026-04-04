"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import { VIDEOS } from "@/lib/constants";
import VideoCard from "./VideoCard";
import SectionHeading from "./SectionHeading";

export default function VideoShowcase() {
  return (
    <section id="videos" className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="OUR BEST EDITS"
          subtitle="Premium hockey content that hits different"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {VIDEOS.map((video, i) => (
            <VideoCard key={i} platform={video.platform} videoId={video.videoId} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
