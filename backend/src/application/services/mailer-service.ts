import type { Env } from '../../config/env'
import { sendMail } from '../../services/mailer'

export class MailerService {
  constructor(private readonly env: Env) {}

  send(options: { to: string; subject: string; text: string; html?: string }) {
    return sendMail(this.env, options)
  }
}
