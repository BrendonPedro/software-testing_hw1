// Builds the submission document: HOMEWORK1_FINAL.md (REPORT.md + the AI usage log as an
// appendix) and HOMEWORK1_FINAL.pdf.
//
//   node scripts/build-final.js
//
// Markdown is rendered by GitHub's own renderer (`gh api /markdown`), the same one that shows
// the files in the repository, and printed to PDF by headless Google Chrome (or Edge).
// Needs the GitHub CLI (logged in) and Chrome. Set CHROME to the browser executable if it is not
// in a default location. Under WSL the Windows browser works; paths are converted with wslpath.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');

// The log's own title is replaced by the appendix title, so the document has one title per part.
const log = read('AI_USAGE_LOG.md').replace(/^# AI Usage Log - Homework 1\n+/, '');
const md = `${read('REPORT.md')}\n\n# Appendix A - AI Usage Log\n\n${log}\n`;
fs.writeFileSync(path.join(ROOT, 'HOMEWORK1_FINAL.md'), md);

const body = execFileSync('gh', ['api', '-X', 'POST', '/markdown', '-f', 'mode=markdown', '-F', 'text=@-'],
    { input: md, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const css = `
@page { size: A4; margin: 16mm 15mm 18mm;
    @bottom-center { content: "Homework 1 - 314540048 - page " counter(page) " of " counter(pages); font: 8pt sans-serif; color: #57606a; } }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font: 10pt/1.5 "Segoe UI", "Noto Sans", "DejaVu Sans", Helvetica, Arial, sans-serif; color: #1f2328; background: #fff; margin: 0; }
h1, h2, h3, h4 { line-height: 1.25; margin: 1.2em 0 0.5em; break-after: avoid; }
h1 { font-size: 20pt; border-bottom: 1px solid #d0d7de; padding-bottom: 0.25em; }
h2 { font-size: 15pt; border-bottom: 1px solid #d0d7de; padding-bottom: 0.2em; }
h3 { font-size: 12.5pt; }
h4 { font-size: 11pt; }
.markdown-heading:has(h1):not(:first-child) { break-before: page; }
.anchor { display: none; }
p, ul, ol, table, pre, .highlight { margin: 0 0 0.75em; }
code { font: 8.6pt/1.45 "Cascadia Mono", Consolas, "DejaVu Sans Mono", monospace; background: #eff1f3; border-radius: 4px; padding: 0.1em 0.3em; overflow-wrap: anywhere; }
pre { background: #f6f8fa; border: 1px solid #d8dee4; border-radius: 6px; padding: 8px 10px; white-space: pre-wrap; overflow-wrap: anywhere; }
pre code { background: none; padding: 0; font-size: 8.2pt; }
table { border-collapse: collapse; width: 100%; font-size: 9pt; }
th, td { border: 1px solid #d0d7de; padding: 4px 7px; vertical-align: top; text-align: left; overflow-wrap: break-word; }
td code { overflow-wrap: break-word; }
th { background: #f6f8fa; }
tr { break-inside: avoid; }
.pl-k { color: #cf222e; } .pl-s, .pl-pds, .pl-s1 .pl-pse { color: #0a3069; } .pl-c { color: #6e7781; }
.pl-c1, .pl-smi .pl-c1 { color: #0550ae; } .pl-en { color: #8250df; } .pl-v { color: #953800; }
`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Homework 1 - Software Testing</title><style>${css}</style></head><body>${body}</body></html>`;
const htmlFile = path.join(ROOT, 'HOMEWORK1_FINAL.html');
fs.writeFileSync(htmlFile, html);

const chrome = [process.env.CHROME,
    '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
    '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium'].find((c) => c && fs.existsSync(c));
if (!chrome) throw new Error('No Chrome or Edge found; set CHROME to the browser executable.');
// A Windows browser started from WSL needs Windows paths.
const native = (p) => chrome.startsWith('/mnt/') ? execFileSync('wslpath', ['-w', p], { encoding: 'utf8' }).trim() : p;
const profile = fs.mkdtempSync(path.join(ROOT, '.chrome-profile-'));
const pdf = path.join(ROOT, 'HOMEWORK1_FINAL.pdf');
try {
    execFileSync(chrome, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
        `--user-data-dir=${native(profile)}`, '--no-pdf-header-footer', `--print-to-pdf=${native(pdf)}`,
        'file:///' + native(htmlFile).replace(/\\/g, '/').replace(/^\//, '')], { stdio: ['ignore', 'ignore', 'pipe'] });
} finally {
    fs.rmSync(profile, { recursive: true, force: true });
    fs.unlinkSync(htmlFile);
}
console.log('Wrote HOMEWORK1_FINAL.md and HOMEWORK1_FINAL.pdf');
