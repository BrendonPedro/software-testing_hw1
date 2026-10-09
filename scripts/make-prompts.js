// Generates the verbatim prompts for B1 (Prompt A / Prompt B) and B3 from hw1.js,
// plus the per-program source that the Prompt A sandbox is allowed to see.
//
// Prompt A ("code only"): the function code, without its JSDoc.
// Prompt B ("spec only"): the JSDoc and the function header, without the body.
// Set INCLUDE_JSDOC_IN_A=1 if you read "the whole function" as including the JSDoc.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PROGRAMS = ['findLast', 'lastZero', 'countPositive', 'oddOrPos'];
const INCLUDE_JSDOC_IN_A = process.env.INCLUDE_JSDOC_IN_A === '1';

const lines = fs.readFileSync(path.join(ROOT, 'hw1.js'), 'utf8').split('\n');

function extract(name) {
    const start = lines.findIndex((l) => l.startsWith(`function ${name}(`));
    if (start < 0) throw new Error(`function ${name} not found in hw1.js`);
    const end = lines.findIndex((l, i) => i > start && l === '}');
    let docStart = start - 1;
    while (!lines[docStart].startsWith('/**')) docStart--;
    return {
        jsdoc: lines.slice(docStart, start).join('\n'),
        header: lines[start].replace(/\s*\{\s*$/, ''),
        code: lines.slice(start, end + 1).join('\n'),
        givenTest: lines[end + 1].startsWith('// test:') ? lines[end + 1] : null,
    };
}

function setupNote(name, prompt) {
    return `(Setup: the function is exported from hw1.js in the project root. ` +
        `Save the tests as test/prompt${prompt}_${name}.test.js and import the function with ` +
        `\`const { ${name} } = require('../hw1.js');\`.)`;
}

const fence = (s) => '```js\n' + s + '\n```';
const promptsDir = path.join(ROOT, 'prompts');
const sandboxSrcDir = path.join(promptsDir, 'sandbox-src');
fs.mkdirSync(sandboxSrcDir, { recursive: true });

for (const name of PROGRAMS) {
    const f = extract(name);
    const codeA = INCLUDE_JSDOC_IN_A ? `${f.jsdoc}\n${f.code}` : f.code;

    fs.writeFileSync(path.join(promptsDir, `A_${name}.txt`),
        `${fence(codeA)}\n\nWrite unit tests for this function with node:test. Make sure all tests pass.\n\n${setupNote(name, 'A')}\n`);
    fs.writeFileSync(path.join(promptsDir, `B_${name}.txt`),
        `${fence(`${f.jsdoc}\n${f.header}`)}\n\nWrite unit tests with node:test that check this specification.\n\n${setupNote(name, 'B')}\n`);
    // The Prompt A agent must be able to run its tests, so its sandbox gets exactly the code it was shown.
    fs.writeFileSync(path.join(sandboxSrcDir, `${name}.js`),
        `${codeA}\n\nmodule.exports = { ${name} };\n`);
}

// B3: lastZero exactly as Part A presents it, with Part A's questions (a)-(e) and the hint definitions.
const lz = extract('lastZero');
fs.writeFileSync(path.join(promptsDir, 'B3_lastZero.txt'), `The program below is faulty. It includes test inputs that result in failure. Answer the following questions about it.

${fence(`${lz.jsdoc}\n${lz.code}\n${lz.givenTest}`)}

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
`);

console.log(`Wrote prompts to ${path.relative(ROOT, promptsDir)}/ (Prompt A ${INCLUDE_JSDOC_IN_A ? 'includes' : 'excludes'} JSDoc)`);
