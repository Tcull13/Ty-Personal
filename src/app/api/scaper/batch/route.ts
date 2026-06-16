import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import fs from "fs";
import path from "path";
import { BATCHES, ScapeBatch, ScapeProduct } from "@/lib/scaper-config";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const FLUX_PRO_MODEL = "black-forest-labs/flux-pro";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json(
        {
          error:
            "REPLICATE_API_TOKEN not configured. Set it in .env.local or environment variables.",
          setup_instructions:
            "1. Sign up at https://replicate.com\n2. Get API token at https://replicate.com/account/api-tokens\n3. Add REPLICATE_API_TOKEN to .env.local",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const batchSlug: string = body.batch || "neon-nights";
    const specificProduct: string | undefined = body.product;
    const runMode: "generate" | "metadata-only" = body.mode || "generate";

    const batch = BATCHES[batchSlug];
    if (!batch) {
      return NextResponse.json(
        {
          error: `Unknown batch "${batchSlug}". Available: ${Object.keys(BATCHES).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const productsToGenerate = specificProduct
      ? batch.products.filter((p) => p.slug === specificProduct)
      : batch.products;

    if (productsToGenerate.length === 0) {
      return NextResponse.json(
        { error: `No products found for slug "${specificProduct}"` },
        { status: 400 }
      );
    }

    const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });
    const results: any[] = [];

    for (const product of productsToGenerate) {
      console.log(
        `[Product Scaper] Generating "${product.name}" (${product.slug})...`
      );

      let imageUrls: string[] = [];

      if (runMode === "generate") {
        const output = await replicate.run(FLUX_PRO_MODEL, {
          input: {
            prompt: product.prompt,
            negative_prompt: batch.negativePrompt,
            aspect_ratio: batch.aspectRatio,
            num_outputs: batch.numOutputs,
            output_format: "webp",
            guidance_scale: product.guidanceScale,
            seed: product.seed,
            safety_tolerance: 2,
          },
        });

        imageUrls = Array.isArray(output)
          ? output.map((u) => String(u))
          : [String(output)];
      }

      // Build metadata
      const now = new Date().toISOString();
      const metadata = {
        product_slug: product.slug,
        product_name: product.name,
        category: product.category,
        batch: batchSlug,
        batch_name: batch.name,
        seed: product.seed,
        generated_at: runMode === "generate" ? now : null,
        affiliate_link: product.affiliateLink,
        pinterest_caption: product.caption,
        aspect_ratio: batch.aspectRatio,
        guidance_scale: product.guidanceScale,
        images: imageUrls,
        num_variations: imageUrls.length,
        status: runMode === "generate" ? "generated" : "metadata-only",
      };

      results.push(metadata);
    }

    const endTime = Date.now();
    const totalDurationMs = endTime - startTime;

    return NextResponse.json({
      success: true,
      batch: batchSlug,
      batch_name: batch.name,
      products_generated: results.length,
      total_duration_ms: totalDurationMs,
      total_duration_seconds: (totalDurationMs / 1000).toFixed(1),
      estimated_cost_usd: (
        results.reduce(
          (sum, r) => sum + r.num_variations * 0.05,
          0
        )
      ).toFixed(2),
      results,
    });
  } catch (error: any) {
    const endTime = Date.now();
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        duration_ms: endTime - startTime,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return available batches and products (no generation)
  const { searchParams } = new URL(request.url);
  const batchSlug = searchParams.get("batch");

  if (batchSlug) {
    const batch = BATCHES[batchSlug];
    if (!batch) {
      return NextResponse.json(
        { error: `Unknown batch "${batchSlug}"` },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      batch: {
        slug: batch.slug,
        name: batch.name,
        description: batch.description,
        aspect_ratio: batch.aspectRatio,
        products: batch.products.map((p) => ({
          slug: p.slug,
          name: p.name,
          category: p.category,
          seed: p.seed,
        })),
      },
    });
  }

  // Return all batches overview
  const overview = Object.values(BATCHES).map((batch) => ({
    slug: batch.slug,
    name: batch.name,
    description: batch.description,
    product_count: batch.products.length,
    aspect_ratio: batch.aspectRatio,
    products: batch.products.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
    })),
  }));

  return NextResponse.json({ success: true, batches: overview });
}