import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectRelease, products } from './update-catalog.mjs';

function release(product, version, extra = {}) {
  return { tag_name: `${product}-v${version}`, draft: false, prerelease: false,
    assets: [products[product].asset(version), 'checksums.txt', 'manifest.json'].map(name => ({name, state: 'uploaded'})), ...extra };
}
test('selects per-product semantic version, ignoring other tools and prereleases', () => {
  const wanted = release('TPMAzureAssistCLI', '0.10.0');
  assert.equal(selectRelease([
    release('TPMRedis', '99.0.0'), release('TPMAzureAssistCLI', '0.9.0'), wanted,
    release('TPMAzureAssistCLI', '1.0.0', {draft: true}),
    release('TPMAzureAssistCLI', '2.0.0', {prerelease: true}),
    release('TPMAzureAssistCLI', '3.0.0-beta.1'),
  ], 'TPMAzureAssistCLI').tag_name, wanted.tag_name);
});
test('does not advertise incomplete releases', () => {
  assert.equal(selectRelease([release('TPMRedis', '1.0.0', {assets: []})], 'TPMRedis'), undefined);
});
