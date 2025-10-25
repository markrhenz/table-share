import { sanitizeCell } from '../utils/sanitizer.js';

// Placeholder for template replacement to avoid JavaScript template literal interpolation issues
const TABLE_ID_PLACEHOLDER = '__TABLE_ID__';

const VIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TABLE_TITLE}} - Table Share</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      color: #000;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 20px 0;
      box-sizing: border-box;
    }

    table {
      margin: 0 auto; /* center compact table */
      border-collapse: collapse;
      border: 2px solid #000; /* keep border */
    }

    th, td {
      padding: 8px 12px;
      border-bottom: 1px solid #ddd;
      white-space: nowrap; /* keep content on one line; remove if undesired */
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .download-link {
      display: block;
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
      border-top: 2px solid #000;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    footer a {
      color: #0066CC;
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
    Created with <a href="/">Table Share</a> -
    The fastest way to share a table |
    <a href="mailto:abuse@tableshare.com?subject=Report Table {{TABLE_ID}}">
      Report Abuse
    </a>
  </footer>

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
          if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            text = '"' + text.replace(/"/g, '""') + '"';
          }

          return text;
        });

        csv.push(rowData.join(','));
      });

      // Create blob and download
      const csvContent = csv.join('\n');
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
  console.log('handleView called with id:', id);
  try {
    // Validate ID format
    if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
      console.log('Invalid ID format');
      return new Response('Not Found', { status: 404 });
    }

    // Fetch from KV
    console.log('Fetching from KV for id:', id);
    const dataStr = await env.TABLES.get(id);
    console.log('KV get result:', dataStr);
    if (!dataStr) {
      console.log('No data found in KV');
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
    if (!tableData) {
      return new Response('Table not found or expired', { 
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Parse JSON
    console.log('Parsing JSON');
    const tableData = JSON.parse(dataStr);
    console.log('Parsed data:', tableData);
    let { data, createdAt, rowCount, colCount } = tableData;

    // Normalize column counts to prevent extra blank cells

    const maxCols = Math.max(...data.map(r => r.length));

    data = data.map(r => {

      // Trim empty cells that cause border spilling

      while (r.length > 0 && r[r.length - 1] === "") r.pop();

      // Ensure equal column count for all rows

      while (r.length < maxCols) r.push("");

      return r;

    });

    // Generate HTML table
    let tableHtml = '<table>';
    if (data.length > 0) {
      // First row as thead
      tableHtml += '<thead><tr>';
      data[0].forEach(cell => {
        tableHtml += `<th>${sanitizeCell(cell)}</th>`;
      });
      tableHtml += '</tr></thead>';

      // Rest as tbody
      tableHtml += '<tbody>';
      for (let i = 1; i < data.length; i++) {
        tableHtml += '<tr>';
        data[i].forEach(cell => {
          tableHtml += `<td>${sanitizeCell(cell)}</td>`;
        });
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody>';
    }
    tableHtml += '</table>';

    // Calculate expiration date (30 days from createdAt)
    const createdDate = new Date(createdAt);
    const expiresDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiresAt = expiresDate.toISOString().split('T')[0];

    // Replace placeholders
    console.log('Replacing placeholders in template');
    let html = VIEW_TEMPLATE
      .replace(/{{TABLE_TITLE}}/g, `Table ${id}`)
      .replace(/{{TABLE_META}}/g, `${rowCount} rows × ${colCount} columns`)
      .replace(/{{TABLE_HTML}}/g, tableHtml)
      .replace(/{{EXPIRES_AT}}/g, expiresAt)
      .replace(/{{TABLE_ID}}/g, id);

    console.log('Generating response');
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