# 📖 API Documentation
## PassGuard — Password Strength Checker API

**Base URL:** `http://localhost:4000`
**Version:** 1.0.0

---

## Endpoints

### POST `/api/check`
Analyse a password and return a full strength report.

**Request:**
```json
{ "password": "MyPassword123!" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 3,
    "strength": "Strong",
    "color": "#22c55e",
    "crackTime": "centuries",
    "entropy": 52,
    "length": 14,
    "checks": {
      "minLength": true,
      "goodLength": true,
      "hasUppercase": true,
      "hasLowercase": true,
      "hasNumbers": true,
      "hasSymbols": true,
      "notCommon": true,
      "noRepeating": true,
      "noSequential": true
    },
    "suggestions": [],
    "passphraseTip": null
  }
}
```

**Score values:**
| Score | Label | Meaning |
|-------|-------|---------|
| 0 | Very Weak | Cracked instantly |
| 1 | Weak | Cracked in minutes |
| 2 | Fair | Cracked in hours/days |
| 3 | Strong | Cracked in years |
| 4 | Very Strong | Practically uncrackable |

---

### GET `/api/health`
Check if the API is running.

**Response:**
```json
{ "success": true, "status": "ok", "uptime": 123.4 }
```

---

## Error Responses

| Status | Error |
|--------|-------|
| 400 | No password provided |
| 400 | Password too long (max 128 chars) |
| 429 | Too many requests |
| 500 | Internal server error |

---

*PassGuard API Docs — Vibe Coder Internship Week 4*
