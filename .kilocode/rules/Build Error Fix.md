# Build Error Fix Workflow

## WHEN YOU ENCOUNTER BUILD ERRORS

### STEP 1: IDENTIFY ERROR TYPE
Run: `wrangler deploy --dry-run`
Read the EXACT error message.

Common errors:
- "SyntaxError": Missing brace, unclosed template literal
- "Cannot find module": Invalid import path
- "Unexpected token": Typo in JavaScript

### STEP 2: CHECK SYNTAX
Verify:
- [ ] All `if` statements have closing `}`
- [ ] All template literals start with \` and end with \`;
- [ ] No HTML imports (must be template literals)
- [ ] All routes inside `export default` block

### STEP 3: FIX IN ORDER
1. Fix syntax errors FIRST (braces, semicolons)
2. Fix import errors SECOND (wrong paths, invalid imports)
3. Fix logic errors LAST (wrong variable names)

### STEP 4: TEST
```bash
cd "D:\PROJECTS\Spreadsheet Project\table-share"
wrangler deploy
```

### STEP 5: VERIFY
Open https://table-share.org/
Test:
- [ ] Homepage loads
- [ ] Paste data works
- [ ] Generate link works
- [ ] View page loads
- [ ] /pricing loads
- [ ] /terms loads
- [ ] /privacy loads

## DO NOT
- Don't make multiple changes at once
- Don't assume syntax is correct
- Don't skip testing after each fix
- Don't create new files without checking duplicates