import https from 'https'
import { URLSearchParams } from 'url'
import { toApiError } from '../../utils/apiError'

interface RecaptchaVerificationResponse {
  success: boolean
  score?: number
  action?: string
  hostname?: string
  challenge_ts?: string
  'error-codes'?: string[]
}

export class RecaptchaService {
  private readonly endpoint = 'https://www.google.com/recaptcha/api/siteverify'

  constructor(private readonly secret: string) {}

  private async request(body: string): Promise<RecaptchaVerificationResponse> {
    return new Promise((resolve, reject) => {
      const req = https.request(
        this.endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          const chunks: Buffer[] = []
          res.on('data', (chunk) => {
            chunks.push(chunk)
          })
          res.on('end', () => {
            if (!res.statusCode || res.statusCode >= 400) {
              reject(toApiError(500, 'Failed to verify reCAPTCHA'))
              return
            }
            try {
              const payload = Buffer.concat(chunks).toString('utf-8')
              const parsed = JSON.parse(payload) as RecaptchaVerificationResponse
              resolve(parsed)
            } catch (error) {
              reject(error)
            }
          })
        }
      )
      req.on('error', (err) => reject(err))
      req.write(body)
      req.end()
    })
  }

  async verify(token?: string | null) {
    if (!token) {
      throw toApiError(400, 'Missing reCAPTCHA token')
    }
    if (!this.secret) {
      throw toApiError(500, 'reCAPTCHA not configured')
    }

    const params = new URLSearchParams({
      secret: this.secret,
      response: token,
    })

    let result: RecaptchaVerificationResponse
    try {
      result = await this.request(params.toString())
    } catch (error) {
      throw toApiError(500, 'Failed to verify reCAPTCHA')
    }

    if (!result.success) {
      throw toApiError(403, 'reCAPTCHA verification failed', {
        details: result['error-codes'],
      })
    }

    if (typeof result.score === 'number' && result.score < 0.3) {
      throw toApiError(403, 'reCAPTCHA score too low')
    }

    return result
  }
}
