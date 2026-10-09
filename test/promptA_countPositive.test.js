const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { countPositive } = require('../hw1.js');

describe('countPositive', () => {
    describe('input validation', () => {
        test('throws TypeError for non-array inputs', () => {
            const inputs = [undefined, null, 0, 5, 'abc', '', true, {}, { length: 2, 0: 1, 1: 2 }, () => {}];
            for (const input of inputs) {
                assert.throws(() => countPositive(input), {
                    name: 'TypeError',
                    message: 'Not an array',
                });
            }
        });

        test('throws TypeError when called with no arguments', () => {
            assert.throws(() => countPositive(), TypeError);
        });
    });

    describe('counting', () => {
        test('returns 0 for an empty array', () => {
            assert.equal(countPositive([]), 0);
        });

        test('counts all elements when every element is positive', () => {
            assert.equal(countPositive([1, 2, 3, 4]), 4);
        });

        test('returns 0 when every element is negative', () => {
            assert.equal(countPositive([-1, -2, -3]), 0);
        });

        test('counts only non-negative elements in a mixed array', () => {
            assert.equal(countPositive([-4, 2, 0, 2]), 3);
        });

        test('counts zero as non-negative (current behavior)', () => {
            assert.equal(countPositive([0]), 1);
            assert.equal(countPositive([0, 0, 0]), 3);
        });

        test('counts negative zero, since -0 >= 0', () => {
            assert.equal(countPositive([-0]), 1);
        });

        test('handles single-element arrays', () => {
            assert.equal(countPositive([7]), 1);
            assert.equal(countPositive([-7]), 0);
        });

        test('handles fractional values near zero', () => {
            assert.equal(countPositive([0.0001, -0.0001]), 1);
        });

        test('handles Infinity and -Infinity', () => {
            assert.equal(countPositive([Infinity, -Infinity]), 1);
        });

        test('handles large magnitude numbers', () => {
            assert.equal(countPositive([Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MAX_VALUE]), 2);
        });

        test('does not count NaN', () => {
            assert.equal(countPositive([NaN, 1]), 1);
        });

        test('handles large arrays', () => {
            const arr = Array.from({ length: 10000 }, (_, i) => (i % 2 === 0 ? i : -i));
            assert.equal(countPositive(arr), 5000);
        });

        test('does not mutate the input array', () => {
            const arr = [3, -1, 0, 5];
            const copy = [...arr];
            countPositive(arr);
            assert.deepEqual(arr, copy);
        });
    });

    describe('non-number elements (JS comparison coercion)', () => {
        test('coerces numeric strings', () => {
            assert.equal(countPositive(['5', '-5', '0']), 2);
        });

        test('treats null as 0 and undefined as NaN', () => {
            assert.equal(countPositive([null, undefined]), 1);
        });

        test('treats holes in sparse arrays as undefined', () => {
            // eslint-disable-next-line no-sparse-arrays
            assert.equal(countPositive([1, , 2]), 2);
        });

        test('does not count non-numeric strings or plain objects', () => {
            assert.equal(countPositive(['abc', {}]), 0);
        });

        test('coerces booleans to 1 and 0', () => {
            assert.equal(countPositive([true, false]), 2);
        });
    });
});
