import { sanitizeCell } from '../utils/sanitizer.js';

const TABLE_ID_PLACEHOLDER = '__TABLE_ID__';

const VIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Table Share</title>
  <style>
    :root {
      --bg-color: #fff;
      --text-color: #000;
      --border-color: #000;
      --accent-color: #0066cc;
      --muted-color: #666;
    }
    [data-theme="dark"] {
      --bg-color: #1a1a1a;
      --text-color: #fff;
      --border-color: #fff;
      --accent-color: #4da6ff;
      --muted-color: #aaa;
    }
    body {
      font-family: system-ui, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      background: var(--bg-color);
      color: var(--text-color);
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 20px 0;
      box-sizing: border-box;
    }

    table {
      width: auto;
      margin: 0 auto;
      border-collapse: collapse;
      border: 2px solid var(--border-color);
    }

    th, td {
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      text-align: left;
    }

    .download-link {
      display: block;
      margin: 20px 0;
      color: var(--accent-color);
      text-decoration: none;
    }

    .download-link:hover {
      text-decoration: underline;
    }

    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid var(--border-color);
      text-align: center;
      font-size: 12px;
      color: var(--muted-color);
    }

    footer a {
      color: var(--accent-color);
      text-decoration: none;
    }
  </style>
  <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
</head>
<body>
  <div class="table-container">
    <table>
      {{TABLE_HTML}}
    </table>
  </div>

  <a href="#" class="download-link" onclick="downloadCSV()">Download CSV</a>

  <footer>
    Created with <a href="/">Table Share</a> |
    <a href="mailto:markrhenz2@gmail.com?subject=Report Table {{TABLE_ID}}">
      Report Abuse
    </a>
  </footer>

  <script>
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

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
          if (text.includes(',') || text.includes('"') || text.includes('\\n')) {
            text = '"' + text.replace(/"/g, '""') + '"';
          }
          return text;
        });
        csv.push(rowData.join(','));
      });

      const csvContent = csv.join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'table-{{TABLE_ID}}.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

export async function handleView(request, env, id) {
  try {
    if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
      return new Response('Not Found', { status: 404 });
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
      `, { status: 404, headers: { 'Content-Type': 'text/html' } });
    }

    const tableData = JSON.parse(dataStr);
    let { data } = tableData;

    const maxCols = Math.max(...data.map(r => r.length));
    data = data.map(r => {
      while (r.length > 0 && r.at(-1) === "") r.pop();
      while (r.length < maxCols) r.push("");
      return r;
    });

    let tableHtml = '';
    if (data.length > 0) {
      tableHtml += '<thead><tr>';
      for (const cell of data[0]) {
        tableHtml += `<th>${sanitizeCell(cell)}</th>`;
      }
      tableHtml += '</tr></thead>';

      tableHtml += '<tbody>';
      for (let i = 1; i < data.length; i++) {
        tableHtml += '<tr>';
        for (const cell of data[i]) {
          tableHtml += `<td>${sanitizeCell(cell)}</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody>';
    }

    let html = VIEW_TEMPLATE
      .replace(/{{TABLE_HTML}}/g, tableHtml)
      .replace(/{{TABLE_ID}}/g, id);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error in handleView:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}