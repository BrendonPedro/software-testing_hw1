const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { findLast } = require('../hw1.js');

describe('findLast', () => {
    describe('input validation', () => {
        it('throws TypeError when the first parameter is not an array', () => {
            for (const bad of [undefined, null, 42, 'abc', { length: 1, 0: 1 }, new Set([1])]) {
                assert.throws(() => findLast(bad, 1), {
                    name: 'TypeError',
                    message: 'The first parameter must be an array',
                });
            }
        });

        it('throws TypeError when the second parameter is not a number', () => {
            for (const bad of [undefined, null, '1', true, [1], {}, 1n]) {
                assert.throws(() => findLast([1, 2, 3], bad), {
                    name: 'TypeError',
                    message: 'The second parameter must be a number',
                });
            }
        });

        it('validates the array before the number', () => {
            assert.throws(() => findLast('not an array', 'not a number'), {
                message: 'The first parameter must be an array',
            });
        });
    });

    describe('search behavior', () => {
        it('returns -1 for an empty array', () => {
            assert.equal(findLast([], 1), -1);
        });

        it('returns -1 when the value is not present', () => {
            assert.equal(findLast([1, 2, 3], 4), -1);
        });

        it('returns the index of the last element when it matches', () => {
            assert.equal(findLast([1, 2, 3], 3), 2);
        });

        it('returns the index of a match in the middle', () => {
            assert.equal(findLast([1, 2, 3], 2), 1);
        });

        it('returns the last index when the value occurs multiple times', () => {
            assert.equal(findLast([2, 1, 2, 3, 2, 4], 2), 4);
        });

        it('returns 0 when the only match is at index 0', () => {
            assert.equal(findLast([7, 1, 2], 7), 0);
        });

        it('returns 0 for a single-element array that matches', () => {
            assert.equal(findLast([7], 7), 0);
        });

        it('uses strict equality (no type coercion)', () => {
            assert.equal(findLast(['1', 1, '1'], 1), 1);
            assert.equal(findLast(['1', '2'], 1), -1);
        });

        it('never finds NaN, since NaN !== NaN', () => {
            assert.equal(findLast([NaN, 1, NaN], NaN), -1);
        });

        it('treats 0 and -0 as equal', () => {
            assert.equal(findLast([1, -0, 2], 0), 1);
        });

        it('handles negative numbers, decimals and Infinity', () => {
            assert.equal(findLast([-1, -2, -1], -1), 2);
            assert.equal(findLast([0.5, 1.5], 1.5), 1);
            assert.equal(findLast([Infinity, 1], Infinity), 0);
        });

        it('does not mutate the input array', () => {
            const arr = [3, 1, 3];
            findLast(arr, 3);
            assert.deepEqual(arr, [3, 1, 3]);
        });
    });
});
