const allowedOrigins = new Set([
  'https://dollarangle.com',
  'https://www.dollarangle.com'
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedTopics = new Set([
  'Correction',
  'Editorial feedback',
  'Source question',
  'Partnership',
  'General'
]);

function sendJson(response, statusCode, payload) {
  response.status(statusCode);
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

function cleanSingleLine(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength)
    : '';
}

function cleanMessage(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/\r\n/g, '\n').trim().slice(0, maxLength)
    : '';
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { ok: false });
  }

  const origin = request.headers.origin;
  if (origin && !allowedOrigins.has(origin)) {
    return sendJson(response, 403, { ok: false });
  }

  let body = request.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return sendJson(response, 400, { ok: false });
    }
  }

  const website = cleanSingleLine(body?.website, 200);
  if (website) {
    return sendJson(response, 200, { ok: true });
  }

  const name = cleanSingleLine(body?.name, 100);
  const email = cleanSingleLine(body?.email, 254).toLowerCase();
  const topic = cleanSingleLine(body?.topic, 50);
  const message = cleanMessage(body?.message, 5000);

  if (!name || !email || !emailPattern.test(email) || !allowedTopics.has(topic) || !message) {
    return sendJson(response, 400, { ok: false });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_INBOX_ADDRESS) {
    return sendJson(response, 503, { ok: false });
  }

  const subject = `[DollarAngle Contact] ${topic}: ${name}`;
  const text = [
    'New DollarAngle contact form submission',
    '',
    `Inquiry type: ${topic}`,
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
    '',
    'Submitted through https://dollarangle.com/contact'
  ].join('\n');

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DollarAngle Contact <contact@dollarangle.com>',
        to: [process.env.CONTACT_INBOX_ADDRESS],
        reply_to: email,
        subject,
        text
      })
    });

    if (!resendResponse.ok) {
      return sendJson(response, 502, { ok: false });
    }

    return sendJson(response, 200, { ok: true });
  } catch {
    return sendJson(response, 502, { ok: false });
  }
}
