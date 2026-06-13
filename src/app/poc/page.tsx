"use client";

import { useState } from "react";
import Link from "next/link";

// 6-panel "Neon Nights" comic prompts based on the research report
// Using vaporwave/synthwave aesthetic with a simple narrative arc
const NEON_NIGHTS_PROMPTS = [
  {
    panel: "Panel 1 — Establishing Shot",
    prompt:
      "Neon-lit cyberpunk city street at night, rain-slicked pavement reflects purple and pink neon signs, retro-future synthwave aesthetic, chrome buildings with grid patterns, cinematic composition, vaporwave atmosphere, comic book style --ar 3:2",
  },
  {
    panel: "Panel 2 — Protagonist Intro",
    prompt:
      "Close-up of a silhouette figure in a chrome trenchcoat standing under a glowing neon sign, purple and cyan light casting dramatic shadows, synthwave vaporwave aesthetic, comic book panel style, cinematic lighting --ar 3:2",
  },
  {
    panel: "Panel 3 — Action Beat",
    prompt:
      "Dynamic action scene in a neon-lit alley, electric blue and hot pink reflections on wet surfaces, retro-future cyberpunk aesthetic, comic book panel composition, dramatic motion --ar 3:2",
  },
  {
    panel: "Panel 4 — Dialogue / Confrontation",
    prompt:
      "Two characters face off in a dimly lit bar with neon tube lighting, green and magenta ambiance, synthwave vaporwave decor, comic book panel perspective, cinematic angle --ar 3:2",
  },
  {
    panel: "Panel 5 — Chase Sequence",
    prompt:
      "Fast-paced chase through a neon-grid cityscape at night, motion blur on glowing signs, cyberpunk aesthetic with retro-wave color palette, comic book dynamic panel style --ar 3:2",
  },
  {
    panel: "Panel 6 — Climax / Reveal",
    prompt:
      "Wide shot of a rooftop overlooking a neon-drenched city, single figure at the edge bathed in purple and gold light, synthwave sunset sky with grid pattern overlay, epic comic book splash panel --ar 3:2",
  },
];

export default function POCPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [benchmarks, setBenchmarks] = useState<any>(null);
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  async function generateSinglePanel(index: number) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: NEON_NIGHTS_PROMPTS[index].prompt,
          aspect_ratio: "3:2",
          num_outputs: 1,
          output_format: "webp",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Generation failed");
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function generateAllPanels() {
    setLoading(true);
    setError(null);
    setResults([]);
    setBenchmarks(null);

    const allResults: any[] = [];
    let totalDuration = 0;

    for (let i = 0; i < NEON_NIGHTS_PROMPTS.length; i++) {
      const data = await generateSinglePanel(i);
      if (data) {
        allResults.push({
          panel: NEON_NIGHTS_PROMPTS[i].panel,
          index: i + 1,
          images: data.images,
          metadata: data.metadata,
        });
        totalDuration += data.metadata?.duration_ms || 0;
      } else {
        allResults.push({
          panel: NEON_NIGHTS_PROMPTS[i].panel,
          index: i + 1,
          images: [],
          metadata: null,
          error: "Failed to generate",
        });
      }
    }

    setResults(allResults);
    setBenchmarks({
      total_panels: NEON_NIGHTS_PROMPTS.length,
      generated: allResults.filter((r) => r.images.length > 0).length,
      failed: allResults.filter((r) => r.images.length === 0).length,
      total_duration_ms: totalDuration,
      total_duration_seconds: (totalDuration / 1000).toFixed(1),
      avg_duration_per_panel_ms: Math.round(
        totalDuration / NEON_NIGHTS_PROMPTS.length
      ),
      estimated_total_cost_usd: (allResults.filter((r) => r.images.length > 0)
        .length * 0.05).toFixed(2),
      estimated_cost_per_page: (6 * 0.05).toFixed(2), // 6 panels per page
    });
  }

  async function generateSingle() {
    setLoading(true);
    setError(null);

    const data = await generateSinglePanel(selectedPrompt);
    if (data) {
      setResults([
        {
          panel: NEON_NIGHTS_PROMPTS[selectedPrompt].panel,
          index: selectedPrompt + 1,
          images: data.images,
          metadata: data.metadata,
        },
      ]);
    }
  }

  return (
    <div className="min-h-dvh px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vibe-purple via-vibe-pink to-vibe-cyan flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M12 3L20 9V15L12 21L4 15V9L12 3Z" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="4" y1="9" x2="20" y2="9" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg">VibeScapes</span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Flux Pro{" "}
            <span className="gradient-text">Proof-of-Concept</span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Testing Flux Pro via Replicate API for the{" "}
            <span className="text-white font-medium">&quot;Neon Nights&quot;</span>{" "}
            comic template. This generates 6 panels of a vaporwave/synthwave
            comic story to benchmark quality, latency, and cost.
          </p>
        </div>

        {/* Setup status */}
        <div className="mb-8 p-4 rounded-xl bg-surface border border-white/[0.06] text-sm">
          <p className="text-muted">
            <strong className="text-white">Setup required:</strong> Add your
            Replicate API token to{" "}
            <code className="text-vibe-cyan bg-white/5 px-1.5 py-0.5 rounded">
              .env.local
            </code>{" "}
            as <code className="text-vibe-cyan bg-white/5 px-1.5 py-0.5 rounded">
              REPLICATE_API_TOKEN
            </code>.
            <br />
            Get one at{" "}
            <a
              href="https://replicate.com/account/api-tokens"
              className="text-vibe-purple hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              replicate.com/account/api-tokens
            </a>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm text-muted mb-2">
              Test single panel:
            </label>
            <div className="flex gap-2">
              <select
                value={selectedPrompt}
                onChange={(e) => setSelectedPrompt(Number(e.target.value))}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-white/10 text-white text-sm focus:outline-none focus:border-vibe-purple/50"
              >
                {NEON_NIGHTS_PROMPTS.map((p, i) => (
                  <option key={i} value={i}>
                    {p.panel}
                  </option>
                ))}
              </select>
              <button
                onClick={generateSingle}
                disabled={loading}
                className="px-5 py-2 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateAllPanels}
              disabled={loading}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-vibe-purple to-vibe-pink text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading
                ? "Generating All 6 Panels..."
                : "Generate Full 6-Panel Page"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Benchmarks */}
        {benchmarks && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Total Panels", value: benchmarks.total_panels },
              { label: "Generated", value: benchmarks.generated },
              { label: "Failed", value: benchmarks.failed },
              {
                label: "Total Time",
                value: `${benchmarks.total_duration_seconds}s`,
              },
              {
                label: "Avg/Panel",
                value: `${(benchmarks.avg_duration_per_panel_ms / 1000).toFixed(1)}s`,
              },
              {
                label: "Est. Cost/Page",
                value: `$${benchmarks.estimated_cost_per_page}`,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-surface border border-white/[0.06] text-center"
              >
                <div className="text-2xl font-display font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && (
          <div
            className={`grid gap-4 ${results.length === 1 ? "grid-cols-1 max-w-lg mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
          >
            {results.map((result, i) => (
              <div
                key={i}
                className="rounded-2xl bg-surface border border-white/[0.06] overflow-hidden"
              >
                {/* Panel Header */}
                <div className="p-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-vibe-purple to-vibe-pink flex items-center justify-center text-xs font-bold">
                      {result.index}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {result.panel}
                      </div>
                      {result.metadata && (
                        <div className="text-xs text-muted">
                          {result.metadata.duration_seconds}s · ~$0.05
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="aspect-[3/2] bg-black/50 flex items-center justify-center overflow-hidden">
                  {result.images.length > 0 ? (
                    <img
                      src={result.images[0]}
                      alt={result.panel}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted text-sm">Failed to generate</div>
                  )}
                </div>

                {/* Prompt */}
                <div className="p-3">
                  <details className="group">
                    <summary className="text-xs text-muted cursor-pointer hover:text-white transition-colors">
                      View prompt
                    </summary>
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      {NEON_NIGHTS_PROMPTS[result.index - 1]?.prompt}
                    </p>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-vibe-purple/30 border-t-vibe-purple animate-spin mb-4" />
            <p className="text-muted text-sm">
              Generating panels... (each takes 5-15 seconds)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}