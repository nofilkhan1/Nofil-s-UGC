import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["app", "components", "lib"];
const files = [];
for (const root of roots) walk(root);

function walk(path) {
  for (const entry of readdirSync(path)) {
    const full = join(path, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx?|css)$/.test(entry)) files.push(full);
  }
}

const source = files.map((file) => `${file}\n${readFileSync(file, "utf8")}`).join("\n");
const failures = [];

if (/(?:window\.)?(?:alert|confirm|prompt)\s*\(/.test(source)) failures.push("Native browser dialog call found.");
if (/<(?:div|span|p|section)[^>]*onClick/.test(source)) failures.push("Clickable non-semantic element found.");
if (/<form(?![^>]*noValidate)[^>]*>/.test(source)) failures.push("Product form without noValidate found.");
if (/<textarea[^>]*className=(?![^>]*(?:textarea|resize))/.test(source)) failures.push("Textarea bypasses shared resize-none owner.");

const globals = readFileSync("app/globals.css", "utf8");
if (!globals.includes("scrollbar-color") || !globals.includes("::-webkit-scrollbar")) failures.push("Global cross-engine scrollbar contract is incomplete.");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`UI contract checks passed across ${files.length} source files.`);
