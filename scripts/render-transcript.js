// Renders one Claude Code session as Markdown for the AI usage log.
// Reads either a `claude -p --output-format stream-json` stream (logs/<id>.jsonl, with the prompt
// passed via --prompt) or a session file that Claude Code stores under ~/.claude/projects/.
//
//   node scripts/render-transcript.js <session.jsonl> [--prompt <prompt.txt>] [--times-from <stored.jsonl>] [--summary]
//
// Prompts and agent text are printed verbatim inside fences, so the agent's own Markdown headings
// do not mix with the log's headings. Leading blank lines of a prompt are trimmed. Without --summary every tool call and tool result is printed
// in full. With --summary each tool call is one line and tool results are left out.
// Harness-only content is skipped: system reminders, slash-command echoes, the agent's private
// thinking, and session metadata. Paste markers added by the terminal are removed, and e-mail
// addresses are redacted because the log is published.
'use strict';
const fs = require('node:fs');

const args = process.argv.slice(2);
const file = args[0];
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const summary = args.includes('--summary');
const promptFile = opt('--prompt');

const events = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
const isStream = events.some((e) => e.type === 'system' && e.subtype === 'init');

const redact = (s) => s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g, '[e-mail redacted]');
const unpaste = (s) => s.replace(/<pasted_content id="[^"]*">\n?/g, '').replace(/\n?<\/pasted_content[^>]*>/g, '');
function fence(body, lang = '') {
    const runs = body.match(/^`{3,}/gm) || [];
    const n = Math.max(4, ...runs.map((r) => r.length + 1));
    return '`'.repeat(n) + lang + '\n' + body.replace(/\n+$/, '') + '\n' + '`'.repeat(n) + '\n';
}
const asText = (c) => typeof c === 'string' ? c
    : Array.isArray(c) ? c.map((p) => p.type === 'text' ? p.text : `[${p.type}]`).join('\n') : JSON.stringify(c, null, 2);
const local = (iso) => new Date(iso).toLocaleString('sv-SE', { timeZone: 'Asia/Taipei' }).slice(0, 16) + ' (UTC+8)';
const oneLine = (input) => {
    const s = input.description || input.command || input.file_path || input.pattern || input.url || JSON.stringify(input);
    const first = String(s).split('\n')[0];
    return first.length > 200 ? first.slice(0, 197) + '...' : first;
};

const out = [];
const meta = { models: new Set() };
let promptNo = 0;
let pendingSummary = [];
const flushSummary = () => {
    if (!pendingSummary.length) return;
    out.push('*Tool calls (summarized; tool results omitted):*\n');
    out.push(pendingSummary.map((l) => `- ${l}`).join('\n') + '\n');
    pendingSummary = [];
};
const prompt = (text) => {
    flushSummary();
    promptNo++;
    out.push(`**Prompt ${promptNo} (verbatim):**\n`);
    out.push(fence(redact(unpaste(text)).replace(/^\s*\n/, ''), 'text'));
};
const agentPart = (part) => {
    if (part.type === 'text' && part.text.trim()) {
        flushSummary();
        out.push('**Agent:**\n');
        out.push(fence(redact(part.text), 'text'));
    } else if (part.type === 'tool_use') {
        if (summary) { pendingSummary.push(`${part.name}: ${redact(oneLine(part.input))}`); return; }
        out.push(`**Agent tool call: ${part.name}**\n`);
        // Multi-line string arguments (file contents, scripts) are printed as plain text below
        // the remaining arguments, so they stay readable; nothing is dropped.
        const multi = Object.entries(part.input).filter(([, v]) => typeof v === 'string' && v.includes('\n'));
        const rest = Object.fromEntries(Object.entries(part.input).filter(([k]) => !multi.some(([m]) => m === k)));
        if (Object.keys(rest).length) out.push(fence(redact(JSON.stringify(rest, null, 2)), 'json'));
        for (const [k, v] of multi) { out.push(`\`${k}\`:\n`); out.push(fence(redact(v), 'text')); }
    }
};
const toolResult = (part) => {
    if (summary) return;
    out.push(`**Tool result${part.is_error ? ' (error)' : ''}:**\n`);
    out.push(fence(redact(asText(part.content))));
};

if (isStream) {
    if (promptFile) prompt(fs.readFileSync(promptFile, 'utf8'));
    for (const e of events) {
        if (e.type === 'system' && e.subtype === 'init') {
            Object.assign(meta, { version: e.claude_code_version, session: e.session_id, cwd: e.cwd });
            meta.models.add(e.model);
        } else if (e.type === 'assistant') {
            e.message.content.forEach(agentPart);
        } else if (e.type === 'user' && Array.isArray(e.message?.content)) {
            e.message.content.filter((p) => p.type === 'tool_result').forEach(toolResult);
        } else if (e.type === 'result') {
            flushSummary();
            meta.finished = `${e.subtype}, ${e.num_turns} turns, ${(e.duration_ms / 1000).toFixed(1)} s`;
        }
    }
} else {
    for (const e of events) {
        if (!meta.version && e.version) Object.assign(meta, { version: e.version, session: e.sessionId, cwd: e.cwd });
        if (e.timestamp && (e.type === 'user' || e.type === 'assistant')) {
            meta.started ??= e.timestamp;
            meta.last = e.timestamp;
        }
        if (e.type === 'assistant') {
            if (e.message?.model && !e.message.model.startsWith('<')) meta.models.add(e.message.model);
            (e.message?.content || []).forEach(agentPart);
        } else if (e.type === 'user' && !e.isMeta) {
            const c = e.message?.content;
            const parts = typeof c === 'string' ? [{ type: 'text', text: c }] : (c || []);
            for (const p of parts) {
                if (p.type === 'tool_result') toolResult(p);
                else if (p.type === 'text') {
                    const t = p.text;
                    if (/^\s*<(system-reminder|local-command|command-name|command-message)/.test(t)) continue;
                    if (/^\[Request interrupted/.test(t)) { flushSummary(); out.push(`*${t}*\n`); continue; }
                    prompt(t);
                }
            }
        }
    }
    flushSummary();
}
// A stream has no timestamps; the matching stored session file can supply them.
if (opt('--times-from')) {
    const stamps = fs.readFileSync(opt('--times-from'), 'utf8').split('\n').filter(Boolean)
        .map((l) => { try { return JSON.parse(l); } catch { return null; } })
        .filter((e) => e && e.timestamp && (e.type === 'user' || e.type === 'assistant'))
        .map((e) => e.timestamp);
    if (stamps.length) Object.assign(meta, { started: stamps[0], last: stamps[stamps.length - 1] });
}

const head = [
    `- Tool: Claude Code ${meta.version ?? '(unknown)'}`,
    `- Model: ${[...meta.models].join(', ') || '(unknown)'}`,
    `- Session: ${meta.session ?? '(unknown)'}`,
    meta.started ? `- Time: ${local(meta.started)} to ${local(meta.last).slice(11)}` : null,
    `- Working directory: ${meta.cwd ?? '(unknown)'}`,
    meta.finished ? `- Finished: ${meta.finished}` : null,
].filter(Boolean);
process.stdout.write(head.join('\n') + '\n\n' + out.join('\n'));
