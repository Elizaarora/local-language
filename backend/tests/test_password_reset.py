"""
Tests for forgot-password / reset-password logic.
Calls FastAPI route-handler functions directly (no HTTP server needed).
"""
import asyncio
import pytest
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import BackgroundTasks

# ── Import handlers after conftest has stubbed all external modules ────────────
from app.api.auth import (
    forgot_password, reset_password,
    ForgotPasswordRequest, ResetPasswordRequest,
)
from fastapi import HTTPException


# ── Helpers ───────────────────────────────────────────────────────────────────
FAKE_USER = {
    'id': 'uid-abc-123',
    'email': 'user@example.com',
    'name': 'Test User',
    'hashed_password': '$2b$12$fakehashfakehashfakehashfakehashfakehash',
    'preferred_language': 'english',
    'is_active': True,
    'created_at': datetime.utcnow(),
}

VALID_TOKEN   = 'valid_token_abc'
EXPIRED_TOKEN = 'expired_token_xyz'
USED_TOKEN    = 'used_token_def'
BAD_TOKEN     = 'nonexistent_token'


def _record(token, *, used=False, hours_from_now=1):
    return {
        'email': FAKE_USER['email'],
        'token': token,
        'used':  used,
        'expires_at': datetime.utcnow() + timedelta(hours=hours_from_now),
    }


def run(coro):
    """Run a coroutine synchronously."""
    return asyncio.get_event_loop().run_until_complete(coro)


# ═══════════════════════════════════════════════════════════════════════════════
#  forgot_password
# ═══════════════════════════════════════════════════════════════════════════════

class TestForgotPassword:

    def _bg(self):
        bg = BackgroundTasks()
        return bg

    def test_existing_email_enqueues_email(self):
        """Valid email → token created, email queued, 200 returned."""
        mock_create = AsyncMock(return_value=True)
        mock_email  = AsyncMock(return_value=True)
        bg = self._bg()

        with patch('app.api.auth.firebase_service.get_user_by_email',
                   new=AsyncMock(return_value=FAKE_USER)), \
             patch('app.api.auth.firebase_service.create_reset_token', new=mock_create), \
             patch('app.api.auth.send_password_reset_email', new=mock_email):

            result = run(forgot_password(
                ForgotPasswordRequest(email=FAKE_USER['email']), bg
            ))

        assert 'message' in result
        mock_create.assert_called_once()
        # email is queued as background task — not called yet, but tasks registered
        assert len(bg.tasks) == 1

    def test_unknown_email_no_token_created(self):
        """Unknown email → no token created, still returns message (no info leak)."""
        mock_create = AsyncMock(return_value=True)
        bg = self._bg()

        with patch('app.api.auth.firebase_service.get_user_by_email',
                   new=AsyncMock(return_value=None)), \
             patch('app.api.auth.firebase_service.create_reset_token', new=mock_create):

            result = run(forgot_password(
                ForgotPasswordRequest(email='ghost@example.com'), bg
            ))

        assert 'message' in result
        mock_create.assert_not_called()

    def test_token_contains_correct_email(self):
        """create_reset_token must be called with the user's email."""
        captured = {}

        async def fake_create(email, token, expires_at):
            captured['email'] = email
            return True

        bg = self._bg()
        with patch('app.api.auth.firebase_service.get_user_by_email',
                   new=AsyncMock(return_value=FAKE_USER)), \
             patch('app.api.auth.firebase_service.create_reset_token', new=fake_create), \
             patch('app.api.auth.send_password_reset_email', new=AsyncMock()):
            run(forgot_password(ForgotPasswordRequest(email=FAKE_USER['email']), bg))

        assert captured['email'] == FAKE_USER['email']

    def test_reset_link_uses_frontend_url(self):
        """The queued reset link must start with the configured FRONTEND_URL."""
        queued_args = {}

        bg = BackgroundTasks()
        original_add = bg.add_task

        def capture_task(func, *args, **kwargs):
            queued_args['func'] = func
            queued_args['args'] = args
            original_add(func, *args, **kwargs)

        bg.add_task = capture_task

        with patch('app.api.auth.firebase_service.get_user_by_email',
                   new=AsyncMock(return_value=FAKE_USER)), \
             patch('app.api.auth.firebase_service.create_reset_token',
                   new=AsyncMock(return_value=True)), \
             patch('app.api.auth.send_password_reset_email', new=AsyncMock()):
            run(forgot_password(ForgotPasswordRequest(email=FAKE_USER['email']), bg))

        reset_link = queued_args['args'][1]   # second arg to send_password_reset_email
        assert reset_link.startswith('http://localhost:5173')
        assert '/reset-password?token=' in reset_link

    def test_invalid_email_raises_validation_error(self):
        """Pydantic should reject bad email format."""
        with pytest.raises(Exception):
            ForgotPasswordRequest(email='not-an-email')


# ═══════════════════════════════════════════════════════════════════════════════
#  reset_password
# ═══════════════════════════════════════════════════════════════════════════════

class TestResetPassword:

    def test_valid_token_updates_password(self):
        """Happy path: valid token + good password → success message."""
        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=_record(VALID_TOKEN))), \
             patch('app.api.auth.firebase_service.update_user_password',
                   new=AsyncMock(return_value=True)), \
             patch('app.api.auth.firebase_service.mark_reset_token_used',
                   new=AsyncMock(return_value=True)):

            result = run(reset_password(
                ResetPasswordRequest(token=VALID_TOKEN, new_password='NewPass123')
            ))

        assert result['message'] == 'Password updated successfully'

    def test_expired_token_raises_400(self):
        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=_record(EXPIRED_TOKEN, hours_from_now=-1))):
            with pytest.raises(HTTPException) as exc:
                run(reset_password(
                    ResetPasswordRequest(token=EXPIRED_TOKEN, new_password='NewPass123')
                ))
        assert exc.value.status_code == 400
        assert 'expired' in exc.value.detail.lower()

    def test_used_token_raises_400(self):
        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=_record(USED_TOKEN, used=True))):
            with pytest.raises(HTTPException) as exc:
                run(reset_password(
                    ResetPasswordRequest(token=USED_TOKEN, new_password='NewPass123')
                ))
        assert exc.value.status_code == 400
        assert 'already been used' in exc.value.detail.lower()

    def test_nonexistent_token_raises_400(self):
        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=None)):
            with pytest.raises(HTTPException) as exc:
                run(reset_password(
                    ResetPasswordRequest(token=BAD_TOKEN, new_password='NewPass123')
                ))
        assert exc.value.status_code == 400
        assert 'invalid' in exc.value.detail.lower()

    def test_short_password_raises_400(self):
        """Password under 6 chars rejected before any DB call."""
        mock_get = AsyncMock()
        with patch('app.api.auth.firebase_service.get_reset_token', new=mock_get):
            with pytest.raises(HTTPException) as exc:
                run(reset_password(
                    ResetPasswordRequest(token=VALID_TOKEN, new_password='123')
                ))
        assert exc.value.status_code == 400
        assert '6' in exc.value.detail
        mock_get.assert_not_called()    # DB not even queried for bad passwords

    def test_password_stored_as_bcrypt_hash(self):
        """Stored value must be a bcrypt hash, never plain text."""
        stored = {}

        async def fake_update(email, hashed):
            stored['hash'] = hashed
            return True

        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=_record(VALID_TOKEN))), \
             patch('app.api.auth.firebase_service.update_user_password', new=fake_update), \
             patch('app.api.auth.firebase_service.mark_reset_token_used',
                   new=AsyncMock(return_value=True)):
            run(reset_password(
                ResetPasswordRequest(token=VALID_TOKEN, new_password='MySecret99')
            ))

        assert stored['hash'] != 'MySecret99',  "Plain-text password stored!"
        assert stored['hash'].startswith('$2b$'), "Not a bcrypt hash"

    def test_token_marked_used_after_reset(self):
        """Token must be invalidated once used."""
        mock_mark = AsyncMock(return_value=True)

        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=_record(VALID_TOKEN))), \
             patch('app.api.auth.firebase_service.update_user_password',
                   new=AsyncMock(return_value=True)), \
             patch('app.api.auth.firebase_service.mark_reset_token_used', new=mock_mark):
            run(reset_password(
                ResetPasswordRequest(token=VALID_TOKEN, new_password='NewPass123')
            ))

        mock_mark.assert_called_once_with(VALID_TOKEN)

    def test_firebase_update_failure_raises_500(self):
        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=_record(VALID_TOKEN))), \
             patch('app.api.auth.firebase_service.update_user_password',
                   new=AsyncMock(return_value=False)):
            with pytest.raises(HTTPException) as exc:
                run(reset_password(
                    ResetPasswordRequest(token=VALID_TOKEN, new_password='NewPass123')
                ))
        assert exc.value.status_code == 500

    def test_token_not_marked_used_if_update_fails(self):
        """Don't consume the token if the password update itself failed."""
        mock_mark = AsyncMock(return_value=True)

        with patch('app.api.auth.firebase_service.get_reset_token',
                   new=AsyncMock(return_value=_record(VALID_TOKEN))), \
             patch('app.api.auth.firebase_service.update_user_password',
                   new=AsyncMock(return_value=False)), \
             patch('app.api.auth.firebase_service.mark_reset_token_used', new=mock_mark):
            with pytest.raises(HTTPException):
                run(reset_password(
                    ResetPasswordRequest(token=VALID_TOKEN, new_password='NewPass123')
                ))

        mock_mark.assert_not_called()


# ═══════════════════════════════════════════════════════════════════════════════
#  Email service
# ═══════════════════════════════════════════════════════════════════════════════

class TestEmailService:

    def test_no_smtp_creds_returns_false(self):
        from app.services import email_service
        with patch('app.services.email_service.settings') as s:
            s.SMTP_USER = ''
            s.SMTP_PASS = ''
            result = run(email_service.send_password_reset_email(
                'a@b.com', 'http://example.com/reset'
            ))
        assert result is False

    def test_smtp_success_returns_true(self):
        """When _send_smtp succeeds, function returns True."""
        from app.services import email_service
        with patch('app.services.email_service.settings') as s, \
             patch('asyncio.to_thread', new=AsyncMock(return_value=None)):
            s.SMTP_USER = 'sender@gmail.com'
            s.SMTP_PASS = 'app-pass'
            s.SMTP_FROM = 'sender@gmail.com'
            s.SMTP_HOST = 'smtp.gmail.com'
            s.SMTP_PORT = 587
            result = run(email_service.send_password_reset_email(
                'recipient@test.com', 'http://x.com/reset?token=abc'
            ))
        assert result is True

    def test_smtp_failure_returns_false(self):
        """When SMTP throws, function returns False (not crash)."""
        from app.services import email_service
        with patch('app.services.email_service.settings') as s, \
             patch('asyncio.to_thread', new=AsyncMock(side_effect=Exception('SMTP down'))):
            s.SMTP_USER = 'sender@gmail.com'
            s.SMTP_PASS = 'app-pass'
            s.SMTP_FROM = 'sender@gmail.com'
            s.SMTP_HOST = 'smtp.gmail.com'
            s.SMTP_PORT = 587
            result = run(email_service.send_password_reset_email(
                'recipient@test.com', 'http://x.com/reset?token=abc'
            ))
        assert result is False
