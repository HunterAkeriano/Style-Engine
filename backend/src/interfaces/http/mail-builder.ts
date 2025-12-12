import type { PreferredLanguage } from "../../utils/language"

export class MailBuilder {
  private normalizeLocale(locale?: PreferredLanguage): PreferredLanguage {
    return locale === "uk" ? "uk" : "en"
  }

  resetSubject(locale?: PreferredLanguage) {
    return this.normalizeLocale(locale) === "uk"
      ? "Скидання пароля для CSS-Zone"
      : "Reset your CSS-Zone password"
  }

  muteSubject(locale?: PreferredLanguage) {
    return this.normalizeLocale(locale) === "uk"
      ? "Вас тимчасово обмежили на форумі CSS-Zone"
      : "You were muted on the CSS-Zone forum"
  }

  topicStatusSubject(locale?: PreferredLanguage) {
    return this.normalizeLocale(locale) === "uk"
      ? "Статус вашої теми на форумі CSS-Zone змінено"
      : "Your forum topic status was updated"
  }

  private formatStatus(status: string, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    switch (status) {
      case "open":
        return lang === "uk" ? "Відкрита" : "Open";
      case "in_review":
        return lang === "uk" ? "На розгляді" : "In review";
      case "closed":
        return lang === "uk" ? "Закрита" : "Closed";
      default:
        return status;
    }
  }

  private formatExpiry(expiresAt: Date | null, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    if (!expiresAt) return lang === "uk" ? "безстроково" : "indefinitely";
    try {
      return new Intl.DateTimeFormat(lang === "uk" ? "uk-UA" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(expiresAt);
    } catch {
      return expiresAt.toISOString();
    }
  }

  private escape(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  plainReset(resetLink: string, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    if (lang === "uk") {
      return `Ми отримали запит на скидання пароля.\n\nПосилання для скидання: ${resetLink}\nЯкщо ви не робили цей запит, просто проігноруйте лист.`
    }
    return `We received a request to reset your password.\n\nReset link: ${resetLink}\nIf you did not request this, ignore the email.`
  }

  htmlReset(resetLink: string, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    const heading = lang === "uk" ? "Скиньте свій пароль" : "Reset your password"
    const intro =
      lang === "uk"
        ? "Ми отримали запит на скидання вашого пароля. Натисніть кнопку нижче, щоб обрати новий."
        : "We received a request to reset your password. Click the button below to choose a new one."
    const button = lang === "uk" ? "Скинути пароль" : "Reset password"
    const copyHint =
      lang === "uk"
        ? "Якщо кнопка не працює, скопіюйте й вставте це посилання у браузер:"
        : "If the button doesn't work, copy and paste this link into your browser:"
    const ignore =
      lang === "uk"
        ? "Якщо ви не робили цей запит, просто проігноруйте лист — ваш пароль не зміниться."
        : "If you didn't request this, you can ignore the email — your password stays the same."

    return `
  <div style="font-family: 'Inter', Arial, sans-serif; background: #0b1220; color: #e2e8f0; padding: 32px;">
    <div style="max-width: 520px; margin: 0 auto; background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(236,72,153,0.16)); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.35);">
      <div style="padding: 24px 28px; background: radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.2), transparent 45%), rgba(15,23,42,0.92);">
        <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.08em; color: #a5b4fc; font-size: 12px;">CSS-Zone</p>
        <h1 style="margin: 8px 0 6px; color: #f8fafc; font-size: 22px;">${heading}</h1>
        <p style="margin: 0; color: #cbd5e1; line-height: 1.6;">${intro}</p>
      </div>
      <div style="padding: 24px 28px; background: rgba(15,23,42,0.92); backdrop-filter: blur(8px);">
        <div style="text-align: center; margin: 12px 0 18px;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; border-radius: 999px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; text-decoration: none; font-weight: 700; box-shadow: 0 10px 30px rgba(99,102,241,0.35);">${button}</a>
        </div>
        <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">${copyHint}</p>
        <p style="word-break: break-all; color: #e2e8f0; font-size: 13px; margin-top: 6px;">${resetLink}</p>
        <p style="margin-top: 14px; color: #64748b; font-size: 12px;">${ignore}</p>
      </div>
    </div>
  </div>
  `
  }

  plainMute(options: {
    appUrl: string
    userName?: string | null
    reason?: string
    expiresAt: Date | null
    contacts: { forum: string; telegram: string; viber: string; email: string }
  }, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    const duration = this.formatExpiry(options.expiresAt, lang)
    const reason =
      options.reason && options.reason.trim().length > 0
        ? options.reason
        : lang === "uk"
          ? "Не вказано"
          : "Not specified"
    const name = options.userName
      ? options.userName
      : lang === "uk"
        ? "друже"
        : "there"

    if (lang === "uk") {
      return `Привіт, ${name}.

Ваші можливості писати на форумі CSS-Zone тимчасово обмежені.
Тривалість: ${duration}
Причина: ${reason}

Якщо у вас є питання або ви хочете оскаржити блокування, зв'яжіться з нами:
- Форум: ${options.contacts.forum}
- Telegram: ${options.contacts.telegram}
- Viber: ${options.contacts.viber}
- Email: ${options.contacts.email}

Також можете перейти до застосунку: ${options.appUrl}

Якщо обмеження тимчасове, ви зможете знову писати після його завершення.`
    }

    return `Hi ${name},

Your posting permissions on the CSS-Zone forum have been limited.
Duration: ${duration}
Reason: ${reason}

If you have questions or want to appeal, reach out:
- Forum: ${options.contacts.forum}
- Telegram: ${options.contacts.telegram}
- Viber: ${options.contacts.viber}
- Email: ${options.contacts.email}

You can also visit the app: ${options.appUrl}

If this mute is temporary, you can post again once it expires.`
  }

  htmlMute(options: {
    appUrl: string
    userName?: string | null
    reason?: string
    expiresAt: Date | null
    contacts: { forum: string; telegram: string; viber: string; email: string }
  }, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    const duration = this.formatExpiry(options.expiresAt, lang)
    const reason = options.reason
      ? this.escape(options.reason)
      : lang === "uk"
        ? "Не вказано"
        : "Not specified"
    const name = options.userName
      ? this.escape(options.userName)
      : lang === "uk"
        ? "друже"
        : "there"
    const title =
      lang === "uk" ? "Сповіщення про обмеження" : "Forum mute notice"
    const lead =
      lang === "uk"
        ? `Привіт, ${name}. Ваші можливості писати на форумі CSS-Zone тимчасово обмежені.`
        : `Hi ${name}, your posting permissions on the CSS-Zone forum have been limited.`
    const contactHint =
      lang === "uk"
        ? "Якщо у вас є питання чи ви хочете оскаржити рішення, скористайтеся будь-яким контактом нижче. Якщо обмеження тимчасове, після завершення ви знову зможете писати."
        : "If you have questions or want to appeal, reach out via any contact below. If the mute is temporary, you can post again once it expires."
    const forumCta = lang === "uk" ? "Відкрити форум" : "Open forum"
    const appCta = lang === "uk" ? "Перейти в застосунок" : "Go to app"
    const contactsTitle =
      lang === "uk" ? "Контакти:" : "Contact options:"

    return `
  <div style="font-family: 'Inter', Arial, sans-serif; background: #0b1220; color: #e2e8f0; padding: 32px;">
    <div style="max-width: 520px; margin: 0 auto; background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(236,72,153,0.16)); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.35);">
      <div style="padding: 24px 28px; background: radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.2), transparent 45%), rgba(15,23,42,0.92);">
        <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.08em; color: #a5b4fc; font-size: 12px;">CSS-Zone</p>
        <h1 style="margin: 8px 0 6px; color: #f8fafc; font-size: 22px;">${title}</h1>
        <p style="margin: 0; color: #cbd5e1; line-height: 1.6;">${lead}</p>
      </div>
      <div style="padding: 24px 28px; background: rgba(15,23,42,0.92); backdrop-filter: blur(8px);">
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px 18px; margin-bottom: 14px;">
          <p style="margin: 0; color: #e2e8f0; font-weight: 600;">${lang === "uk" ? "Тривалість" : "Duration"}: <span style="color: #a5b4fc;">${duration}</span></p>
          <p style="margin: 6px 0 0; color: #e2e8f0; font-weight: 600;">${lang === "uk" ? "Причина" : "Reason"}: <span style="color: #fda4af;">${reason}</span></p>
        </div>
        <p style="margin: 0 0 12px; color: #94a3b8; font-size: 14px; line-height: 1.6;">${contactHint}</p>
        <div style="margin: 12px 0 18px;">
          <a href="${options.contacts.forum}" style="display: inline-block; padding: 10px 16px; border-radius: 999px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; text-decoration: none; font-weight: 700; box-shadow: 0 10px 30px rgba(99,102,241,0.35); margin-right: 8px;">${forumCta}</a>
          <a href="${options.appUrl}" style="display: inline-block; padding: 10px 16px; border-radius: 999px; background: rgba(255,255,255,0.08); color: #e2e8f0; text-decoration: none; font-weight: 600; border: 1px solid rgba(255,255,255,0.12);">${appCta}</a>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 16px;">
          <p style="margin: 0 0 8px; color: #cbd5e1; font-size: 14px; font-weight: 600;">${contactsTitle}</p>
          <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; line-height: 1.7; font-size: 14px;">
            <li>${lang === "uk" ? "Форум" : "Forum"}: <a href="${options.contacts.forum}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.forum}</a></li>
            <li>Telegram: <a href="${options.contacts.telegram}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.telegram}</a></li>
            <li>Viber: <a href="${options.contacts.viber}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.viber}</a></li>
            <li>Email: <a href="mailto:${options.contacts.email}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.email}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `
  }

  plainTopicStatus(options: {
    appUrl: string
    topicTitle: string
    status: string
    topicLink: string
    userName?: string | null
    contacts: { forum: string; telegram: string; viber: string; email: string }
  }, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    const name = options.userName
      ? options.userName
      : lang === "uk"
        ? "друже"
        : "there"
    const status = this.formatStatus(options.status, lang)

    if (lang === "uk") {
      return `Привіт, ${name},

Статус вашої теми "${options.topicTitle}" на форумі оновлено.
Новий статус: ${status}

Переглянути тему: ${options.topicLink}

Якщо є питання, напишіть нам:
- Форум: ${options.contacts.forum}
- Telegram: ${options.contacts.telegram}
- Viber: ${options.contacts.viber}
- Email: ${options.contacts.email}

Також можете відкрити застосунок: ${options.appUrl}`
    }

    return `Hi ${name},

The status of your forum topic "${options.topicTitle}" was updated.
New status: ${status}

View your topic: ${options.topicLink}

If you have questions, reach out:
- Forum: ${options.contacts.forum}
- Telegram: ${options.contacts.telegram}
- Viber: ${options.contacts.viber}
- Email: ${options.contacts.email}

You can also open the app: ${options.appUrl}`
  }

  htmlTopicStatus(options: {
    appUrl: string
    topicTitle: string
    status: string
    topicLink: string
    userName?: string | null
    contacts: { forum: string; telegram: string; viber: string; email: string }
  }, locale?: PreferredLanguage) {
    const lang = this.normalizeLocale(locale)
    const name = options.userName
      ? this.escape(options.userName)
      : lang === "uk"
        ? "друже"
        : "there"
    const status = this.formatStatus(options.status, lang)
    const title = this.escape(options.topicTitle)
    const heading =
      lang === "uk" ? "Статус теми оновлено" : "Topic status updated"
    const lead =
      lang === "uk"
        ? `Привіт, ${name}. Статус вашої теми змінився.`
        : `Hi ${name}, the status of your topic has changed.`
    const topicCta = lang === "uk" ? "Відкрити тему" : "Open topic"
    const appCta = lang === "uk" ? "Перейти в застосунок" : "Go to app"
    const contactsTitle =
      lang === "uk" ? "Контакти:" : "Contact options:"

    return `
  <div style="font-family: 'Inter', Arial, sans-serif; background: #0b1220; color: #e2e8f0; padding: 32px;">
    <div style="max-width: 520px; margin: 0 auto; background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(236,72,153,0.16)); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.35);">
      <div style="padding: 24px 28px; background: radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.2), transparent 45%), rgba(15,23,42,0.92);">
        <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.08em; color: #a5b4fc; font-size: 12px;">CSS-Zone</p>
        <h1 style="margin: 8px 0 6px; color: #f8fafc; font-size: 22px;">${heading}</h1>
        <p style="margin: 0; color: #cbd5e1; line-height: 1.6;">${lead}</p>
      </div>
      <div style="padding: 24px 28px; background: rgba(15,23,42,0.92); backdrop-filter: blur(8px);">
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px 18px; margin-bottom: 14px;">
          <p style="margin: 0 0 6px; color: #e2e8f0; font-weight: 700;">${title}</p>
          <p style="margin: 0; color: #a5b4fc; font-weight: 700;">${lang === "uk" ? "Новий статус" : "New status"}: ${status}</p>
        </div>
        <div style="margin: 12px 0 18px;">
          <a href="${options.topicLink}" style="display: inline-block; padding: 10px 16px; border-radius: 999px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; text-decoration: none; font-weight: 700; box-shadow: 0 10px 30px rgba(99,102,241,0.35); margin-right: 8px;">${topicCta}</a>
          <a href="${options.appUrl}" style="display: inline-block; padding: 10px 16px; border-radius: 999px; background: rgba(255,255,255,0.08); color: #e2e8f0; text-decoration: none; font-weight: 600; border: 1px solid rgba(255,255,255,0.12);">${appCta}</a>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 16px;">
          <p style="margin: 0 0 8px; color: #cbd5e1; font-size: 14px; font-weight: 600;">${contactsTitle}</p>
          <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; line-height: 1.7; font-size: 14px;">
            <li>${lang === "uk" ? "Форум" : "Forum"}: <a href="${options.contacts.forum}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.forum}</a></li>
            <li>Telegram: <a href="${options.contacts.telegram}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.telegram}</a></li>
            <li>Viber: <a href="${options.contacts.viber}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.viber}</a></li>
            <li>Email: <a href="mailto:${options.contacts.email}" style="color: #a5b4fc; text-decoration: none;">${options.contacts.email}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `
  }
}
