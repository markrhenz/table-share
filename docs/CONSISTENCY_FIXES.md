# CONSISTENCY FIXES - STEP BY STEP
Reference: index.html
Based on: CONSISTENCY_AUDIT.md

## EXECUTION ORDER:
1. view.html (most changes needed)
2. pricing.html
3. privacy.html
4. terms.html

---

## FILE 1: view.html
========================================

STEP 1: Add external CSS link
LOCATION: In <head> section, after line 6 (<title> tag)
ADD:
<link rel="stylesheet" href="/styles.css">

STEP 2: Delete entire <style> block
SEARCH FOR (first 5 lines to identify):
<style>
    :root {
      --bg-color: #fff;
      --text-color: #000;
      --border-color: #000;

DELETE: Lines 7 through 331 (entire <style> block - 325 lines)
CONFIRM DELETION: Remove everything from line 7 <style> to line 331 </style>

STEP 3: Replace header with index.html reference
SEARCH FOR (exact current header HTML):
<div style="position: fixed; top: 0; left: 0; right: 0; width: 100%; background: #fff; border-bottom: 2px solid #000; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; box-sizing: border-box;">
  <div style="display: flex; align-items: center; gap: 10px;">
    <img src="/logo.png" alt="" style="height: 24px;">
    <span style="font-size: 16px; font-weight: bold;">Table Share</span>
  </div>
  <button id="themeToggle" style="padding: 4px 10px; border: 1px solid #000; background: #fff; cursor: pointer; font-size: 12px;">🌙</button>
</div>

REPLACE WITH (exact HTML from index.html):
<header class="ts-header">
  <div class="ts-header-left">
    <img src="/logo.png" alt="" class="ts-header-logo">
    <h1 class="ts-header-title">Table Share</h1>
  </div>
  <button id="themeToggle" class="ts-theme-toggle">
    <span class="ts-theme-icon">🌙</span>
    <span class="ts-theme-text">Dark</span>
  </button>
</header>

STEP 4: Remove inline styles from spacer div
LINE 343:
CURRENT: <div style="height: 60px;"></div>
REPLACE: <div style="height: 60px;"></div>

STEP 5: Add footer
LOCATION: Before line 417 (</body> tag)
ADD (exact HTML from index.html):
<footer class="ts-footer">
  <p>&copy; 2025 Table Share | <a href="mailto:markrhenz2@gmail.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
</footer>

STEP 6: Update theme toggle JavaScript structure
CURRENT THEME JS (lines 355-379):
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateButtonContent(theme);
}
function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
// Update button content (icon + text or icon only)
const updateButtonContent = function(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');

  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
};
applyTheme(getPreferredTheme());
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

REPLACE WITH (same JavaScript - keep as is, it's already correct):
// Theme management
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateButtonContent(theme);
}
function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
// Update button content (icon + text or icon only)
const updateButtonContent = function(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');

  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
};
applyTheme(getPreferredTheme());
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

---

## FILE 2: pricing.html
========================================

STEP 1: Delete entire <style> block
SEARCH FOR (first 5 lines to identify):
<style>
    :root {
        --bg-color: #fff;
        --text-color: #000;
        --secondary-bg: #f5f5f5;

DELETE: Lines 8 through 269 (entire <style> block - 262 lines)
CONFIRM DELETION: Remove everything from line 8 <style> to line 269 </style>

STEP 2: Replace header with index.html reference
SEARCH FOR (exact current header HTML):
<div style="position: fixed; top: 0; left: 0; right: 0; width: 100%; background: #fff; border-bottom: 2px solid #000; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; box-sizing: border-box;">
  <div style="display: flex; align-items: center; gap: 10px;">
    <img src="/logo.png" alt="" style="height: 24px;">
    <span style="font-size: 16px; font-weight: bold;">Table Share</span>
  </div>
  <div class="controls" style="display: flex; align-items: center; gap: 16px; flex-shrink: 0;">
    <button id="themeToggle" class="theme-toggle" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #000; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;" aria-label="Toggle dark mode">🌙</button>
  </div>
</div>

REPLACE WITH (exact HTML from index.html):
<header class="ts-header">
  <div class="ts-header-left">
    <img src="/logo.png" alt="" class="ts-header-logo">
    <h1 class="ts-header-title">Table Share</h1>
  </div>
  <button id="themeToggle" class="ts-theme-toggle">
    <span class="ts-theme-icon">🌙</span>
    <span class="ts-theme-text">Dark</span>
  </button>
</header>

STEP 3: Remove inline styles from spacer div
LINE 283:
CURRENT: <div style="height: 60px;"></div>
REPLACE: <div style="height: 60px;"></div>

STEP 4: Add footer
LOCATION: Before line 402 (</body> tag)
ADD (exact HTML from index.html):
<footer class="ts-footer">
  <p>&copy; 2025 Table Share | <a href="mailto:markrhenz2@gmail.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
</footer>

STEP 5: Replace theme toggle JavaScript
CURRENT THEME JS (lines 380-400):
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && window.SharedTheme) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
        });
        return true;
    }
    return false;
}

// Try immediate initialization, fall back to DOMContentLoaded
if (!initThemeToggle()) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!initThemeToggle()) {
            setTimeout(initThemeToggle, 100);
        }
    });
}

REPLACE WITH (exact JS from index.html):
// Theme management
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateButtonContent(theme);
}
function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
// Update button content (icon + text or icon only)
const updateButtonContent = function(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');

  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
};
applyTheme(getPreferredTheme());
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

STEP 6: Remove SharedTheme script reference
CURRENT: Line 377: <script src="/shared-theme.js"></script>
REMOVE: Line 377 entirely

---

## FILE 3: privacy.html
========================================

STEP 1: Delete entire <style> block
SEARCH FOR (first 5 lines to identify):
<style>
/* Header - Bulletproof Responsive Layout */
header {
  position: sticky;
  top: 0;
  background: #fff;

DELETE: Lines 7 through 256 (entire <style> block - 250 lines)
CONFIRM DELETION: Remove everything from line 7 <style> to line 256 </style>

STEP 2: Replace header with index.html reference
SEARCH FOR (exact current header HTML):
<div style="position: fixed; top: 0; left: 0; right: 0; width: 100%; background: #fff; border-bottom: 2px solid #000; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; box-sizing: border-box;">
  <div style="display: flex; align-items: center; gap: 10px;">
    <img src="/logo.png" alt="" style="height: 24px;">
    <span style="font-size: 16px; font-weight: bold;">Table Share</span>
  </div>
  <div class="controls" style="display: flex; align-items: center; gap: 16px; flex-shrink: 0;">
    <button id="themeToggle" class="theme-toggle" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #000; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;" aria-label="Toggle dark mode">🌙</button>
  </div>
</div>

REPLACE WITH (exact HTML from index.html):
<header class="ts-header">
  <div class="ts-header-left">
    <img src="/logo.png" alt="" class="ts-header-logo">
    <h1 class="ts-header-title">Table Share</h1>
  </div>
  <button id="themeToggle" class="ts-theme-toggle">
    <span class="ts-theme-icon">🌙</span>
    <span class="ts-theme-text">Dark</span>
  </button>
</header>

STEP 3: Remove inline styles from spacer div
LINE 270:
CURRENT: <div style="height: 60px;"></div>
REPLACE: <div style="height: 60px;"></div>

STEP 4: Add footer
LOCATION: Before line 337 (</body> tag)
ADD (exact HTML from index.html):
<footer class="ts-footer">
  <p>&copy; 2025 Table Share | <a href="mailto:markrhenz2@gmail.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
</footer>

STEP 5: Replace theme toggle JavaScript
CURRENT THEME JS (lines 314-335):
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && window.SharedTheme) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
        });
        return true;
    }
    return false;
}

// Try immediate initialization, fall back to DOMContentLoaded
if (!initThemeToggle()) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!initThemeToggle()) {
            setTimeout(initThemeToggle, 100);
        }
    });
}

REPLACE WITH (exact JS from index.html):
// Theme management
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateButtonContent(theme);
}
function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
// Update button content (icon + text or icon only)
const updateButtonContent = function(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');

  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
};
applyTheme(getPreferredTheme());
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

STEP 6: Remove SharedTheme script reference
CURRENT: Line 312: <script src="/shared-theme.js"></script>
REMOVE: Line 312 entirely

---

## FILE 4: terms.html
========================================

STEP 1: Fix header class names
SEARCH FOR (current header):
<div class="ts-fixed-header">
  <div class="ts-fixed-header-left">
    <img src="/logo.png" alt="" class="ts-fixed-header-logo">
    <span class="ts-fixed-header-title">Table Share</span>
  </div>
  <button id="themeToggle" class="ts-theme-toggle-circle">🌙</button>
</div>

REPLACE WITH (exact HTML from index.html):
<header class="ts-header">
  <div class="ts-header-left">
    <img src="/logo.png" alt="" class="ts-header-logo">
    <h1 class="ts-header-title">Table Share</h1>
  </div>
  <button id="themeToggle" class="ts-theme-toggle">
    <span class="ts-theme-icon">🌙</span>
    <span class="ts-theme-text">Dark</span>
  </button>
</header>

STEP 2: Add footer
LOCATION: Before line 73 (</body> tag)
ADD (exact HTML from index.html):
<footer class="ts-footer">
  <p>&copy; 2025 Table Share | <a href="mailto:markrhenz2@gmail.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
</footer>

STEP 3: Replace theme toggle JavaScript
CURRENT THEME JS (lines 52-72):
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && window.SharedTheme) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
        });
        return true;
    }
    return false;
}

// Try immediate initialization, fall back to DOMContentLoaded
if (!initThemeToggle()) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!initThemeToggle()) {
            setTimeout(initThemeToggle, 100);
        }
    });
}

REPLACE WITH (exact JS from index.html):
// Theme management
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateButtonContent(theme);
}
function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
// Update button content (icon + text or icon only)
const updateButtonContent = function(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');

  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
};
applyTheme(getPreferredTheme());
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

STEP 4: Remove SharedTheme script reference
CURRENT: Line 49: <script src="/shared-theme.js"></script>
REMOVE: Line 49 entirely

---

## VALIDATION TESTS (Run after ALL fixes):
1. Open each template in browser
2. Verify header looks identical to index.html
3. Click theme toggle - should work on all pages
4. Check dark mode - should look identical across pages
5. Verify footer present and styled correctly
6. Check mobile view (360px) - header should be consistent
7. Browser console - no errors

## VERIFICATION CHECKLIST:
For each file after fixing:
✓ External CSS link added (view.html, pricing.html, privacy.html)
✓ All <style> blocks removed (view.html, pricing.html, privacy.html)
✓ Header structure matches index.html exactly
✓ Theme toggle structure matches index.html exactly
✓ Footer added where missing (pricing.html, privacy.html, terms.html)
✓ Theme JavaScript unified across all pages
✓ No inline styles remain (except spacer divs)
✓ SharedTheme.js references removed (pricing.html, privacy.html, terms.html)