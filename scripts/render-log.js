// Renders a `claude -p --output-format stream-json` transcript as Markdown for the AI usage log.
// Nothing is truncated: the assignment asks for the agent's full responses.
'use strict';
const fs = require('node:fs');

const events = fs.readFileSync(process.argv[2], 'utf8').split('\n')
    .filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);

const out = [];
const block = (s) => out.push('````\n' + s + '\n````\n');
if (process.argv[3]) {
    out.push('**Prompt (verbatim):**\n');
    block(fs.readFileSync(process.argv[3], 'utf8'));
}
const asText = (c) => typeof c === 'string' ? c
    : Array.isArray(c) ? c.map((p) => p.text ?? JSON.stringify(p)).join('\n') : JSON.stringify(c, null, 2);

for (const e of events) {
    if (e.type === 'system' && e.subtype === 'init') {
        out.push(`- Tool: Claude Code ${e.claude_code_version ?? ''}`.trimEnd());
        out.push(`- Model: ${e.model}`);
        out.push(`- Session: ${e.session_id}`);
        out.push(`- Working directory: ${e.cwd}\n`);
    } else if (e.type === 'assistant') {
        for (const part of e.message.content) {
            if (part.type === 'text') out.push(`**Agent:**\n\n${part.text}\n`);
            else if (part.type === 'tool_use') {
                out.push(`**Agent tool call: ${part.name}**\n`);
                block(JSON.stringify(part.input, null, 2));
            }
        }
    } else if (e.type === 'user' && Array.isArray(e.message?.content)) {
        for (const part of e.message.content) {
            if (part.type === 'tool_result') {
                out.push(`**Tool result${part.is_error ? ' (error)' : ''}:**\n`);
                block(asText(part.content));
            }
        }
    } else if (e.type === 'result') {
        out.push(`---\n- Finished: ${e.subtype}, ${e.num_turns} turns, ${(e.duration_ms / 1000).toFixed(1)} s`);
    }
}
process.stdout.write(out.join('\n') + '\n');
