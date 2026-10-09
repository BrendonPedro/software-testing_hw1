#!/usr/bin/env bash
# Runs one Part B prompt in a brand-new Claude Code session inside an isolated sandbox,
# saves the full transcript to logs/, and copies any generated test file into test/.
#
#   scripts/run-agent.sh A_findLast              # B1 Prompt A (sandbox has only that function's code)
#   scripts/run-agent.sh B_findLast              # B1 Prompt B (sandbox has no implementation at all)
#   scripts/run-agent.sh B3_lastZero             # B3 (no files, no tools, no MCP servers, no skills)
#   scripts/run-agent.sh followup B3_lastZero "your follow-up prompt"   # B3(c), same session
#
# Every rendered transcript (prompt + full agent response) is also appended to AI_USAGE_LOG.md.
# Extra flags for claude (e.g. --model) can be passed via CLAUDE_ARGS.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOGS="$ROOT/logs"
mkdir -p "$LOGS" "$ROOT/test"

run_claude() { # <log-basename> <prompt> [extra claude args...]
    local base="$1" prompt="$2"; shift 2
    printf '%s' "$prompt" > "$LOGS/$base.prompt.txt"
    # shellcheck disable=SC2086
    claude -p "$prompt" --output-format stream-json --verbose $CLAUDE_ARGS "$@" \
        | tee "$LOGS/$base.jsonl" > /dev/null
    node "$ROOT/scripts/render-log.js" "$LOGS/$base.jsonl" "$LOGS/$base.prompt.txt" > "$LOGS/$base.md"
    echo "Transcript: logs/$base.md (raw: logs/$base.jsonl)"
    { printf '\n## Transcript: %s\n\n' "$base"; cat "$LOGS/$base.md"; } >> "$ROOT/AI_USAGE_LOG.md"
    echo "Appended transcript to AI_USAGE_LOG.md"
}
CLAUDE_ARGS="${CLAUDE_ARGS:-}"
# B3 is a pure reasoning question, so the agent gets nothing beyond the prompt: no tools (it cannot
# read files such as ~/.claude/history.jsonl or other transcripts), no MCP servers (e.g. claude.ai
# Google Drive / Gmail connectors), and no skills.
B3_ISOLATION=(--tools "" --strict-mcp-config --disable-slash-commands)

if [[ "${1:-}" == "followup" ]]; then
    id="$2"; prompt="$3"
    read -r session sandbox < "$LOGS/$id.session"
    n=1; while [[ -e "$LOGS/$id.followup$n.jsonl" ]]; do n=$((n + 1)); done
    extra=(--permission-mode default)
    [[ "$id" == B3_* ]] && extra+=("${B3_ISOLATION[@]}")
    cd "$sandbox"
    run_claude "$id.followup$n" "$prompt" --resume "$session" "${extra[@]}"
    exit 0
fi

id="${1:?usage: run-agent.sh <A_prog|B_prog|B3_lastZero> | followup <id> <prompt>}"
promptFile="$ROOT/prompts/$id.txt"
[[ -f "$promptFile" ]] || { echo "No prompt file $promptFile (run: node scripts/make-prompts.js)"; exit 1; }
kind="${id%%_*}"; prog="${id#*_}"

sandbox="$(mktemp -d -t "hw1-$id-XXXX")"
mkdir -p "$sandbox/test"
case "$kind" in
    A)  cp "$ROOT/prompts/sandbox-src/$prog.js" "$sandbox/hw1.js"
        extra=(--permission-mode acceptEdits --allowedTools "Bash(node:*)") ;;
    B)  extra=(--permission-mode acceptEdits) ;;
    B3) extra=(--permission-mode default "${B3_ISOLATION[@]}") ;;
    *)  echo "Unknown prompt kind: $kind"; exit 1 ;;
esac

echo "Sandbox: $sandbox"
cd "$sandbox"
run_claude "$id" "$(cat "$promptFile")" "${extra[@]}"
node -e 'for (const l of require("fs").readFileSync(process.argv[1], "utf8").split("\n"))
    { try { const e = JSON.parse(l); if (e.type === "system" && e.session_id) { console.log(e.session_id); break; } } catch {} }' \
    "$LOGS/$id.jsonl" | { read -r sid; echo "$sid $sandbox" > "$LOGS/$id.session"; }

if [[ "$kind" == A || "$kind" == B ]]; then
    target="$ROOT/test/prompt${kind}_$prog.test.js"
    mapfile -t made < <(find "$sandbox" -name '*.test.js' -not -path '*/node_modules/*')
    if [[ ${#made[@]} -eq 1 ]]; then
        cp "${made[0]}" "$target"
        echo "Saved test file unchanged as test/$(basename "$target")"
    else
        echo "WARNING: expected 1 test file, found ${#made[@]} in $sandbox: ${made[*]:-none}. Copy it manually."
    fi
fi
