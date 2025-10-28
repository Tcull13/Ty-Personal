import axios from 'axios'

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5'

export interface PinterestBoard {
  id: string
  name: string
  description?: string
}

export interface CreatePinParams {
  boardId: string
  title: string
  description: string
  imageUrl: string
  link: string
  altText?: string
}

export class PinterestClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Get user's Pinterest boards
   */
  async getBoards(): Promise<PinterestBoard[]> {
    try {
      const response = await axios.get(`${PINTEREST_API_BASE}/boards`, {
        headers: this.getHeaders(),
      })

      return response.data.items || []
    } catch (error: any) {
      console.error('Error fetching Pinterest boards:', error.response?.data || error.message)
      throw new Error('Failed to fetch Pinterest boards')
    }
  }

  /**
   * Create a new pin
   */
  async createPin(params: CreatePinParams): Promise<string> {
    try {
      const pinData = {
        board_id: params.boardId,
        title: params.title,
        description: params.description,
        link: params.link,
        media_source: {
          source_type: 'image_url',
          url: params.imageUrl,
        },
        alt_text: params.altText || params.title,
      }

      const response = await axios.post(
        `${PINTEREST_API_BASE}/pins`,
        pinData,
        {
          headers: this.getHeaders(),
        }
      )

      return response.data.id
    } catch (error: any) {
      console.error('Error creating Pinterest pin:', error.response?.data || error.message)
      throw new Error(`Failed to create Pinterest pin: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Delete a pin
   */
  async deletePin(pinId: string): Promise<void> {
    try {
      await axios.delete(`${PINTEREST_API_BASE}/pins/${pinId}`, {
        headers: this.getHeaders(),
      })
    } catch (error: any) {
      console.error('Error deleting Pinterest pin:', error.response?.data || error.message)
      throw new Error('Failed to delete Pinterest pin')
    }
  }

  /**
   * Get pin analytics (if available)
   */
  async getPinAnalytics(pinId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${PINTEREST_API_BASE}/pins/${pinId}/analytics`,
        {
          headers: this.getHeaders(),
          params: {
            metric_types: 'IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK',
          },
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Error fetching pin analytics:', error.response?.data || error.message)
      return null
    }
  }
}

/**
 * OAuth: Get Pinterest authorization URL
 */
export function getPinterestAuthUrl(redirectUri: string): string {
  const appId = process.env.PINTEREST_APP_ID
  const scope = 'boards:read,pins:read,pins:write'

  return `https://www.pinterest.com/oauth/?client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&state=${Math.random().toString(36).substring(7)}`
}

/**
 * OAuth: Exchange code for access token
 */
export async function exchangePinterestCode(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken?: string }> {
  try {
    const response = await axios.post('https://api.pinterest.com/v5/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.PINTEREST_APP_ID,
      client_secret: process.env.PINTEREST_APP_SECRET,
    })

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    }
  } catch (error: any) {
    console.error('Error exchanging Pinterest code:', error.response?.data || error.message)
    throw new Error('Failed to authenticate with Pinterest')
  }
}

/**
 * Refresh Pinterest access token
 */
export async function refreshPinterestToken(
  refreshToken: string
): Promise<string> {
  try {
    const response = await axios.post('https://api.pinterest.com/v5/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.PINTEREST_APP_ID,
      client_secret: process.env.PINTEREST_APP_SECRET,
    })

    return response.data.access_token
  } catch (error: any) {
    console.error('Error refreshing Pinterest token:', error.response?.data || error.message)
    throw new Error('Failed to refresh Pinterest token')
  }
}
