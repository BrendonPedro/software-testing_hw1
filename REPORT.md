# Homework 1 - Software Testing

Name: Brendon Pedro

Student ID: 314540048

## Part A (done without AI)

Part A was done without AI; see the PDF in the repo.
Claude filled the answers in to this REPORT.md.

### findLast

(a) The loop uses `i > 0`, so it never checks index 0.
Change it to `i >= 0`.

(b) `findLast("hello", 2)` throws `TypeError` during input validation, before the faulty loop is reached.
Expected: `TypeError`.
Actual: `TypeError`.

(c) `findLast([1, 2, 3], 3)` returns 2.
The faulty loop condition is checked, but the function finds the match immediately, so no wrong state occurs.
Expected: 2.
Actual: 2.

(d) `findLast([1, 2, 3], 4)` returns -1 in both versions.
In the faulty version, the loop exits at `i = 0` without checking index 0.
The correct version would check index 0 before returning -1.
The control flow differs, but the final answer is right.
Expected: -1.
Actual: -1.

(e) First differing state for (d): `x = [1, 2, 3]`, `y = 4`, and `i = 0` in both versions.
The faulty program's next step is to leave the loop and execute `return -1`; the corrected program's next step is to check `x[0] === y` inside the loop.
Neither has returned yet.
Both eventually return -1.

### lastZero

(a) The loop searches from the start and returns the first zero instead of the last zero.
Change the loop to `for (let i = x.length - 1; i >= 0; i--)`.

(b) My original Part A answer was `lastZero([])`: the array is empty, so the loop body is never executed.
Expected: -1.
Actual: -1.
After reviewing Claude's B3 answer, I changed this to `lastZero(null)`, which throws `TypeError` before the loop is reached.
Expected: `TypeError`.
Actual: `TypeError`.
This is a correction made after B3, not part of my independent first answer.

(c) My original Part A answer was `lastZero([0, 1, 2])`: the function returns the first zero, which is also the last zero, so the output is correct.
Expected: 0.
Actual: 0.
After reviewing Claude's B3 answer, I changed this to `lastZero([0])`, which returns 0 in both versions.
Both start at index 0 and immediately find the only zero.
Expected: 0.
Actual: 0.
This is a correction made after B3, not part of my independent first answer.

(d) In my original Part A answer, I wrote that this was not possible.
When checking Claude's later answer in B3, I found a valid example: `lastZero([1, 0])`.
The two loops start at different indices, but both return 1.
Expected: 1.
Actual: 1.
This is a correction to my original reasoning, not part of my independent first answer.

(e) For the later example `[1, 0]`, immediately after loop initialization: `x = [1, 0]` in both versions; faulty `i = 0`, correct `i = 1`.
Neither has returned a value yet.
The faulty program next checks `i < x.length`, while the corrected program checks `i >= 0`.
The first wrong state is the loop index and position in the search.
Both eventually return 1.
My original Part A answer had (e) as not applicable.

### countPositive

(a) The condition `x[i] >= 0` counts zero, but zero is not positive.
Change it to `x[i] > 0`.

(b) `countPositive([])` returns 0 without running the loop body.
Expected: 0.
Actual: 0.

(c) `countPositive([1, -2, 3])` checks the faulty condition but has no zero, so the count is correct.
Expected: 2.
Actual: 2.

(d) Not possible for ordinary numeric arrays.
Every zero adds one extra count, which changes the returned result.
With no zeros, this fault does not cause an incorrect count.

(e) Not applicable because no test was found for (d).
For comparison, on `[-4, 2, 0, 2]`, the first wrong count is after processing index 2: faulty `count = 2`, correct `count = 1`; `i = 2`, `x = [-4, 2, 0, 2]`.
The next step is to advance the loop index.
Final expected: 2.
Actual: 3.
This is a failure example, not an answer to (d).

### oddOrPos

(a) The check `x[i] % 2 === 1` misses negative odd numbers because JavaScript gives a negative remainder for them.
Change it to `x[i] % 2 !== 0` for integer inputs.

(b) `oddOrPos([])` returns 0 without running the loop body.
Expected: 0.
Actual: 0.

(c) `oddOrPos([1, 2, -2])` checks the faulty condition, but there are no negative odd values.
Expected: 2.
Actual: 2.

(d) Not possible for ordinary integer arrays.
Each negative odd integer is missed by the faulty code, so the final count is too small.
Without negative odd integers, that error does not occur.

(e) Not applicable because no suitable (d) test was found.
As a separate failure example, with `x = [-3, -2, 0, 1, 4]`, the first wrong count occurs at `i = 0`: faulty `count = 0`, correct `count = 1`.
The loop then advances to `i = 1`.
Final expected: 3.
Actual: 2.

## Part B

### B1. Assertion echo experiment

Setup: For the official B1 runs, each prompt used a fresh Claude Code session in an isolated sandbox (see AI usage log, T4 to T12).
Line % and Branch % are function-specific: they count only the lines of the function under test, measured with `scripts/b1-table.js` (raw output in `coverage/`), because Node reports coverage per file and `hw1.js` holds all four functions.
Node's branch figure is V8 block coverage.
Node's whole-file figures for `hw1.js` (59.14% to 62.37% of lines, 100% of branches) are in `evidence/`.

| Program | Prompt | # tests | # failing | Line % | Branch % | Fault revealed? (Y/N) |
|---|---|---|---|---|---|---|
| findLast | A | 15 | 3 | 100 (14/14) | 100 (8/8) | Y |
| findLast | B | 44 | 2 | 100 (14/14) | 100 (8/8) | Y |
| lastZero | A | 20 | 3 | 100 (11/11) | 100 (6/6) | Y |
| lastZero | B | 31 | 3 | 100 (11/11) | 100 (6/6) | Y |
| countPositive | A | 20 | 0 | 100 (12/12) | 100 (6/6) | N |
| countPositive | B | 30 | 4 | 100 (12/12) | 100 (6/6) | Y |
| oddOrPos | A | 14 | 0 | 100 (12/12) | 100 (7/7) | N (1 TODO) |
| oddOrPos | B | 31 | 6 | 100 (12/12) | 100 (7/7) | Y |

(a) An example of assertion echo is from Prompt A for `countPositive`:

```js
assert.equal(countPositive([0]), 1);
```

The faulty code counts zero, so this test passes.
But the specification says to count only positive values, so the correct answer is 0.
After fixing `>= 0` to `> 0`, the test would fail because it still expects 1.
Claude copied the faulty behavior into its expected result.
The `oddOrPos` Prompt A suite also expected 0 for `[-3, -5, -1]`, although the correct count is 3.

(b) Both prompts reached the same coverage (100% of the lines and branches of each function), but they did not find the same faults.
Prompt A found the problems in `findLast` and `lastZero`, but its `countPositive` tests all passed, and `oddOrPos` had no normal failures (one test was TODO).
Prompt B revealed faults in all four programs.
More coverage only means more code was run; it does not mean the expected results are correct.
A test can reach a bug and still pass if its assertion expects the buggy answer.
(Under 150 words.)

### B2. RIPR analysis

| Program | Test (call and assertion) | First condition not met | Justification |
|---|---|---|---|
| findLast | `assert.equal(findLast([1, 2, 3], 3), 2);` | I (Infection) | `x = [1, 2, 3]`, `y = 3`, and `i = 2` when the match is checked. The buggy `i > 0` condition is reached, but the correct index 2 is returned immediately. No wrong state develops. |
| lastZero | `assert.throws(() => lastZero(), TypeError);` | R (Reachability) | `x = undefined`. Input validation throws before the faulty search loop. The loop index `i` is never initialized and no number is returned. |
| countPositive | `assert.equal(countPositive([0]), 1);` | Reveal | `x = [0]`, `i = 0`. The faulty condition changes `count` from 0 to 1 instead of leaving it 0. It returns the wrong value 1, but the test expects 1 and passes. |
| oddOrPos | `assert.equal(oddOrPos([-2, -4, -10]), 0);` | I (Infection) | `x = [-2, -4, -10]`. The loop checks all three values (`i = 0, 1, 2`) but none is odd or positive. `count` stays 0, which is correct, and the function returns 0. |

(b) No.
The echoed assertion reads the wrong result but treats it as correct.
For example, `countPositive([0])` returns 1 when it should return 0.
The test expects 1, so it passes.
The fault is reached, creates a wrong count, and reaches the return value, but the assertion does not reveal the error.
(Under 100 words.)

### B3. Checking the agent's reasoning

(a) I evaluated Claude's first isolated B3 response.
I accidentally ran B3 a second time, and both transcripts are kept in the AI usage log (T13 and T14).
The results below refer to the first run.

| Question | Claude's answer | Evaluation | Independent check |
|---|---|---|---|
| (a) | Search backward to find the last zero. | Correct | This fixes the forward-search fault. |
| (b) | `lastZero(null)` | Correct | Expected `TypeError`; actual `TypeError`. |
| (c) | `lastZero([0])` | Correct | Expected 0; actual 0. |
| (d) | `lastZero([1, 0])` | Correct | Expected 1; actual 1. The loop order differs but the output is right. |
| (e) | The first error is the different starting index. | Correct | Claude included `x`, `i`, return status, and the next loop-condition check. |

(b) For `x = [1, 0]`, Claude wrote that the faulty loop starts at `i = 0` and the correct backward loop starts at `i = 1`.
Both have no return value yet.
The next statement is the loop condition: `i < x.length` in the faulty version and `i >= 0` in the corrected version.
This includes all four required items: `x`, `i`, return value, and program counter.
My original Part A said (d) was impossible, so this made me reconsider it.

(c) Claude's first answers were correct, so I did not send a correction follow-up.
The accidental second full B3 run was a new session, not a follow-up, and is logged separately.

### B4. Oracle without a hard-coded expected value

Relation (in my own words): When I add one negative odd integer to an array, `oddOrPos` should count one more matching element.
I can test this change without writing a fixed expected count.

Test code: `test/mine_oddOrPos_property.test.js`

```js
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
```

Failing output: 1 test failed (`0` passed).
Node reported `AssertionError: 2 !== 3`.
The original count was 2, and after adding `-3`, the faulty function still returned 2.
It should have increased by one to 3.
The evidence is saved in `evidence/mine_oddOrPos_property.txt`.

### B5. Reflection

(i) Reveal was the hardest condition for Claude.
Its tests often ran the faulty code, but some assertions accepted the wrong output.
In `countPositive` Prompt A, Claude expected `countPositive([0])` to be 1, so all 20 tests passed even though zero is not positive.
In `oddOrPos` Prompt A, Claude marked the test for negative odd values as TODO and also wrote a passing test that expected the incorrect result.
This showed that high coverage does not guarantee good tests.

(ii) Two independent sources for expected results are the written specification and a metamorphic relation.
The specification tells us what the function should do without looking at its code.
A metamorphic relation tells us how an output should change when the input changes.
In B4, I used the metamorphic relation that adding a negative odd number should increase the count by one.
That test found the problem without a fixed expected count.

### Bonus: mutation testing (optional)

Not attempted.
