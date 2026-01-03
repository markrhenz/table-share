========================================
CONSISTENCY AUDIT REPORT
Reference: index.html
Date: 2025-11-20T23:09:49Z
========================================

INDEX.HTML REFERENCE PATTERNS:
-----------------------------------

HEADER:
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

THEME TOGGLE:
<button id="themeToggle" class="ts-theme-toggle">
  <span class="ts-theme-icon">🌙</span>
  <span class="ts-theme-text">Dark</span>
</button>

DARK MODE CSS:
- External CSS via <link rel="stylesheet" href="/styles.css">
- No inline dark mode CSS variables
- Relies on external stylesheet for theme management

FOOTER:
<footer class="ts-footer">
  <p>&copy; 2025 Table Share | <a href="mailto:markrhenz2@gmail.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
</footer>

JAVASCRIPT:
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
const updateButtonContent = function(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('.theme-text');

  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
};

CSS LINK:
<link rel="stylesheet" href="/styles.css">

========================================

FILE-BY-FILE COMPARISON:
-----------------------------------

FILE: view.html

❌ HEADER MISMATCHES:
- Line 334: Uses inline style div instead of <header class="ts-header">
- Structure: DIFFERENT - div with inline styles vs proper semantic header
- Classes: DIFFERENT - no ts-header classes used
- Logo: Line 336: style="height: 24px;" vs class="ts-header-logo"
- Title: Line 337: <span> vs <h1 class="ts-header-title">

❌ THEME TOGGLE MISMATCHES:
- Line 339: <button id="themeToggle" style="padding: 4px 10px; border: 1px solid #000; background: #fff; cursor: pointer; font-size: 12px;">🌙</button>
- Button classes: DIFFERENT - no ts-theme-toggle class
- Icon/text spans: MISSING - no .ts-theme-icon or .ts-theme-text spans
- Inline styles: Line 339: style="padding: 4px 10px; border: 1px solid #000; background: #fff; cursor: pointer; font-size: 12px;"

❌ DARK MODE CSS MISMATCHES:
- Lines 8-331: DUPLICATE INLINE STYLES (323 lines) - should use external stylesheet
- :root variables: DIFFERENT - has inline variables vs external CSS
- [data-theme="dark"] rules: DIFFERENT - inline vs external CSS
- Logo invert: Lines 137-139: inline rule vs external CSS
- Other selectors: Multiple duplicate selectors

❌ FOOTER MISMATCHES:
- Line 350: <footer> vs <footer class="ts-footer">
- Structure: DIFFERENT - no ts-footer class
- Links: Similar structure but missing ts-footer wrapper

❌ JAVASCRIPT MISMATCHES:
- Theme toggle code: MATCHES - same functions present
- Function names: MATCH - applyTheme, getPreferredTheme, updateButtonContent

❌ INLINE STYLES (MUST BE REMOVED):
- Line 334: style="position: fixed; top: 0; left: 0; right: 0; width: 100%; background: #fff; border-bottom: 2px solid #000; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; box-sizing: border-box;"
- Line 336: style="height: 24px;"
- Line 339: style="padding: 4px 10px; border: 1px solid #000; background: #fff; cursor: pointer; font-size: 12px;"

❌ DUPLICATE <STYLE> BLOCKS (MUST BE REMOVED):
- Lines 8-331: 323 lines of duplicate inline styles

❌ CSS LINK:
- MISSING: No external CSS link present

========================================

FILE: pricing.html

❌ HEADER MISMATCHES:
- Line 272: Uses inline style div instead of <header class="ts-header">
- Structure: DIFFERENT - div with inline styles vs proper semantic header
- Classes: DIFFERENT - no ts-header classes used
- Logo: Line 274: style="height: 24px;" vs class="ts-header-logo"
- Title: Line 275: <span> vs <h1 class="ts-header-title">

❌ THEME TOGGLE MISMATCHES:
- Line 278: <button id="themeToggle" class="theme-toggle" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #000; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;" aria-label="Toggle dark mode">🌙</button>
- Button classes: DIFFERENT - "theme-toggle" vs "ts-theme-toggle"
- Icon/text spans: MISSING - no .ts-theme-icon or .ts-theme-text spans
- Inline styles: Line 278: extensive inline styles present

❌ DARK MODE CSS MISMATCHES:
- Lines 8-269: DUPLICATE INLINE STYLES (262 lines) - should use external stylesheet
- :root variables: DIFFERENT - has inline variables vs external CSS
- [data-theme="dark"] rules: DIFFERENT - inline vs external CSS
- Logo invert: Lines 62-64: inline rule vs external CSS
- Other selectors: Multiple duplicate selectors

❌ FOOTER MISMATCHES:
- MISSING: No footer element present
- Should have <footer class="ts-footer"> like index.html

❌ JAVASCRIPT MISMATCHES:
- Theme toggle code: DIFFERENT - uses SharedTheme from /shared-theme.js
- Function names: DIFFERENT - window.SharedTheme.applyTheme vs direct functions
- Missing: applyTheme, getPreferredTheme, updateButtonContent functions

❌ INLINE STYLES (MUST BE REMOVED):
- Line 272: style="position: fixed; top: 0; left: 0; right: 0; width: 100%; background: #fff; border-bottom: 2px solid #000; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; box-sizing: border-box;"
- Line 274: style="height: 24px;"
- Line 278: style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #000; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;"

❌ DUPLICATE <STYLE> BLOCKS (MUST BE REMOVED):
- Lines 8-269: 262 lines of duplicate inline styles

❌ CSS LINK:
- MISSING: No external CSS link present

========================================

FILE: terms.html

❌ HEADER MISMATCHES:
- Line 9: <div class="ts-fixed-header"> vs <header class="ts-header">
- Structure: DIFFERENT - div instead of semantic header element
- Classes: DIFFERENT - "ts-fixed-header" vs "ts-header"
- Logo: Line 11: class="ts-fixed-header-logo" vs "ts-header-logo"
- Title: Line 12: class="ts-fixed-header-title" vs "ts-header-title"

❌ THEME TOGGLE MISMATCHES:
- Line 14: <button id="themeToggle" class="ts-theme-toggle-circle">🌙</button>
- Button classes: DIFFERENT - "ts-theme-toggle-circle" vs "ts-theme-toggle"
- Icon/text spans: MISSING - no .ts-theme-icon or .ts-theme-text spans
- Inline styles: Line 14: no inline styles (good)

❌ DARK MODE CSS MISMATCHES:
- MISSING: No dark mode CSS variables
- Uses external /styles.css link (good)
- No inline dark mode rules

❌ FOOTER MISMATCHES:
- MISSING: No footer element present
- Should have <footer class="ts-footer"> like index.html

❌ JAVASCRIPT MISMATCHES:
- Theme toggle code: DIFFERENT - uses SharedTheme from /shared-theme.js
- Function names: DIFFERENT - window.SharedTheme.applyTheme vs direct functions
- Missing: applyTheme, getPreferredTheme, updateButtonContent functions

❌ INLINE STYLES (MUST BE REMOVED):
- Line 9: class="ts-fixed-header" (class name issue, not inline style)
- Line 14: class="ts-theme-toggle-circle" (class name issue, not inline style)

❌ DUPLICATE <STYLE> BLOCKS:
- NONE: Uses external CSS link (good)

❌ CSS LINK:
- PRESENT: Line 6: <link rel="stylesheet" href="/styles.css"> (correct location)

========================================

FILE: privacy.html

❌ HEADER MISMATCHES:
- Line 259: Uses inline style div instead of <header class="ts-header">
- Structure: DIFFERENT - div with inline styles vs proper semantic header
- Classes: DIFFERENT - no ts-header classes used
- Logo: Line 261: style="height: 24px;" vs class="ts-header-logo"
- Title: Line 262: <span> vs <h1 class="ts-header-title">

❌ THEME TOGGLE MISMATCHES:
- Line 265: <button id="themeToggle" class="theme-toggle" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #000; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;" aria-label="Toggle dark mode">🌙</button>
- Button classes: DIFFERENT - "theme-toggle" vs "ts-theme-toggle"
- Icon/text spans: MISSING - no .ts-theme-icon or .ts-theme-text spans
- Inline styles: Line 265: extensive inline styles present

❌ DARK MODE CSS MISMATCHES:
- Lines 8-256: DUPLICATE INLINE STYLES (249 lines) - should use external stylesheet
- :root variables: DIFFERENT - has inline variables vs external CSS
- [data-theme="dark"] rules: DIFFERENT - inline vs external CSS
- Logo invert: Lines 45-47: inline rule vs external CSS
- Other selectors: Multiple duplicate selectors

❌ FOOTER MISMATCHES:
- MISSING: No footer element present
- Should have <footer class="ts-footer"> like index.html

❌ JAVASCRIPT MISMATCHES:
- Theme toggle code: DIFFERENT - uses SharedTheme from /shared-theme.js
- Function names: DIFFERENT - window.SharedTheme.applyTheme vs direct functions
- Missing: applyTheme, getPreferredTheme, updateButtonContent functions

❌ INLINE STYLES (MUST BE REMOVED):
- Line 259: style="position: fixed; top: 0; left: 0; right: 0; width: 100%; background: #fff; border-bottom: 2px solid #000; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999; box-sizing: border-box;"
- Line 261: style="height: 24px;"
- Line 265: style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #000; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;"

❌ DUPLICATE <STYLE> BLOCKS (MUST BE REMOVED):
- Lines 8-256: 249 lines of duplicate inline styles

❌ CSS LINK:
- MISSING: No external CSS link present

========================================

SUMMARY:
- Total files audited: 5
- Files matching index.html: 0
- Files requiring fixes: 4
- Total inline styles found: 15 individual style attributes
- Total duplicate <style> blocks: 4 blocks (834 lines total)
- Files missing external CSS link: 3 (view.html, pricing.html, privacy.html)
- Files with incorrect header structure: 4 (all except index.html)
- Files with incorrect theme toggle: 4 (all except index.html)
- Files missing footer: 3 (pricing.html, terms.html, privacy.html)
- Files using different JavaScript approach: 3 (pricing.html, terms.html, privacy.html)

CRITICAL ISSUES REQUIRING IMMEDIATE FIX:
1. All templates have duplicate CSS that should be external
2. Multiple inline styles that should use CSS classes
3. Inconsistent header implementations across templates
4. Missing footer elements in several templates
5. Different JavaScript theme management approaches
6. Missing external CSS links in 3 files