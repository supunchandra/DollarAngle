const allowedOrigins = new Set([
  'https://dollarangle.com',
  'https://www.dollarangle.com'
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendJson(response, statusCode, payload) {
  response.status(statusCode);
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

async function resendRequest(path, options = {}) {
  return fetch(`https://api.resend.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
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

  const email = typeof body?.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';
  const consent = body?.consent === true;
  const website = typeof body?.website === 'string' ? body.website.trim() : '';

  if (website) {
    return sendJson(response, 200, { ok: true });
  }

  if (!consent) {
    return sendJson(response, 400, { ok: false });
  }

  if (!email || email.length > 254 || !emailPattern.test(email)) {
    return sendJson(response, 400, { ok: false });
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  const topicId = process.env.RESEND_TOPIC_ID;
  if (!process.env.RESEND_API_KEY || !segmentId || !topicId) {
    return sendJson(response, 503, { ok: false });
  }

  const encodedEmail = encodeURIComponent(email);

  try {
    const existing = await resendRequest(`/contacts/${encodedEmail}`, {
      method: 'GET'
    });

    if (existing.ok) {
      const update = await resendRequest(`/contacts/${encodedEmail}`, {
        method: 'PATCH',
        body: JSON.stringify({ unsubscribed: false })
      });

      if (!update.ok) {
        return sendJson(response, 502, { ok: false });
      }

      const addToSegment = await resendRequest(
        `/contacts/${encodedEmail}/segments/${encodeURIComponent(segmentId)}`,
        { method: 'POST' }
      );

      if (!addToSegment.ok && addToSegment.status !== 409) {
        return sendJson(response, 502, { ok: false });
      }

      const updateTopic = await resendRequest(
        `/contacts/${encodedEmail}/topics`,
        {
          method: 'PATCH',
          body: JSON.stringify([
            { id: topicId, subscription: 'opt_in' }
          ])
        }
      );

      if (!updateTopic.ok) {
        return sendJson(response, 502, { ok: false });
      }

      return sendJson(response, 200, { ok: true });
    }

    if (existing.status !== 404) {
      return sendJson(response, 502, { ok: false });
    }

    const created = await resendRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email,
        unsubscribed: false,
        segments: [{ id: segmentId }],
        topics: [{ id: topicId, subscription: 'opt_in' }]
      })
    });

    if (created.ok || created.status === 409) {
      return sendJson(response, 201, { ok: true });
    }

    return sendJson(response, 502, { ok: false });
  } catch {
    return sendJson(response, 502, { ok: false });
  }
}
