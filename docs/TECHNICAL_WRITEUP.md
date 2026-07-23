# Technical Write-up — Firstbeat & Myoact Data Integration

**Prepared by:** Surender & Priyesh
**For:** Ms. Varnika — to arrange the required test files and a technical point-of-contact from Firstbeat and Myoact.
**Project:** State Sports Command Center — Department of Sports, Government of Jharkhand
**Date:** [DD-MM-YYYY]

---

## 1. Purpose

We are integrating athlete physiological-monitoring data into the **State Sports
Command Center** to strengthen **athlete welfare and injury prevention**:

- **Firstbeat** → heart-rate variability (HRV), training load, recovery, workload ratio
- **Myoact** → muscle load, left/right asymmetry, fatigue, muscle activation

To begin integration and **testing**, we need four things from each company. This
document specifies exactly what to request so the files they share are usable
on first pass.

---

## 2. What we need from each company (for the testing phase)

| # | Item | Why |
|---|------|-----|
| A | **Sample/test data export files** — anonymised, for ~5–10 athletes over ~14 days | Lets us build and validate our data parser before live API access |
| B | **Sandbox / test API access + credentials** (if an API exists) | To test live retrieval end-to-end |
| C | **API documentation / data dictionary** | Field definitions, units, endpoints, auth |
| D | **A dedicated technical contact (engineer)** from each company | Kick-off call + integration Q&A |

> For the first milestone, item **A (sample files)** is the priority — we can
> build and demonstrate the full pipeline from static files while API access is
> being arranged.

---

## 3. Data we require from **Firstbeat** (per athlete, per day/session)

| Field | Unit / type | Example |
|---|---|---|
| Athlete ID (Firstbeat's own) | string | `FB-10293` |
| Session / date | ISO date-time | `2026-06-27T17:30:00+05:30` |
| Training load (TRIMP) | number | `62` |
| Weekly load (rolling 7-day) | number | `410` |
| Acute:Chronic Workload Ratio (ACWR) | decimal | `1.24` |
| HRV (rMSSD) | milliseconds | `58` |
| Recovery score | 0–100 | `74` |
| Resting heart rate | bpm | `52` |

**Preferred format:** JSON or CSV (FIT also acceptable). Example JSON per record:

```json
{
  "athleteId": "FB-10293",
  "date": "2026-06-27T17:30:00+05:30",
  "trainingLoad": 62,
  "weeklyLoad": 410,
  "acwr": 1.24,
  "hrvRmssd": 58,
  "recoveryScore": 74,
  "restingHr": 52
}
```

---

## 4. Data we require from **Myoact** (per athlete, per session)

| Field | Unit / type | Example |
|---|---|---|
| Athlete ID (Myoact's own) | string | `MYO-4471` |
| Session / date | ISO date-time | `2026-06-27T18:00:00+05:30` |
| Overall muscle load | 0–100 | `68` |
| Left/right asymmetry | % | `12` |
| Fatigue index | 0–100 | `55` |
| Per-muscle activation (L & R) | % per group | quads, hamstrings, glutes, calves, core |

**Preferred format:** JSON or CSV. Example JSON per record:

```json
{
  "athleteId": "MYO-4471",
  "date": "2026-06-27T18:00:00+05:30",
  "muscleLoad": 68,
  "asymmetryPct": 12,
  "fatigueIndex": 55,
  "muscleGroups": [
    { "group": "Quadriceps", "left": 72, "right": 60 },
    { "group": "Hamstrings", "left": 65, "right": 63 }
  ]
}
```

---

## 5. Athlete identifier mapping

Please ask each company for the **unique athlete identifier** their system uses
(and, ideally, a name / roster reference). We need it to map their records to
our athlete roster. A simple two-column list (their ID → athlete name) alongside
the sample files is sufficient.

---

## 6. Transport & authentication (for the live phase, after testing)

For each vendor, please confirm:
- API type (REST / other) and **authentication** (OAuth 2.0, API key, etc.)
- **Pull** (we poll endpoints) vs **push** (webhooks / streaming), and recommended sync frequency
- Rate limits and historical-backfill depth

---

## 7. Data protection & compliance

- Test files should be **anonymised / pseudonymised** (no personal identifiers).
- Please confirm **data ownership**, the **athlete-consent** model, and that data
  can be exported into a **Government of Jharkhand** platform, in compliance with
  India's **Digital Personal Data Protection (DPDP) Act** (and GDPR if applicable),
  including any data-residency requirements.

---

## 8. What we will do with the files (testing plan)

1. Parse the sample files and map them onto our normalised data model.
2. Validate field coverage, units and edge cases; flag any gaps back to the vendor.
3. Connect to the sandbox API and reproduce the same output live.
4. Move to a scheduled production sync into the command center.

Our integration layer is already built to a **vendor-neutral model**, so once the
sample data matches the fields above, wiring each source in is a small, isolated
change.

---

## 9. Requested from Ms. Varnika

Please arrange, from **Firstbeat** and **Myoact** respectively:
1. The **sample/test data files** (Sections 3 & 4),
2. **Sandbox API access + documentation** (Sections 2 & 6),
3. The **athlete-ID mapping** (Section 5), and
4. A **dedicated technical contact** from each company for a kick-off call.

Happy to join a call with their technical teams to walk through this document.

**Regards,**
Surender & Priyesh
State Sports Command Center — Department of Sports, Government of Jharkhand
