// Runs every test/prompt{A,B}_<program>.test.js on its own against the unchanged hw1.js and
// prints the B1 table. Line % and Branch % are restricted to the lines of the function under
// test, because Node reports coverage per file and hw1.js holds all four functions.
// Raw output for each suite (spec + Node's own coverage table, lcov, TAP) goes to coverage/.
//
// "Fault revealed?" is left for you: a failing test only reveals the fault if it fails
// *because of* the fault, not because the agent guessed a wrong expected value.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const PROGRAMS = ['findLast', 'lastZero', 'countPositive', 'oddOrPos'];
const COV = path.join(ROOT, 'coverage');
fs.mkdirSync(COV, { recursive: true });

const src = fs.readFileSync(path.join(ROOT, 'hw1.js'), 'utf8').split('\n');
function fnRange(name) {
    const start = src.findIndex((l) => l.startsWith(`function ${name}(`));
    const end = src.findIndex((l, i) => i > start && l === '}');
    return [start + 1, end + 1]; // 1-based, inclusive
}

function measure(name, prompt) {
    const file = `test/prompt${prompt}_${name}.test.js`;
    if (!fs.existsSync(path.join(ROOT, file))) return null;
    const id = `prompt${prompt}_${name}`;
    const lcovFile = path.join(COV, `${id}.lcov`);
    const tapFile = path.join(COV, `${id}.tap`);
    const run = spawnSync(process.execPath, ['--test', '--experimental-test-coverage',
        '--test-reporter=spec', '--test-reporter-destination=stdout',
        '--test-reporter=lcov', `--test-reporter-destination=${lcovFile}`,
        '--test-reporter=tap', `--test-reporter-destination=${tapFile}`, file],
        { cwd: ROOT, encoding: 'utf8' });
    fs.writeFileSync(path.join(COV, `${id}.txt`), run.stdout + run.stderr);

    const tap = fs.readFileSync(tapFile, 'utf8');
    const count = (k) => Number((tap.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1] ?? NaN);

    const [lo, hi] = fnRange(name);
    let inHw1 = false, lines = 0, linesHit = 0, br = 0, brHit = 0;
    for (const l of fs.readFileSync(lcovFile, 'utf8').split('\n')) {
        if (l.startsWith('SF:')) inHw1 = path.basename(l.slice(3)) === 'hw1.js';
        if (!inHw1) continue;
        let m;
        if ((m = l.match(/^DA:(\d+),(\d+)/)) && +m[1] >= lo && +m[1] <= hi) {
            lines++; if (+m[2] > 0) linesHit++;
        } else if ((m = l.match(/^BRDA:(\d+),\d+,\d+,(\d+|-)/)) && +m[1] >= lo && +m[1] <= hi) {
            br++; if (m[2] !== '-' && +m[2] > 0) brHit++;
        }
    }
    const pct = (a, b) => b ? `${(100 * a / b).toFixed(1)}% (${a}/${b})` : 'n/a';
    return { tests: count('tests'), failing: count('fail'), line: pct(linesHit, lines), branch: pct(brHit, br) };
}

const rows = [['Program', 'Prompt', '# tests', '# failing', 'Line %', 'Branch %', 'Fault revealed? (Y/N)']];
for (const name of PROGRAMS) {
    for (const prompt of ['A', 'B']) {
        const r = measure(name, prompt);
        rows.push(r ? [name, prompt, r.tests, r.failing, r.line, r.branch, '?']
            : [name, prompt, '(no suite yet)', '', '', '', '']);
    }
}
const widths = rows[0].map((_, c) => Math.max(...rows.map((r) => String(r[c]).length)));
const fmt = (r) => '| ' + r.map((v, c) => String(v).padEnd(widths[c])).join(' | ') + ' |';
console.log([fmt(rows[0]), '|' + widths.map((w) => '-'.repeat(w + 2)).join('|') + '|', ...rows.slice(1).map(fmt)].join('\n'));
console.log('\nPer-suite raw output (incl. Node\'s whole-file coverage table) saved in coverage/.');
