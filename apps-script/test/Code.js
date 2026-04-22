const ENVIRONMENT_LABEL = 'TEST';
const SPREADSHEET_ID = 'PASTE_TEST_SPREADSHEET_ID_HERE';
const REQUESTS_SHEET = 'Booking Requests';
const BUSINESS_EMAIL = 'nghiemtruongcorp@gmail.com';
const SEND_EMAILS = false;
const CALENDAR_ID = 'primary';
const REQUEST_REF_PREFIX = 'CTMTEST';
const DEFAULT_STATUS = 'New Request';
const UPDATED_STATUS = 'Updated Request';
const CANCELLED_STATUS = 'Cancelled';
const SUMMARY_HEADERS = [
  'Created At',
  'Updated At',
  'Request Reference',
  'Status',
  'Client Name',
  'Email',
  'Phone',
  'Session Type',
  'Preferred Date',
  'Preferred Time',
  'Backup Date',
  'Backup Time',
  'Location',
  'School Name',
  'Number of People',
  'Source',
  'Instagram Handle',
  'Notes',
  'Cancellation Note',
  'Calendar Event ID',
  'Customer Email Status',
  'Internal Email Status'
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const action = normalizeAction_(payload.action);
    const sheet = getRequestsSheet_();
    ensureHeaders_(sheet);

    if (action === 'update') {
      return handleUpdateRequest_(payload, sheet);
    }

    if (action === 'cancel') {
      return handleCancelRequest_(payload, sheet);
    }

    return handleCreateRequest_(payload, sheet);
  } catch (error) {
    return jsonResponse_({ success: false, error: error.message || 'Unable to process booking request.' });
  }
}

function handleCreateRequest_(payload, sheet) {
  validateCreatePayload_(payload);

  const now = new Date();
  const requestReference = buildRequestReference_(now);
  const row = [
    formatDateTime_(now),
    formatDateTime_(now),
    requestReference,
    DEFAULT_STATUS,
    payload.name,
    payload.email,
    normalizePhone_(payload.phone),
    payload.sessionType,
    normalizeDateValue_(payload.preferredDate),
    normalizeTimeValue_(payload.preferredTime),
    normalizeDateValue_(payload.backupDate),
    normalizeTimeValue_(payload.backupTime),
    payload.location || '',
    payload.schoolName || '',
    payload.numberOfPeople || '',
    payload.source || '',
    payload.instagramHandle || '',
    payload.notes || '',
    '',
    '',
    'Pending',
    'Pending'
  ];

  sheet.appendRow(row);

  if (SEND_EMAILS) {
    sendCustomerRequestReceived_(payload, requestReference);
    notifyBusinessNewRequest_(payload, requestReference);
    writeEmailStatus_(sheet, sheet.getLastRow(), 'Sent', 'Sent');
  }

  return jsonResponse_({
    success: true,
    action: 'create',
    requestReference,
    status: DEFAULT_STATUS,
    message: `${ENVIRONMENT_LABEL} request received. We will review availability and follow up to confirm.`
  });
}

function handleUpdateRequest_(payload, sheet) {
  validateReferencePayload_(payload, true);
  const record = findRequestRecord_(sheet, payload.requestReference, payload.email);
  const values = record.values;
  const now = new Date();

  const updated = {
    status: UPDATED_STATUS,
    name: payload.name || values[4],
    email: payload.email || values[5],
    phone: payload.phone || values[6],
    sessionType: payload.sessionType || values[7],
    preferredDate: payload.preferredDate || values[8],
    preferredTime: payload.preferredTime || values[9],
    backupDate: payload.backupDate || values[10],
    backupTime: payload.backupTime || values[11],
    location: payload.location || values[12],
    schoolName: payload.schoolName || values[13],
    numberOfPeople: payload.numberOfPeople || values[14],
    source: payload.source || values[15],
    instagramHandle: payload.instagramHandle || values[16],
    notes: mergeText_(values[17], payload.notes),
    cancellationNote: values[18],
    calendarEventId: values[19]
  };

  writeRow_(sheet, record.rowNumber, [
    values[0],
    formatDateTime_(now),
    values[2],
    updated.status,
    updated.name,
    updated.email,
    updated.phone,
    updated.sessionType,
    normalizeDateValue_(updated.preferredDate),
    normalizeTimeValue_(updated.preferredTime),
    normalizeDateValue_(updated.backupDate),
    normalizeTimeValue_(updated.backupTime),
    updated.location,
    updated.schoolName,
    updated.numberOfPeople,
    updated.source,
    updated.instagramHandle,
    updated.notes,
    updated.cancellationNote,
    updated.calendarEventId,
    'Pending',
    'Pending'
  ]);

  if (SEND_EMAILS) {
    sendCustomerUpdateReceived_(updated, values[2]);
    notifyBusinessUpdatedRequest_(updated, values[2]);
    writeEmailStatus_(sheet, record.rowNumber, 'Sent', 'Sent');
  }

  return jsonResponse_({
    success: true,
    action: 'update',
    requestReference: values[2],
    status: UPDATED_STATUS,
    message: `${ENVIRONMENT_LABEL} update received. We will review the changes before confirming.`
  });
}

function handleCancelRequest_(payload, sheet) {
  validateReferencePayload_(payload, false);
  const record = findRequestRecord_(sheet, payload.requestReference, payload.email);
  const values = record.values;
  const now = new Date();
  const cancellationNote = mergeText_(values[18], payload.cancelReason || payload.notes || 'Cancelled by client');

  writeRow_(sheet, record.rowNumber, [
    values[0],
    formatDateTime_(now),
    values[2],
    CANCELLED_STATUS,
    values[4],
    values[5],
    values[6],
    values[7],
    values[8],
    values[9],
    values[10],
    values[11],
    values[12],
    values[13],
    values[14],
    values[15],
    values[16],
    values[17],
    cancellationNote,
    values[19],
    'Pending',
    'Pending'
  ]);

  if (SEND_EMAILS) {
    sendCustomerCancellationReceived_(values[5], values[4], values[2]);
    notifyBusinessCancelledRequest_(values, cancellationNote);
    writeEmailStatus_(sheet, record.rowNumber, 'Sent', 'Sent');
  }

  return jsonResponse_({
    success: true,
    action: 'cancel',
    requestReference: values[2],
    status: CANCELLED_STATUS,
    message: `${ENVIRONMENT_LABEL} cancellation received. Your request has been marked as cancelled.`
  });
}

function getRequestsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(REQUESTS_SHEET);
  if (!sheet) {
    throw new Error(`Sheet not found: ${REQUESTS_SHEET}`);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SUMMARY_HEADERS);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, SUMMARY_HEADERS.length).getValues()[0];
  const needsUpdate = SUMMARY_HEADERS.some((header, index) => currentHeaders[index] !== header);
  if (needsUpdate) {
    sheet.getRange(1, 1, 1, SUMMARY_HEADERS.length).setValues([SUMMARY_HEADERS]);
  }
}

function findRequestRecord_(sheet, requestReference, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    throw new Error('No requests found.');
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, SUMMARY_HEADERS.length).getValues();
  const normalizedRef = String(requestReference || '').trim().toUpperCase();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (String(row[2] || '').trim().toUpperCase() === normalizedRef && String(row[5] || '').trim().toLowerCase() === normalizedEmail) {
      return { rowNumber: index + 2, values: row };
    }
  }

  throw new Error('Request reference and email did not match any booking request.');
}

function writeRow_(sheet, rowNumber, values) {
  sheet.getRange(rowNumber, 1, 1, values.length).setValues([values]);
}

function writeEmailStatus_(sheet, rowNumber, customerStatus, internalStatus) {
  sheet.getRange(rowNumber, 21).setValue(customerStatus);
  sheet.getRange(rowNumber, 22).setValue(internalStatus);
}

function validateCreatePayload_(payload) {
  if (!payload.name) throw new Error('Name is required.');
  if (!payload.email) throw new Error('Email is required.');
  if (!payload.phone) throw new Error('Phone is required.');
  if (!payload.sessionType) throw new Error('Session type is required.');
  if (!payload.preferredDate) throw new Error('Preferred date is required.');
}

function validateReferencePayload_(payload, requireDetails) {
  if (!payload.requestReference) throw new Error('Request reference is required.');
  if (!payload.email) throw new Error('Email is required.');
  if (requireDetails && !payload.name) throw new Error('Name is required for updates.');
}

function normalizeAction_(action) {
  const normalized = String(action || 'create').trim().toLowerCase();
  if (['create', 'update', 'cancel'].indexOf(normalized) === -1) {
    return 'create';
  }
  return normalized;
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing request payload.');
  }

  const payload = JSON.parse(e.postData.contents);
  return {
    action: payload.action,
    requestReference: sanitizeText_(payload.requestReference),
    name: sanitizeText_(payload.name),
    email: sanitizeEmail_(payload.email),
    phone: sanitizeText_(payload.phone),
    sessionType: sanitizeText_(payload.sessionType),
    preferredDate: sanitizeText_(payload.preferredDate),
    preferredTime: sanitizeText_(payload.preferredTime),
    backupDate: sanitizeText_(payload.backupDate),
    backupTime: sanitizeText_(payload.backupTime),
    location: sanitizeText_(payload.location),
    schoolName: sanitizeText_(payload.schoolName),
    numberOfPeople: sanitizeText_(payload.numberOfPeople),
    source: sanitizeText_(payload.source),
    instagramHandle: sanitizeText_(payload.instagramHandle),
    notes: sanitizeText_(payload.notes),
    cancelReason: sanitizeText_(payload.cancelReason)
  };
}

function buildRequestReference_(date) {
  return `${REQUEST_REF_PREFIX}-${Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss')}`;
}

function normalizePhone_(phone) {
  return String(phone || '').trim();
}

function normalizeDateValue_(value) {
  return String(value || '').trim();
}

function normalizeTimeValue_(value) {
  return String(value || '').trim();
}

function sanitizeText_(value) {
  return String(value || '').trim();
}

function sanitizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function mergeText_(existingValue, newValue) {
  const existing = String(existingValue || '').trim();
  const incoming = String(newValue || '').trim();
  if (!incoming) return existing;
  if (!existing) return incoming;
  if (existing.indexOf(incoming) !== -1) return existing;
  return `${existing}\n\n${incoming}`;
}

function formatDateTime_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendCustomerRequestReceived_(payload, requestReference) {
  const subject = `[${ENVIRONMENT_LABEL}] We received your session request`;
  const body = `Hi ${payload.name},\n\nThanks for reaching out to Capture the Moment Photography. We received your session request and will review availability before confirming.\n\nRequest reference: ${requestReference}\nSession type: ${payload.sessionType}\nPreferred date: ${payload.preferredDate}\nPreferred time: ${payload.preferredTime || 'Flexible'}\n\nWe will follow up after checking the schedule.\n\nThanks,\nCapture the Moment Photography`;
  GmailApp.sendEmail(payload.email, subject, body);
}

function sendCustomerUpdateReceived_(payload, requestReference) {
  const subject = `[${ENVIRONMENT_LABEL}] We received your booking request update`;
  const body = `Hi ${payload.name},\n\nWe received your update request for ${requestReference}. We will review the changes before confirming availability.\n\nThanks,\nCapture the Moment Photography`;
  GmailApp.sendEmail(payload.email, subject, body);
}

function sendCustomerCancellationReceived_(email, name, requestReference) {
  const subject = `[${ENVIRONMENT_LABEL}] Your booking request was cancelled`;
  const body = `Hi ${name},\n\nWe received your cancellation for ${requestReference}.\n\nThanks,\nCapture the Moment Photography`;
  GmailApp.sendEmail(email, subject, body);
}

function notifyBusinessNewRequest_(payload, requestReference) {
  const subject = `[${ENVIRONMENT_LABEL}] New photography booking request: ${requestReference}`;
  const body = buildBusinessSummary_(payload, requestReference, DEFAULT_STATUS);
  GmailApp.sendEmail(BUSINESS_EMAIL, subject, body);
}

function notifyBusinessUpdatedRequest_(payload, requestReference) {
  const subject = `[${ENVIRONMENT_LABEL}] Updated photography booking request: ${requestReference}`;
  const body = buildBusinessSummary_(payload, requestReference, UPDATED_STATUS);
  GmailApp.sendEmail(BUSINESS_EMAIL, subject, body);
}

function notifyBusinessCancelledRequest_(values, cancellationNote) {
  const subject = `[${ENVIRONMENT_LABEL}] Cancelled photography booking request: ${values[2]}`;
  const body = `Request ${values[2]} has been cancelled.\n\nClient: ${values[4]}\nEmail: ${values[5]}\nSession type: ${values[7]}\nPreferred date: ${values[8]}\nPreferred time: ${values[9]}\nCancellation note: ${cancellationNote}`;
  GmailApp.sendEmail(BUSINESS_EMAIL, subject, body);
}

function buildBusinessSummary_(payload, requestReference, status) {
  return `Request reference: ${requestReference}\nStatus: ${status}\nClient: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || 'N/A'}\nSession type: ${payload.sessionType || 'N/A'}\nPreferred date: ${payload.preferredDate || 'N/A'}\nPreferred time: ${payload.preferredTime || 'Flexible'}\nBackup date: ${payload.backupDate || 'N/A'}\nBackup time: ${payload.backupTime || 'N/A'}\nLocation: ${payload.location || 'N/A'}\nSchool: ${payload.schoolName || 'N/A'}\nPeople: ${payload.numberOfPeople || 'N/A'}\nSource: ${payload.source || 'N/A'}\nInstagram: ${payload.instagramHandle || 'N/A'}\nNotes: ${payload.notes || 'N/A'}`;
}
