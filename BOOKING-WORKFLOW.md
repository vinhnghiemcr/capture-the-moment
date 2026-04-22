# Photography Booking Request Workflow

## Recommendation

Use a **request-first** workflow, not instant booking.

Reason:
- availability must be checked manually
- travel, weather, and location matter
- some sessions need back-and-forth before confirming

## Customer-facing flow

### 1. Website CTA
Use wording like:
- Request a Session
- Check Availability
- Send Booking Request

Avoid promising instant confirmation.

### 2. Request form fields
Required:
- Full name
- Email
- Phone
- Session type
- Preferred date
- Preferred time

Recommended:
- Backup date
- Backup time
- Location / preferred area
- School name (for graduation sessions)
- Number of people
- Notes
- How they heard about the business

### 3. Customer submission result
After submit, show a success state like:

> Thanks, your session request has been received. We’ll review availability and contact you to confirm.

No instant confirmation language.

## Internal workflow

### 1. Save request
Create a request row in Google Sheets.

Suggested status on creation:
- `New Request`

### 2. Send customer email
Automatic email should say:
- request received
- not yet confirmed
- someone will follow up after checking availability
- include request reference and submitted details

### 3. Notify Nghiem
Send notification email with:
- request reference
- client info
- session type
- preferred date/time
- backup date/time
- location
- notes

### 4. Manual review
Nghiem reviews availability and decides:
- Confirmed
- Needs Reschedule
- Declined
- Cancelled

### 5. Calendar behavior
Recommended:
- do **not** create a main calendar booking on initial request
- only create calendar event after manual confirmation

Optional later enhancement:
- create a tentative/internal-only hold event for review

## Update and cancel flow

### Update request
Customer can submit:
- request reference
- email
- changed date/time/location/notes

System behavior:
- update request row
- status becomes `Needs Review` or `Updated Request`
- notify Nghiem
- customer gets acknowledgment email
- if already confirmed, manual re-confirmation may be needed before calendar update

### Cancel request
Customer can submit:
- request reference
- email

System behavior:
- mark request as `Cancelled`
- notify Nghiem
- send customer cancellation acknowledgment
- if confirmed calendar event exists, remove or cancel it

## Suggested statuses
- `New Request`
- `Reviewing`
- `Confirmed`
- `Needs Reschedule`
- `Updated Request`
- `Declined`
- `Cancelled`
- `Completed`

## Suggested sheet structure

### Booking Requests sheet
Columns:
- Created At
- Updated At
- Request Reference
- Status
- Client Name
- Email
- Phone
- Session Type
- Preferred Date
- Preferred Time
- Backup Date
- Backup Time
- Location
- School Name
- Number of People
- Notes
- Source
- Calendar Event ID
- Customer Email Status
- Internal Email Status

### Activity / Change Log sheet (optional but recommended)
Columns:
- Timestamp
- Request Reference
- Action
- Old Value Summary
- New Value Summary
- Triggered By

## Tech stack recommendation
Use the same stack as macaron for speed and consistency:
- static website
- Google Apps Script backend
- Google Sheets
- Gmail
- Google Calendar

## Differences from macaron
Do **not** mirror macaron exactly.

Macaron was suitable for near-direct order confirmation.
Photography should be:
- request-first
- manually confirmed
- calendar only after approval

## Next implementation steps
1. Replace Calendly-focused booking section with a booking request form
2. Define session types and required fields
3. Create Google Sheet structure
4. Build Apps Script endpoints for:
   - create request
   - update request
   - cancel request
5. Add customer and internal email templates
6. Add manual confirmation workflow for Nghiem
7. Create calendar event only on confirmed bookings
