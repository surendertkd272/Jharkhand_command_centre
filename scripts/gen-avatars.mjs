// Regenerate athlete profile avatars into /public/avatars/<slug>.svg
// Usage: node scripts/gen-avatars.mjs   (deps: @dicebear/core, @dicebear/collection)
//
// Avatars are self-contained illustrated portraits (NOT photos of real people)
// with Indian-appropriate skin tones and gender-aware hair, seeded by name so
// each athlete is stable across the app. The <Avatar> component loads these by
// name-slug and falls back to a tinted initials monogram if a file is missing.
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const src = readFileSync("lib/mock/athletes.ts", "utf8");
const re =
  /name:\s*"([^"]+)",\s*age:\s*\d+,\s*ageVerified:\s*(?:true|false),\s*gender:\s*"([MF])"/g;
const roster = [];
let m;
while ((m = re.exec(src)) !== null) roster.push({ name: m[1], gender: m[2] });
roster.push({ name: "Rajesh Sharma", gender: "M" }); // on-duty director

const topEnum =
  avataaars.schema?.properties?.top?.items?.enum ??
  avataaars.schema?.properties?.top?.enum ??
  [];
const femaleRe =
  /long|bob|bun|curvy|frida|hijab|bigHair|fro$|dreads|shaggy|straight|miaWallace|curly/i;
const femaleTops = topEnum.filter((t) => femaleRe.test(t));
const maleTops = topEnum.filter(
  (t) => !femaleRe.test(t) && !/hat|turban|hijab|winterHat/i.test(t),
);

const SKIN = ["edb98a", "d08b5b", "ae5d29", "fd9841"]; // Indian skin-tone range
const BG = ["dbeafe", "e3f8e8", "ffeedd", "efeafe", "e6f0ff"];

mkdirSync("public/avatars", { recursive: true });
let count = 0;
for (const r of roster) {
  const svg = createAvatar(avataaars, {
    seed: r.name,
    skinColor: SKIN,
    backgroundColor: BG,
    radius: 50,
    top: r.gender === "F" ? femaleTops : maleTops,
    facialHairProbability: r.gender === "M" ? 30 : 0,
  }).toString();
  writeFileSync(`public/avatars/${slug(r.name)}.svg`, svg);
  count++;
}
console.log(`generated ${count} avatars into public/avatars/`);
