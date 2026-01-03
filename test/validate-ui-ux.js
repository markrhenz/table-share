#!/usr/bin/env node

/**
 * Table Share - Comprehensive UI/UX Validation Test Suite
 * Tests rendered website appearance and functionality
 * Run with: node test/validate-ui-ux.js
 */

const puppeteer = require('puppeteer');
const path = require('path');

// Test Configuration
const BASE_URL = 'https://table-share.org';
const VIEWPORT_SIZES = [
  { width: 320, height: 568, name: 'iPhone SE' },
  { width: 375, height: 667, name: 'iPhone 8' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1024, height: 768, name: 'Desktop' },
  { width: 1440, height: 900, name: 'Large Desktop' }
];

// Test Results Storage
const testResults = {
  passed: [],
  failed: [],
  warnings: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

// Utility Functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📋',
    pass: '✅',
    fail: '❌',
    warn: '⚠️'
  }[type] || '📋';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addResult(testName, status, message, details = null) {
  const result = { testName, status, message, details, timestamp: new Date().toISOString() };
  testResults[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings'].push(result);
  testResults.summary[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++;
  testResults.summary.total++;
  
  log(`${testName}: ${message}`, status);
}

// Browser Setup
let browser;
let page;

async function setupBrowser() {
  log('Setting up browser...');
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  page = await browser.newPage();
  
  // Set up console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      log(`Browser Error: ${msg.text()}`, 'warn');
    }
  });
  
  // Set up request/response logging for debugging
  page.on('requestfailed', request => {
    log(`Request failed: ${request.url()}`, 'warn');
  });
  
  await page.setCacheEnabled(true);
}

async function teardownBrowser() {
  if (browser) {
    await browser.close();
    log('Browser closed');
  }
}

// Test Functions
async function testPageLoad(url, expectedTitle) {
  log(`Testing page load: ${url}`);
  
  try {
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    if (!response || response.status() >= 400) {
      addResult(`Page Load - ${url}`, 'fail', `HTTP ${response?.status() || 'No response'}`);
      return false;
    }
    
    // Check if page loaded
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check title
    const title = await page.title();
    if (title.includes(expectedTitle) || expectedTitle === 'Homepage') {
      addResult(`Page Load - ${url}`, 'pass', 'Page loaded successfully');
      return true;
    } else {
      addResult(`Page Load - ${url}`, 'fail', `Title mismatch: "${title}"`);
      return false;
    }
  } catch (error) {
    addResult(`Page Load - ${url}`, 'fail', `Error: ${error.message}`);
    return false;
  }
}

async function testResponsiveLayout(viewport, url) {
  log(`Testing responsive layout at ${viewport.name} (${viewport.width}x${viewport.height})`);
  
  try {
    await page.setViewport(viewport);
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Check if content is visible and not cut off
    const body = await page.$('body');
    const bodyBox = await body.boundingBox();
    
    if (bodyBox.height < viewport.height * 0.5) {
      addResult(`Responsive Layout - ${viewport.name}`, 'warn', 'Content appears very short');
    }
    
    // Check for horizontal scroll (indicates layout issues)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    if (hasHorizontalScroll) {
      addResult(`Responsive Layout - ${viewport.name}`, 'fail', 'Horizontal scroll detected - layout issues');
    } else {
      addResult(`Responsive Layout - ${viewport.name}`, 'pass', 'Layout responsive');
    }
    
    // Take screenshot for visual inspection
    await page.screenshot({ 
      path: `test-results/screenshot-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
      fullPage: true 
    });
    
    return true;
  } catch (error) {
    addResult(`Responsive Layout - ${viewport.name}`, 'fail', `Error: ${error.message}`);
    return false;
  }
}

async function testThemeToggle() {
  log('Testing theme toggle functionality');
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
    // Check if theme toggle exists
    const themeToggle = await page.$('#themeToggle');
    if (!themeToggle) {
      addResult('Theme Toggle', 'fail', 'Theme toggle button not found');
      return false;
    }
    
    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 'light';
    });
    
    // Click theme toggle
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // Check if theme changed
    const newTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 'light';
    });
    
    if (initialTheme !== newTheme) {
      addResult('Theme Toggle', 'pass', `Theme changed from ${initialTheme} to ${newTheme}`);
    } else {
      addResult('Theme Toggle', 'fail', 'Theme did not change after click');
    }
    
    // Check if button text/icon updated
    const buttonIcon = await page.$eval('.ts-theme-icon', el => el.textContent);
    const buttonText = await page.$eval('.ts-theme-text', el => el.textContent);
    
    if (newTheme === 'dark') {
      if (buttonIcon === '☀️' && buttonText === 'Light') {
        addResult('Theme Toggle UI', 'pass', 'Button correctly shows "Light" in dark mode');
      } else {
        addResult('Theme Toggle UI', 'fail', `Button shows "${buttonIcon}" "${buttonText}" instead of "☀️" "Light"`);
      }
    } else {
      if (buttonIcon === '🌙' && buttonText === 'Dark') {
        addResult('Theme Toggle UI', 'pass', 'Button correctly shows "Dark" in light mode');
      } else {
        addResult('Theme Toggle UI', 'fail', `Button shows "${buttonIcon}" "${buttonText}" instead of "🌙" "Dark"`);
      }
    }
    
    return true;
  } catch (error) {
    addResult('Theme Toggle', 'fail', `Error: ${error.message}`);
    return false;
  }
}

async function testFormFunctionality() {
  log('Testing form functionality');
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
    // Test paste functionality
    const pasteBox = await page.$('#pasteBox');
    if (!pasteBox) {
      addResult('Form Functionality', 'fail', 'Paste box not found');
      return false;
    }
    
    // Insert test data
    await pasteBox.type('Name\tAge\nAlice\t30\nBob\t25');
    await page.waitForTimeout(500);
    
    // Check if generate button appears
    const generateBtn = await page.$('#generateBtn');
    const isVisible = await generateBtn.isVisible();
    
    if (isVisible) {
      addResult('Form Functionality', 'pass', 'Generate button appears after pasting data');
    } else {
      addResult('Form Functionality', 'fail', 'Generate button did not appear');
    }
    
    // Test title input
    const titleInput = await page.$('#titleInput');
    if (titleInput) {
      await titleInput.type('Test Table');
      addResult('Form Functionality', 'pass', 'Title input works');
    }
    
    return true;
  } catch (error) {
    addResult('Form Functionality', 'fail', `Error: ${error.message}`);
    return false;
  }
}

async function testAccessibility() {
  log('Testing accessibility features');
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
    // Check for alt text on logo
    const logo = await page.$('img[src="/logo.png"]');
    if (logo) {
      const alt = await logo.getAttribute('alt');
      if (alt && alt.trim() !== '') {
        addResult('Accessibility - Alt Text', 'pass', 'Logo has alt text');
      } else {
        addResult('Accessibility - Alt Text', 'fail', 'Logo has empty alt text');
      }
    }
    
    // Check for ARIA labels on theme toggle
    const themeToggle = await page.$('#themeToggle');
    if (themeToggle) {
      const ariaLabel = await themeToggle.getAttribute('aria-label');
      if (ariaLabel) {
        addResult('Accessibility - ARIA Labels', 'pass', 'Theme toggle has ARIA label');
      } else {
        addResult('Accessibility - ARIA Labels', 'warn', 'Theme toggle missing ARIA label');
      }
    }
    
    // Check for focus indicators
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      return document.activeElement;
    });
    
    if (focusedElement && focusedElement !== document.body) {
      const outline = await page.evaluate(() => {
        const style = window.getComputedStyle(document.activeElement);
        return style.outline || style.border;
      });
      
      if (outline && outline !== 'none') {
        addResult('Accessibility - Focus Indicators', 'pass', 'Focus indicators visible');
      } else {
        addResult('Accessibility - Focus Indicators', 'warn', 'Focus indicators may be missing');
      }
    }
    
    return true;
  } catch (error) {
    addResult('Accessibility', 'fail', `Error: ${error.message}`);
    return false;
  }
}

async function testPageNavigation() {
  log('Testing page navigation');
  
  const pages = [
    { url: `${BASE_URL}/pricing`, title: 'Pricing' },
    { url: `${BASE_URL}/terms`, title: 'Terms' },
    { url: `${BASE_URL}/privacy`, title: 'Privacy' }
  ];
  
  for (const pageData of pages) {
    const success = await testPageLoad(pageData.url, pageData.title);
    
    // Check if page has consistent header
    if (success) {
      const hasLogo = await page.$('img[src="/logo.png"]');
      const hasTitle = await page.$('.ts-header-title');
      const hasThemeToggle = await page.$('#themeToggle');
      
      if (hasLogo && hasTitle && hasThemeToggle) {
        addResult(`Navigation - ${pageData.title}`, 'pass', 'Page has consistent header');
      } else {
        addResult(`Navigation - ${pageData.title}`, 'warn', 'Page header may be inconsistent');
      }
    }
    
    await page.waitForTimeout(1000);
  }
}

async function testPerformance() {
  log('Testing performance metrics');
  
  try {
    // Measure page load time
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      addResult('Performance - Load Time', 'pass', `Page loaded in ${loadTime}ms`);
    } else if (loadTime < 5000) {
      addResult('Performance - Load Time', 'warn', `Page loaded in ${loadTime}ms (acceptable)`);
    } else {
      addResult('Performance - Load Time', 'fail', `Page loaded in ${loadTime}ms (slow)`);
    }
    
    // Check for JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.toString());
    });
    
    // Reload page to trigger any errors
    await page.reload({ waitUntil: 'networkidle2' });
    
    if (jsErrors.length === 0) {
      addResult('Performance - JavaScript Errors', 'pass', 'No JavaScript errors detected');
    } else {
      addResult('Performance - JavaScript Errors', 'fail', `Found ${jsErrors.length} JavaScript errors: ${jsErrors.join(', ')}`);
    }
    
    return true;
  } catch (error) {
    addResult('Performance', 'fail', `Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  log('Starting UI/UX validation tests...');
  
  try {
    await setupBrowser();
    
    // Create test results directory
    const fs = require('fs');
    if (!fs.existsSync('test-results')) {
      fs.mkdirSync('test-results');
    }
    
    // Run tests
    log('Running page load tests...');
    await testPageLoad(BASE_URL, 'Homepage');
    
    log('Running responsive design tests...');
    for (const viewport of VIEWPORT_SIZES) {
      await testResponsiveLayout(viewport, BASE_URL);
    }
    
    log('Running theme toggle tests...');
    await testThemeToggle();
    
    log('Running form functionality tests...');
    await testFormFunctionality();
    
    log('Running accessibility tests...');
    await testAccessibility();
    
    log('Running page navigation tests...');
    await testPageNavigation();
    
    log('Running performance tests...');
    await testPerformance();
    
    // Generate report
    await generateTestReport();
    
  } catch (error) {
    log(`Test execution failed: ${error.message}`, 'fail');
  } finally {
    await teardownBrowser();
  }
}

async function generateTestReport() {
  log('Generating test report...');
  
  const fs = require('fs');
  const reportPath = 'test-results/ui-ux-validation-report.json';
  
  // Calculate summary statistics
  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: testResults.summary.total,
    passed: testResults.summary.passed,
    failed: testResults.summary.failed,
    warnings: testResults.summary.warnings,
    passRate: ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1) + '%',
    testDuration: process.uptime()
  };
  
  const report = {
    summary,
    results: {
      passed: testResults.passed,
      failed: testResults.failed,
      warnings: testResults.warnings
    },
    meta: {
      viewportSizes: VIEWPORT_SIZES,
      baseUrl: BASE_URL,
      userAgent: await page.evaluate(() => navigator.userAgent)
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  log('\n' + '='.repeat(50));
  log('TEST SUMMARY');
  log('='.repeat(50));
  log(`Total Tests: ${summary.totalTests}`);
  log(`Passed: ${summary.passed} (${summary.passRate})`);
  log(`Failed: ${summary.failed}`);
  log(`Warnings: ${summary.warnings}`);
  log(`Test Duration: ${summary.testDuration.toFixed(2)}s`);
  log(`Report saved to: ${reportPath}`);
  
  if (summary.failed > 0) {
    log('\nFAILED TESTS:');
    testResults.failed.forEach(test => {
      log(`❌ ${test.testName}: ${test.message}`, 'fail');
    });
  }
  
  if (summary.warnings > 0) {
    log('\nWARNINGS:');
    testResults.warnings.forEach(test => {
      log(`⚠️ ${test.testName}: ${test.message}`, 'warn');
    });
  }
  
  log('='.repeat(50));
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection: ${reason}`, 'fail');
});

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'fail');
});

// Main execution
if (require.main === module) {
  runAllTests().then(() => {
    process.exit(testResults.summary.failed > 0 ? 1 : 0);
  }).catch(error => {
    log(`Fatal error: ${error.message}`, 'fail');
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testResults
};
