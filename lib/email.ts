/**
 * Email utility — tries Resend first, falls back to Gmail SMTP (nodemailer)
 * Gmail SMTP can send to ANY email address.
 *
 * Setup Gmail SMTP:
 * 1. Enable 2-Step Verification on your Google account
 * 2. Go to myaccount.google.com/apppasswords → create "CodeHiring" app password
 * 3. Add to .env:
 *    GMAIL_USER=yourname@gmail.com
 *    GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 */

const RESEND_API_URL = "https://api.resend.com/emails"
const FROM_RESEND = "CodeHiring <onboarding@resend.dev>"

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  // Try Gmail SMTP first if configured (works with any recipient)
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (gmailUser && gmailPass) {
    try {
      const nodemailer = await import("nodemailer")
      const transporter = nodemailer.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailPass.replace(/\s/g, ""),
        },
        tls: { rejectUnauthorized: false },
      })
      await transporter.sendMail({
        from: `"CodeHiring" <${gmailUser}>`,
        to,
        subject,
        html,
      })
      console.log(`[EMAIL] Sent via Gmail SMTP to ${to}`)
      return { success: true }
    } catch (e) {
      console.error("Gmail SMTP error:", JSON.stringify(e))
      // Fall through to Resend
    }
  }

  // Try Resend
  const key = process.env.RESEND_API_KEY
  if (key && key.startsWith("re_")) {
    try {
      const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM_RESEND, to: [to], subject, html }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error("Resend error:", err)
        return { success: false, error: err }
      }
      return { success: true }
    } catch (e) {
      console.error("Email send error:", e)
      return { success: false, error: String(e) }
    }
  }

  // No email provider configured
  console.log(`[EMAIL NO-OP] To: ${to} | Subject: ${subject}`)
  return { success: false, error: "No email provider configured" }
}

export function otpEmailHtml(otp: string, name?: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#0f0f11;color:#f8f8f8;margin:0;padding:0">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;margin:40px auto;background:#1a1a1f;border:1px solid #2a2a35;border-radius:16px;overflow:hidden">
    <tr>
      <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px;text-align:center">
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px">CodeHiring</h1>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75)">Email Verification</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px">
        <p style="margin:0 0 8px;font-size:15px;color:#d1d5db">Hi${name ? " " + name : ""},</p>
        <p style="margin:0 0 28px;font-size:14px;color:#9ca3af;line-height:1.6">Your CodeHiring verification code is:</p>
        <div style="background:#111118;border:1px solid #2a2a35;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <span style="font-size:48px;font-weight:900;letter-spacing:16px;color:#818cf8;font-family:monospace">${otp}</span>
        </div>
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-align:center">This code expires in <strong style="color:#f8f8f8">5 minutes</strong>.</p>
        <p style="margin:0;font-size:13px;color:#6b7280;text-align:center">If you didn't request this, you can safely ignore it.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 24px;border-top:1px solid #2a2a35;text-align:center">
        <p style="margin:0;font-size:11px;color:#4b5563">© 2026 CodeHiring · Where Coding Skills Meet Opportunities</p>
      </td>
    </tr>
  </table>
</body>
</html>`
}
