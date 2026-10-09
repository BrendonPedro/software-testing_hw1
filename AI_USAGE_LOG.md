# AI Usage Log - Homework 1

| Field | Value |
|---|---|
| Tool | Claude Code (CLI) 2.1.295 |
| Model | claude-opus-5-5 (setup session); per-prompt models are recorded in each transcript header in `logs/` |
| Node | v22.23.1 |
| Dates | 2026-10-09 (setup) |

Part A was completed without any AI agent.
Every Part B prompt was run in a new Claude Code session (`claude -p`) inside a fresh, empty sandbox directory, via `scripts/run-agent.sh`.
The Prompt A sandbox contained only the code of the function under test; the Prompt B sandbox contained no implementation.
The exact prompt text is in `prompts/`, and the full transcript of every session (prompt, all agent messages, all tool calls and tool results) is in `logs/<id>.md`, with the raw stream in `logs/<id>.jsonl`.

## Session 0 - Project setup (not a Part B prompt)

Used to create the scaffolding only: `hw1.js` (the four functions copied from the handout, unchanged), `scripts/` (prompt generator, agent runner, transcript renderer, B1 table), `package.json`, and this log.
The agent was told Part A must be done without AI and did not answer or discuss any Part A question.
Full transcript: export with `/export` and attach as Appendix 0.

Prompt (verbatim):

> Please see the assignment below and attached and help me completye it step by step: [assignment summary pasted from the course page] + Homework1.pdf

## Part B sessions

| # | Question | Prompt file | Transcript | Notes |
|---|---|---|---|---|
| 1 | B1 Prompt A - findLast | quoted in section below | section "B1 Prompt A - findLast" below | Interactive session, not sandboxed; see caveat below |
| 2 | B1 Prompt B - findLast | `prompts/B_findLast.txt` | `logs/B_findLast.md` | |
| 3 | B1 Prompt A - lastZero | `prompts/A_lastZero.txt` | `logs/A_lastZero.md` | |
| 4 | B1 Prompt B - lastZero | `prompts/B_lastZero.txt` | `logs/B_lastZero.md` | |
| 5 | B1 Prompt A - countPositive | `prompts/A_countPositive.txt` | `logs/A_countPositive.md` | |
| 6 | B1 Prompt B - countPositive | `prompts/B_countPositive.txt` | `logs/B_countPositive.md` | |
| 7 | B1 Prompt A - oddOrPos | `prompts/A_oddOrPos.txt` | `logs/A_oddOrPos.md` | |
| 8 | B1 Prompt B - oddOrPos | `prompts/B_oddOrPos.txt` | `logs/B_oddOrPos.md` | |
| 9 | B3 - lastZero Part A questions | `prompts/B3_lastZero.txt` | `logs/B3_lastZero.md`, also appended at the end of this log | Empty sandbox; no tools, MCP servers or skills (`--tools "" --strict-mcp-config --disable-slash-commands`) |
| 10 | B3(c) follow-up (if needed) | quoted in report | `logs/B3_lastZero.followup1.md`, also appended at the end of this log | Same session as #9 (`--resume`), same isolation flags |
| 11 | B4 code (optional; relation stated by me) | | | |

## Edits to agent-generated tests

Agent suites are saved unchanged as `test/promptA_<program>.test.js` and `test/promptB_<program>.test.js`.
Any edited copy is saved separately as `test/mine_*.test.js` with each change marked `// EDITED: <reason>`.

## B1 Prompt A - findLast

| Field | Value |
|---|---|
| Tool | Claude Code (CLI), interactive session |
| Model | claude-opus-5-5 (Opus 5.5) |
| Date | 2026-10-09 |
| Node | v22.23.1 |
| Saved suite | `test/promptA_findLast.test.js` (byte-identical to the agent's generated file, verified with `cmp`) |
| Evidence | `evidence/promptA_findLast_coverage.txt` |

Caveat: this run was not done through `scripts/run-agent.sh`.
It ran in an interactive Claude Code session started in the project root, after `/clear`.
The agent could see the whole homework folder, including `hw1.js` with its `// test: x = [2, 3, 5]; y = 2; Expected = 0` comment.
The agent listed the folder and read `hw1.js`, `package.json`, `REPORT.md`, this log, `prompts/A_findLast.txt`, `prompts/B_findLast.txt` and `scripts/run-agent.sh` before writing the tests.
The prompt text also differs from `prompts/A_findLast.txt`: it includes the JSDoc comment and different setup wording.

### Prompt (verbatim)

````text
Write unit tests for this function with node:test. Make sure all tests pass.

Use CommonJS and import findLast from ../hw1.js. Output the complete test file without modifying the original function.

 /**
 * Find last index of element
 * @param {Object[]} x - The array to search.
 * @param {number} y - The value to look for.
 * @returns {number} Last index of y in x; -1 if absent.
 * @throws TypeError if x is not an array or y is not a number.
 */
function findLast(x, y) {
    if (!Array.isArray(x)) {
        throw new TypeError('The first parameter must be an array');
    }
    if (typeof y !== 'number') {
        throw new TypeError('The second parameter must be a number');
    }
    for (let i = x.length - 1; i > 0; i--) {
        if (x[i] === y) {
            return i;
        }
    }
    return -1;
}
````

### Agent actions (tool calls)

1. Listed the homework folder and printed `hw1.js`; checked `node --version` (v22.23.1).
2. Printed `package.json`, `REPORT.md`, `AI_USAGE_LOG.md`, `prompts/A_findLast.txt`, `prompts/B_findLast.txt`, `scripts/run-agent.sh`.
3. Listed `test/` (empty) and confirmed `logs/` did not exist.
4. Copied `hw1.js` unchanged into its scratchpad, wrote the test file there as `test/findLast.test.js`, and ran `node --test`.
   Result: 24 tests, 22 pass, 0 fail, 2 todo, exit code 0.

### Agent's final response (verbatim)

````markdown
The suite runs with exit code 0: 22 tests pass, 0 fail, and 2 are marked `todo`. I didn't change `findLast`.

**`findLast` has a bug.** The loop condition is `i > 0`, so index 0 is never checked. Because of that, `findLast([2, 3, 5], 2)` returns `-1` instead of `0`, which breaks the documented contract. I didn't write tests that treat that wrong answer as correct. Instead, the two index-0 tests check what the doc comment says should happen and are marked `{ todo }`. They still run and still fail, and the output shows that failure, but they don't make the suite fail. If you want a strict suite that exposes the bug, remove the `todo` options and those two tests fail as they should. The fix in the function is `i >= 0`.

```js
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { findLast } = require('../hw1.js');

describe('findLast - input validation', () => {
    for (const [label, x] of [
        ['null', null],
        ['undefined', undefined],
        ['a string', 'abc'],
        ['a number', 42],
        ['a plain object', { 0: 1, length: 1 }],
    ]) {
        test(`throws TypeError when x is ${label}`, () => {
            assert.throws(() => findLast(x, 1), {
                name: 'TypeError',
                message: 'The first parameter must be an array',
            });
        });
    }

    for (const [label, y] of [
        ['a numeric string', '2'],
        ['null', null],
        ['undefined', undefined],
        ['a boolean', true],
        ['a BigInt', 2n],
        ['an object', {}],
    ]) {
        test(`throws TypeError when y is ${label}`, () => {
            assert.throws(() => findLast([1, 2, 3], y), {
                name: 'TypeError',
                message: 'The second parameter must be a number',
            });
        });
    }

    test('checks x before y when both are invalid', () => {
        assert.throws(() => findLast('abc', 'b'), {
            name: 'TypeError',
            message: 'The first parameter must be an array',
        });
    });
});

describe('findLast - search behavior', () => {
    test('returns -1 for an empty array', () => {
        assert.equal(findLast([], 1), -1);
    });

    test('returns -1 when y is absent', () => {
        assert.equal(findLast([1, 2, 3], 4), -1);
    });

    test('returns the index of the last element when it matches', () => {
        assert.equal(findLast([1, 2, 3], 3), 2);
    });

    test('returns the index of a single match in the middle', () => {
        assert.equal(findLast([1, 2, 3], 2), 1);
    });

    test('returns the last index when y occurs more than once', () => {
        assert.equal(findLast([1, 2, 3, 2, 1], 2), 3);
        assert.equal(findLast([7, 7, 7, 7], 7), 3);
    });

    test('handles negative numbers, floats and Infinity', () => {
        assert.equal(findLast([0, -5, 3, -5], -5), 3);
        assert.equal(findLast([0, 1.5, 2.5], 2.5), 2);
        assert.equal(findLast([0, Infinity, 1], Infinity), 1);
    });

    test('uses strict equality (no type coercion)', () => {
        assert.equal(findLast([1, '2', 3], 2), -1);
        assert.equal(findLast([0, true], 1), -1);
    });

    test('treats 0 and -0 as equal', () => {
        assert.equal(findLast([1, -0], 0), 1);
    });

    test('never matches NaN (same as Array.prototype.lastIndexOf)', () => {
        assert.equal(findLast([1, NaN, 2], NaN), -1);
    });

    test('does not mutate the input array', () => {
        const x = [3, 1, 3];
        findLast(x, 3);
        assert.deepEqual(x, [3, 1, 3]);
    });

    // Known bug: the loop condition is `i > 0`, so index 0 is never checked.
    // These assertions follow the documented spec and fail against the current code;
    // they are marked `todo` so the suite passes without hiding the defect.
    test('returns 0 when the only match is the first element', { todo: 'loop skips index 0 (i > 0 should be i >= 0)' }, () => {
        assert.equal(findLast([2, 3, 5], 2), 0);
    });

    test('returns 0 for a single-element array that matches', { todo: 'loop skips index 0 (i > 0 should be i >= 0)' }, () => {
        assert.equal(findLast([2], 2), 0);
    });
});
```

I ran it in my scratchpad against an unchanged copy of your `hw1.js` and didn't write anything into your `test/` folder.

For your Part B log: this session could see your whole homework folder, including `hw1.js` with its `// test: ... Expected = 0` comment, so it doesn't count as an isolated Prompt A run. For a clean B1 result, use `scripts/run-agent.sh A_findLast`.
````

### Execution results

Command, run from the project root against the unchanged `hw1.js`:

```text
node --test --experimental-test-coverage test/promptA_findLast.test.js
```

Exit code 0.
Full output is in `evidence/promptA_findLast_coverage.txt`.

| Metric | Value |
|---|---|
| Total tests | 24 |
| Passed | 22 |
| Failed | 0 |
| TODO | 2 (both fail with `-1 !== 0`; these are the index-0 tests that expose the fault) |
| Line % (`hw1.js`, whole file, Node report) | 62.37 (uncovered 36-46, 57-68, 79-90 are the other three functions) |
| Branch % (`hw1.js`, whole file, Node report) | 100.00 |
| Line % (`findLast` only, lines 11-24, from lcov) | 100% (14/14) |
| Branch % (`findLast` only, lines 11-24, from lcov) | 100% (8/8) |

## Transcript: B3_lastZero

**Prompt (verbatim):**

````
The program below is faulty. It includes test inputs that result in failure. Answer the following questions about it.

```js
/**
 * Find last index of zero
 *
 * @param {Object[]} x - The array to search.
 *
 * @returns {number} Last index of 0 in x; -1 if absent.
 * @throws TypeError if x is not an array.
 */
function lastZero(x) {
    if (!Array.isArray(x)) {
        throw new TypeError('Not an array');
    }
    for (let i = 0; i < x.length; i++) {
        if (x[i] === 0) {
            return i;
        }
    }
    return -1;
}
// test: x = [0, 1, 0]; Expected = 2
```

(a) Explain what is wrong with the given code.
Describe the fault precisely by proposing a modification to the code.
(b) If possible, give a test case that does not execute the fault.
If not, briefly explain why not. (You need to give the same number of arguments.)
(c) If possible, give a test case that executes the fault, but does not result in an error state.
If not, briefly explain why not. (You also need to answer expected and actual output.)
(d) If possible, give a test case that results in an error state, but not a failure.
If not, briefly explain why not. (You also need to answer expected and actual output.)
(e) For the given test case in (d), describe the first error state. Be sure to describe the complete state.

Hints:
Fault: A static defect in software. Parts of source code that are incorrect.
Error State: An incorrect internal state. State information: variable values (including return value).
Failure: External, incorrect behavior with respect to the expected behavior.
````

- Tool: Claude Code 2.1.283
- Model: claude-opus-5-5[1m]
- Session: 0cdbd5fe-06c4-400b-9494-c960c75ca57b
- Working directory: C:\Users\user.DESKTOP-7QU46KG\AppData\Local\Temp\hw1-B3_lastZero-AHkJ

**Agent:**

# lastZero: Fault Analysis

## (a) The fault

The loop scans the array **from front to back**, so it returns the index of the *first* zero, not the *last*.
The loop should iterate backwards:

```js
for (let i = x.length - 1; i >= 0; i--) {
```

## (b) Test case that does not execute the fault

**Possible.**
A non-array input throws before the loop header is ever reached.

- Input: `x = null`
- Expected: `TypeError`
- Actual: `TypeError`

## (c) Test case that executes the fault but produces no error state

**Possible.**
Use a one-element array whose element is `0`.
Both versions start at `i = 0`, find `x[0] === 0` on the first check, and return immediately.
Every intermediate state is identical to the correct program's state.

- Input: `x = [0]`
- Expected: `0`
- Actual: `0`

## (d) Test case that produces an error state but no failure

**Possible.**
Use an array with exactly one zero and at least two elements.
The iteration order is wrong, so the internal state differs, but the only zero is found either way.

- Input: `x = [1, 0]`
- Expected: `1`
- Actual: `1`

## (e) First error state for `x = [1, 0]`

The first error state occurs right after the loop initialization `let i = 0`, before the first evaluation of the loop condition.

| | Faulty program | Correct program |
|---|---|---|
| `x` | `[1, 0]` | `[1, 0]` |
| `i` | **`0`** | `1` |
| PC | at `i < x.length` | at `i >= 0` |
| return value | undefined | undefined |

The error is `i = 0` where the correct program would have `i = 1` (`x.length - 1`).
The faulty program then checks `x[0]` (not zero), moves to `i = 1`, finds `x[1] === 0`, and returns `1`.
That matches the expected output, so the error never becomes a failure.

---
- Finished: success, 1 turns, 16.3 s

## Transcript: B3_lastZero

**Prompt (verbatim):**

````
The program below is faulty. It includes test inputs that result in failure. Answer the following questions about it.

```js
/**
 * Find last index of zero
 *
 * @param {Object[]} x - The array to search.
 *
 * @returns {number} Last index of 0 in x; -1 if absent.
 * @throws TypeError if x is not an array.
 */
function lastZero(x) {
    if (!Array.isArray(x)) {
        throw new TypeError('Not an array');
    }
    for (let i = 0; i < x.length; i++) {
        if (x[i] === 0) {
            return i;
        }
    }
    return -1;
}
// test: x = [0, 1, 0]; Expected = 2
```

(a) Explain what is wrong with the given code.
Describe the fault precisely by proposing a modification to the code.
(b) If possible, give a test case that does not execute the fault.
If not, briefly explain why not. (You need to give the same number of arguments.)
(c) If possible, give a test case that executes the fault, but does not result in an error state.
If not, briefly explain why not. (You also need to answer expected and actual output.)
(d) If possible, give a test case that results in an error state, but not a failure.
If not, briefly explain why not. (You also need to answer expected and actual output.)
(e) For the given test case in (d), describe the first error state. Be sure to describe the complete state.

Hints:
Fault: A static defect in software. Parts of source code that are incorrect.
Error State: An incorrect internal state. State information: variable values (including return value).
Failure: External, incorrect behavior with respect to the expected behavior.
````

- Tool: Claude Code 2.1.283
- Model: claude-opus-5-5[1m]
- Session: 4dba3c38-c1d5-42f1-b8fb-a7bcd15a210b
- Working directory: C:\Users\user.DESKTOP-7QU46KG\AppData\Local\Temp\hw1-B3_lastZero-yv3R

**Agent:**

## (a) The fault

The loop scans **forward** from index 0, so it returns the *first* zero rather than the *last*.
It should scan backward:

```js
for (let i = x.length - 1; i >= 0; i--) {
```

With `x = [0, 1, 0]`, the faulty code returns `0` but the expected result is `2`.

## (b) A test that does not execute the fault

**`x = null`**

`Array.isArray(null)` is false, so a `TypeError` is thrown before the `for` loop is reached.
Expected: TypeError. Actual: TypeError.

Any array input reaches the loop header, so a non-array argument is the only way to avoid the fault.

## (c) Executes the fault, but no error state

**`x = [0]`**

The fault is executed: the loop initializes `i = 0`.
For a 1-element array, the correct initial value `x.length - 1` is also `0`, so the states match.
`x[0] === 0` is true, so both versions return `0` immediately, before any `i++` or `i--` can make them differ.

Expected: `0`. Actual: `0`. The state never differs from the correct program's state.

(`x = []` does not work here: the faulty version sets `i = 0` while the correct one sets `i = -1`, which is already an error state.)

## (d) Error state, but no failure

**`x = [0, 1]`**

The faulty code starts at `i = 0`, but the correct code would start at `i = 1`, so that is an error state.
The faulty code then finds `x[0] === 0` and returns `0`.
`0` happens to be the correct answer, because the only zero is the last zero.

Expected: `0`. Actual: `0`. There is no failure.

## (e) The first error state for `x = [0, 1]`

It occurs right after the loop initialization `let i = 0`, before the condition `i < x.length` is first evaluated.

| Component | Faulty state | Correct state |
|---|---|---|
| `x` | `[0, 1]` | `[0, 1]` |
| `i` | **`0`** | `1` |
| PC | at the loop condition (`i < x.length`) | at the loop condition (`i >= 0`) |
| return value | undefined (not yet returned) | undefined |

The state is wrong because `i` is `0` when it should be `x.length - 1 = 1`.

---
- Finished: success, 1 turns, 16.7 s
