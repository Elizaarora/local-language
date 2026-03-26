"""
Mock all external dependencies BEFORE any app code is imported.
Tests call endpoint functions directly — no HTTP server needed.
"""
import sys
import os
from unittest.mock import MagicMock

# ── Env vars for settings ─────────────────────────────────────────────────────
os.environ['SMTP_USER']       = 'test@example.com'
os.environ['SMTP_PASS']       = 'testpass'
os.environ['SMTP_FROM']       = 'test@example.com'
os.environ['FRONTEND_URL']    = 'http://localhost:5173'
os.environ['JWT_SECRET']      = 'test-secret-key-for-pytest-only'
os.environ['FIREBASE_CREDENTIALS'] = '{"type":"service_account","project_id":"test"}'
os.environ['ENVIRONMENT']     = 'development'

# ── Stub out firebase_admin so FirebaseService.__init__ doesn't crash ─────────
_fb      = MagicMock()
_fb._apps = {'[DEFAULT]': MagicMock()}   # pretend already initialised
_fs      = MagicMock()
_fs.client.return_value = MagicMock()

sys.modules['firebase_admin']             = _fb
sys.modules['firebase_admin.credentials'] = MagicMock()
sys.modules['firebase_admin.firestore']   = _fs
sys.modules['firebase_admin.auth']        = MagicMock()

# ── Stub python-socketio so app.main doesn't crash ───────────────────────────
_sio           = MagicMock()
_sio_server    = MagicMock()
_sio_server.event = lambda f: f          # passthrough decorator
_sio.AsyncServer.return_value = _sio_server
_sio.ASGIApp.return_value     = MagicMock()
sys.modules['socketio'] = _sio
