export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@_bruinsedits_",
  instagram: "https://www.instagram.com/boston.bruins.edits",
};

export const STATS = [
  { label: "Followers", value: 7400, display: "7.4K+" },
  { label: "Posts", value: 189, display: "189+" },
  { label: "Views", value: 500000, display: "500K+" },
  { label: "On TikTok", value: 1, display: "#1" },
];

export const VIDEOS = [
  { platform: "tiktok" as const, videoId: "7518030863796358455" },
  { platform: "tiktok" as const, videoId: "7516554430444096782" },
  { platform: "tiktok" as const, videoId: "7517646170219400462" },
  { platform: "tiktok" as const, videoId: "7516910599624772919" },
  { platform: "tiktok" as const, videoId: "7494271132669988142" },
  { platform: "tiktok" as const, videoId: "7493724965997448491" },
];

export const SERVICES = [
  {
    title: "Shoutout",
    description: "Get your brand in front of 7.4K+ engaged hockey fans with a featured post or story.",
    price: "Starting at $25",
    features: ["Story or feed post", "24-hour minimum exposure", "Tagged mention"],
  },
  {
    title: "Custom Edit",
    description: "Professional-quality sports edit tailored to your team, player, or brand.",
    price: "Starting at $50",
    features: ["HD quality edit", "Trending audio", "2 revision rounds", "Full usage rights"],
  },
  {
    title: "Brand Package",
    description: "Full partnership with multiple posts, stories, and custom content for maximum impact.",
    price: "Contact Us",
    features: ["Multiple posts & stories", "Custom edit series", "Analytics report", "Priority support"],
  },
];

export const NAV_LINKS = [
  { label: "Edits", href: "#videos" },
  { label: "Stats", href: "#stats" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];
