// The Long Roast: Lawmakers and the File They Cannot Convert
// Entry generator — writes one satirical sentence to output/entry.txt.
//
// Why this line works (reasoning, before a single byte is written):
// The brief wants bite + aim + freshness, judged pairwise by a model.
// - AIM: the target is precise — lawmakers who regulate AI yet cannot
//   do the most basic digital task (Word -> PDF). No named politician,
//   so the roast lands on the institution, not a person.
// - BITE: the contrast is the joke. "400-page bill" vs "one file
//   conversion" — the bigger the claimed competence, the funnier the
//   tiny failure. Scale mismatch is the oldest roast mechanic.
// - FRESHNESS: the punchline escalates in threes (staffer, tutorial,
//   prayer) — the third item breaks the pattern by invoking divine
//   intervention for a two-click task, which is where the laugh lives.
// - One sentence only, well under the 320-character cap, no profanity,
//   no cliche ("old people bad at computers" is implied, never said).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry line. Single satirical sentence, <= 320 characters.
const ENTRY =
  "They can draft a 400-page bill to regulate artificial intelligence, but ask them to turn a Word document into a PDF and suddenly the future of technology needs a staffer, a tutorial, and a prayer.";

// --- Validation rules (from the bounty brief) ---------------------------
// The brief caps the entry at 320 characters. Count in code points
// (spread into an array) rather than UTF-16 units so any future
// non-ASCII character is measured the way the judge counts it.
// A trailing newline is allowed in the file but is NOT part of the
// entry — the entry itself must be exactly one sentence, non-empty,
// and not only whitespace.
const MAX_CHARS = 320;

function validate(line: string): string[] {
  const problems: string[] = [];
  if (line.trim().length === 0) problems.push("entry is empty or only whitespace");
  if ([...line].length > MAX_CHARS)
    problems.push(`entry is ${[...line].length} characters, over the ${MAX_CHARS} limit`);
  if (line.includes("\n")) problems.push("entry must be a single sentence on one line");
  if (!/[.!?]$/.test(line.trim())) problems.push("entry must end with terminal punctuation");
  return problems;
}

// --- Output location -----------------------------------------------------
// MAKEFUN_OUTPUT_DIR is honoured when set (the harness sets it);
// default to ./output next to this script.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "./output";
const outPath = join(outDir, "entry.txt");

// --- Write, read back, verify --------------------------------------------
// Write the entry plus one trailing newline (conventional text-file
// ending; the newline is not part of the entry). Then read the file
// back and check it is byte-identical to what we intended — a
// truncated or mangled write must fail loudly, never silently ship.
const problems = validate(ENTRY);
if (problems.length > 0) {
  for (const p of problems) console.error(`FAIL: ${p}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY + "\n", "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY + "\n") {
  console.error("FAIL: entry.txt is not byte-identical to the intended entry");
  process.exit(1);
}
const readBackProblems = validate(roundTrip.replace(/\n$/, ""));
if (readBackProblems.length > 0) {
  for (const p of readBackProblems) console.error(`FAIL (read-back): ${p}`);
  process.exit(1);
}

console.log(`OK: wrote ${outPath}`);
console.log(`OK: ${[...ENTRY].length} characters (limit ${MAX_CHARS}), single sentence`);
console.log(`ENTRY: ${ENTRY}`);
