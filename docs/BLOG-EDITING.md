# Blog Editing Guide

## How to Edit Blog Articles

### The New System

Blog articles are now stored as **HTML files** in `src/templates/`. When you deploy, a build script automatically converts them to JavaScript.

### Files

- `src/templates/blog-post-excel.html` - Excel sharing article
- `src/templates/blog-post-sql.html` - SQL results article
- `src/templates/blog-post-sheets.html` - Google Sheets alternatives article
- `src/templates/blog-index.html` - Blog homepage

### Workflow

1. **Edit HTML files** in `src/templates/`
2. **Deploy**: `npm run deploy`
   - This automatically runs `build-templates.js` which reads your HTML
   - Then deploys to Cloudflare Workers

### Important Notes

- ✅ **Edit HTML files** - These are the source of truth
- ❌ **Don't edit `src/utils/templates.js`** - It's auto-generated and will be overwritten
- 📝 **CSS changes** go in `public/blog.css` - No build needed, it's a static asset

### Classes to Use

Your HTML should use these CSS classes (already in place):

- `blog-container` - Main article wrapper
- `blog-title` - Article title
- `blog-meta` - Date/read time
- `blog-section` - Major sections
- `blog-card` - Callout boxes
- `blog-card-highlight` - Important callouts
- `blog-content` - General content wrapper

### Example Edit

```bash
# 1. Edit the HTML
code src/templates/blog-post-excel.html

# 2. Deploy (builds templates automatically)
npm run deploy
```

That's it! Your changes are now live.
