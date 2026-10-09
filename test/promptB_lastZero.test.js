const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { lastZero } = require('../hw1.js');

describe('lastZero - returns last index of 0', () => {
  test('single zero', () => {
    assert.equal(lastZero([0]), 0);
  });

  test('zero at the start only', () => {
    assert.equal(lastZero([0, 1, 2]), 0);
  });

  test('zero in the middle only', () => {
    assert.equal(lastZero([1, 0, 2]), 1);
  });

  test('zero at the end only', () => {
    assert.equal(lastZero([1, 2, 0]), 2);
  });

  test('multiple zeros returns the last one', () => {
    assert.equal(lastZero([0, 1, 0, 3]), 2);
  });

  test('multiple zeros with last at end', () => {
    assert.equal(lastZero([0, 1, 0]), 2);
  });

  test('all zeros', () => {
    assert.equal(lastZero([0, 0, 0, 0]), 3);
  });

  test('negative numbers around a zero', () => {
    assert.equal(lastZero([-1, 0, -2]), 1);
  });

  test('-0 is a zero', () => {
    assert.equal(lastZero([1, -0, 2]), 1);
  });

  test('mixed types: only numeric 0 counts', () => {
    assert.equal(lastZero([0, 'a', null, {}, 5]), 0);
  });

  test('large array with zero near the end', () => {
    const x = new Array(10000).fill(7);
    x[9998] = 0;
    assert.equal(lastZero(x), 9998);
  });
});

describe('lastZero - returns -1 when 0 is absent', () => {
  test('empty array', () => {
    assert.equal(lastZero([]), -1);
  });

  test('no zero among numbers', () => {
    assert.equal(lastZero([1, 2, 3]), -1);
  });

  test('single non-zero element', () => {
    assert.equal(lastZero([5]), -1);
  });

  test('values close to zero are not zero', () => {
    assert.equal(lastZero([0.1, -0.0001, 1e-300]), -1);
  });

  test('NaN, null, undefined, false are not zero', () => {
    assert.equal(lastZero([NaN, null, undefined, false]), -1);
  });

  test('string "0" is not the number 0', () => {
    assert.equal(lastZero(['0']), -1);
  });
});

describe('lastZero - does not modify input', () => {
  test('array is unchanged after call', () => {
    const x = [3, 0, 1, 0, 2];
    const copy = [...x];
    lastZero(x);
    assert.deepEqual(x, copy);
  });
});

describe('lastZero - throws TypeError for non-arrays', () => {
  const nonArrays = [
    ['undefined', undefined],
    ['null', null],
    ['number 0', 0],
    ['number', 42],
    ['string', '0'],
    ['empty string', ''],
    ['boolean', true],
    ['plain object', {}],
    ['array-like object', { 0: 0, length: 1 }],
    ['function', () => [0]],
    ['Set', new Set([0])],
    ['typed array', new Int8Array([0])],
  ];

  for (const [name, value] of nonArrays) {
    test(`throws TypeError for ${name}`, () => {
      assert.throws(() => lastZero(value), TypeError);
    });
  }

  test('throws TypeError when called with no arguments', () => {
    assert.throws(() => lastZero(), TypeError);
  });
});
