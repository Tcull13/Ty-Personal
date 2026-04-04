"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play } from "lucide-react";
import { fadeUp } from "@/lib/animations";

interface VideoCardProps {
  platform: "tiktok" | "instagram";
  videoId: string;
}

export default function VideoCard({ platform, videoId }: VideoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "100px" });
  const [loaded, setLoaded] = useState(false);

  const isPlaceholder = videoId.startsWith("PLACEHOLDER");

  const iframeSrc =
    platform === "tiktok"
      ? `https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=0`
      : `https://www.instagram.com/reel/${videoId}/embed/`;

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-bruins-gold/50 hover:scale-[1.02] bg-bruins-gray-light"
    >
      {isPlaceholder ? (
        // Placeholder card when no real video IDs are set
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-bruins-gray-light to-bruins-gray">
          <div className="w-16 h-16 rounded-full bg-bruins-gold/10 flex items-center justify-center border border-bruins-gold/30">
            <Play size={28} className="text-bruins-gold ml-1" />
          </div>
          <span className="text-sm text-gray-500 font-medium">Coming Soon</span>
        </div>
      ) : inView ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-bruins-gold border-t-transparent animate-spin" />
            </div>
          )}
          <iframe
            src={iframeSrc}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
