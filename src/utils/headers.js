/**
 * Centralized security headers and response helpers.
 * ALL responses from ALL handlers MUST use these.
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net scripts.simpleanalyticscdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.simpleanalytics.io; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

export function htmlResponse(html, status = 200, extraHeaders = {}) {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html', ...corsHeaders, ...extraHeaders }
  });
}

export function textResponse(text, status = 200) {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain', ...corsHeaders }
  });
}
