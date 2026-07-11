import asyncio
import html
import logging
import os
import time
from collections import defaultdict, deque
from pathlib import Path

import resend
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Akmaludien Ramadhan Portfolio API", version="1.0.0")
api_router = APIRouter(prefix="/api")

RATE_WINDOW_SECONDS = 600
RATE_LIMIT = 3
request_history: dict[str, deque[float]] = defaultdict(deque)


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    organization: str = Field(default="", max_length=120)
    message: str = Field(min_length=20, max_length=3000)
    website: str = Field(default="", max_length=200)
    consent: bool

    @field_validator("name", "organization", "message")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        return " ".join(value.strip().split())


class ContactResponse(BaseModel):
    accepted: bool
    message: str
    delivery_id: str | None = None


class ContactStatusResponse(BaseModel):
    configured: bool


def _client_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _enforce_rate_limit(client_key: str) -> None:
    now = time.monotonic()
    history = request_history[client_key]
    while history and now - history[0] > RATE_WINDOW_SECONDS:
        history.popleft()
    if len(history) >= RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages. Please wait before trying again.",
        )
    history.append(now)


def _contact_config() -> tuple[str, str, str] | None:
    api_key = os.environ.get("RESEND_API_KEY")
    sender = os.environ.get("SENDER_EMAIL")
    recipient = os.environ.get("CONTACT_RECIPIENT_EMAIL")
    if not all((api_key, sender, recipient)):
        return None
    return api_key, sender, recipient


@api_router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "healthy"}


@api_router.get("/contact/status", response_model=ContactStatusResponse)
async def contact_status() -> ContactStatusResponse:
    return ContactStatusResponse(configured=_contact_config() is not None)


@api_router.post(
    "/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def submit_contact(
    payload: ContactRequest, request: Request
) -> ContactResponse:
    if payload.website:
        return ContactResponse(
            accepted=True,
            message="Your message has been accepted.",
        )
    if not payload.consent:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Consent is required to send this message.",
        )

    config = _contact_config()
    if config is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Contact delivery is not configured yet.",
        )

    _enforce_rate_limit(_client_key(request))
    api_key, sender, recipient = config
    resend.api_key = api_key

    safe_name = html.escape(payload.name)
    safe_email = html.escape(str(payload.email))
    safe_org = html.escape(payload.organization or "Not provided")
    safe_message = html.escape(payload.message).replace("\n", "<br>")
    params = {
        "from": sender,
        "to": [recipient],
        "reply_to": str(payload.email),
        "subject": f"Portfolio inquiry from {payload.name}",
        "html": (
            "<table role='presentation' style='font-family:Arial,sans-serif;"
            "max-width:640px;color:#0f172a'>"
            f"<tr><td><strong>Name</strong></td><td>{safe_name}</td></tr>"
            f"<tr><td><strong>Email</strong></td><td>{safe_email}</td></tr>"
            f"<tr><td><strong>Organization</strong></td><td>{safe_org}</td></tr>"
            f"<tr><td colspan='2' style='padding-top:20px'>{safe_message}</td></tr>"
            "</table>"
        ),
    }

    try:
        response = await asyncio.to_thread(resend.Emails.send, params)
        delivery_id = response.get("id") if isinstance(response, dict) else None
        if not delivery_id:
            raise RuntimeError("Resend did not return a delivery identifier")
        return ContactResponse(
            accepted=True,
            message="Your message was accepted for delivery.",
            delivery_id=delivery_id,
        )
    except Exception as exc:
        logger.exception("Resend rejected a portfolio contact message: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Delivery could not be accepted. Please try again later.",
        ) from exc


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "").split(","),
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)