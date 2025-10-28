import axios from 'axios'
import * as cheerio from 'cheerio'

export interface AmazonProduct {
  productId: string
  title: string
  price: string | null
  imageUrl: string | null
  category: string | null
}

/**
 * Extract Amazon product information from a URL
 */
export async function scrapeAmazonProduct(url: string): Promise<AmazonProduct> {
  try {
    // Extract ASIN from URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/) || url.match(/\/gp\/product\/([A-Z0-9]{10})/)

    if (!asinMatch) {
      throw new Error('Invalid Amazon URL - could not extract product ID')
    }

    const productId = asinMatch[1]

    // Fetch the product page
    const response = await axios.get(`https://www.amazon.com/dp/${productId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    })

    const $ = cheerio.load(response.data)

    // Extract product information
    const title = $('#productTitle').text().trim() ||
                  $('span#productTitle').text().trim() ||
                  'Product Title'

    const price = $('.a-price .a-offscreen').first().text().trim() ||
                  $('#priceblock_ourprice').text().trim() ||
                  $('#priceblock_dealprice').text().trim() ||
                  null

    const imageUrl = $('#landingImage').attr('src') ||
                     $('#imgBlkFront').attr('src') ||
                     $('.a-dynamic-image').first().attr('src') ||
                     null

    const category = $('#wayfinding-breadcrumbs_feature_div a').first().text().trim() ||
                     null

    return {
      productId,
      title: title.substring(0, 200), // Limit title length
      price,
      imageUrl,
      category,
    }
  } catch (error: any) {
    console.error('Error scraping Amazon product:', error.message)

    // Return minimal data if scraping fails
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/) || url.match(/\/gp\/product\/([A-Z0-9]{10})/)
    return {
      productId: asinMatch?.[1] || 'unknown',
      title: 'Amazon Product',
      price: null,
      imageUrl: null,
      category: null,
    }
  }
}

/**
 * Add or validate affiliate tag in Amazon URL
 */
export function addAffiliateTag(url: string, affiliateTag: string): string {
  try {
    const urlObj = new URL(url)

    // Remove existing tag parameter if present
    urlObj.searchParams.delete('tag')

    // Add the affiliate tag
    urlObj.searchParams.set('tag', affiliateTag)

    return urlObj.toString()
  } catch (error) {
    console.error('Error adding affiliate tag:', error)
    return url
  }
}

/**
 * Validate if URL is an Amazon product URL
 */
export function isValidAmazonUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const isAmazonDomain = urlObj.hostname.includes('amazon.com') ||
                          urlObj.hostname.includes('amzn.to')

    const hasProductId = /\/dp\/[A-Z0-9]{10}/.test(url) ||
                        /\/gp\/product\/[A-Z0-9]{10}/.test(url)

    return isAmazonDomain && hasProductId
  } catch {
    return false
  }
}
