import { generateId } from '../idGenerator.js';
import assert from 'assert';

// Test default length (8 characters)
const defaultId = generateId();
assert.strictEqual(typeof defaultId, 'string', 'generateId() should return a string');
assert.strictEqual(defaultId.length, 8, 'generateId() should return 8 characters by default');

// Test custom length (6 characters)
const shortId = generateId(6);
assert.strictEqual(typeof shortId, 'string', 'generateId(6) should return a string');
assert.strictEqual(shortId.length, 6, 'generateId(6) should return 6 characters');

// Test base62 regex pattern
const base62Regex = /^[a-zA-Z0-9]+$/;
assert(base62Regex.test(defaultId), 'Default ID should match base62 pattern');
assert(base62Regex.test(shortId), 'Short ID should match base62 pattern');

// Test uniqueness: generate 100 IDs and ensure no duplicates
const ids = new Set();
for (let i = 0; i < 100; i++) {
  ids.add(generateId());
}
assert.strictEqual(ids.size, 100, 'All generated IDs should be unique');

console.log('All tests passed!');