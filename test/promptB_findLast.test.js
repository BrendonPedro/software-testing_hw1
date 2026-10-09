const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { findLast } = require('../hw1.js');

describe('findLast', () => {
  describe('returns the last index of y in x', () => {
    it('finds a value that occurs once', () => {
      assert.equal(findLast([4, 7, 9], 7), 1);
    });

    it('returns the last index when the value occurs multiple times', () => {
      assert.equal(findLast([2, 5, 2, 8, 2, 3], 2), 4);
    });

    it('returns the last index when every element matches', () => {
      assert.equal(findLast([1, 1, 1, 1], 1), 3);
    });

    it('finds a value at index 0', () => {
      assert.equal(findLast([3, 4, 5], 3), 0);
    });

    it('finds a value at the final index', () => {
      assert.equal(findLast([3, 4, 5], 5), 2);
    });

    it('finds the value in a single-element array', () => {
      assert.equal(findLast([42], 42), 0);
    });

    it('finds the last occurrence when it is at the final index', () => {
      assert.equal(findLast([6, 1, 6], 6), 2);
    });

    it('handles negative numbers', () => {
      assert.equal(findLast([-1, -2, -1, -3], -1), 2);
    });

    it('handles floating-point numbers', () => {
      assert.equal(findLast([0.5, 1.25, 0.5, 2.75], 0.5), 2);
    });

    it('handles zero', () => {
      assert.equal(findLast([0, 1, 0, 2], 0), 2);
    });

    it('handles Infinity and -Infinity', () => {
      assert.equal(findLast([Infinity, -Infinity, Infinity, 1], Infinity), 2);
      assert.equal(findLast([Infinity, -Infinity, Infinity, 1], -Infinity), 1);
    });

    it('finds a number in an array containing non-number elements', () => {
      assert.equal(findLast(['a', 3, { v: 3 }, null, 3, 'b'], 3), 4);
    });

    it('works on a large array', () => {
      const x = Array.from({ length: 10000 }, (_, i) => i % 10);
      assert.equal(findLast(x, 7), 9997);
    });
  });

  describe('returns -1 when y is absent', () => {
    it('returns -1 for an empty array', () => {
      assert.equal(findLast([], 1), -1);
    });

    it('returns -1 when the value is not in the array', () => {
      assert.equal(findLast([1, 2, 3], 4), -1);
    });

    it('returns -1 for a single-element array without the value', () => {
      assert.equal(findLast([5], 6), -1);
    });

    it('does not match a string that looks like the number', () => {
      assert.equal(findLast(['5', '5'], 5), -1);
    });

    it('does not match other loosely-equal values', () => {
      assert.equal(findLast([false, '', null, [], '0'], 0), -1);
      assert.equal(findLast([true, '1', [1]], 1), -1);
    });

    it('does not match a nearby floating-point value', () => {
      assert.equal(findLast([0.1 + 0.2], 0.3), -1);
    });
  });

  describe('does not modify its input', () => {
    it('leaves the array unchanged', () => {
      const x = [3, 1, 3, 2];
      const copy = [...x];
      findLast(x, 3);
      assert.deepEqual(x, copy);
    });
  });

  describe('throws TypeError if x is not an array', () => {
    const nonArrays = [
      ['undefined', undefined],
      ['null', null],
      ['a number', 5],
      ['a string', '123'],
      ['a boolean', true],
      ['a plain object', { 0: 1, length: 1 }],
      ['a function', () => [1]],
      ['a Set', new Set([1])],
      ['a symbol', Symbol('x')],
      ['a bigint', 1n],
    ];

    for (const [label, x] of nonArrays) {
      it(`throws when x is ${label}`, () => {
        assert.throws(() => findLast(x, 1), TypeError);
      });
    }

    it('throws when called with no arguments', () => {
      assert.throws(() => findLast(), TypeError);
    });
  });

  describe('throws TypeError if y is not a number', () => {
    const nonNumbers = [
      ['undefined', undefined],
      ['null', null],
      ['a numeric string', '1'],
      ['a boolean', true],
      ['an object', {}],
      ['an array', [1]],
      ['a bigint', 1n],
      ['a symbol', Symbol('x')],
      ['a function', () => 1],
    ];

    for (const [label, y] of nonNumbers) {
      it(`throws when y is ${label}`, () => {
        assert.throws(() => findLast([1, '1', true, null], y), TypeError);
      });
    }

    it('throws when y is not a number even if x is empty', () => {
      assert.throws(() => findLast([], '1'), TypeError);
    });

    it('throws when y is omitted', () => {
      assert.throws(() => findLast([1, 2, 3]), TypeError);
    });

    it('does not throw when y is NaN, since NaN is a number', () => {
      assert.doesNotThrow(() => findLast([1, 2, 3], NaN));
    });
  });

  describe('throws TypeError when both arguments are invalid', () => {
    it('throws when x is not an array and y is not a number', () => {
      assert.throws(() => findLast('abc', 'b'), TypeError);
    });
  });
});
