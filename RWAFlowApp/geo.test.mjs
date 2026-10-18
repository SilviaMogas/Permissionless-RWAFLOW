import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('search description identifies the Flow testnet rather than asserting verified investments', () => {
  const layout = readFileSync(new URL('./app/layout.tsx', import.meta.url), 'utf8');
  const description = layout.match(/description:\s*"([^"]+)"/)?.[1];
  assert.match(description, /real-world asset tokenization and DeFi education/);
  assert.match(description, /Flow testnet/);
  assert.doesNotMatch(description, /verified|guaranteed/);
});
