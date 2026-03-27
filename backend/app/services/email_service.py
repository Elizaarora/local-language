import smtplib
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from ..core.config import settings
from ..core.logging_config import logger


def _send_smtp(to_email: str, subject: str, html_body: str) -> None:
    """Synchronous SMTP send — runs in a thread via asyncio.to_thread."""
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = settings.SMTP_FROM or settings.SMTP_USER
    msg['To'] = to_email
    msg.attach(MIMEText(html_body, 'html'))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.sendmail(msg['From'], [to_email], msg.as_string())


async def send_password_reset_email(to_email: str, reset_link: str) -> bool:
    """Send password reset email. Returns True on success."""
    if not settings.SMTP_USER or not settings.SMTP_PASS:
        logger.error("SMTP credentials not configured. Set SMTP_USER and SMTP_PASS env vars.")
        return False

    subject = "Reset your Local Language password"
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:32px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:10px;
                            display:inline-flex;align-items:center;justify-content:center;font-size:20px;">🌐</div>
                <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-.3px;">Local Language Integrator</span>
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;">Reset your password</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                We received a request to reset the password for your account (<strong>{to_email}</strong>).
                Click the button below to choose a new password.
              </p>
              <a href="{reset_link}"
                 style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);
                        color:#fff;text-decoration:none;font-size:15px;font-weight:600;
                        padding:14px 32px;border-radius:10px;letter-spacing:-.2px;">
                Reset Password
              </a>
              <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                This link expires in <strong>1 hour</strong>. If you didn't request this,
                you can safely ignore this email — your password won't change.
              </p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                Or copy this URL into your browser:<br>
                <span style="color:#3b82f6;word-break:break-all;">{reset_link}</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f8fafc;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                &copy; 2024 Local Language Integrator &mdash; Connecting people across languages
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    try:
        await asyncio.to_thread(_send_smtp, to_email, subject, html_body)
        logger.info(f"Password reset email sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send reset email to {to_email}: {e}")
        return False


ADMIN_EMAIL = "elizaarora04@gmail.com"

async def send_contact_email(name: str, from_email: str, message: str) -> bool:
    """Forward a Help-page contact form submission to the admin inbox."""
    admin_email = ADMIN_EMAIL
    if not settings.SMTP_USER or not settings.SMTP_PASS:
        logger.error("SMTP credentials not configured — contact email not sent.")
        return False

    subject = f"[Help Request] New message from {name}"
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:28px 32px;text-align:center;">
              <span style="color:#fff;font-size:18px;font-weight:700;">🌐 Local Language — Help Request</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <span style="font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">From</span><br>
                    <span style="font-size:15px;color:#0f172a;font-weight:600;">{name}</span>
                    <span style="font-size:14px;color:#64748b;"> &lt;{from_email}&gt;</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:24px;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">Message</span><br>
                    <p style="margin:8px 0 0;font-size:15px;color:#334155;line-height:1.7;white-space:pre-wrap;">{message}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;">
                    <a href="mailto:{from_email}"
                       style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#6366f1);
                              color:#fff;text-decoration:none;font-size:14px;font-weight:600;
                              padding:12px 28px;border-radius:10px;">
                      Reply to {name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px;background:#f8fafc;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                &copy; 2024 Local Language Integrator &mdash; Sent from the Help &amp; Support page
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    try:
        await asyncio.to_thread(_send_smtp, admin_email, subject, html_body)
        logger.info(f"Contact email from {from_email} forwarded to admin")
        return True
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
        return False
