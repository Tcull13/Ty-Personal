/**
 * VibeVault Scaper Configuration
 *
 * Defines all aesthetic batches, their products, prompts, and metadata.
 * Extensible — add new batches (Storied Pages, Cozy Corners, etc.) by
 * adding entries to the `BATCHES` object.
 */

// Shared style anchor appended to all Neon Nights prompts
const NEON_NIGHTS_ANCHOR =
  "vaporwave aesthetic, synthwave style, retro 80s neon outrun, chrome accents, cyan and pink color palette, grid floor reflections, neon glow lighting, retro-futuristic, dreamy nostalgic mood, grainy VHS texture, soft lens flare, cinematic composition, product photography, clean sharp focus on product, soft background blur, aspirational lifestyle";

const UNIVERSAL_NEGATIVE_PROMPT =
  "photorealistic human faces, people, crowds, messy composition, dull colors, natural lighting, daytime, brown tones, earth tones, modern realistic architecture, photoreal, 3d render, oversaturated, washed out, low contrast, minimalist, grunge, cluttered, dirty, ugly";

export interface ScapeProduct {
  /** URL-safe slug (e.g. "neon-cloud-sign") */
  slug: string;
  /** Display name (e.g. "LED Cloud Neon Sign") */
  name: string;
  /** Category within the batch (e.g. "Neon Signs", "Wall Art") */
  category: string;
  /** The Flux Pro prompt */
  prompt: string;
  /** Stable seed for reproducibility */
  seed: number;
  /** Pinterest-optimized caption */
  caption: string;
  /** Placeholder for the owner's affiliate link */
  affiliateLink: string;
  /** Guidance scale for generation */
  guidanceScale: number;
}

export interface ScapeBatch {
  /** Batch slug (e.g. "neon-nights") */
  slug: string;
  /** Display name */
  name: string;
  /** Description for the collection */
  description: string;
  /** Products in this batch */
  products: ScapeProduct[];
  /** Shared negative prompt */
  negativePrompt: string;
  /** Aspect ratio for all images */
  aspectRatio: string;
  /** Number of outputs per generation */
  numOutputs: number;
}

export const BATCHES: Record<string, ScapeBatch> = {
  "neon-nights": {
    slug: "neon-nights",
    name: "Neon Nights",
    description:
      "Vaporwave and synthwave aesthetic product scapes with neon glow, chrome accents, and retro-futuristic vibes. Perfect for cyberpunk and 80s nostalgia enthusiasts.",
    negativePrompt: UNIVERSAL_NEGATIVE_PROMPT,
    aspectRatio: "2:3",
    numOutputs: 3,
    products: [
      {
        slug: "neon-cloud-sign",
        name: "LED Cloud Neon Sign",
        category: "Neon Signs",
        seed: 20001,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_NEON_CLOUD]",
        caption:
          "Transform your space with this dreamy LED cloud neon sign ☁️✨ The perfect vaporwave bedroom decor piece. Soft pink glow, retro vibes, pure nostalgia. #Vaporwave #BedroomDecor #NeonSign #Synthwave",
        prompt: `A pink LED cloud-shaped neon sign mounted on a vaporwave bedroom wall, glowing softly in pink light, the sign reads "DREAM" in neon script, casting a warm pink glow across the wall, a chrome-framed window beside it shows a synthwave sunset with purple and orange sky, a retro cassette tape player sits on a chrome shelf below, small cactus in a terracotta pot, grid-patterned floor reflecting the neon glow, dreamy nostalgic atmosphere, soft pink and cyan lighting, ${NEON_NIGHTS_ANCHOR}`,
      },
      {
        slug: "nagai-posters",
        name: "Hiroshi Nagai Lofi Art Posters (Set of 9)",
        category: "Wall Art",
        seed: 20002,
        guidanceScale: 3.5,
        affiliateLink: "[AFFILIATE_LINK_NAGAI_POSTERS]",
        caption:
          "Bring calm vibes to your walls with this set of 9 Hiroshi Nagai art posters 🏝️🌴 Retro pastel scenes, palm trees, and vintage architecture. The ultimate lofi bedroom aesthetic. #Lofi #Vaporwave #PosterSet #RoomDecor",
        prompt: `A set of 9 Hiroshi Nagai art posters arranged in a 3x3 grid on a vaporwave bedroom wall, each poster showing retro pastel scenes of palm trees, blue skies, and vintage architecture, soft cyan LED strip lighting framing the gallery wall, a warm wooden retro desk below holding a small vintage lamp and a trailing plant in a white pot, soft afternoon light filtering through sheer curtains, calm nostalgic lofi atmosphere, ${NEON_NIGHTS_ANCHOR}`,
      },
      {
        slug: "great-wave-neon",
        name: "Great Wave Off Kanagawa LED Neon Sign",
        category: "Neon Signs",
        seed: 20003,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_GREAT_WAVE_NEON]",
        caption:
          "The Great Wave reimagined in neon 🌊💙 This stunning LED neon sign brings iconic Japanese art into the future. Moody blue glow, vaporwave aesthetic. #NeonSign #Vaporwave #JapaneseArt #WallDecor",
        prompt: `The Great Wave Off Kanagawa transformed into a glowing LED neon sign on a dark vaporwave bedroom wall, the iconic wave rendered in luminous blue and pink neon tubes, Mount Fuji silhouette visible through the wave in the design, the neon sign casting cool blue light across the dark purple wall, a chrome side table below holding a retro rotary telephone and a small pink neon tube accent light, dark room with grid-patterned floor reflecting the blue neon glow, moody nighttime atmosphere, ${NEON_NIGHTS_ANCHOR}`,
      },
      {
        slug: "synthwave-mousepad",
        name: "Retro Synthwave Gaming Mouse Pad (Large)",
        category: "Gaming",
        seed: 20004,
        guidanceScale: 3.5,
        affiliateLink: "[AFFILIATE_LINK_SYNTHWAVE_MOUSEPAD]",
        caption:
          "Level up your desk setup with this retro synthwave gaming mouse pad 🕹️🌅 Neon grids, palm trees, and sunset gradients. The ultimate gamer aesthetic. #GamingSetup #Synthwave #DeskSetup #Vaporwave",
        prompt: `An extra-large retro synthwave gaming mouse pad covering a wooden desk, the mouse pad design features a vivid neon grid, palm tree silhouettes, and a pink and purple gradient sunset, a mechanical keyboard with cyan LED backlighting sits on the pad, a retro-style monitor on the desk displays synthwave wallpaper with grid lines, a small neon palm tree decoration beside the monitor, warm golden sunset light from a nearby window mixing with cool cyan keyboard glow, steam rising from a coffee mug, vaporwave desk aesthetic, ${NEON_NIGHTS_ANCHOR}`,
      },
      {
        slug: "custom-neon-sign",
        name: "Multi-Colored Custom Vaporwave Neon Sign",
        category: "Neon Signs",
        seed: 20005,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_CUSTOM_NEON_SIGN]",
        caption:
          "Make it yours with a custom multi-colored neon sign 💗💙💜💚 Each letter glows in a different hue. The ultimate personalized vaporwave room statement piece. #CustomNeon #Vaporwave #RoomGoals #NeonSigns",
        prompt: `A custom multi-colored neon sign mounted on a vaporwave bedroom accent wall, the sign spells a word in glowing neon tubes with vibrant pink, cyan, purple, and green colors, each letter a different neon hue, the sign casts colorful reflections across the dark purple wall, a white acrylic floating shelf below holds a small retro arcade figurine and a glowing crystal decoration, the room has subtle grid pattern lighting on the ceiling, a retro arcade machine visible in the background with CRT glow, custom personalized atmosphere, ${NEON_NIGHTS_ANCHOR}`,
      },
    ],
  },
};

/**
 * Get all batch slugs for iteration
 */
export function getBatchSlugs(): string[] {
  return Object.keys(BATCHES);
}

/**
 * Get a specific batch by slug
 */
export function getBatch(slug: string): ScapeBatch | undefined {
  return BATCHES[slug];
}

/**
 * Get all products across all batches
 */
export function getAllProducts(): ScapeProduct[] {
  return Object.values(BATCHES).flatMap((batch) => batch.products);
}