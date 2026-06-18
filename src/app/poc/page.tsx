"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BATCHES } from "@/lib/scaper-config";

type ScapeResult = {
  product_slug: string;
  product_name: string;
  category: string;
  batch: string;
  images: string[];
  pinterest_caption: string;
  affiliate_link: string;
  seed: number;
  status: string;
};

export default function VibeVaultPage() {
  const [selectedBatch, setSelectedBatch] = useState("neon-nights");
  const [results, setResults] = useState<ScapeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "scaper">("preview");

  const batch = BATCHES[selectedBatch];

  async function generateBatch() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scaper/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: selectedBatch, mode: "generate" }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function generateProduct(productSlug: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scaper/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: selectedBatch,
          product: productSlug,
          mode: "generate",
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Merge or replace single product result
      setResults((prev) => {
        const filtered = prev.filter(
          (r) => r.product_slug !== productSlug
        );
        return [...filtered, ...data.results];
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const batchInfo = BATCHES[selectedBatch];

  return (
    <div className="min-h-dvh">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vibe-purple via-vibe-pink to-vibe-cyan flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 3L20 9V15L12 21L4 15V9L12 3Z" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="4" y1="9" x2="20" y2="9" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg">VibeVault</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => setActiveTab("preview")}
              className={`transition-colors ${
                activeTab === "preview" ? "text-white" : "text-muted hover:text-white"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("scaper")}
              className={`transition-colors ${
                activeTab === "scaper" ? "text-white" : "text-muted hover:text-white"
              }`}
            >
              Scaper
            </button>
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition-all"
            >
              Exit
            </Link>
          </div>
        </div>
      </nav>

      {activeTab === "preview" ? (
        <div className="pt-24 px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                VibeVault{" "}
                <span className="gradient-text">Product Scapes</span>
              </h1>
              <p className="text-muted max-w-2xl mx-auto">
                AI-generated atmospheric backgrounds for affiliate products.
                Each "Scape" pairs a product with a curated aesthetic scene.
              </p>
            </div>

            {/* Batch selector */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {Object.entries(BATCHES).map(([slug, b]) => (
                <button
                  key={slug}
                  onClick={() => {
                    setSelectedBatch(slug);
                    setResults([]);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedBatch === slug
                      ? "bg-gradient-to-r from-vibe-purple to-vibe-pink text-white"
                      : "bg-surface border border-white/10 text-muted hover:text-white"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* Batch description */}
            {batchInfo && (
              <p className="text-center text-muted text-sm mb-8 max-w-xl mx-auto">
                {batchInfo.description}
              </p>
            )}

            {/* Products Grid */}
            {batchInfo && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {batchInfo.products.map((product) => {
                  const result = results.find(
                    (r) => r.product_slug === product.slug
                  );
                  return (
                    <div
                      key={product.slug}
                      className="group rounded-2xl bg-surface border border-white/[0.06] overflow-hidden hover:border-white/10 transition-all"
                    >
                      {/* Image */}
                      <div className="aspect-[2/3] bg-black/50 flex items-center justify-center overflow-hidden relative">
                        {result?.images?.[0] ? (
                          <img
                            src={result.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-vibe-purple/20 to-vibe-pink/20 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-vibe-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                              </svg>
                            </div>
                            <p className="text-xs text-muted">
                              Click "Generate" to create Scape
                            </p>
                          </div>
                        )}

                        {/* Generate overlay */}
                        {!result && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => generateProduct(product.slug)}
                              disabled={loading}
                              className="px-4 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 transition-all disabled:opacity-50"
                            >
                              {loading ? "..." : "Generate Scape"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3 space-y-2">
                        <div className="text-xs text-vibe-cyan font-medium">
                          {product.category}
                        </div>
                        <h3 className="font-display font-semibold text-sm leading-tight">
                          {product.name}
                        </h3>

                        {/* Affiliate Link Placeholder */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-muted">Link:</span>
                          <code className="text-vibe-purple bg-white/5 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[180px]">
                            {result?.affiliate_link || product.affiliateLink}
                          </code>
                        </div>

                        {/* Pinterest Caption */}
                        {result && (
                          <details className="group">
                            <summary className="text-[10px] text-muted cursor-pointer hover:text-white transition-colors">
                              Pinterest caption
                            </summary>
                            <p className="text-[10px] text-muted mt-1 leading-relaxed">
                              {result.pinterest_caption}
                            </p>
                          </details>
                        )}

                        {/* Regenerate button */}
                        {result && (
                          <button
                            onClick={() => generateProduct(product.slug)}
                            disabled={loading}
                            className="w-full py-1.5 rounded-full border border-white/10 text-xs text-muted hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                          >
                            {loading ? "Generating..." : "↻ Regenerate"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Batch generate button */}
            {batchInfo && (
              <div className="text-center mt-8">
                <button
                  onClick={generateBatch}
                  disabled={loading}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-vibe-purple to-vibe-pink text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading
                    ? `Generating ${batchInfo.products.length} Scapes...`
                    : `Generate All ${batchInfo.products.length} Scapes`}
                </button>
                <p className="text-xs text-muted mt-2">
                  ~$0.25 per batch (5 products × 3 variations × $0.05 each
                  ÷ 3 selected)
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Results metadata */}
            {results.length > 0 && (
              <div className="mt-8 p-4 rounded-xl bg-surface border border-white/[0.06]">
                <h3 className="font-display font-semibold text-sm mb-3">
                  Generation Report
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-muted text-xs">Products</div>
                    <div className="font-medium">
                      {results.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted text-xs">Variations</div>
                    <div className="font-medium">
                      {results.reduce((s, r) => s + r.images.length, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted text-xs">Est. Cost</div>
                    <div className="font-medium">
                      ${(results.reduce((s, r) => s + r.images.length, 0) * 0.05).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted text-xs">Batch</div>
                    <div className="font-medium capitalize">
                      {batchInfo.name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* === SCAPER TAB === */
        <div className="pt-24 px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                🏗️ Product <span className="gradient-text">Scaper</span>
              </h1>
              <p className="text-muted max-w-xl mx-auto">
                Automated batch generation pipeline for Vibe Scapes. Configure,
                generate, and manage product visuals for all aesthetic batches.
              </p>
            </div>

            {/* Batch selection */}
            <div className="grid gap-4">
              {Object.entries(BATCHES).map(([slug, batch]) => (
                <div
                  key={slug}
                  className="p-6 rounded-2xl bg-surface border border-white/[0.06]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg">
                        {batch.name}
                      </h3>
                      <p className="text-muted text-sm mt-1">
                        {batch.description}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted">
                      <div>{batch.products.length} products</div>
                      <div>{batch.aspectRatio} ratio</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {batch.products.map((product) => (
                      <div
                        key={product.slug}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/20"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {product.name}
                          </div>
                          <div className="text-xs text-muted">
                            {product.category} · Seed {product.seed}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-[10px] text-vibe-cyan bg-white/5 px-2 py-1 rounded">
                            {product.affiliateLink}
                          </code>
                          <button
                            onClick={() => generateProduct(product.slug)}
                            disabled={loading}
                            className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition-all disabled:opacity-50"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBatch(slug);
                        generateBatch();
                      }}
                      disabled={loading}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-vibe-purple to-vibe-pink text-white text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      Generate All ({batch.products.length})
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBatch(slug);
                        setActiveTab("preview");
                      }}
                      className="px-4 py-2 rounded-full border border-white/10 text-muted text-xs hover:text-white transition-all"
                    >
                      View Gallery
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Future batch placeholder */}
            <div className="mt-6 p-6 rounded-2xl border border-dashed border-white/10 text-center">
              <p className="text-muted text-sm">
                ✨ Future batches: <strong>Storied Pages</strong> (Dark
                Academia), <strong>Dream Worlds</strong> (Fantasy /
                Ethereal), <strong>Midnight City</strong> (Cyberpunk / Noir)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}