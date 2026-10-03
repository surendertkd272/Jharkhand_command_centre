# State Sports Command Center — Demo Video Brief (for Higgsfield)

## What this video needs to do

Show one thing: **a real problem in Jharkhand's sports administration, and how this dashboard catches it before it becomes a loss.** Not a feature tour. Not a tech demo. No mention of frameworks, databases, APIs, or "how it's built" — only what breaks today, and what the Director sees instead once this is running.

- **Audience:** Department of Sports officials, Government of Jharkhand; state-level decision makers considering a pilot.
- **Length:** ~90–110 seconds. Short enough to hold a Director's attention in one sitting.
- **Tone:** Confident, human, a little urgent — not a corporate feature reel. Think "a story about one athlete," not "a walkthrough of nine modules."
- **Language:** English narration. (Flag to re-cut a Hindi voiceover pass later if the department asks.)
- **Golden rule:** every scene should answer "what problem does this stop," never "what does this screen do."

## The one-sentence story

*A promising athlete's scholarship almost went to a duplicate registration, and nobody in the department would have known — until the day Jharkhand could finally see everything, on one screen.*

## The persona (fictional — say so on screen or in narration)

Use one composite athlete throughout so the video follows a person, not a product. Suggested name: **"Sunita, 16, a track athlete at a district academy."** Make clear in the brief to your video model that Sunita is an **illustrative composite, not a real athlete** — don't imply this is a real case file.

---

## Scene-by-scene script

Each block is one shot/clip. Feed these to Higgsfield as separate generation prompts, in order.

### Scene 1 — The Hook (0:00–0:08)
**Visual:** A Prime Minister's Office / PIB-style photograph or archival clip of Narendra Modi at a sports event, or a simple bold title card if no footage is licensed for use. On-screen text fades in: **"2036 OLYMPICS"**
**Voiceover:** "Bharat wants to host the 2036 Olympics. The Prime Minister has said it plainly: we have to start preparing athletes now."
**On-screen text:** 2036 OLYMPICS BID

### Scene 2 — The Problem, Cold Open (0:08–0:22)
**Visual:** A district sports academy in Jharkhand — a coach filling a paper register by hand, a stack of physical files, a young athlete training in the background. Warm but slightly dim lighting — this world runs on paper.
**Voiceover:** "Meet Sunita — sixteen, a track athlete at a district academy in Jharkhand. Her registration, her medical file, her scholarship, her training records — spread across five different offices. Nobody sees all of it. Not her coach. Not the district officer. Not even the Director, two hundred kilometers away in Ranchi."
**On-screen text (small, corner):** Illustrative example

### Scene 3 — The Stakes (0:22–0:34)
**Visual:** Four quick cuts (2–3 seconds each): a form being duplicated/stamped twice; a warehouse shelf with fewer boxes than the paper manifest says; a fund-release signature with no one double-checking it; an empty chair where an athlete used to sit at practice.
**Voiceover:** "Somewhere in that gap: a duplicate registration quietly drawing a scholarship meant for someone else. A kit shipment that never fully arrives. A fund release nobody double-checks. And an athlete who stops showing up — until it's too late to bring her back."
**On-screen text:** none — let the visuals carry it.

### Scene 4 — The Turn (0:34–0:44)
**Visual:** Hard cut to a clean, glowing dashboard. The Jharkhand state map lights up district by district as it loads.
**Voiceover:** "This is the State Sports Command Center — one dashboard for the Department of Sports, Government of Jharkhand. Every academy. Every athlete. Every rupee. On one screen."
**On-screen text:** STATE SPORTS COMMAND CENTER · GOVERNMENT OF JHARKHAND
**Screen to record:** `/` (Command Overview) — full dashboard load, map animating in.

### Scene 5 — Catching the Duplicate (0:44–0:56)
**Visual:** Screen recording — the identity verification queue, then the evaluator scatter chart.
**Voiceover:** "Every athlete's identity is sealed once, through DigiLocker. So when someone tries to register Sunita twice, under two names, it doesn't slip through anymore — it shows up as a flag, the same day."
**On-screen text:** Duplicate flagged, in real time
**Screen to record:** `/integrity` — Verified/Pending/Flagged tiles, then the de-biasing scatter chart.

### Scene 6 — Following the Money and the Kit (0:56–1:08)
**Visual:** Screen recording — chain-of-custody funnel, then the DBT ledger.
**Voiceover:** "Every kit, every ration, is tracked from the state warehouse to the athlete's own hands. And every scholarship transfer moves to Sunita's bank account, tracked transfer by transfer — not through a spreadsheet with no audit trail."
**On-screen text:** Warehouse → Academy → Athlete
**Screens to record:** `/resources` (custody funnel), `/finance` (DBT ledger).

### Scene 7 — Catching Her Before She Leaves (1:08–1:22)
**Visual:** Screen recording — the at-risk athlete queue, then a quick cut to her injury/medical timeline and recovery score on her profile.
**Voiceover:** "And when Sunita's attendance quietly starts slipping — weeks before she'd normally just disappear — the Director already sees it. Her medical history and her training load are sitting right there, on the same page."
**On-screen text:** Flagged weeks before the exit — not after.
**Screens to record:** `/welfare` (at-risk queue), `/athletes/[id]` (injury timeline + recovery score).

### Scene 8 — One Feed, One Login (1:22–1:32)
**Visual:** Screen recording — the unified alerts feed, severity tags visible, then a pull-back to the full Command Overview.
**Voiceover:** "Every one of those flags — fraud, funding, welfare — lands in one feed. One login. One morning briefing for a whole state, not five separate ones."
**On-screen text:** One dashboard. Every pillar.
**Screens to record:** `/alerts`, then back to `/` (Command Overview).

### Scene 9 — The Outcome (1:32–1:42)
**Visual:** Split screen — Sunita training, smiling, unaware anything was ever at risk / the Director calmly reviewing the dashboard over morning tea.
**Voiceover:** "Sunita keeps her scholarship. The state keeps its money honest. And Jharkhand keeps its next Olympic hopeful in the system — not lost in one."

### Scene 10 — Closing (1:42–1:52)
**Visual:** Return to a still frame of the Modi quote card, then a clean closing title card with the Command Center wordmark.
**Voiceover:** "If Bharat is serious about 2036, it has to be serious about knowing where every rupee, every athlete, and every academy stands — today, not at audit time. The State Sports Command Center. Built for Jharkhand. Built for Bharat's Olympic future."
**On-screen text:** STATE SPORTS COMMAND CENTER — Department of Sports, Government of Jharkhand · [contact/portal placeholder]

---

## Screens to capture (for the editor, all in one pass)

Record these at 1600×1000 or higher, in this order, before cutting the video:

1. `/` — Command Overview: full load, map animating in, KPI row visible
2. `/integrity` — identity queue tiles + evaluator scatter chart
3. `/resources` — chain-of-custody funnel
4. `/finance` — DBT ledger table
5. `/welfare` — at-risk athlete queue
6. `/athletes/[id]` — injury & clearance timeline + recovery score (pick one demo athlete and reuse them as "Sunita" throughout for consistency)
7. `/alerts` — unified feed with a mix of severities visible

## Numbers you're allowed to show on screen

Only use these — all from the working demo dataset, and label anything that isn't a live/confirmed number as **"illustrative"** in small type if it appears on screen:

- 28 academies + 12 PECs = 40 facilities (illustrative)
- ₹18.4 Cr tracked through DBT, FY 2025–26 (illustrative)
- 14 open alerts, 3 of them critical — one each for fraud, funding and welfare (illustrative)
- 9 oversight pillars, one login

## What to avoid

- No tech talk: don't mention frameworks, databases, "the backend," APIs, or anything an engineer would care about and a Director wouldn't.
- No real athlete's name, photo, or identity — Sunita is a composite, and the video should not imply otherwise.
- No fabricated real officials, quotes, or events beyond the one sourced Modi quote above (verified from a public news post — don't invent additional quotes attributed to real people).
- Don't cram in all nine pillars — this script deliberately shows four (Identity, Resources/Finance, Welfare, Alerts) through one athlete's story. Depth beats breadth in 90 seconds.
