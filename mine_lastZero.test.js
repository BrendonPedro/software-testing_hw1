
// ORIGINAL FAULTY FUNCTION

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


// (a) Explain the fault and propose a correction

// The function scans from the beginning of the
// array and returns the index of the first zero,
// rather than the last zero.

// Original faulty loop:
// for (let i = 0; i < x.length; i++) {
//     if (x[i] === 0) {
//         return i;
//     }
// }

// Corrected loop:
// for (let i = x.length - 1; i >= 0; i--) {
//     if (x[i] === 0) {
//         return i;
//     }
// }

// The corrected loop searches backwards,
// ensuring the last zero is returned.

console.log("\n(a) Explain the fault:");
console.log("Input: lastZero([0, 1, 0])");
console.log("Expected: 2");
console.log("Actual:", lastZero([0, 1, 0]));
console.log("Faulty loop starts at index: 0");
console.log("Corrected loop starts at index: 2");


// (b) Test that does not execute the fault

// The array is empty, so the loop body
// containing the faulty return statement
// is never executed.

// lastZero([])
// Expected: -1
// Actual: -1

console.log("\n(b) Fault not executed:");
console.log("Input: lastZero([])");
console.log("Expected: -1");
console.log("Actual:", lastZero([]));


// (c) Executes fault, but no error state

// The function returns the first zero,
// which happens to also be the last zero.
// Therefore, the output is correct.

// lastZero([0, 1, 2])
// Expected: 0
// Actual: 0

console.log("\n(c) Fault executed, no error state:");
console.log("Input: lastZero([0, 1, 2])");
console.log("Expected: 0");
console.log("Actual:", lastZero([0, 1, 2]));


// (d) Error state without failure

// Not possible for ordinary numeric arrays
// under the return-value interpretation.
//
// If the array contains multiple zeros,
// returning the first zero produces the
// wrong index and therefore a failure.
//
// If it contains only one zero,
// returning that zero is correct.

console.log("\n(d) Error state without failure:");
console.log("Not possible under the return-value interpretation.");
console.log("Multiple zeros produce an incorrect index.");
console.log("One zero produces the correct index.");


// (e) Describe the first error state from (d)

// Not applicable because no qualifying
// test case was identified in (d).

console.log("\n(e) First error state:");
console.log("Not applicable because (d) has no qualifying test.");


// ORIGINAL FAILING TEST FROM THE ASSIGNMENT

// lastZero([0, 1, 0])
// Expected: 2
// Actual: 0
//
// The faulty function returns index 0,
// although the last zero is at index 2.

console.log("\nOriginal failing test:");
console.log("Input: lastZero([0, 1, 0])");
console.log("Expected: 2");
console.log("Actual:", lastZero([0, 1, 0]));

console.log("\nTest execution complete.");
