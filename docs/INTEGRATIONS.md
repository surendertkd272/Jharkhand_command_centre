# Physiological-monitoring integrations — Firstbeat & Myoact

The command center surfaces athlete **load, recovery, HRV and muscle
asymmetry** captured by third-party sports-science systems. This document
covers how it's wired, what to ask the vendors, and how to go live.

## How it works (architecture)

```
Firstbeat Cloud ─┐   lib/integrations/firstbeat.ts ─┐
                 │                                    ├─► index.ts ─► UI
Myoact system  ──┘   lib/integrations/myoact.ts   ───┘  (merge +      (/monitoring,
                                                          derive risk)  athlete profile)
```

- **The UI only imports from `lib/integrations`** — never a vendor SDK or raw
  payload. Everything is normalized to the model in `types.ts`
  (`AthletePhysiology`, `FleetPhysiology`).
- Each vendor has **one adapter file**. It has a DEMO branch (deterministic
  sample data, used now) and a REAL branch (a `fetch()` stub, commented, ready
  to fill in). Swapping a source to live is a **single-file change**.
- Data is fetched in **server components** (`app/monitoring/page.tsx`,
  `app/athletes/[id]/page.tsx`) so credentials never reach the browser.
- Injury-risk / readiness / flags are **derived centrally** in `index.ts` from
  ACWR, recovery, HRV and L/R asymmetry — consistent everywhere.

## Demo vs live

| Env set? | Behaviour |
|---|---|
| `FIRSTBEAT_API_BASE` / `MYOACT_API_BASE` unset | **Demo** — adapters return sample data |
| set | **Live** — adapter calls the vendor (once the REAL branch is implemented) |

Copy `.env.example` → `.env.local` to configure.

## What to ask each vendor (before writing the live branch)

1. **Is there an API**, or only manual export (CSV / FIT / PDF)?
2. **How to get access** — partner/developer program? What credentials
   (API key, OAuth2 client id/secret, mTLS)?
3. **Auth** method + token lifetime / refresh.
4. **Data + granularity** — which metrics, per athlete + per session; raw
   (beat-to-beat RR, raw EMG) vs aggregated (daily load, recovery, muscle load)?
5. **API docs + a sandbox** to develop against.
6. **Pull or push** — poll endpoints, or webhooks / streaming?
7. **Historical backfill** depth; **rate limits**.
8. **Athlete identifiers** — the id they key on, so we can map to our roster
   (see `firstbeatExternalId()` / `myoactExternalId()`).
9. **Data ownership, consent & compliance** — critical for a government system:
   who owns the data, can it be exported into a state platform, is it **DPDP
   Act** (and GDPR, if relevant) compliant? Get it in writing.

### Vendor notes
- **Firstbeat** is owned by Garmin. Product: **Firstbeat Sports** (HRV,
  training load/TRIMP, EPOC, recovery, ACWR). Programmatic access usually via
  **Firstbeat Sports Cloud export** and/or the **Garmin Health API partner
  program** — likely a partner agreement, not self-serve. Ask for
  "Firstbeat Sports API / data export access".
- **Myoact** — EMG muscle-activity monitoring. Confirm exact product/API;
  many EMG systems are session-export (CSV) first, API second.

## Going live (per vendor)

1. Get access + credentials; set the env vars in `.env.example`.
2. Open the adapter (`lib/integrations/firstbeat.ts` or `myoact.ts`).
3. Implement auth (`getAccessToken()` for Firstbeat OAuth2) and replace the
   `throw` in the REAL branch with the real `fetch()` + a `normalize…()` that
   maps the payload onto `LoadRecovery` / `MuscleActivity`.
4. Map athlete ids in `…ExternalId()`.
5. For fresh data, switch the pages from static to revalidated/dynamic
   (`export const revalidate = 900`) or add a scheduled sync into a datastore.

That's the whole surface — the model, UI, risk logic and screens stay unchanged.
