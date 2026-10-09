
const test = require('node:test');
const assert = require('node:assert/strict');
const { oddOrPos } = require('../hw1.js');

test('appending a negative odd integer increases the count by one', () => {
    const original = [2, 4, 0];
    const transformed = [...original, -3];

    const originalCount = oddOrPos(original);
    const transformedCount = oddOrPos(transformed);

    assert.equal(transformedCount, originalCount + 1);
});

