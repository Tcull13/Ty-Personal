import OpenAI from 'openai'
import { AmazonProduct } from '../amazon-scraper'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GeneratedPin {
  title: string
  description: string
  imageUrl: string
  generatedWith: string
  prompt: string
}

/**
 * Generate compelling Pinterest pin copy
 */
export async function generatePinCopy(
  product: AmazonProduct,
  style: string = 'auto'
): Promise<{ title: string; description: string }> {
  try {
    const stylePrompts: Record<string, string> = {
      auto: 'engaging and click-worthy',
      minimal: 'minimalist and clean',
      bold: 'bold and attention-grabbing',
      elegant: 'elegant and sophisticated',
    }

    const styleDescription = stylePrompts[style] || stylePrompts.auto

    const prompt = `Create Pinterest pin copy for this product:
Title: ${product.title}
Price: ${product.price || 'Check price'}
Category: ${product.category || 'General'}

Generate:
1. A catchy Pinterest pin title (max 100 characters) - ${styleDescription}
2. A compelling description (max 500 characters) that includes:
   - Key benefits
   - Call to action
   - Relevant hashtags
   - Use of emojis where appropriate

Format your response as JSON with "title" and "description" fields.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a Pinterest marketing expert who creates viral pin copy that drives clicks and conversions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    })

    const content = response.choices[0].message.content
    const result = JSON.parse(content || '{}')

    return {
      title: result.title || product.title.substring(0, 100),
      description: result.description || `Check out this amazing product! ${product.title}`,
    }
  } catch (error) {
    console.error('Error generating pin copy:', error)
    return {
      title: product.title.substring(0, 100),
      description: `${product.title} - Click to learn more!`,
    }
  }
}

/**
 * Generate Pinterest pin image using DALL-E
 */
export async function generatePinImage(
  product: AmazonProduct,
  style: string = 'auto'
): Promise<string> {
  try {
    const stylePrompts: Record<string, string> = {
      auto: 'modern, clean design with vibrant colors',
      minimal: 'minimalist design with lots of white space',
      bold: 'bold colors, dramatic lighting, eye-catching',
      elegant: 'elegant, sophisticated, muted tones',
    }

    const styleDescription = stylePrompts[style] || stylePrompts.auto

    // Create a visually appealing prompt for DALL-E
    const imagePrompt = `Create a Pinterest-style promotional image for: ${product.title.substring(0, 100)}.
Style: ${styleDescription}.
The image should be vertical (Pinterest pin format), highly aesthetic,
include subtle product imagery, attractive typography overlay with the product name,
modern design, perfect for social media marketing. No photos of real products,
use illustrations or abstract representations.`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1792', // Pinterest pin dimensions (roughly 9:16)
      quality: 'standard',
    })

    return response.data[0].url || ''
  } catch (error) {
    console.error('Error generating pin image:', error)
    // Fall back to product image if available
    return product.imageUrl || ''
  }
}

/**
 * Generate complete Pinterest pin (image + copy)
 */
export async function generateCompletePinContent(
  product: AmazonProduct,
  style: string = 'auto',
  customText?: string
): Promise<GeneratedPin> {
  try {
    // Generate pin copy and image in parallel
    const [pinCopy, imageUrl] = await Promise.all([
      generatePinCopy(product, style),
      generatePinImage(product, style),
    ])

    // Override description with custom text if provided
    const description = customText || pinCopy.description

    return {
      title: pinCopy.title,
      description,
      imageUrl,
      generatedWith: 'openai-dalle3',
      prompt: `Style: ${style}, Product: ${product.title}`,
    }
  } catch (error) {
    console.error('Error generating complete pin content:', error)
    throw new Error('Failed to generate pin content')
  }
}

/**
 * Alternative: Generate pin using product image + AI overlay
 * This is cheaper and faster than DALL-E
 */
export async function generateQuickPinContent(
  product: AmazonProduct,
  style: string = 'auto',
  customText?: string
): Promise<GeneratedPin> {
  try {
    const pinCopy = await generatePinCopy(product, style)

    return {
      title: pinCopy.title,
      description: customText || pinCopy.description,
      imageUrl: product.imageUrl || '', // Use original product image
      generatedWith: 'openai-gpt4',
      prompt: `Quick mode - Style: ${style}`,
    }
  } catch (error) {
    console.error('Error generating quick pin content:', error)
    throw new Error('Failed to generate pin content')
  }
}
