'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

test('site pages load the shared app script', () => {
  for (const page of ['index.html', 'login.html', 'signup.html', 'add-expense.html', 'contact.html']) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(html, /<script\s+src=["']app\.js["']><\/script>/, `${page} should load app.js`);
    assert.doesNotMatch(html, /<script\s+src=["'](?:script|expense)\.js["']/, `${page} should not load removed scripts`);
  }
});

test('expense profiles have nonempty categories with unique IDs', () => {
  const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const match = source.match(/const SPENDLY_PERSONAS = (\{[\s\S]*?\n\});/);
  assert.ok(match, 'SPENDLY_PERSONAS data should exist in app.js');

  const personas = JSON.parse(JSON.stringify(vm.runInNewContext(`(${match[1]})`)));
  assert.deepEqual(Object.keys(personas).sort(), ['business', 'retired', 'salaried', 'student']);

  for (const [profile, details] of Object.entries(personas)) {
    assert.ok(details.categories.length > 0, `${profile} should have categories`);
    const ids = details.categories.map((category) => category.id);
    assert.equal(new Set(ids).size, ids.length, `${profile} category IDs should be unique`);
  }
});