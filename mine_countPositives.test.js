
// ORIGINAL FAULTY FUNCTION

function countPositive(x) {
    if (!Array.isArray(x)) {
        throw new TypeError('Not an array');
    }
    let count = 0;
    for (let i = 0; i < x.length; i++) {
        if (x[i] >= 0) {
            count++;
        }
    }
    return count;
}


// (a) Explain the fault and propose a correction

// The condition x[i] >= 0 incorrectly counts
// zero as a positive number.
// Positive numbers must be strictly greater than zero.

// Original faulty condition:
// if (x[i] >= 0) {
//     count++;
// }

// Corrected condition:
// if (x[i] > 0) {
//     count++;
// }

// The corrected condition only counts elements
// that are strictly greater than zero.

console.log("\n(a) Explain the fault:");
console.log("Input: 0");
console.log("Faulty condition (0 >= 0):", 0 >= 0);
console.log("Correct condition (0 > 0):", 0 > 0);


// (b) Test that does not execute the fault

// The array is empty, so the loop and faulty
// condition are never executed.

// countPositive([])
// Expected: 0
// Actual: 0

console.log("\n(b) Fault not executed:");
console.log("Input: countPositive([])");
console.log("Expected: 0");
console.log("Actual:", countPositive([]));


// (c) Executes fault, but no error state

// The faulty condition is evaluated, but the
// array does not contain zero.
// Therefore, the count remains correct.

// countPositive([1, -2, 3])
// Expected: 2
// Actual: 2

console.log("\n(c) Fault executed, no error state:");
console.log("Input: countPositive([1, -2, 3])");
console.log("Expected: 2");
console.log("Actual:", countPositive([1, -2, 3]));


// (d) Error state without failure

// Not possible for ordinary numeric arrays.

// Whenever the array contains zero, the faulty
// condition increments the count incorrectly.
// The final count is therefore incorrect.

// An error state caused by this fault always
// produces a failure.

console.log("\n(d) Error state without failure:");
console.log("Not possible for ordinary numeric arrays.");
console.log("Zero is incorrectly counted as positive.");
console.log("This produces an incorrect final result.");


// (e) Describe the first error state from (d)

// Not applicable because no qualifying test
// case exists for (d).

// For reference, the supplied failing test is:
// countPositive([-4, 2, 0, 2])

// Expected: 2
// Actual: 3

// First error state in this failing test:
// x = [-4, 2, 0, 2]
// i = 2
// x[i] = 0
// Correct count = 1
// Faulty count = 2

console.log("\n(e) First error state:");
console.log("Not applicable to (d).");
console.log("Example from the original failing test:");
console.log("x = [-4, 2, 0, 2]");
console.log("i = 2");
console.log("x[i] = 0");
console.log("Expected count after index 2: 1");
console.log("Actual count after index 2: 2");


// ORIGINAL FAILING TEST FROM THE ASSIGNMENT

console.log("\nOriginal failing test:");
console.log("Input: countPositive([-4, 2, 0, 2])");
console.log("Expected: 2");
console.log("Actual:", countPositive([-4, 2, 0, 2]));

console.log("\nTest execution complete.");
