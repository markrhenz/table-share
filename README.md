# Table Share

The fastest way to share a table. Paste your data, get an instant shareable link. No signup required.

## Features

- 🚀 **Fast**: Generate shareable links in under 5 seconds
- 🔒 **Secure**: XSS prevention, rate limiting, password protection
- 📱 **Mobile-friendly**: Works on any device
- 💾 **CSV Export**: Recipients can download data
- 🌓 **Dark Mode**: Built-in theme support
- ⏰ **Auto-expires**: Links expire after 7 days (or custom up to 30 days for Pro)

## Deployment

### Prerequisites

- Cloudflare Workers account
- Wrangler CLI installed (`npm install -g wrangler`)
- SendGrid account (for Pro API key delivery)
- Ko-fi account (for Pro payments)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd table-share
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and fill in your values
   # NEVER commit .env to version control!
   ```

4. **Create KV namespace**

   ```bash
   wrangler kv:namespace create "TABLES"
   ```

   Update the KV namespace ID in `wrangler.toml`:

   ```toml
   [[kv_namespaces]]
   binding = "TABLES"
   id = "your-kv-namespace-id"
   ```

5. **Set up Cloudflare Workers secrets**

   ```bash
   # Set the analytics admin key
   wrangler secret put ADMIN_KEY
   # Enter your secure admin key when prompted

   # Set the SendGrid API key
   wrangler secret put SENDGRID_API_KEY
   # Enter your SendGrid API key when prompted

   # Set the Ko-fi webhook token
   wrangler secret put KOFI_TOKEN
   # Enter your Ko-fi webhook token when prompted
   ```

6. **Deploy to Cloudflare Workers**

   ```bash
   wrangler deploy
   ```

### Security Notes

⚠️ **IMPORTANT**: Never commit secrets to version control!

- `.env` is in `.gitignore` - keep it that way
- Use Cloudflare Workers secrets for production (via `wrangler secret put`)
- The `.env.example` file is for documentation only
- Rotate secrets regularly, especially if they may have been exposed

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_KEY` | Admin key for accessing `/analytics` dashboard | Yes |
| `SENDGRID_API_KEY` | SendGrid API key for sending Pro API key emails | Yes (for Pro) |
| `KOFI_TOKEN` | Ko-fi webhook verification token | Yes (for Pro) |

### Analytics Dashboard

Access the analytics dashboard at:

```text
https://table-share.org/analytics?key=YOUR_ADMIN_KEY
```

Replace `YOUR_ADMIN_KEY` with the value you set in Cloudflare Workers secrets.

## Development

```bash
# Run development server
wrangler dev

# Build templates (if you modify HTML templates)
node build-templates.js
```

## License

ISC
