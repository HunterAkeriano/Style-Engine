import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import type { Env } from '../config/env'

interface SendMailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

let transporter: nodemailer.Transporter | null = null
let testAccountPromise: Promise<nodemailer.TestAccount> | null = null

export function initMailer(env: Env) {
  if (
    env.SMTP_HOST &&
    env.SMTP_PORT &&
    env.SMTP_USER &&
    env.SMTP_PASS &&
    env.SMTP_FROM
  ) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })
    return transporter
  }

  console.warn('SMTP not fully configured — emails will be saved to backend/emails only.')
  transporter = null
  return null
}

export async function sendMail(env: Env | undefined, options: SendMailOptions) {
  const activeTransport = await getTransport(env)
  if (!activeTransport || !env?.SMTP_FROM) {
    await logEmail(options)
    return
  }

  try {
    const info = await activeTransport.sendMail({
      from: env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text
    })
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log('Preview email at:', previewUrl)
    }
  } catch (err) {
    console.error('Failed to send email via SMTP/test transport, falling back to file log', err)
    await logEmail(options)
  }
}

async function getTransport(env?: Env | null) {
  if (transporter) return transporter
  if (
    env &&
    env.SMTP_HOST &&
    env.SMTP_PORT &&
    env.SMTP_USER &&
    env.SMTP_PASS
  ) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })
    return transporter
  }

  // fallback: use ethereal test account (requires network)
  try {
    if (!testAccountPromise) {
      testAccountPromise = nodemailer.createTestAccount()
    }
    const account = await testAccountPromise
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    })
    return transporter
  } catch (err) {
    console.warn('Failed to create test account, emails will be logged to files only', err)
    return null
  }
}

async function logEmail(options: SendMailOptions) {
  console.log('Email (log only):', { to: options.to, subject: options.subject, text: options.text })
  try {
    const dir = path.resolve(process.cwd(), 'emails')
    await fs.promises.mkdir(dir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const base = `${timestamp}-${options.to.replace(/[^a-zA-Z0-9@._-]/g, '')}`
    const textPath = path.join(dir, `${base}.txt`)
    await fs.promises.writeFile(
      textPath,
      `To: ${options.to}\nSubject: ${options.subject}\n\n${options.text}`,
      'utf8'
    )
    if (options.html) {
      const htmlPath = path.join(dir, `${base}.html`)
      await fs.promises.writeFile(htmlPath, options.html, 'utf8')
    }
  } catch (err) {
    console.warn('Failed to write email to disk', err)
  }
}
