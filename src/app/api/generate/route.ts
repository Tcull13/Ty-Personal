import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Flux Pro model on Replicate
// https://replicate.com/black-forest-labs/flux-pro
const FLUX_PRO_MODEL = "black-forest-labs/flux-pro";
const FLUX_DEV_MODEL = "black-forest-labs/flux-dev";

interface GenerateRequest {
  prompt: string;
  model?: "flux-pro" | "flux-dev";
  aspect_ratio?: string;
  num_outputs?: number;
  output_format?: "png" | "jpeg" | "webp";
  safety_tolerance?: number;
}

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

    const body: GenerateRequest = await request.json();

    if (!body.prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN,
    });

    const model =
      body.model === "flux-dev" ? FLUX_DEV_MODEL : FLUX_PRO_MODEL;
    const aspectRatio = body.aspect_ratio || "3:2";
    const numOutputs = body.num_outputs || 1;
    const outputFormat = body.output_format || "webp";
    const safetyTolerance = body.safety_tolerance ?? 2;

    console.log(
      `[Flux Pro POC] Generating with model=${model}, prompt="${body.prompt.substring(0, 60)}...", aspect_ratio=${aspectRatio}`
    );

    // Call Replicate's Flux Pro model
    const output = await replicate.run(model, {
      input: {
        prompt: body.prompt,
        aspect_ratio: aspectRatio,
        num_outputs: numOutputs,
        output_format: outputFormat,
        safety_tolerance: safetyTolerance,
      },
    });

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    // Replicate returns an array of image URLs
    const imageUrls = Array.isArray(output)
      ? output.map((u) => String(u))
      : [String(output)];

    console.log(
      `[Flux Pro POC] Completed in ${durationMs}ms. Generated ${imageUrls.length} image(s).`
    );

    return NextResponse.json({
      success: true,
      images: imageUrls,
      metadata: {
        model,
        prompt: body.prompt,
        aspect_ratio: aspectRatio,
        duration_ms: durationMs,
        duration_seconds: (durationMs / 1000).toFixed(1),
        num_images: imageUrls.length,
        estimated_cost_usd: imageUrls.length * 0.05, // ~$0.05/image for Flux Pro
      },
    });
  } catch (error: any) {
    const endTime = Date.now();
    const durationMs = endTime - startTime;

    console.error(`[Flux Pro POC] Error after ${durationMs}ms:`, error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        metadata: {
          duration_ms: durationMs,
          duration_seconds: (durationMs / 1000).toFixed(1),
        },
      },
      { status: 500 }
    );
  }
}