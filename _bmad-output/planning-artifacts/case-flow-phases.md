# Brasil Legalize - Case Flow: 4 Phases, 16 Steps

## Overview

The client journey is divided into **4 Phases** with **16 Steps** total. Each phase represents a distinct stage in the client lifecycle, from initial contact to case completion.

---

## Phase 1: Lead Capture & Qualification (Steps 1-4)

> **Goal:** Convert website visitors into qualified leads ready for consultation

| Step | Status | Admin Actions | Client Info Collected/Displayed |
|------|--------|---------------|--------------------------------|
| **1. New Lead** | `new` | • View lead details<br>• Assign to team member<br>• Add internal notes<br>• View eligibility answers<br>• Send WhatsApp message<br>• Delete spam leads | Name, Email, Phone, City, Country, Service Interest, Eligibility Answers, Consent, Source (web/manual), Created Date |
| **2. Contacted** | `contacted` | • Log contact attempt<br>• Record call/WhatsApp notes<br>• Schedule follow-up<br>• Update contact info<br>• Mark as qualified/unqualified | Last Contact Date, Contact Method (call/email/WhatsApp), Contact Notes, Response Status, Follow-up Date |
| **3. Qualified** | `qualified` | • Confirm service need<br>• Recommend package<br>• Schedule consultation<br>• Generate booking link<br>• Create price quote | Qualification Notes, Recommended Package, Service Requirements, Budget Discussion, Expected Travel Date |
| **4. Consultation Booked** | `consultation_booked` | • View Calendly booking<br>• Prepare consultation<br>• Send reminder<br>• Reschedule if needed<br>• Add pre-consultation notes | Consultation Date/Time, Consultation Type (video/in-person), Calendly Event ID, Pre-consultation Notes, Reminder Status |

---

## Phase 2: Onboarding & Payment (Steps 5-8)

> **Goal:** Convert qualified leads into paying clients with signed agreements

| Step | Status | Admin Actions | Client Info Collected/Displayed |
|------|--------|---------------|--------------------------------|
| **5. Consultation Completed** | `consultation_done` | • Record consultation summary<br>• Finalize service package<br>• Create custom quote<br>• Generate contract/agreement<br>• Send proposal email | Consultation Notes, Services Agreed, Final Package, Custom Requirements, Family Size (adults/children), Expected Due Date (for birth tourism) |
| **6. Proposal Sent** | `proposal_sent` | • Track proposal views<br>• Send follow-up reminders<br>• Modify proposal<br>• Answer questions<br>• Resend proposal | Proposal Date, Proposal PDF Link, Quote Amount, Payment Terms, Proposal Status (viewed/not viewed), Follow-up Count |
| **7. Contract Signed** | `contract_signed` | • Verify signature<br>• Generate invoice<br>• Set payment deadline<br>• Create client portal access<br>• Assign case manager | Contract Signed Date, Contract PDF, Client ID, Payment Due Date, Assigned Case Manager, Client Portal Token |
| **8. Payment Received** | `payment_received` | • Record payment<br>• Issue receipt<br>• Send welcome email<br>• Generate upload token<br>• Create case folder | Payment Amount, Payment Method, Payment Date, Receipt Number, Transaction ID, Payment Plan (if applicable) |

---

## Phase 3: Document Collection & Processing (Steps 9-12)

> **Goal:** Collect, verify, and process all required documents for the case

| Step | Status | Admin Actions | Client Info Collected/Displayed |
|------|--------|---------------|--------------------------------|
| **9. Documents Requested** | `docs_requested` | • Generate upload link<br>• Send document checklist<br>• Set deadline<br>• Customize required docs<br>• Send WhatsApp reminder | Upload Token, Token Expiry, Document Checklist, Required Documents List, Upload Link, Deadline Date |
| **10. Documents Uploading** | `docs_uploading` | • View uploaded files<br>• Approve/reject documents<br>• Request replacements<br>• Download documents<br>• Track upload progress | Files Uploaded (list), Upload Date per File, File Status (pending/approved/rejected), Missing Documents, Rejection Reasons |
| **11. Documents Complete** | `docs_complete` | • Verify all docs<br>• Mark as ready for processing<br>• Generate document summary<br>• Prepare government forms<br>• Schedule appointments | Document Verification Date, Verified By (admin), Complete Checklist, Translation Status, Legalization Status |
| **12. Under Review** | `under_review` | • Review case file<br>• Check document validity<br>• Verify client info<br>• Flag issues<br>• Request additional info | Review Start Date, Reviewer Name, Review Notes, Issues Found, Additional Info Needed, Expected Review Complete |

---

## Phase 4: Submission & Completion (Steps 13-16)

> **Goal:** Submit applications to government, track progress, and complete the case

| Step | Status | Admin Actions | Client Info Collected/Displayed |
|------|--------|---------------|--------------------------------|
| **13. Submitted to Government** | `submitted` | • Log submission date<br>• Record protocol numbers<br>• Upload submission receipts<br>• Set expected timeline<br>• Update client on status | Submission Date, Protocol/Reference Numbers, Government Office, Expected Processing Time, Submission Receipt, Tracking Numbers |
| **14. In Progress at Government** | `in_progress` | • Track government status<br>• Log follow-up calls<br>• Request status updates<br>• Handle requests for info<br>• Update estimated completion | Government Status, Last Check Date, Next Follow-up Date, Government Notes, Any Delays, New Document Requests |
| **15. Approved/Ready for Pickup** | `approved` | • Schedule document pickup<br>• Arrange delivery method<br>• Prepare final documents<br>• Send completion notification<br>• Generate final invoice (if balance) | Approval Date, Documents Ready, Pickup/Delivery Method, Delivery Address (if shipping), Final Documents List |
| **16. Case Completed** | `completed` | • Mark case complete<br>• Send completion email<br>• Request testimonial<br>• Archive case<br>• Generate case summary report | Completion Date, Final Documents Delivered, Client Feedback, Case Duration, Total Services Provided, Final Cost Summary |

---

## Additional Statuses (Special Cases)

| Status | Description | Admin Actions |
|--------|-------------|---------------|
| `on_hold` | Case paused temporarily | Set hold reason, resume date, send notification |
| `cancelled` | Case cancelled by client or admin | Record cancellation reason, process refund if needed |
| `refunded` | Payment refunded | Record refund amount, refund date, reason |

---

## Client Profile - Complete Information

The admin can view a comprehensive client profile containing:

### Basic Information
- Full Name
- Email Address
- Phone Number (with WhatsApp indicator)
- City & Country
- Preferred Language/Locale
- Profile Photo (if uploaded)

### Service Information
- Service Type (visa, residency, birth tourism, etc.)
- Selected Package (Basic/Complete/Custom)
- Family Configuration (adults, children)
- Expected Travel/Due Dates

### All Cases (Historical + Current)
- List of all cases linked to this client
- Case status and phase for each
- Quick links to each case detail

### Financial Information
- Total Amount Paid
- Outstanding Balance
- Payment History
- Invoices & Receipts

### Documents
- All uploaded documents across all cases
- Document status (pending, approved, rejected)
- Document history

### Communication History
- All emails sent
- WhatsApp messages logged
- Call notes
- Internal notes

### Timeline
- Complete history of all status changes
- All admin actions logged
- Important dates and milestones

---

## Kanban Board Configuration

The Kanban board in `/admin/dashboard/applications` displays cards for each case. Each card shows:

- Client Name
- Service Type
- Current Phase & Step
- Days in current status
- **View Profile Button** (links to `/admin/clients/[id]`)
- Quick action buttons (contact, update status)

---

## Manual Lead/Client Entry

Admins can manually add leads/clients through `/admin/clients/new`:

### Fields for Manual Entry:
1. **Basic Info:** Name, Email, Phone, City, Country
2. **Service Info:** Service Type, Preferred Package, Expected Dates
3. **Source:** Manual Entry, Referral, Phone Call, Walk-in, etc.
4. **Notes:** Initial contact notes, special requirements
5. **Historical Option:** Mark as historical client to import past cases

### Historical Client Import:
- Upload past case data
- Set completed status and dates
- Link existing documents
- Maintain full history for returning clients
