
// ORIGINAL FAULTY FUNCTION

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


// (a) Explain the fault and propose a correction

// The loop condition is i > 0, which prevents
// the program from checking index 0.
// The function incorrectly returns -1 if the
// last occurrence of y is at index 0.

// Original faulty condition:
// for (let i = x.length - 1; i > 0; i--)

// Corrected condition:
// for (let i = x.length - 1; i >= 0; i--) {
//     if (x[i] === y) {
//         return i;
//     }
// }

// The corrected loop also checks index 0.

console.log("\n(a) Explain the fault:");
console.log("Input: findLast([2, 3, 5], 2)");
console.log("Expected: 0");
console.log("Actual:", findLast([2, 3, 5], 2));
console.log("Faulty loop condition (0 > 0):", 0 > 0);
console.log("Correct loop condition (0 >= 0):", 0 >= 0);


// (b) Test that does not execute the fault

// The input validation throws an exception
// before the faulty loop is reached.

// findLast("hello", 2)
// Expected: TypeError
// Actual: TypeError

console.log("\n(b) Fault not executed:");
console.log('Input: findLast("hello", 2)');
console.log("Expected: TypeError");

try {
    findLast("hello", 2);
    console.log("Actual: No error thrown");
} catch (error) {
    console.log("Actual:", error.name);
}


// (c) Executes fault, but no error state

// The faulty loop condition is evaluated,
// but the program finds 3 at index 2
// and returns immediately.
// No incorrect state occurs.

// findLast([1, 2, 3], 3)
// Expected: 2
// Actual: 2

console.log("\n(c) Fault executed, no error state:");
console.log("Input: findLast([1, 2, 3], 3)");
console.log("Expected: 2");
console.log("Actual:", findLast([1, 2, 3], 3));


// (d) Error state without failure

// The faulty loop terminates when i = 0,
// skipping the final array element.
// The corrected loop would examine index 0.

// This causes incorrect control flow,
// but the result is still correct because
// 4 is absent from the array.

// findLast([1, 2, 3], 4)
// Expected: -1
// Actual: -1

console.log("\n(d) Error state without failure:");
console.log("Input: findLast([1, 2, 3], 4)");
console.log("Expected: -1");
console.log("Actual:", findLast([1, 2, 3], 4));
console.log("Faulty loop stops when i = 0.");
console.log("Corrected loop would check index 0.");
console.log("Both versions return -1.");
console.log("Note: divergence is in control flow.");


// (e) Describe the first error state from (d)

// Both programs eventually return -1.
// The first divergence occurs when i = 0.

// The faulty program exits the loop.
// The corrected program enters the loop
// to examine the element at index 0.

// Complete state at this point:
// x = [1, 2, 3]
// y = 4
// i = 0

// Faulty control flow: exit loop
// Correct control flow: enter loop
// Expected final output: -1
// Actual final output: -1

console.log("\n(e) First error state:");
console.log("x = [1, 2, 3]");
console.log("y = 4");
console.log("i = 0");
console.log("Faulty control flow: exits loop.");
console.log("Correct control flow: enters loop.");
console.log("Expected final output: -1");
console.log("Actual final output: -1");
console.log("First divergence: control-flow location.");


// ORIGINAL FAILING TEST FROM THE ASSIGNMENT

console.log("\nOriginal failing test:");
console.log("Input: findLast([2, 3, 5], 2)");
console.log("Expected: 0");
console.log("Actual:", findLast([2, 3, 5], 2));

console.log("\nTest execution complete.");
