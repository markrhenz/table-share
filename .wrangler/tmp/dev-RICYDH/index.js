var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/utils/id-generator.js
var BASE62_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function generateId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += BASE62_CHARS[bytes[i] % 62];
  }
  return id;
}
__name(generateId, "generateId");
async function generateUniqueId(kvNamespace) {
  const MAX_ATTEMPTS = 3;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const id = generateId();
    const exists = await kvNamespace.get(id);
    if (!exists) {
      return id;
    }
    console.warn(`ID collision on attempt ${attempt}/${MAX_ATTEMPTS}: ${id}`);
  }
  throw new Error(`Failed to generate unique ID after ${MAX_ATTEMPTS} attempts`);
}
__name(generateUniqueId, "generateUniqueId");

// src/utils/sanitizer.js
function escapeHtml(text) {
  if (text === null || text === void 0) {
    return "";
  }
  const replacements = {
    "&": "&",
    "<": "<",
    ">": ">",
    '"': '"',
    "'": "&#39;"
  };
  return String(text).replace(/[&<>"']/g, (char) => replacements[char]);
}
__name(escapeHtml, "escapeHtml");
function sanitizeCell(cell) {
  let text = String(cell);
  text = text.trim();
  if (text.length > 1e3) {
    text = text.substring(0, 1e3) + "...";
  }
  return escapeHtml(text);
}
__name(sanitizeCell, "sanitizeCell");
function validateInput(data) {
  if (!Array.isArray(data)) {
    return { valid: false, error: "Data must be an array" };
  }
  if (data.length === 0) {
    return { valid: false, error: "Data cannot be empty" };
  }
  if (data.length > 1e3) {
    return { valid: false, error: "Too many rows (max 1000)" };
  }
  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i])) {
      return { valid: false, error: `Row ${i} is not an array` };
    }
    if (data[i].length > 100) {
      return { valid: false, error: `Row ${i} has too many columns (max 100)` };
    }
  }
  const jsonSize = JSON.stringify(data).length;
  if (jsonSize > 51200) {
    return { valid: false, error: "Data too large (max 50KB)" };
  }
  return { valid: true, error: null };
}
__name(validateInput, "validateInput");
function detectMaliciousContent(text) {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /on\w+=/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i
  ];
  return maliciousPatterns.some((pattern) => pattern.test(text));
}
__name(detectMaliciousContent, "detectMaliciousContent");

// src/utils/rate-limiter.js
function getRateLimitKey(ip) {
  const minute = Math.floor(Date.now() / 6e4);
  return `rate-limit:${ip}:${minute}`;
}
__name(getRateLimitKey, "getRateLimitKey");
function isWhitelisted(ip) {
  if (!ip) return true;
  const whitelist = [
    "127.0.0.1",
    // IPv4 localhost
    "::1",
    // IPv6 localhost
    "localhost"
  ];
  return whitelist.includes(ip);
}
__name(isWhitelisted, "isWhitelisted");
async function checkRateLimit(kvNamespace, ip, maxRequests = 5) {
  if (isWhitelisted(ip)) {
    return { allowed: true, remaining: maxRequests };
  }
  try {
    const key = getRateLimitKey(ip);
    const countStr = await kvNamespace.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;
    if (count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    const newCount = count + 1;
    await kvNamespace.put(key, String(newCount), { expirationTtl: 60 });
    return {
      allowed: true,
      remaining: maxRequests - newCount
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true, remaining: maxRequests };
  }
}
__name(checkRateLimit, "checkRateLimit");

// src/handlers/create.js
async function handleCreate(request, env) {
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const rateCheck = await checkRateLimit(env.TABLES, ip, 5);
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, honeypot } = await request.json();
    if (honeypot) {
      return new Response(JSON.stringify({ error: "Invalid submission" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const validation = validateInput(data);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sanitizedData = data.map((row) => row.map((cell) => sanitizeCell(cell)));
    for (const row of sanitizedData) {
      for (const cell of row) {
        if (detectMaliciousContent(cell)) {
          return new Response(JSON.stringify({ error: "Invalid content" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
    const id = await generateUniqueId(env.TABLES);
    const tableData = {
      data: sanitizedData,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      rowCount: sanitizedData.length,
      colCount: sanitizedData[0]?.length || 0
    };
    await env.TABLES.put(id, JSON.stringify(tableData), { expirationTtl: 2592e3 });
    const url = `https://${request.headers.get("host")}/t/${id}`;
    return new Response(JSON.stringify({ id, url }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreate, "handleCreate");

// src/handlers/view.js
var VIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TABLE_TITLE}} - TableShare</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f7fafc;
      padding: 20px;
      line-height: 1.6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.07);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 28px;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .meta {
      opacity: 0.9;
      font-size: 14px;
    }

    .content {
      padding: 40px;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f7fafc;
      font-weight: 600;
      color: #2d3748;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    tbody tr:hover {
      background: #f7fafc;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .actions {
      padding: 24px 40px;
      text-align: center;
      background: #f7fafc;
      border-top: 1px solid #e2e8f0;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin: 0 8px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      font-size: 14px;
    }

    .btn:hover {
      background: #5568d3;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .btn.secondary {
      background: #718096;
    }

    .btn.secondary:hover {
      background: #4a5568;
    }

    .footer {
      text-align: center;
      padding: 24px;
      color: #a0aec0;
      font-size: 13px;
      border-top: 1px solid #e2e8f0;
    }

    .footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }

      .header {
        padding: 24px 20px;
      }

      .header h1 {
        font-size: 22px;
      }

      .content {
        padding: 20px;
      }

      table {
        font-size: 13px;
      }

      th, td {
        padding: 10px 12px;
      }

      .actions {
        padding: 20px;
      }

      .btn {
        display: block;
        margin: 8px 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{TABLE_TITLE}}</h1>
      <div class="meta">{{TABLE_META}}</div>
    </div>

    <div class="content">
      {{TABLE_HTML}}
    </div>

    <div class="actions">
      <button class="btn" onclick="downloadCSV()">\u{1F4E5} Download CSV</button>
      <a href="/" class="btn secondary">\u2795 Create New Table</a>
    </div>

    <div class="footer">
      Created with <a href="/">TableShare</a> \u2022 Expires: {{EXPIRES_AT}}
    </div>
  </div>

  <script>
    function downloadCSV() {
      const table = document.querySelector('table');
      if (!table) {
        alert('No table found to download');
        return;
      }

      const rows = table.querySelectorAll('tr');
      const csv = [];

      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => {
          let text = cell.textContent.trim();

          // Escape CSV special characters
          if (text.includes(',') || text.includes('"') || text.includes('
')) {
            text = '"' + text.replace(/"/g, '""') + '"';
          }

          return text;
        });

        csv.push(rowData.join(','));
      });

      // Create blob and download
      const csvContent = csv.join('
');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'table-{{TABLE_ID}}.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  <\/script>
</body>
</html>`;
async function handleView(request, env, id) {
  try {
    if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
      return new Response("Not Found", { status: 404 });
    }
    const dataStr = await env.TABLES.get(id);
    if (!dataStr) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Table Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>Table Not Found</h1>
          <p>The table you're looking for doesn't exist or has expired.</p>
          <a href="/">Create a new table</a>
        </body>
        </html>
      `, { status: 404, headers: { "Content-Type": "text/html" } });
    }
    const tableData = JSON.parse(dataStr);
    const { data, createdAt, rowCount, colCount } = tableData;
    let tableHtml = "<table>";
    if (data.length > 0) {
      tableHtml += "<thead><tr>";
      data[0].forEach((cell) => {
        tableHtml += `<th>${sanitizeCell(cell)}</th>`;
      });
      tableHtml += "</tr></thead>";
      tableHtml += "<tbody>";
      for (let i = 1; i < data.length; i++) {
        tableHtml += "<tr>";
        data[i].forEach((cell) => {
          tableHtml += `<td>${sanitizeCell(cell)}</td>`;
        });
        tableHtml += "</tr>";
      }
      tableHtml += "</tbody>";
    }
    tableHtml += "</table>";
    const createdDate = new Date(createdAt);
    const expiresDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1e3);
    const expiresAt = expiresDate.toISOString().split("T")[0];
    let html = VIEW_TEMPLATE.replace(/{{TABLE_TITLE}}/g, `Table ${id}`).replace(/{{TABLE_META}}/g, `${rowCount} rows \xD7 ${colCount} columns`).replace(/{{TABLE_HTML}}/g, tableHtml).replace(/{{EXPIRES_AT}}/g, expiresAt).replace(/{{TABLE_ID}}/g, id);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
__name(handleView, "handleView");

// src/index.js
var INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TableShare - Paste. Share. Done.</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      max-width: 800px;
      width: 100%;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 48px;
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    h1 {
      font-size: 36px;
      margin-bottom: 8px;
      color: #1a202c;
      font-weight: 700;
    }
    
    .tagline {
      color: #718096;
      margin-bottom: 32px;
      font-size: 18px;
    }
    
    #paste-area {
      width: 100%;
      min-height: 300px;
      padding: 20px;
      border: 2px dashed #cbd5e0;
      border-radius: 12px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      resize: vertical;
      outline: none;
      transition: all 0.3s ease;
      background: #f7fafc;
    }
    
    #paste-area:focus {
      border-color: #667eea;
      border-style: solid;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    #paste-area::placeholder {
      color: #a0aec0;
    }
    
    .loading {
      display: none;
      text-align: center;
      margin-top: 20px;
      color: #667eea;
      font-weight: 500;
    }
    
    .loading.active {
      display: block;
    }
    
    .loading::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
    }
    
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
    
    #status {
      margin-top: 20px;
      padding: 16px 20px;
      border-radius: 8px;
      display: none;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    #status.success {
      background: #c6f6d5;
      color: #22543d;
      display: block;
      border-left: 4px solid #38a169;
    }
    
    #status.error {
      background: #fed7d7;
      color: #742a2a;
      display: block;
      border-left: 4px solid #e53e3e;
    }
    
    #status a {
      color: inherit;
      font-weight: 600;
      text-decoration: underline;
    }
    
    .footer {
      margin-top: 24px;
      text-align: center;
      color: #a0aec0;
      font-size: 14px;
    }
    
    /* Mobile responsive */
    @media (max-width: 600px) {
      .container { 
        padding: 24px; 
      }
      h1 { 
        font-size: 28px; 
      }
      #paste-area { 
        min-height: 200px; 
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>\u{1F4CA} TableShare</h1>
    <p class="tagline">Paste your table data. Get a shareable link. That's it.</p>
    
    <textarea 
      id="paste-area" 
      placeholder="Paste CSV, TSV, or table data here...

Example:
Name,Age,City
Alice,30,NYC
Bob,25,LA"
      autofocus
    ></textarea>
    
    <div class="loading" id="loading">Generating your link</div>
    
    <div id="status"></div>
    
    <div class="footer">
      No signup required \u2022 Links expire in 30 days \u2022 Privacy-first
    </div>
    
    <!-- Honeypot for bot detection -->
    <input type="text" name="website" id="website" style="position:absolute;left:-9999px;" tabindex="-1" autocomplete="off" aria-hidden="true">
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"><\/script>
  
  <script>
    const pasteArea = document.getElementById('paste-area');
    const status = document.getElementById('status');
    const loading = document.getElementById('loading');
    
    // Auto-process on paste
    pasteArea.addEventListener('paste', () => {
      setTimeout(() => processData(), 100);
    });
    
    
    async function processData() {
      const rawData = pasteArea.value.trim();
      
      if (!rawData) return;
      
      // Check honeypot
      if (document.getElementById('website').value) {
        showError('Invalid submission detected');
        return;
      }
      
      // Show loading
      loading.classList.add('active');
      status.style.display = 'none';
      
      // Parse with PapaParse
      const parsed = Papa.parse(rawData, {
        delimiter: '',
        skipEmptyLines: true,
        dynamicTyping: true
      });
      
      if (parsed.errors.length > 0) {
        showError('Could not parse data. Please check formatting.');
        loading.classList.remove('active');
        return;
      }
      
      if (parsed.data.length === 0) {
        showError('No data found to share.');
        loading.classList.remove('active');
        return;
      }
      
      // Send to API
      try {
        const response = await fetch('/api/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: parsed.data,
            honeypot: document.getElementById('website').value
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create table');
        }
        
        // Copy to clipboard
        await navigator.clipboard.writeText(result.url);
        
        // Show success
        showSuccess(\`\u2705 Link copied to clipboard!<br><br><a href="\${result.url}" target="_blank">\${result.url}</a>\`);
        
        // Clear textarea after 3 seconds
        setTimeout(() => {
          status.style.display = 'none';
        }, 5000);
        
      } catch (error) {
        showError(error.message);
      } finally {
        loading.classList.remove('active');
      }
    }
    
    function showSuccess(message) {
      status.innerHTML = message;
      status.className = 'success';
      status.style.display = 'block';
    }
    
    function showError(message) {
      status.innerHTML = \`\u274C \${message}\`;
      status.className = 'error';
      status.style.display = 'block';
    }
  <\/script>
</body>
</html>`;
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
};
var src_default = {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders
        });
      }
      if (pathname === "/") {
        return new Response(INDEX_HTML, {
          headers: {
            "Content-Type": "text/html",
            ...corsHeaders
          }
        });
      } else if (pathname === "/api/create" && request.method === "POST") {
        const response = await handleCreate(request, env);
        return new Response(response.body, {
          ...response,
          headers: {
            ...response.headers,
            ...corsHeaders
          }
        });
      } else if (pathname.startsWith("/t/") && pathname.length === 11) {
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
      return new Response("Not Found", {
        status: 404,
        headers: corsHeaders
      });
    } catch (error) {
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

// C:/Users/markr/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/markr/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Gu5LDY/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// C:/Users/markr/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Gu5LDY/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
