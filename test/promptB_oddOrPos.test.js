const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { oddOrPos } = require('../hw1.js');

describe('oddOrPos', () => {
  describe('input validation', () => {
    test('throws TypeError when x is undefined', () => {
      assert.throws(() => oddOrPos(undefined), TypeError);
    });

    test('throws TypeError when x is null', () => {
      assert.throws(() => oddOrPos(null), TypeError);
    });

    test('throws TypeError when x is a number', () => {
      assert.throws(() => oddOrPos(3), TypeError);
    });

    test('throws TypeError when x is a string', () => {
      assert.throws(() => oddOrPos('1,2,3'), TypeError);
    });

    test('throws TypeError when x is a plain object', () => {
      assert.throws(() => oddOrPos({ 0: 1, 1: 3, length: 2 }), TypeError);
    });

    test('throws TypeError when called with no arguments', () => {
      assert.throws(() => oddOrPos(), TypeError);
    });
  });

  describe('basic counting', () => {
    test('returns 0 for an empty array', () => {
      assert.equal(oddOrPos([]), 0);
    });

    test('returns a number', () => {
      assert.equal(typeof oddOrPos([1, 2, 3]), 'number');
    });

    test('counts positive odd numbers', () => {
      assert.equal(oddOrPos([1, 3, 5]), 3);
    });

    test('counts positive even numbers (positive)', () => {
      assert.equal(oddOrPos([2, 4, 6]), 3);
    });

    test('counts negative odd numbers (odd)', () => {
      assert.equal(oddOrPos([-1, -3, -5]), 3);
    });

    test('does not count negative even numbers', () => {
      assert.equal(oddOrPos([-2, -4, -6]), 0);
    });

    test('does not count zero (neither odd nor positive)', () => {
      assert.equal(oddOrPos([0]), 0);
    });

    test('does not count negative zero', () => {
      assert.equal(oddOrPos([-0]), 0);
    });
  });

  describe('single element arrays', () => {
    test('[1] -> 1', () => assert.equal(oddOrPos([1]), 1));
    test('[2] -> 1', () => assert.equal(oddOrPos([2]), 1));
    test('[-1] -> 1', () => assert.equal(oddOrPos([-1]), 1));
    test('[-2] -> 0', () => assert.equal(oddOrPos([-2]), 0));
  });

  describe('mixed arrays', () => {
    test('counts each qualifying element exactly once', () => {
      // -3 odd, 1 odd+pos, 2 pos -> 3; 0 and -2 excluded
      assert.equal(oddOrPos([-3, -2, 0, 1, 2]), 3);
    });

    test('elements that are both odd and positive are not double counted', () => {
      assert.equal(oddOrPos([1, 3, 5, 7]), 4);
    });

    test('counts duplicates individually', () => {
      assert.equal(oddOrPos([-1, -1, 2, 2, -2, -2, 0, 0]), 4);
    });

    test('handles an array with only non-qualifying elements', () => {
      assert.equal(oddOrPos([0, -2, -4, -100, 0]), 0);
    });

    test('handles large magnitude values', () => {
      assert.equal(
        oddOrPos([Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER, -(2 ** 52)]),
        2
      );
    });

    test('handles long arrays', () => {
      const x = [];
      for (let i = -500; i <= 500; i++) x.push(i);
      // positives: 1..500 = 500; negative odds: -1,-3,...,-499 = 250
      assert.equal(oddOrPos(x), 750);
    });
  });

  describe('non-integer and special numbers', () => {
    test('counts positive non-integers (positive)', () => {
      assert.equal(oddOrPos([0.5, 2.5]), 2);
    });

    test('does not count negative non-integers (not odd, not positive)', () => {
      assert.equal(oddOrPos([-0.5, -1.5]), 0);
    });

    test('counts Infinity (positive)', () => {
      assert.equal(oddOrPos([Infinity]), 1);
    });

    test('does not count -Infinity', () => {
      assert.equal(oddOrPos([-Infinity]), 0);
    });

    test('does not count NaN', () => {
      assert.equal(oddOrPos([NaN]), 0);
    });
  });

  describe('side effects', () => {
    test('does not modify the input array', () => {
      const x = [-3, -2, 0, 1, 2];
      const copy = [...x];
      oddOrPos(x);
      assert.deepEqual(x, copy);
    });

    test('returns the same result on repeated calls', () => {
      const x = [-3, -2, 0, 1, 2];
      assert.equal(oddOrPos(x), oddOrPos(x));
    });
  });
});
