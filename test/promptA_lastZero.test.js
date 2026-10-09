const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { lastZero } = require('../hw1.js');

describe('lastZero', () => {
    describe('input validation', () => {
        for (const [label, value] of [
            ['undefined', undefined],
            ['null', null],
            ['a number', 0],
            ['a string', '0'],
            ['a plain object', { 0: 0, length: 1 }],
            ['a typed array', new Int8Array([0])],
        ]) {
            test(`throws TypeError for ${label}`, () => {
                assert.throws(() => lastZero(value), {
                    name: 'TypeError',
                    message: 'Not an array',
                });
            });
        }

        test('throws TypeError when called with no arguments', () => {
            assert.throws(() => lastZero(), TypeError);
        });
    });

    describe('no zero present', () => {
        test('returns -1 for an empty array', () => {
            assert.equal(lastZero([]), -1);
        });

        test('returns -1 when no element is zero', () => {
            assert.equal(lastZero([1, 2, 3]), -1);
        });

        test('does not treat zero-like values as zero', () => {
            assert.equal(lastZero(['0', false, null, undefined, '', NaN, 0n, [0]]), -1);
        });

        test('returns -1 for a sparse array with only holes', () => {
            assert.equal(lastZero(new Array(5)), -1);
        });
    });

    describe('single zero', () => {
        test('returns 0 for [0]', () => {
            assert.equal(lastZero([0]), 0);
        });

        test('finds a zero at the start', () => {
            assert.equal(lastZero([0, 1, 2]), 0);
        });

        test('finds a zero in the middle', () => {
            assert.equal(lastZero([1, 0, 2]), 1);
        });

        test('finds a zero at the end', () => {
            assert.equal(lastZero([1, 2, 0]), 2);
        });

        test('treats -0 as zero', () => {
            assert.equal(lastZero([1, -0, 2]), 1);
        });
    });

    describe('multiple zeros', () => {
        test('returns the index of the last zero', () => {
            assert.equal(lastZero([0, 1, 0]), 2);
        });

        test('returns the last index when every element is zero', () => {
            assert.equal(lastZero([0, 0, 0, 0]), 3);
        });

        test('returns the last zero when it is not at the end', () => {
            assert.equal(lastZero([0, 5, 0, 7, 0, 9]), 4);
        });
    });

    test('does not mutate the input array', () => {
        const input = [3, 0, 1, 0];
        lastZero(input);
        assert.deepEqual(input, [3, 0, 1, 0]);
    });
});
