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
    const url = `${new URL(request.url).origin}/t/${id}`;
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
  <title>{{TABLE_TITLE}} - Table Share</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      color: #000;
      line-height: 1.5;
    }
    
    table {
      width: 100%;
      border: 2px solid #000;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th {
      background: #F5F5F5;
      border: 1px solid #000;
      padding: 10px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      border: 1px solid #ccc;
      padding: 10px;
    }
    
    .download-link {
      display: inline-block;
      margin: 20px 0;
      color: #0066CC;
      text-decoration: none;
    }
    
    .download-link:hover {
      text-decoration: underline;
    }
    
    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    
    footer a {
      color: #0066CC;
      text-decoration: none;
      margin: 0 10px;
    }
    
    footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="meta">{{TABLE_META}}</div>
  {{TABLE_HTML}}
  
  <a href="#" class="download-link" onclick="downloadCSV(); return false;">\u{1F4E5} Download CSV</a>
  
  <footer>
    Created with <a href="/">Table Share</a> \u2022 Expires: {{EXPIRES_AT}}
  </footer>
  
  <script>
    function downloadCSV() {
      var table = document.querySelector('table');
      if (!table) {
        alert('No table found');
        return;
      }
      
      var rows = table.querySelectorAll('tr');
      var csv = [];
      
      rows.forEach(function(row) {
        var cells = row.querySelectorAll('th, td');
        var rowData = [];
        cells.forEach(function(cell) {
          var text = cell.textContent.trim();
          if (text.indexOf(',') !== -1 || text.indexOf('"') !== -1) {
            text = '"' + text.split('"').join('""') + '"';
          }
          rowData.push(text);
        });
        csv.push(rowData.join(','));
      });
      
      var csvContent = csv.join('
');
      var blob = new Blob([csvContent], {type: 'text/csv'});
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'table-{{TABLE_ID}}.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  <\/script>
</body>
</html>`;
async function handleView(request, env, id) {
  console.log("handleView called with id:", id);
  try {
    if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
      console.log("Invalid ID format");
      return new Response("Not Found", { status: 404 });
    }
    console.log("Fetching from KV for id:", id);
    const dataStr = await env.TABLES.get(id);
    console.log("KV get result:", dataStr);
    if (!dataStr) {
      console.log("No data found in KV");
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
    console.log("Parsing JSON");
    const tableData = JSON.parse(dataStr);
    console.log("Parsed data:", tableData);
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
    console.log("Replacing placeholders in template");
    let html = VIEW_TEMPLATE.replace(/{{TABLE_TITLE}}/g, `Table ${id}`).replace(/{{TABLE_META}}/g, `${rowCount} rows \xD7 ${colCount} columns`).replace(/{{TABLE_HTML}}/g, tableHtml).replace(/{{EXPIRES_AT}}/g, expiresAt).replace(/{{TABLE_ID}}/g, id);
    console.log("Generating response");
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error in handleView:", error);
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
  <title>Table Share</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 700px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      color: #000;
      line-height: 1.5;
    }

    h1 {
      font-size: 24px;
      font-weight: normal;
      margin-bottom: 8px;
    }

    .tagline {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
    }

    #dataInput {
      width: 100%;
      height: 300px;
      font-family: Consolas, Monaco, monospace;
      font-size: 14px;
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 10px;
    }

    #generateBtn {
      background: #0066CC;
      color: #fff;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      display: none;
    }

    #status {
      color: #228B22;
      margin-top: 10px;
      display: none;
    }

    #status.show { display: block; }

    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    footer a {
      color: #0066CC;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <h1>Table Share</h1>
  <p class="tagline">Paste your table. Get a link.</p>

  <textarea id="dataInput" placeholder="Paste your table here (from Excel, Sheets, or CSV)"></textarea>

  <button id="generateBtn">Generate Link</button>

  <div id="status"></div>

  <footer>
    Created with <a href="/">Table Share</a>
  </footer>

  <!-- Honeypot for bot detection -->
  <input type="text" name="website" id="website" style="position:absolute;left:-9999px;" tabindex="-1" autocomplete="off" aria-hidden="true">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"><\/script>

  <script>
    const dataInput = document.getElementById('dataInput');
    const generateBtn = document.getElementById('generateBtn');
    const status = document.getElementById('status');

    // Show button on paste
    dataInput.addEventListener('paste', () => {
      setTimeout(() => {
        if (dataInput.value.trim()) {
          generateBtn.style.display = 'block';
        }
      }, 100);
    });

    // Process on button click
    generateBtn.addEventListener('click', processData);

    async function processData() {
      const rawData = dataInput.value.trim();

      if (!rawData) return;

      // Check honeypot
      if (document.getElementById('website').value) {
        showError('Invalid submission detected');
        return;
      }

      // Show loading
      status.textContent = 'Generating your link...';
      status.classList.add('show');
      generateBtn.style.display = 'none';

      // Parse with PapaParse
      const parsed = Papa.parse(rawData, {
        delimiter: '',
        skipEmptyLines: true,
        dynamicTyping: true
      });

      if (parsed.errors.length > 0) {
        showError('Could not parse data. Please check formatting.');
        return;
      }

      if (parsed.data.length === 0) {
        showError('No data found to share.');
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
        showSuccess('\u2713 Link copied!');

        // Clear after 3 seconds
        setTimeout(() => {
          status.classList.remove('show');
        }, 3000);

      } catch (error) {
        showError(error.message);
      }
    }

    function showSuccess(message) {
      status.textContent = message;
      status.classList.add('show');
    }

    function showError(message) {
      status.textContent = message;
      status.classList.add('show');
      generateBtn.style.display = 'block';
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

// .wrangler/tmp/bundle-Jf6A3B/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-Jf6A3B/middleware-loader.entry.ts
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
