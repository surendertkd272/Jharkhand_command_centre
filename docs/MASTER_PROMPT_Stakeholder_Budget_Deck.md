# Master Prompt — Fluff-Free Stakeholder Budget Deck

Reusable prompt for generating the same kind of deck built for the State Control
Command Center: a short, honest, bottom-up-costed slide brief for any project.
Copy the block below into a fresh chat, fill in every `[bracket]`, delete this
header, and send it.

**What made the original work, in one line:** every number traces to either real
research or a named assumption, every table sums to the exact stated total, and
every contingency line has a specific reason — not a round percentage.

---

## THE PROMPT (copy from here down)

Act as a presentation strategist and financial analyst. Build a fluff-free
stakeholder slide brief for a project called **[PROJECT NAME]** —
**[ONE-SENTENCE DESCRIPTION OF WHAT IT DOES AND FOR WHOM]**. The audience is
**[STAKEHOLDER / GOVERNING BODY, e.g. "a state government department" / "our board"]**
and they do not want a long or generic presentation — get to the point.

Deliver it as a single self-contained HTML artifact: **[2 or 3]** slides, each
one full 16:9 board, printable to PDF (A4 landscape, one slide per page). Use
tasteful, considered design — real typography, a real color system, tabular
numerals for every figure — not a generic template. [Either: "Reuse the visual
identity from `[link/name of prior deck]`, adapted where needed" **or** "Design
a fresh visual identity grounded in this project's own subject matter — don't
default to a generic look."]

### Slide 1 — Overview
- **Definition:** 1–2 plain-English sentences on what this is and its core function.
- **Scope tiles:** 3–5 hard numbers that size the project — [e.g. districts /
  users / facilities / branches covered]. **Research these if you don't have
  them from me — don't invent round numbers.**
- **Rollout:** a real phased timeline (quarters, months, or milestones — pick
  what fits), each phase a concrete deliverable, not a vague label.
- **Outcomes:** 3–5 bullets on what changes because this exists — stated as
  capability, not feature ("real-time view of X," not "has a dashboard").

### Slide 2 — Year-1 financials
Total budget: **[₹/$ AMOUNT, or "an amount you propose and justify" if not fixed]**.

Build this **bottom-up, not top-down**:
1. **Research real market rates first.** For any team, salary, or vendor cost,
   search for current rates in **[REGION/COUNTRY]** for **[SECTOR — e.g.
   "government IT," "enterprise SaaS," "construction"]** before pricing
   anything. Cite what you found and where. Never invent a number that looks
   plausible — verify it.
2. **Cost every team as headcount × rate × duration**, shown as a real roster
   (named roles, counts, monthly rate, annual cost) — not a lump percentage of
   the budget. If a role's rate seems high or low, say why relative to the
   market band you found.
3. If a target total is given and your bottom-up build lands under it, **do
   not inflate existing line items to close the gap.** Either (a) add genuinely
   useful, named scope items (state exactly what they are and why they belong)
   until the total is honestly reached, or (b) present the lower bottom-up
   number as the real minimum and flag the gap explicitly — let the person
   choose, don't hide the choice from them.
4. **Every table must sum to its stated total exactly.** Compute it with a
   script, not by hand, and re-verify before presenting. If a total doesn't
   reconcile, fix the inputs, not the total.
5. **Contingency needs a named reason.** "For unforeseen costs" is not
   acceptable — say what the specific risk is (e.g., "three integrations with
   no track record," "a single-vendor hardware dependency") and size the
   contingency to that risk, not to a generic 10%.
6. If **field/operational staff** are part of this (people stationed anywhere,
   not just a dev team), cost them against **real statutory minimums and real
   employer costs** for the jurisdiction — minimum wage, statutory
   contributions (the local equivalent of EPF/ESIC/payroll tax), gratuity or
   severance accrual, and any allowance structure — not just a round monthly
   salary. Show what the employer actually pays versus what the employee
   actually takes home.

### Slide 3 — Year 2 onward (only if the project runs past Year 1)
- Split costs into **one-time (Year-1 capex)** — hardware, setup,
  certification, initial audits — versus **recurring (run-rate)** — hosting,
  a smaller maintenance team, ongoing compliance, salary escalation.
- If headcount or coverage **expands over time** (e.g., staffing more sites in
  later years), model each hiring cohort on **its own clock**: a person who
  joins in Year 3 starts at Year-3's entry cost and escalates from there — do
  not backdate their appraisal to Year 1.
- Apply the stated appraisal/escalation rate: **[X% per year for operational
  staff, Y% for a retained technical team]**. If a wage floor or statutory
  threshold exists in the jurisdiction, check year by year whether the
  escalation breaches any cap you set elsewhere in the plan, and say so
  plainly if it does.
- Two short callouts: **what disappears after Year 1** (capex that doesn't
  recur) and **what still grows every year** (salary escalation, usage-driven
  cost) — so a reader isn't surprised by Year-2 costs looking different in
  shape from Year 1, not just smaller.

### Close every deck with
2–3 explicit **"confirm before this goes to sanction"** points — the specific
judgment calls you made that are the stakeholder's call, not yours (a market
rate you estimated rather than sourced live, a policy choice like an appraisal
percentage, a scope boundary you drew). State them as decisions to ratify, not
buried caveats.

### Rigor checklist (apply silently, don't narrate this section)
- [ ] Every dollar/rupee figure traces to research, a script-verified
      calculation, or a labeled assumption — never a vibe.
- [ ] Every table's rows sum to its own stated total, checked by script.
- [ ] Every percentage (appraisal, contingency, statutory rate) has a stated
      reason, not just a number.
- [ ] Nothing is presented as fact that is actually an estimate — hedge
      explicitly where real.
- [ ] The design is legible printed on paper: check page count before calling
      it done; don't crush type below ~9px to force a page count.

---

## Fill-in checklist before sending

| Field | What to put there |
|---|---|
| `[PROJECT NAME]` | The thing's actual name |
| `[ONE-SENTENCE DESCRIPTION]` | What it does, for whom |
| `[STAKEHOLDER / GOVERNING BODY]` | Who's in the room |
| `[2 or 3]` slides | 2 if single-year, 3 if you need a run-rate slide |
| `[REGION/COUNTRY]`, `[SECTOR]` | Anchors the market-rate research |
| `[₹/$ AMOUNT]` | The fixed envelope, or say "propose one" |
| `[X% / Y%]` | Appraisal and escalation rates, if known |
| Visual identity | Reuse a prior deck's look, or ask for a fresh one |

## Worked example (what this produced the first time)

Project: **State Control Command Center**, Department of Sports, Government of
Jharkhand. Region/sector: India / government IT. Fixed envelope: ₹5.00 Cr
Year 1. Result: a 3-slide deck — scope & rollout, a ₹5 Cr build budget with a
real 15-person dev team benchmarked to India's ₹60,000–₹1,10,000/month
dedicated-team rate, and a Year 2–5 run-rate that phased field staffing from
15 to 40 people at a stated appraisal rate, with the ₹20,000 entry-wage cap
shown breaking in the exact year the math says it does. See
`Command-Center-Manpower-Costing.pdf` and the published two-slide-brief
artifact in this project for the reference output.
