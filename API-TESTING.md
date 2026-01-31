# Brasil Legalize - API Testing Guide

All PHP backend has been converted to Next.js API routes. The app now runs entirely on Node.js.

## Base URL
- Local: `http://localhost:3000`
- Production: `https://your-domain.com`

---

## 📋 API Endpoints to Test

### 1. Health Check
```
GET /api/health
```
Returns system status and all available endpoints.

**Test:** Open http://localhost:3000/api/health

---

### 2. Leads API
```
GET  /api/leads           - List all leads
POST /api/leads           - Create a new lead
```

**Test POST (create lead):**
```json
POST /api/leads
Content-Type: application/json

{
  "name": "Test User",
  "contact": "test@example.com",
  "country": "Brazil",
  "serviceType": "citizenship",
  "consent": true,
  "consentVersion": "v1"
}
```

---

### 3. Tokens API
```
POST /api/tokens          - Create/extend/validate token
GET  /api/tokens          - List all tokens (admin auth required)
```

**Test (validate token):**
```json
POST /api/tokens
Content-Type: application/json

{
  "action": "validate",
  "token": "your-token-here"
}
```

---

### 4. Status API
```
GET /api/status?token=xxx  - Get case status by token
```

**Test:** Open http://localhost:3000/api/status?token=test-token

---

### 5. Upload API
```
POST /api/upload          - Upload files (multipart/form-data)
GET  /api/upload?token=x  - List uploaded files for a case
```

**Test:** Use Postman or similar to upload files with:
- `token`: Valid upload token
- `files`: File(s) to upload

---

### 6. Pricing API
```
GET /api/pricing?locale=en  - Get public pricing
```

**Test URLs:**
- http://localhost:3000/api/pricing?locale=en
- http://localhost:3000/api/pricing?locale=pt
- http://localhost:3000/api/pricing?locale=es
- http://localhost:3000/api/pricing?locale=ar

---

### 7. Consent API
```
POST /api/consent         - Record consent
GET  /api/consent?userId= - Get consent status
```

**Test POST:**
```json
POST /api/consent
Content-Type: application/json

{
  "type": "cookies",
  "granted": true,
  "userId": "user123"
}
```

---

### 8. Admin Auth API
```
POST /api/admin/auth/login    - Admin login
POST /api/admin/auth/logout   - Admin logout
GET  /api/admin/auth/session  - Check session status
```

**Test Login:**
```json
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@brasillegalize.com",
  "password": "your-admin-password"
}
```

> **Note:** Set these environment variables:
> - `ADMIN_EMAIL=admin@brasillegalize.com`
> - `ADMIN_PASSWORD=your-password`

---

### 9. Admin Cases API
```
GET   /api/admin/cases        - List cases (auth required)
POST  /api/admin/cases        - Create case (auth required)
PATCH /api/admin/cases        - Update case (auth required)
```

**Test:** Requires admin authentication (Bearer token or cookie)

---

### 10. Admin Clients API
```
GET  /api/client/clients       - List/search clients
POST /api/client/clients       - Create client
```

**Test:** Open http://localhost:3000/api/client/clients

---

### 11. Audit API
```
GET    /api/audit             - Get audit logs (auth required)
POST   /api/audit             - Add audit entry (auth required)
DELETE /api/audit?olderThan=  - Clear old logs (auth required)
```

---

### 12. Notifications API
```
POST /api/notify              - Send notification (auth required)
GET  /api/notify              - List notifications (auth required)
```

---

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```env
# Admin Auth
ADMIN_EMAIL=admin@brasillegalize.com
ADMIN_PASSWORD=your-secure-password

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# Email (optional)
RESEND_API_KEY=re_xxxxx

# WhatsApp (optional)
WHATSAPP_API_KEY=xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ Quick Test Commands (PowerShell)

```powershell
# Test Health
(Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing).Content

# Test Pricing
(Invoke-WebRequest -Uri "http://localhost:3000/api/pricing?locale=en" -UseBasicParsing).Content

# Test Leads (GET)
(Invoke-WebRequest -Uri "http://localhost:3000/api/leads" -UseBasicParsing).Content

# Test Lead Creation (POST)
$body = @{name="Test";contact="test@test.com";consent=$true} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/leads" -Method POST -Body $body -ContentType "application/json"
```

---

## 📁 Files Created

| File | Description |
|------|-------------|
| `lib/api-utils.ts` | Shared utilities (JSON, auth, rate limiting) |
| `app/api/leads/route.ts` | Lead capture API |
| `app/api/tokens/route.ts` | Token management API |
| `app/api/status/route.ts` | Case status API |
| `app/api/upload/route.ts` | File upload API |
| `app/api/pricing/route.ts` | Public pricing API |
| `app/api/consent/route.ts` | Consent management API |
| `app/api/notify/route.ts` | Notifications API |
| `app/api/audit/route.ts` | Audit logging API |
| `app/api/health/route.ts` | Health check API |
| `app/api/admin/auth/login/route.ts` | Admin login |
| `app/api/admin/auth/logout/route.ts` | Admin logout |
| `app/api/admin/auth/session/route.ts` | Session check |
| `app/api/admin/cases/route.ts` | Cases management |

---

## 🗑️ PHP Files No Longer Needed

These PHP files can be deleted (or kept for reference):

```
api/
├── audit.php
├── auth.php
├── bootstrap.php
├── cases.php
├── clients.php
├── leads.php
├── notify.php
├── pricing.php
├── security.php
├── status.php
├── templates.php
├── tokens.php
├── upload.php
└── lib/
    ├── AdminAuthService.php
    ├── Database.php
    └── PricingService.php
```
