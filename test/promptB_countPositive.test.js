const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { countPositive } = require('../hw1.js');

describe('countPositive', () => {
  describe('valid arrays', () => {
    test('returns 0 for an empty array', () => {
      assert.equal(countPositive([]), 0);
    });

    test('counts a single positive element', () => {
      assert.equal(countPositive([5]), 1);
    });

    test('returns 0 for a single negative element', () => {
      assert.equal(countPositive([-5]), 0);
    });

    test('counts all elements when every element is positive', () => {
      assert.equal(countPositive([1, 2, 3, 4]), 4);
    });

    test('returns 0 when every element is negative', () => {
      assert.equal(countPositive([-1, -2, -3]), 0);
    });

    test('counts only positive elements in a mixed array', () => {
      assert.equal(countPositive([-4, 2, 0, 2]), 2);
      assert.equal(countPositive([3, -1, 7, -9, 1]), 3);
    });

    test('does not count zero as positive', () => {
      assert.equal(countPositive([0]), 0);
      assert.equal(countPositive([0, 0, 0]), 0);
    });

    test('does not count negative zero as positive', () => {
      assert.equal(countPositive([-0]), 0);
      assert.equal(countPositive([-0, 1]), 1);
    });

    test('counts positive non-integer values', () => {
      assert.equal(countPositive([0.5, -0.5, 1e-10, -1e-10]), 2);
    });

    test('counts Number.MIN_VALUE as positive', () => {
      assert.equal(countPositive([Number.MIN_VALUE]), 1);
    });

    test('counts very large positive values', () => {
      assert.equal(countPositive([Number.MAX_VALUE, Number.MAX_SAFE_INTEGER]), 2);
    });

    test('counts Infinity as positive and -Infinity as not positive', () => {
      assert.equal(countPositive([Infinity, -Infinity]), 1);
    });

    test('does not count NaN as positive', () => {
      assert.equal(countPositive([NaN]), 0);
      assert.equal(countPositive([NaN, 1, NaN]), 1);
    });

    test('counts duplicate positive values individually', () => {
      assert.equal(countPositive([2, 2, 2]), 3);
    });

    test('counts positive elements regardless of position', () => {
      assert.equal(countPositive([1, -1, -1]), 1);
      assert.equal(countPositive([-1, 1, -1]), 1);
      assert.equal(countPositive([-1, -1, 1]), 1);
    });

    test('handles a large array', () => {
      const x = Array.from({ length: 10000 }, (_, i) => (i % 2 === 0 ? i + 1 : -(i + 1)));
      assert.equal(countPositive(x), 5000);
    });

    test('returns a number', () => {
      assert.equal(typeof countPositive([1, -1]), 'number');
      assert.equal(typeof countPositive([]), 'number');
    });

    test('does not modify the input array', () => {
      const x = [-4, 2, 0, 2, -1];
      const copy = [...x];
      countPositive(x);
      assert.deepEqual(x, copy);
    });

    test('returns the same result on repeated calls', () => {
      const x = [3, -2, 5, 0];
      assert.equal(countPositive(x), 2);
      assert.equal(countPositive(x), 2);
    });
  });

  describe('invalid input', () => {
    const nonArrays = [
      ['undefined', undefined],
      ['null', null],
      ['a number', 42],
      ['a string', '1,2,3'],
      ['a boolean', true],
      ['a plain object', { 0: 1, 1: 2 }],
      ['an array-like object', { length: 2, 0: 1, 1: 2 }],
      ['a function', () => [1, 2]],
      ['a Set', new Set([1, 2])],
      ['a typed array', new Int32Array([1, 2])],
    ];

    for (const [label, value] of nonArrays) {
      test(`throws TypeError when x is ${label}`, () => {
        assert.throws(() => countPositive(value), TypeError);
      });
    }

    test('throws TypeError when called with no arguments', () => {
      assert.throws(() => countPositive(), TypeError);
    });
  });
});
