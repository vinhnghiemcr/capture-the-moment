# Photography Booking Apps Script Scaffold

This mirrors the macaron stack at a simpler first pass:
- `test/Code.js`
- `prod/Code.js`
- matching `appsscript.json`

## Current behavior

Supported actions via `doPost`:
- `create`
- `update`
- `cancel`

The script currently:
- writes booking requests into a single `Booking Requests` sheet
- generates a request reference
- sends customer + business emails (disabled in TEST, enabled in PROD)
- keeps calendar creation manual for now

## Before deployment

Fill in for both environments:
- `SPREADSHEET_ID`
- optionally `BUSINESS_EMAIL`
- optionally `CALENDAR_ID`

## Website hookup

In `index.html`, set:
- `BOOKING_API_URL`

to the deployed Apps Script web app URL for the target environment.

## Recommended next step

After this scaffold is validated, add the manual confirmation workflow:
- internal review status updates
- confirmation email template
- calendar event creation only after confirmation
