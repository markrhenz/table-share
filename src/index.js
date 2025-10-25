import { handleCreate } from './handlers/create.js';
import { handleView } from './handlers/view.js';

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Share - The Fastest Way to Share a Table</title>
    <meta name="description" content="Turn any table into a shareable link in 5 seconds. No signup, no screenshots, no friction. Just paste, share, done.">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            background: #FFFFFF;
            color: #000000;
            line-height: 1.6;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            margin-bottom: 60px;
            padding-top: 40px;
        }
        
        h1 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        
        .tagline {
            font-size: 24px;
            color: #333;
            margin-bottom: 40px;
        }
        
        .cta {
            font-size: 18px;
            color: #666;
            margin-bottom: 60px;
        }
        
        .paste-box {
            width: 100%;
            border: 2px solid #000;
            padding: 20px;
            font-size: 16px;
            font-family: monospace;
            resize: vertical;
            min-height: 200px;
            margin-bottom: 20px;
        }
        
        .button {
            display: none;
            width: 100%;
            background: #0066CC;
            color: #FFFFFF;
            border: none;
            padding: 15px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 20px;
        }
        
        .button:hover {
            background: #0052A3;
        }
        
        .status {
            text-align: center;
            font-size: 16px;
            color: #666;
            min-height: 24px;
        }
        
        .how-it-works {
            margin: 80px 0;
            padding: 40px;
            background: #F5F5F5;
        }
        
        .how-it-works h2 {
            font-size: 32px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
        }
        
        .step {
            text-align: center;
        }
        
        .step-number {
            font-size: 48px;
            font-weight: 700;
            color: #0066CC;
            margin-bottom: 10px;
        }
        
        .step h3 {
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        .step p {
            color: #666;
        }
        
        .use-cases {
            margin: 80px 0;
        }
        
        .use-cases h2 {
            font-size: 32px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .case-list {
            display: grid;
            gap: 20px;
        }
        
        .case {
            padding: 20px;
            border: 2px solid #000;
        }
        
        .case h3 {
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        .case p {
            color: #666;
        }
        
        .features {
            margin: 80px 0;
            padding: 40px;
            background: #F5F5F5;
        }
        
        .features h2 {
            font-size: 32px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        
        .feature {
            text-align: center;
        }
        
        .feature-icon {
            font-size: 36px;
            margin-bottom: 10px;
        }
        
        .feature h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        .feature p {
            color: #666;
            font-size: 14px;
        }
        
const TERMS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - Table Share</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: #666; margin-bottom: 30px; }
        a { color: #0066CC; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Terms of Service</h1>
    <p class="updated">Last updated: October 25, 2025</p>
    
    <h2>1. Acceptance of Terms</h2>
    <p>By using Table Share, you agree to these terms. If you don't agree, don't use the service.</p>
    
    <h2>2. Service Description</h2>
    <p>Table Share allows you to paste tabular data and generate shareable links. Links expire after 30 days by default.</p>
    
    <h2>3. Acceptable Use</h2>
    // Terms page
    if (url.pathname === '/terms') {
      return new Response(TERMS_HTML, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Privacy page
    if (url.pathname === '/privacy') {
      return new Response(PRIVACY_HTML, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    <p>You may NOT use Table Share to:</p>
    <ul>
        <li>Share illegal, malicious, or harmful content</li>
        <li>Violate others' privacy or intellectual property</li>
        <li>Distribute spam, phishing, or malware</li>
        <li>Abuse the service (e.g., excessive automation)</li>
    </ul>
    
    <h2>4. Data & Privacy</h2>
    <p>We store your pasted data for 30 days (or custom duration if premium). No accounts = no personal data collected. See <a href="/privacy">Privacy Policy</a>.</p>
    
    <h2>5. No Warranty</h2>
    <p>Service provided "as is." We don't guarantee uptime, data persistence, or security.</p>
    
    <h2>6. Termination</h2>
    <p>We may remove content or block users who violate these terms.</p>
    
    <h2>7. Contact</h2>
    <p>Questions? Email: <a href="mailto:legal@tableshare.com">legal@tableshare.com</a></p>
    
    <p style="margin-top: 40px;"><a href="/">&larr; Back to Table Share</a></p>
</body>
</html>
`;

const PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Table Share</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: #666; margin-bottom: 30px; }
        a { color: #0066CC; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: October 25, 2025</p>
    
    <h2>1. What We Collect</h2>
    <p><strong>No accounts = minimal data:</strong></p>
    <ul>
        <li>Pasted table data (stored 30 days)</li>
        <li>IP address (rate limiting only, not logged)</li>
        <li>Browser metadata (standard HTTP headers)</li>
    </ul>
    <p><strong>We do NOT collect:</strong> Names, emails, passwords, payment info, tracking cookies</p>
    
    <h2>2. How We Use Data</h2>
    <ul>
        <li>Display tables to link recipients</li>
        <li>Rate limiting (prevent abuse)</li>
        <li>Security (XSS, malicious content detection)</li>
    </ul>
    
    <h2>3. Data Retention</h2>
    <p>Tables auto-delete after 30 days. Manual deletion: email us at abuse@tableshare.com with the link.</p>
    
    <h2>4. Third Parties</h2>
    <p>We use Cloudflare (hosting/CDN). They may collect standard logs. No analytics/tracking.</p>
    
    <h2>5. Your Rights</h2>
    <ul>
        <li>Request deletion: email abuse@tableshare.com with link</li>
        <li>No data portability (no accounts)</li>
        <li>GDPR/CCPA: Data auto-expires, no PII stored</li>
    </ul>
    
    <h2>6. Security</h2>
    <p>Data encrypted in transit (HTTPS). Storage on Cloudflare infrastructure.</p>
    
    <h2>7. Changes</h2>
    <p>We'll update this page. No email notifications (no accounts!).</p>
    
    <h2>8. Contact</h2>
    <p>Email: <a href="mailto:privacy@tableshare.com">privacy@tableshare.com</a></p>
    
    <p style="margin-top: 40px;"><a href="/">&larr; Back to Table Share</a></p>
</body>
</html>
`;
        footer {
            margin-top: 80px;
            padding-top: 40px;
            border-top: 2px solid #000;
            text-align: center;
            color: #666;
        }
        
        footer a {
            color: #0066CC;
            text-decoration: none;
        }
        
        footer a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            h1 {
                font-size: 32px;
            }
            
            .tagline {
                font-size: 18px;
            }
            
            .how-it-works, .features {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Table Share</h1>
            <p class="tagline">The fastest way to share a table</p>
            <p class="cta">Stop taking screenshots. Paste your data and get an instant shareable link.</p>
        </header>
        
        <main>
            <textarea
                id="pasteBox"
                class="paste-box"
                placeholder="Paste your table data here (from Excel, Google Sheets, CSV, or anywhere)...

Example:
Name    Age    City
Alice   30     NYC
Bob     25     LA"></textarea>
            
            <button id="generateBtn" class="button">Generate Link</button>
            <div id="status" class="status"></div>
            
            <section class="how-it-works">
                <h2>How It Works</h2>
                <div class="steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <h3>Paste</h3>
                        <p>Copy data from Excel, Sheets, CSV, or any table</p>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <h3>Generate</h3>
                        <p>Get an instant shareable link (auto-copied)</p>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <h3>Share</h3>
                        <p>Send link anywhere. Recipients need no account.</p>
                    </div>
                </div>
            </section>
            
            <section class="use-cases">
                <h2>Perfect For</h2>
                <div class="case-list">
                    <div class="case">
                        <h3>🔧 Developers</h3>
                        <p>Share SQL query results, API responses, or log data with teammates or clients instantly</p>
                    </div>
                    <div class="case">
                        <h3>💼 Freelancers</h3>
                        <p>Send pricing tables, project timelines, or deliverables without formatting nightmares</p>
                    </div>
                    <div class="case">
                        <h3>👥 Teams</h3>
                        <p>Quick data snapshots for meetings, action items, or temporary lists</p>
                    </div>
                    <div class="case">
                        <h3>📊 Data Analysts</h3>
                        <p>Share analysis results, pandas DataFrame outputs, or R data tables</p>
                    </div>
                </div>
            </section>
            
            <section class="features">
                <h2>Why Table Share?</h2>
                <div class="feature-grid">
                    <div class="feature">
                        <div class="feature-icon">⚡</div>
                        <h3>5-Second Workflow</h3>
                        <p>From paste to shareable link in under 5 seconds</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🚫</div>
                        <h3>No Accounts</h3>
                        <p>Zero signup for you or recipients. Forever.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📱</div>
                        <h3>Mobile-Perfect</h3>
                        <p>Clean, readable tables on any device</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔒</div>
                        <h3>Auto-Expires</h3>
                        <p>Links expire in 30 days (privacy by default)</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">💾</div>
                        <h3>CSV Download</h3>
                        <p>Recipients can export to spreadsheet</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🛡️</div>
                        <h3>Security Built-In</h3>
                        <p>XSS prevention, rate limiting, content filtering</p>
                    </div>
                </div>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2025 Table Share | <a href="mailto:hello@tableshare.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
        </footer>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
    <script>
        const pasteBox = document.getElementById('pasteBox');
        const generateBtn = document.getElementById('generateBtn');
        const status = document.getElementById('status');
        
        pasteBox.addEventListener('paste', () => {
            setTimeout(() => {
                if (pasteBox.value.trim()) {
                    generateBtn.style.display = 'block';
                }
            }, 100);
        });
        
        pasteBox.addEventListener('input', () => {
            if (pasteBox.value.trim()) {
                generateBtn.style.display = 'block';
            } else {
                generateBtn.style.display = 'none';
            }
        });
        
        generateBtn.addEventListener('click', async () => {
            const data = pasteBox.value.trim();
            if (!data) return;
            
            status.textContent = 'Generating link...';
            generateBtn.disabled = true;
            
            try {
                const parsed = Papa.parse(data, {
                    delimiter: '',
                    newline: '',
                    quoteChar: '"',
                    escapeChar: '"',
                    header: false,
                    dynamicTyping: false,
                    skipEmptyLines: true
                });
                
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: parsed.data,
                        honeypot: ''
                    })
                });
                
                const result = await response.json();
                
                if (result.url) {
                    await navigator.clipboard.writeText(result.url);
                    status.textContent = '✓ Link copied to clipboard!';
                    
                    setTimeout(() => {
                        window.location.href = result.url;
                    }, 1000);
                } else {
                    throw new Error('Failed to generate link');
                }
            } catch (error) {
                status.textContent = '✗ Error: ' + error.message;
                generateBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
`;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle OPTIONS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders
        });
      }

      // Routes
      if (pathname === '/') {
        return new Response(INDEX_HTML, {
          headers: {
            'Content-Type': 'text/html',
            ...corsHeaders
          }
        });
      } else if (pathname === '/api/create' && request.method === 'POST') {
        const response = await handleCreate(request, env);
        return new Response(response.body, {
          ...response,
          headers: {
            ...response.headers,
            ...corsHeaders
          }
        });
      } else if (pathname.startsWith('/t/') && pathname.length === 11) {
        const id = pathname.slice(3);
        if (/^[a-zA-Z0-9]{8}$/.test(id)) {
          const response = await handleView(request, env, id);
          return new Response(response.body, {
            ...response,
            headers: {
              ...response.headers,
              ...corsHeaders
            }
          });
        }
      }

      // Default 404
      return new Response('Not Found', {
        status: 404,
        headers: corsHeaders
      });

    } catch (error) {
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};