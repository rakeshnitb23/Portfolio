import html
import logging
import smtplib
from email.message import EmailMessage

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.contact import SUBJECT_LABELS, ContactRequest

logger = logging.getLogger("contact")

router = APIRouter()


def build_email_html(full_name: str, email: str, company: str, subject_label: str, message: str) -> str:
    full_name = html.escape(full_name)
    email = html.escape(email)
    company_esc = html.escape(company) if company else ""
    message = html.escape(message)

    company_row = f"""
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Company</td>
              <td style="padding: 8px 0; color: #f3f3f3;">{company_esc}</td>
            </tr>""" if company_esc else ""

    return f"""
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #111; color: #f3f3f3; border-radius: 8px;">
          <div style="border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #D4AF37; font-size: 18px; letter-spacing: 0.1em; text-transform: uppercase;">
              New Contact Inquiry
            </h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;">Name</td>
              <td style="padding: 8px 0; color: #f3f3f3;">{full_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
              <td style="padding: 8px 0; color: #f3f3f3;"><a href="mailto:{email}" style="color: #D4AF37;">{email}</a></td>
            </tr>
            {company_row}
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Subject</td>
              <td style="padding: 8px 0; color: #f3f3f3;">{subject_label}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: rgba(212,175,55,0.06); border-left: 2px solid #D4AF37; border-radius: 4px;">
            <p style="margin: 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message</p>
            <p style="margin: 0; color: #f3f3f3; line-height: 1.7; white-space: pre-wrap;">{message}</p>
          </div>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); color: #555; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em;">
            COMM.PORT — SECURE.CHANNEL.v1
          </div>
        </div>
      """


def send_contact_email(data: ContactRequest) -> None:
    if not settings.EMAIL_HOST or not settings.EMAIL_TO or not settings.EMAIL_USER:
        raise RuntimeError("Email is not configured")

    subject_label = SUBJECT_LABELS.get(data.subject, data.subject)

    msg = EmailMessage()
    msg["From"] = f"Portfolio Contact <{settings.EMAIL_USER}>"
    msg["To"] = settings.EMAIL_TO
    msg["Reply-To"] = data.email
    msg["Subject"] = f"[Portfolio] {subject_label} — {data.fullName}"
    msg.set_content(data.message)
    msg.add_alternative(
        build_email_html(data.fullName, data.email, data.company, subject_label, data.message),
        subtype="html",
    )

    secure = settings.EMAIL_PORT == 465
    if secure:
        with smtplib.SMTP_SSL(settings.EMAIL_HOST, settings.EMAIL_PORT) as smtp:
            smtp.login(settings.EMAIL_USER, settings.EMAIL_PASS)
            smtp.send_message(msg)
    else:
        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as smtp:
            smtp.starttls()
            smtp.login(settings.EMAIL_USER, settings.EMAIL_PASS)
            smtp.send_message(msg)


@router.post("/api/contact")
async def submit_contact(request: Request):
    body = await request.json()

    hp = body.get("_hp")
    if isinstance(hp, str) and len(hp) > 0:
        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Message received."},
        )

    try:
        data = ContactRequest.model_validate(body)
    except ValidationError as exc:
        field_errors: dict[str, str] = {}
        for err in exc.errors():
            field = str(err["loc"][0])
            if field == "hp":
                field = "_hp"
            if field not in field_errors:
                field_errors[field] = err["msg"].removeprefix("Value error, ")
        return JSONResponse(
            status_code=400,
            content={"success": False, "errors": field_errors},
        )

    try:
        send_contact_email(data)
    except Exception:
        logger.exception("Contact form error")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Something went wrong. Please try again later.",
            },
        )

    return JSONResponse(
        status_code=200,
        content={"success": True, "message": "Message received."},
    )
