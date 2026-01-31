# End-to-End Test Cases - Brasil Legalize

## Overview
This document provides comprehensive E2E test cases to verify the Brasil Legalize application is functioning correctly.

**App URL:** http://localhost:3000
**Admin Credentials:** 
- Email: `admin@brasillegalize.com`
- Password: `Admin@123456`

---

## Test Suite 1: Public Pages (All Locales)

### TC-1.1: Homepage Loads in All Languages
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/en` | English homepage loads, shows "Brasil Legalize" branding |
| 2 | Navigate to `http://localhost:3000/pt-br` | Portuguese homepage loads |
| 3 | Navigate to `http://localhost:3000/es` | Spanish homepage loads |
| 4 | Navigate to `http://localhost:3000/ar` | Arabic homepage loads with RTL layout |
| 5 | Navigate to `http://localhost:3000` | Redirects to default locale (should redirect to `/en` or detect browser locale) |

### TC-1.2: Navigation and Footer
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | On homepage, check header | Navigation links visible (Services, Pricing, Contact, etc.) |
| 2 | Scroll to footer | Footer shows contact info, social links, legal links |
| 3 | Click language switcher | Can switch between EN/PT/ES/AR |
| 4 | Click WhatsApp button | WhatsApp floating button visible and clickable |

---

## Test Suite 2: Eligibility Flow (Lead Capture)

### TC-2.1: Access Eligibility Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/en/eligibility` | Eligibility assessment form loads |
| 2 | Verify form fields | Should see questionnaire about visa eligibility |

### TC-2.2: Submit Eligibility Form (Create Lead)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill out eligibility form with test data: | Form accepts input |
| | - Name: "Test User" | |
| | - Email: "test@example.com" | |
| | - Phone: "+1234567890" | |
| | - Country: "United States" | |
| | - Service Type: "visa" or "citizenship" | |
| 2 | Submit form | Form submits successfully |
| 3 | Verify confirmation | Shows confirmation message or redirects to booking |
| 4 | Check `storage/data/leads.json` | New lead entry created with status "new" |

### TC-2.3: Eligibility Results
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete eligibility quiz | Result shown (eligible/not-eligible/contact_for_assessment) |
| 2 | If eligible | Shows "Book Consultation" CTA |
| 3 | If contact_for_assessment | Shows contact options |

---

## Test Suite 3: Booking System

### TC-3.1: Access Booking Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/en/book` | Booking page loads |
| 2 | Verify Calendly widget | Calendly embed should be visible (or booking form) |

---

## Test Suite 4: Pricing Display

### TC-4.1: Pricing API
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/api/pricing?locale=en` | Returns JSON with packages and services |
| 2 | Check response structure | Should include: |
| | | - `packages` array (Basic $3004, Complete $5000) |
| | | - `services` array (18 services) |

### TC-4.2: Pricing Page Display
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to pricing section on homepage | Pricing packages displayed |
| 2 | Check "Basic Package" | Shows $3,004 USD, 2 adults included, 1 child |
| 3 | Check "Complete Package" | Shows $5,000 USD, marked as "Popular" |
| 4 | Check services list | All 18 services displayed with icons |

---

## Test Suite 5: Admin Authentication

### TC-5.1: Admin Login Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/admin` | Redirects to login page |
| 2 | Navigate to `http://localhost:3000/admin/login` | Login form displayed |

### TC-5.2: Admin Login - Success
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter email: `admin@brasillegalize.com` | Field accepts input |
| 2 | Enter password: `Admin@123456` | Field accepts input |
| 3 | Click Login | Redirects to `/admin/dashboard` |
| 4 | Verify dashboard | Shows admin dashboard with navigation |

### TC-5.3: Admin Login - Failure
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter wrong credentials | Error message displayed |
| 2 | Try empty fields | Validation error shown |

---

## Test Suite 6: Admin Dashboard

### TC-6.1: Dashboard Overview
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | After login, access `/admin/dashboard` | Dashboard loads with stats |
| 2 | Check sidebar navigation | Should show: Dashboard, Leads, Pricing, Settings |

### TC-6.2: Lead Management (Eligibility Section)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/dashboard/eligibility` | Lead list displayed |
| 2 | Verify existing lead | Shows lead with ID `1769809501591` |
| | | - Status: "new" |
| | | - Service: "visa" |
| | | - Eligibility: "contact_for_assessment" |
| 3 | Click on a lead | Lead detail view opens |
| 4 | Try to change lead status | Status updates (new → contacted → qualified) |

### TC-6.3: Pricing Management
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/pricing` or `/admin/dashboard/pricing` | Pricing management page loads |
| 2 | View packages | Shows Basic ($3,004) and Complete ($5,000) |
| 3 | View services | All 18 services listed |
| 4 | Try editing a price | Price updates and saves |

---

## Test Suite 7: API Endpoints

### TC-7.1: Pricing API
| Endpoint | Method | Expected Response |
|----------|--------|-------------------|
| `/api/pricing?locale=en` | GET | 200 - JSON with packages/services |
| `/api/pricing?locale=pt-br` | GET | 200 - Portuguese names |

### TC-7.2: Leads API
| Endpoint | Method | Expected Response |
|----------|--------|-------------------|
| `/api/leads` | POST | 201 - Creates new lead |
| `/api/admin/leads` | GET | 200 - List all leads (requires auth) |

### TC-7.3: Admin Auth API
| Endpoint | Method | Expected Response |
|----------|--------|-------------------|
| `/api/admin/login` | POST | 200 - Returns session token |
| `/api/admin/logout` | POST | 200 - Clears session |

---

## Test Suite 8: Status Tracking (Client Tracker)

### TC-8.1: Status Check Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/en/status` | Status check form displayed |
| 2 | Enter invalid token | Error: "Application not found" |

**Note:** Token-based tracking requires:
1. Lead to be converted to "paid" status
2. Admin to generate token link
3. Client receives token + password

---

## Test Suite 9: Document Upload

### TC-9.1: Upload Page Access
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/en/upload` | Upload page loads |
| 2 | Without valid session | Should require authentication or redirect |

---

## Test Suite 10: Design System

### TC-10.1: Design System Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `http://localhost:3000/design-system` | Design system showcase loads |
| 2 | Check color tokens | Blue, gray, yellow theme colors displayed |
| 3 | Check components | Buttons, cards, forms showcased |

---

## Current System Status

### ✅ Working Features
| Feature | Status | Notes |
|---------|--------|-------|
| Homepage (all locales) | ✅ Working | EN, PT-BR, ES, AR all load correctly |
| RTL Support (Arabic) | ✅ Working | Layout mirrors correctly |
| Pricing API | ✅ Working | Returns 18 services, 2 packages |
| Admin Login Page | ✅ Available | `/admin/login` accessible |
| Lead Storage | ✅ Working | JSON file stores leads |

### 🔄 Features to Verify
| Feature | Expected Location | Test Priority |
|---------|-------------------|---------------|
| Eligibility Form Submission | `/en/eligibility` | High |
| Admin Dashboard | `/admin/dashboard` | High |
| Lead Status Management | `/admin/dashboard/eligibility` | High |
| Booking Integration | `/en/book` | Medium |

### ⏳ Planned Features (From Stories)
| Feature | Story | Status |
|---------|-------|--------|
| Token Link Generation | Story 2.1 | Planned |
| Client Application Tracker | Story 2.2 | Planned |
| Document Upload System | Story 2.3 | Planned |
| Email Notifications (Resend) | Story 2.4 | Planned |
| 3-Phase Workflow | Story 3.3 | Planned |

---

## Quick Test Checklist

### Smoke Test (5 minutes)
- [ ] `http://localhost:3000/en` loads
- [ ] `http://localhost:3000/ar` loads with RTL
- [ ] `http://localhost:3000/api/pricing?locale=en` returns JSON
- [ ] `http://localhost:3000/admin/login` loads

### Basic Functionality Test (15 minutes)
- [ ] Complete eligibility form submission
- [ ] Admin login with credentials
- [ ] View leads in admin dashboard
- [ ] Change a lead status
- [ ] View pricing page

### Full Regression Test (30 minutes)
- [ ] All Test Suites 1-10 above
- [ ] Cross-browser testing (Chrome, Firefox, Edge)
- [ ] Mobile responsiveness check
- [ ] Locale switching in all pages

---

## Test Data

### Existing Lead Record
```json
{
  "id": 1769809501591,
  "status": "new",
  "service_type": "visa",
  "eligibility_result": "contact_for_assessment",
  "expected_delivery": "2025-09-19T19:05:01.591Z"
}
```

### Admin User
```json
{
  "email": "admin@brasillegalize.com",
  "password": "Admin@123456",
  "role": "super_admin"
}
```

### Available Packages
| Package | Price | Adults | Children |
|---------|-------|--------|----------|
| Basic | $3,004 | 2 | 1 |
| Complete | $5,000 | 2 | 1 |

---

## How to Run Tests

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open browser to:** `http://localhost:3000/en`

3. **Follow test cases above in order**

4. **Check server console for errors** during each test

5. **Verify data in:** `storage/data/leads.json` and `storage/data/pricing.json`
