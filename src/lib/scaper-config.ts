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

// Shared style anchor appended to all Cozy Corners prompts
const COZY_CORNERS_ANCHOR =
  "cottagecore aesthetic, lofi cozy vibes, warm soft window lighting, pastoral peaceful mood, handmade and natural textures, muted sage green and warm terracotta palette, watercolor warmth, gentle nostalgic atmosphere, hygge feeling, soft grain, warm vignette, product photography, clean sharp focus on product, soft background blur, cozy room atmosphere, warm golden tones";

const UNIVERSAL_NEGATIVE_PROMPT =
  "photorealistic human faces, people, crowds, messy composition, dull colors, natural lighting, daytime, brown tones, earth tones, modern realistic architecture, photoreal, 3d render, oversaturated, washed out, low contrast, minimalist, grunge, cluttered, dirty, ugly";

const COZY_CORNERS_NEGATIVE_PROMPT =
  "neon, cold lighting, fluorescent, modern, sterile, plastic, minimalist, concrete, harsh shadows, corporate, urban, dirty, grimy, dark themes, horror, gothic, dramatic chiaroscuro, angular, sterile surfaces, people, messy composition, oversaturated, washed out, low contrast";

// Shared style anchor appended to all Midnight City prompts
const MIDNIGHT_CITY_ANCHOR =
  "cyberpunk aesthetic, noir atmosphere, neon-lit rainy city night, electric blue and magenta palette, holographic advertisements reflecting on wet pavement, gritty urban mood, high contrast cinematic lighting, dark shadows with neon rim light, chrome and steel details, product photography, clean sharp focus on product, soft background blur, tech-heavy atmosphere";

const MIDNIGHT_CITY_NEGATIVE_PROMPT =
  "sunlight, daytime, bright, cheerful, pastel, clean, suburban, rural, nature, peaceful, soft lighting, warm cozy, cottagecore, fantasy, utopian, cartoonish, minimalist, organic, earthy without neon, low contrast, blurry, people, messy composition, oversaturated, dull";

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

  "cozy-corners": {
    slug: "cozy-corners",
    name: "Cozy Corners",
    description:
      "Cottagecore and lofi aesthetic product scapes with warm window lighting, soft textures, and hygge vibes. Perfect for cozy desk setups, reading nooks, and warm minimalist decor.",
    negativePrompt: COZY_CORNERS_NEGATIVE_PROMPT,
    aspectRatio: "2:3",
    numOutputs: 3,
    products: [
      {
        slug: "cloud-wrist-rest",
        name: "Cloud Keyboard Wrist Rest (White)",
        category: "Desk Accessories",
        seed: 30001,
        guidanceScale: 3.5,
        affiliateLink: "[AFFILIATE_LINK_CLOUD_WRIST_REST]",
        caption:
          "Type in dreamy comfort with this cloud-shaped wrist rest ☁️💻 Soft white memory foam on a warm wooden desk, paired with tea, rain on the window, and pure lofi vibes. #CozyDesk #Lofi #WristRest #Cottagecore",
        prompt: `A soft white cloud-shaped keyboard wrist rest on a warm wooden desk, paired with a cream mechanical keyboard, a steaming ceramic mug of tea with a dangling tea tag beside it, a small potted succulent in a terracotta pot, warm golden afternoon light streaming through a window with sheer white curtains, raindrops visible on the window pane outside, a soft knitted blanket draped over the desk chair in the background, the wrist rest has a plush cloud-like texture, calm lofi atmosphere, cozy desk corner, ${COZY_CORNERS_ANCHOR}`,
      },
      {
        slug: "cat-paw-cushion",
        name: "Cat Paw Plush Seat Cushion",
        category: "Seating",
        seed: 30002,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_CAT_PAW_CUSHION]",
        caption:
          "Your cozy corner needs this plush cat paw seat cushion 🐱☁️ Soft beige with pink paw pads, fairy lights, and a sleepy orange kitty. The ultimate lofi floor setup. #CatPawCushion #CozyCorner #Lofi #Kawaii",
        prompt: `A large plush cat paw-shaped seat cushion on a warm wooden bedroom floor, the cushion is soft cream beige with pink paw pads, fluffy textured fabric, a low wooden coffee table beside it holds a steaming ceramic coffee cup and an open paperback book, a real small orange tabby cat curled up sleeping next to the cushion, warm amber fairy lights strung across the wall above, a window showing soft rain outside, warm floor lamp casting golden light across the scene, soft knitted throw on the floor, calm peaceful afternoon, ${COZY_CORNERS_ANCHOR}`,
      },
      {
        slug: "frog-desk-mat",
        name: "Kawaii Frog Green Desk Mat",
        category: "Desk Accessories",
        seed: 30003,
        guidanceScale: 3.5,
        affiliateLink: "[AFFILIATE_LINK_FROG_DESK_MAT]",
        caption:
          "Hop into productivity with this kawaii frog desk mat 🐸🌿 Sage green, cute frog illustration, and a matcha latte — the coziest desk setup ever. #FrogDeskMat #Cottagecore #DeskSetup #Kawaii",
        prompt: `A large kawaii frog-themed desk mat in soft sage green on a warm wooden desk, the mat features a cute frog illustration sitting on a lily pad with subtle botanical patterns around it, a white mechanical keyboard with soft green LED backlight on top of the mat, a small ceramic frog figurine beside a glass of vibrant matcha latte, a monstera plant in a woven basket to the right, soft morning light filtering through sheer curtains, a small notebook open with a green pen, fresh calm cottagecore atmosphere, ${COZY_CORNERS_ANCHOR}`,
      },
      {
        slug: "pixel-speaker",
        name: "Divoom MiniToo Retro Pixel Speaker",
        category: "Tech",
        seed: 30004,
        guidanceScale: 3.5,
        affiliateLink: "[AFFILIATE_LINK_PIXEL_SPEAKER]",
        caption:
          "Retro vibes and pixel art meet cozy evenings 🎵✨ This Divoom MiniToo speaker shows a cute pixel bunny on screen beside hot chocolate, books, and fairy lights. #PixelSpeaker #Lofi #CozyDesk #RetroTech",
        prompt: `A retro PC-styled Divoom MiniToo pixel speaker on a warm wooden desk, the speaker's pixel LED screen displays a cute glowing pixel art bunny with a heart, soft warm light emanating from the screen, a ceramic mug of hot chocolate with mini marshmallows beside it, a vintage brass desk lamp with amber bulb casting warm light across the scene, a stack of paperback books with a silk bookmark hanging out, soft fairy lights strung across the wall in the background, a small trailing plant in a hanging pot, evening lofi atmosphere, cozy desk corner, ${COZY_CORNERS_ANCHOR}`,
      },
      {
        slug: "daisy-headphone-stand",
        name: "Wood Daisy Headphone Stand",
        category: "Desk Accessories",
        seed: 30005,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_DAISY_HEADPHONE_STAND]",
        caption:
          "Nature-inspired desk decor at its finest 🌼🎧 This wooden daisy headphone stand pairs cream headphones with dried flowers, chamomile tea, and golden afternoon light. #Cottagecore #DeskDecor #HeadphoneStand #CozyVibes",
        prompt: `A natural wood daisy-shaped headphone stand on a cottagecore wooden desk, the stand is carved from warm oak wood shaped like a blooming daisy flower, softly holding a pair of cream-colored vintage-style headphones draped over the daisy petals, a small ceramic vase with dried lavender and baby's breath beside it, a handwritten letter on cream paper with a burgundy wax seal, a steaming cup of chamomile tea in a ceramic mug, a small beeswax candle with a soft flame, warm golden afternoon light with visible dust motes floating in the air, floral cottage atmosphere, ${COZY_CORNERS_ANCHOR}`,
      },
    ],
  },

  "midnight-city": {
    slug: "midnight-city",
    name: "Midnight City",
    description:
      "Cyberpunk and noir aesthetic product scapes with neon-lit city nights, electric blue and magenta glow, and high-contrast cinematic lighting. Perfect for tech enthusiasts, gamers, and cyberpunk fans.",
    negativePrompt: MIDNIGHT_CITY_NEGATIVE_PROMPT,
    aspectRatio: "2:3",
    numOutputs: 3,
    products: [
      {
        slug: "rgb-circuit-mousepad",
        name: "Cyberpunk RGB Gaming Mouse Pad (Circuit Board)",
        category: "Gaming",
        seed: 50001,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_RGB_CIRCUIT_MOUSEPAD]",
        caption:
          "Power up your desk with this RGB circuit board gaming mouse pad 🖥️💜 Neon blue and magenta circuit lines glow across the surface, paired with a cyberpunk city backdrop. #Cyberpunk #RGB #GamingSetup #DeskSetup",
        prompt: `A large RGB gaming mouse pad with a glowing circuit board pattern on a dark cyberpunk desk, the pad illuminated with neon blue and magenta circuit lines tracing across the surface, a mechanical keyboard with cyan LED backlighting resting on the pad, a sleek futuristic gaming mouse with RGB glow, a geometric holographic-style desk lamp casting triangular light patterns across the desk, a dark window in the background showing a rainy neon-lit city skyline with towering skyscrapers and holographic billboards, steam rising from street vents below, chrome and glass textures throughout, ${MIDNIGHT_CITY_ANCHOR}`,
      },
      {
        slug: "neon-book-nook",
        name: "Neo Ramen MiniAlley Cyberpunk Book Nook Kit",
        category: "DIY/Kits",
        seed: 50002,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_NEON_BOOK_NOOK]",
        caption:
          "Build your own cyberpunk ramen alley 🏮🌃 This DIY book nook kit creates a miniature neon-lit street scene with glowing signs, lanterns, and rain effects. #BookNook #Cyberpunk #DIY #Miniature",
        prompt: `A completed DIY cyberpunk book nook miniature diorama on a dark wooden bookshelf, the book nook depicts a futuristic ramen alley with tiny glowing neon signs in pink, cyan, and warm yellow, miniature lanterns hanging above, steam rising from small food stalls, tiny rain-slicked street reflecting neon light, the book nook's built-in tiny LED lights illuminating the entire miniature scene from within, placed between books with dark cyberpunk-themed spines and metallic foil accents, soft ambient light from the shelf's hidden LED strip casting dramatic shadows, the miniature details are intricate and highly realistic, ${MIDNIGHT_CITY_ANCHOR}`,
      },
      {
        slug: "times-gate-clock",
        name: "Divoom Times Gate Cyberpunk Digital Clock",
        category: "Tech",
        seed: 50003,
        guidanceScale: 3.5,
        affiliateLink: "[AFFILIATE_LINK_TIMES_GATE_CLOCK]",
        caption:
          "Track crypto in style with this cyberpunk digital clock ⏰💚 Neon green Bitcoin dashboard on a pixel LED display, brushed silver body, and RGB accent lighting. #Cyberpunk #Crypto #DeskClock #TechDecor",
        prompt: `A Divoom Times Gate cyberpunk digital clock on a dark minimalist desk, the clock's pixel LED display is glowing with a Bitcoin and crypto dashboard in bright neon green and electric blue, real-time data visuals and charts scrolling across the screen, the clock has a brushed silver metallic body with subtle RGB accent lighting along its edges, the desk surface is dark and clean with a single braided neon cable trailing from the clock, a black coffee mug with a subtle tech logo beside it, the room is dark with the clock as the primary light source casting green and blue ambient glow across the desk surface, hacker den atmosphere, ${MIDNIGHT_CITY_ANCHOR}`,
      },
      {
        slug: "mech-hand-stand",
        name: "Silverhand Mechanical Hand Controller Stand",
        category: "Gaming",
        seed: 50004,
        guidanceScale: 4.0,
        affiliateLink: "[AFFILIATE_LINK_MECH_HAND_STAND]",
        caption:
          "Level up your gaming setup with this chrome mechanical hand controller stand 🦾🎮 Articulated fingers, neon rim lighting, and pure Blade Runner vibes. #Cyberpunk #GamingSetup #ControllerStand #Silverhand",
        prompt: `A chrome mechanical hand controller stand on a dark cyberpunk desk, the articulated mechanical hand is posed mid-grip with a futuristic game controller held between its chrome fingers, the hand has a brushed chrome metallic finish with subtle neon blue LED glow emanating from its joint mechanisms, the desk surface is black glass with a holographic reflection beneath the hand, a dark wall behind displays a glowing cyberpunk city mural or holographic decal with neon signs in blue and magenta, blue and magenta neon rim lighting tracing the edges of the mechanical hand, chrome and glass textures throughout, dramatic shadows, Blade Runner inspired atmosphere, ${MIDNIGHT_CITY_ANCHOR}`,
      },
      {
        slug: "neon-city-desk-mat",
        name: "Neon City Extra-Large Desk Mat (Cityscape Print)",
        category: "Gaming",
        seed: 50005,
        guidanceScale: 3.5,
        affiliateLink: "[AFFILIATE_LINK_NEON_CITY_DESK_MAT]",
        caption:
          "Anchoring your entire cyberpunk desk setup 🌆💙 This extra-large desk mat features a glowing neon cityscape with flying vehicles and rain effects. #Cyberpunk #DeskSetup #DeskMat #NeonCity",
        prompt: `An extra-large desk mat featuring a neon cyberpunk cityscape print covering a dark wooden desk, the mat depicts a futuristic city skyline at night with towering skyscrapers, glowing neon signs in electric blue, magenta, and warning yellow, flying vehicles with light trails weaving between buildings, subtle rain effects on the city illustration, a minimalist black mechanical keyboard and a sleek futuristic mouse resting on the mat, a small desktop neon sign reading "NEON" in pink light, warm amber desk lamp light from one side contrasting with cool blue neon glow from the cityscape pattern, the desk mat's edges have a subtle stitched border, cyberpunk desk atmosphere, ${MIDNIGHT_CITY_ANCHOR}`,
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