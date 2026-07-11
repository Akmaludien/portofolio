"""Contact and health API regression tests for portfolio backend."""

import importlib.util
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values


FRONTEND_ENV_PATH = Path("/app/frontend/.env")
BACKEND_SERVER_PATH = Path("/app/backend/server.py")


def _base_url() -> str:
    env = dotenv_values(FRONTEND_ENV_PATH)
    base_url = env.get("REACT_APP_BACKEND_URL")
    if not base_url:
        pytest.fail("REACT_APP_BACKEND_URL missing in /app/frontend/.env")
    return str(base_url).rstrip("/")


BASE_URL = _base_url()


@pytest.fixture
def api_client() -> requests.Session:
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestPortfolioHealthAndContact:
    """Core endpoint checks for health and intentionally-unconfigured contact flow."""

    def test_backend_import_health(self) -> None:
        spec = importlib.util.spec_from_file_location("backend_server", BACKEND_SERVER_PATH)
        assert spec is not None
        assert spec.loader is not None

    def test_health_endpoint(self, api_client: requests.Session) -> None:
        response = api_client.get(f"{BASE_URL}/api/health", timeout=20)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_contact_status_unconfigured(self, api_client: requests.Session) -> None:
        response = api_client.get(f"{BASE_URL}/api/contact/status", timeout=20)
        assert response.status_code == 200
        data = response.json()
        assert data["configured"] is False

    def test_contact_post_returns_503_when_unconfigured(
        self, api_client: requests.Session
    ) -> None:
        payload = {
            "name": "TEST Recruiter",
            "email": "recruiter@example.com",
            "organization": "TEST Hiring",
            "message": "This is a valid inquiry message with enough characters.",
            "website": "",
            "consent": True,
        }
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert response.status_code == 503
        data = response.json()
        assert data["detail"] == "Contact delivery is not configured yet."

    def test_contact_rejects_without_consent(self, api_client: requests.Session) -> None:
        payload = {
            "name": "TEST Recruiter",
            "email": "recruiter@example.com",
            "organization": "TEST Hiring",
            "message": "This is a valid inquiry message with enough characters.",
            "website": "",
            "consent": False,
        }
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert response.status_code == 422
        data = response.json()
        assert data["detail"] == "Consent is required to send this message."

    def test_contact_honeypot_returns_accepted(self, api_client: requests.Session) -> None:
        payload = {
            "name": "TEST Recruiter",
            "email": "recruiter@example.com",
            "organization": "TEST Hiring",
            "message": "This is a valid inquiry message with enough characters.",
            "website": "https://spam.example",
            "consent": True,
        }
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert response.status_code == 202
        data = response.json()
        assert data["accepted"] is True
