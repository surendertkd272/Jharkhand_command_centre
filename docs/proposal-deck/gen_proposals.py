#!/usr/bin/env python3
"""Generate the State Control Command Center proposal decks (Karnataka, Tamil Nadu).

Structure and look follow the reference proposal (12 slides, 16:9): cover, challenge,
objectives, scope, app screen, features, two process flows, second app screen,
benefits, stakeholders, next steps.  One shared template, state-specific content.
"""
import html, sys, pathlib

BRAND = ""   # optional text wordmark for "prepared by"; empty = no branding shown
W, H = 1456, 819

FA = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
FONTS = ("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700"
         "&family=Lora:ital,wght@0,500;0,600;0,700;1,600&display=swap")

CSS = f"""
@page{{size:{W}px {H}px;margin:0}}
*{{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
html,body{{margin:0;padding:0;background:#fff}}
body{{font-family:'Lato',system-ui,sans-serif;color:#0b1120}}
.slide{{width:{W}px;height:{H}px;position:relative;overflow:hidden;background:#f4f7fb;
  break-after:page;page-break-after:always}}
.slide:last-child{{break-after:auto;page-break-after:auto}}
.dark{{background:linear-gradient(128deg,#03071a 0%,#071d52 38%,#0a45b8 70%,#0d6bf3 100%)}}
.serif{{font-family:'Lora',Georgia,serif}}

/* header / footer on content slides */
.eyebrow{{position:absolute;left:65px;top:56px;font-size:14.5px;font-weight:900;letter-spacing:.17em;
  text-transform:uppercase;color:#1a5fe0}}
.title{{position:absolute;left:65px;top:86px;margin:0;font-family:'Lora',serif;font-weight:700;
  font-size:41px;line-height:1.12;color:#0a0f1e;letter-spacing:-.005em}}
.badges{{position:absolute;right:50px;top:34px;display:flex;align-items:center;gap:10px}}
.wm{{font-weight:900;font-size:15px;letter-spacing:.3em;color:#1268ee}}
.tile-for{{background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(10,20,50,.14);
  padding:9px 14px;text-align:center;line-height:1.15}}
.tile-for b{{display:block;font-family:'Lora',serif;font-size:14px;color:#0a1a6b;letter-spacing:.02em}}
.tile-for span{{display:block;font-size:8.5px;font-weight:700;letter-spacing:.12em;color:#5b6b85;
  text-transform:uppercase;margin-top:2px}}
.foot{{position:absolute;left:65px;bottom:19px;font-size:13px;color:#8996ad}}
.pg{{position:absolute;right:66px;bottom:19px;font-size:13px;color:#8996ad}}

/* cards */
.card{{background:#fff;border:1px solid #e1e8f3;border-radius:15px;position:absolute}}
.ico{{width:78px;height:78px;border-radius:19px;background:#dbe8ff;color:#1266f1;
  display:grid;place-items:center;font-size:33px}}
.ico.pink{{background:#fde3e7}}
.ct{{font-family:'Lora',serif;font-weight:700;font-size:25px;color:#0a0f1e;line-height:1.2}}
.cd{{font-size:16.5px;line-height:1.5;color:#5d6d88}}

/* dark panels / stat tiles */
.dpanel{{position:absolute;background:#080c1a;border-radius:14px;color:#fff}}
.blue{{color:#1268ee}}
.sq{{width:15px;height:15px;border-radius:4px;background:#1268ee;flex:none}}

/* process flow */
.flowline{{position:absolute;left:198px;width:1060px;top:248px;height:4px;background:#e3e9f4;border-radius:2px}}
.circ{{position:absolute;top:200px;width:98px;height:98px;border-radius:50%;background:#080c1a;
  border:4px solid #1268ee;display:grid;place-items:center;font-family:'Lora',serif;font-weight:700;
  font-size:38px;color:#1268ee;transform:translateX(-50%)}}
.chev{{position:absolute;top:238px;font-size:17px;color:#98a4bd;transform:translateX(-50%)}}
.fl{{position:absolute;top:333px;width:262px;text-align:center;transform:translateX(-50%);
  font-family:'Lora',serif;font-weight:700;font-size:23px}}
.fd{{position:absolute;top:423px;width:238px;text-align:center;transform:translateX(-50%);
  font-size:15px;line-height:1.5;color:#5d6d88}}
.result{{position:absolute;left:65px;right:66px;top:596px;height:80px;border-radius:14px;background:#080c1a;
  display:flex;align-items:center;gap:22px;padding:0 26px;color:#fff}}
.result .rtag{{font-weight:900;font-size:13.5px;letter-spacing:.17em;color:#1268ee}}
.result .rtx{{font-style:italic;font-size:20.5px;color:#eef2fb}}

/* numbered points (app screen slides) */
.pt{{position:absolute;left:834px;width:556px}}
.pt .n{{position:absolute;left:-62px;top:28px;width:38px;height:38px;border-radius:50%;background:#1268ee;
  color:#fff;font-family:'Lora',serif;font-weight:700;font-size:18px;display:grid;place-items:center;
  box-shadow:0 0 0 4px #fff,0 3px 10px rgba(10,30,90,.25)}}
.pt h4{{margin:0;font-family:'Lora',serif;font-weight:700;font-size:25px;color:#0a0f1e}}
.pt p{{margin:12px 0 0;font-size:16px;line-height:1.5;color:#5d6d88}}

/* browser-frame mockup */
.frame{{position:absolute;left:64px;top:160px;width:688px;height:600px;border-radius:14px;background:#fff;
  box-shadow:0 18px 50px rgba(10,30,90,.20),0 0 0 1px #d9e2f1;overflow:hidden}}
.fbar{{height:38px;background:#0c1224;display:flex;align-items:center;gap:7px;padding:0 15px}}
.fbar i{{width:10px;height:10px;border-radius:50%;background:#33406a;display:block}}
.fbar span{{margin-left:14px;font-size:11.5px;font-weight:700;letter-spacing:.14em;color:#9fb0d6;
  text-transform:uppercase}}
.fbody{{padding:18px 20px;background:#f4f7fb;height:562px;position:relative}}
.ktiles{{display:grid;grid-template-columns:repeat(4,1fr);gap:11px}}
.kt{{background:#fff;border:1px solid #e1e8f3;border-radius:10px;padding:11px 12px}}
.kt b{{display:block;font-family:'Lora',serif;font-size:25px;color:#0a0f1e}}
.kt em{{display:block;font-style:normal;font-size:9.5px;font-weight:900;letter-spacing:.1em;color:#6f7e99;
  text-transform:uppercase;margin-top:3px;line-height:1.3}}
.kt .bars{{display:flex;gap:3px;align-items:flex-end;height:15px;margin-top:8px}}
.kt .bars s{{width:100%;background:#8fb4f7;border-radius:2px;display:block}}
.panel{{background:#fff;border:1px solid #e1e8f3;border-radius:10px;padding:13px 14px;margin-top:12px}}
.panel h5{{margin:0 0 8px;font-size:12.5px;font-weight:900;color:#0a0f1e}}
.panel h5 small{{font-weight:700;color:#1a5fe0;float:right;font-size:11px}}
.arow{{display:flex;align-items:center;gap:10px;padding:7px 0;border-top:1px solid #edf1f8;font-size:12px;color:#33405c}}
.arow:first-of-type{{border-top:0}}
.pill{{margin-left:auto;font-size:9.5px;font-weight:900;letter-spacing:.06em;padding:3px 8px;border-radius:99px;
  text-transform:uppercase;white-space:nowrap}}
.p-red{{background:#fde3e7;color:#c21f3a}} .p-blue{{background:#dbe8ff;color:#1453c8}}
.p-green{{background:#d9f3e4;color:#157a43}} .p-amber{{background:#fdf0d2;color:#9a6408}}
.dot{{width:22px;height:22px;border-radius:50%;background:#dbe8ff;color:#1453c8;font-size:9px;font-weight:900;
  display:grid;place-items:center;flex:none}}
.sample{{position:absolute;right:14px;bottom:10px;font-size:10px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;color:#8a97af}}
.steps{{display:flex;gap:0;align-items:flex-start;margin-top:4px}}
.stp{{flex:1;text-align:center;position:relative;font-size:10.5px;font-weight:700;color:#5d6d88;line-height:1.3}}
.stp i{{display:block;margin:0 auto 6px;width:26px;height:26px;border-radius:50%;background:#e4ebf7;color:#6f7e99;
  font-style:normal;font-size:11px;font-weight:900;display:grid;place-items:center}}
.stp.done i{{background:#1268ee;color:#fff}} .stp.done{{color:#0a0f1e}}
.stp.warn i{{background:#c21f3a;color:#fff}} .stp.warn{{color:#c21f3a}}
.stp:not(:last-child)::after{{content:"";position:absolute;top:13px;left:calc(50% + 15px);right:calc(-50% + 15px);
  height:2px;background:#d4ddee}}
.stp.done:not(:last-child)::after{{background:#1268ee}}
svg.area{{width:100%;height:92px;display:block}}

/* cover / closing */
.track{{position:absolute;right:-230px;bottom:-250px;width:980px;height:760px;opacity:.11}}
.cov-top{{position:absolute;left:76px;top:46px;right:76px;display:flex;justify-content:space-between;align-items:flex-start}}
.lbl{{font-size:11px;font-weight:900;letter-spacing:.22em;color:#9fb0d6;text-transform:uppercase}}
.cov-brand{{margin-top:14px;font-weight:900;font-size:27px;letter-spacing:.34em;color:#fff}}
.cov-for{{background:#fff;border-radius:16px;padding:17px 24px;text-align:center;min-width:148px;
  box-shadow:0 6px 20px rgba(0,0,20,.3)}}
.cov-logo{{background:#fff;border-radius:16px;padding:12px 18px}}
.cov-logo img{{display:block;height:118px;width:auto}}
.cov-for b{{display:block;font-family:'Lora',serif;font-size:21px;color:#0a1a6b;letter-spacing:.03em}}
.cov-for span{{display:block;font-size:10px;font-weight:900;letter-spacing:.13em;color:#5b6b85;text-transform:uppercase;margin-top:5px}}
.cov-eyebrow{{position:absolute;left:76px;top:292px;font-size:16px;font-weight:900;letter-spacing:.2em;
  text-transform:uppercase;color:#2f79f7}}
.cov-h{{position:absolute;left:76px;top:340px;margin:0;font-family:'Lora',serif;font-weight:700;font-size:66px;
  line-height:1.14;color:#fff}}
.cov-sub{{position:absolute;left:76px;top:517px;width:900px;font-size:19.5px;line-height:1.55;color:#cfe0fb}}
.cov-pill{{position:absolute;left:76px;top:604px;height:48px;border-radius:26px;background:#10193a;
  border:1.5px solid #1c5bd6;padding:0 30px;display:flex;align-items:center;font-weight:700;font-size:16.5px;color:#fff}}
.cov-foot{{position:absolute;left:76px;bottom:38px;font-size:14px;color:#8fa3cc}}
.nxt-h{{position:absolute;left:78px;top:236px;margin:0;font-family:'Lora',serif;font-weight:700;font-size:52px;color:#fff}}
.nxt-li{{position:absolute;left:78px;display:flex;align-items:center;gap:20px;font-size:20.5px;color:#eaf1ff}}
.nxt-li .sq{{width:20px;height:20px;border-radius:5px}}
"""

# --------------------------------------------------------------------------
# Content: shared structure, per-state wording
# --------------------------------------------------------------------------
STATES = {
  "karnataka": dict(
    file="Command-Center-Proposal-Karnataka-Bengaluru",
    short="KARNATAKA", shortsub="Youth Empowerment & Sports",
    coverfor="KARNATAKA", coverforsub="Bengaluru", logo="karnataka-emblem.png",
    body="Department of Youth Empowerment and Sports, Karnataka",
    hub="Bengaluru",
    cover_sub=("One verified record for every athlete, academy and rupee — identity checks, kit and diet "
               "reconciliation, funding compliance and athlete welfare on a single screen for Karnataka's "
               "sports programme."),
    cover_pill="Karnataka — Bengaluru command hub · 31 districts · 4 divisions",
    deck="Karnataka",
    challenge_title="Many schemes, one athlete — and no single view across them",
    challenge=[
      ("fa-folder-open", "", "No single athlete record",
       "Sports schools, hostels, district events, scholarships and cash incentives each hold part of an athlete's story."),
      ("fa-file-invoice-dollar", "pink", "Funds follow claims",
       "Releases rest on periodic returns — hard to verify facility by facility, and in time."),
      ("fa-boxes-stacked", "", "Leakage found late",
       "Kit, diet and stipend mismatches surface at audit, not at the point they occur."),
      ("fa-user-injured", "", "Welfare signals surface late",
       "Injuries, return-to-play decisions and dropouts are noticed after the season, not during it."),
    ],
    scope_kicker="KARNATAKA",
    scope_head="31 districts under one command screen",
    scope_list=["Bengaluru Division", "Mysuru Division", "Belagavi Division", "Kalaburagi Division"],
    scope_note="Command room in Bengaluru, linked to the Department of Youth Empowerment and Sports.",
    scope_points=[
      "In-scope: athlete records, identity checks, kit and diet tracking, funding compliance, welfare and injury clearance",
      "Every sports school, hostel and training centre, linked to its district sports officer",
      "Role-based access: athlete, centre executive, district officer, medical officer, state director",
      "Designed to work alongside existing state portals, DBT and DigiLocker",
      "Phased rollout: pilot centres first, then statewide standardisation",
    ],
    foot="Command Center — Karnataka",
    stake_hq="State Command, Bengaluru",
    stake_hq_desc="Sees the whole state on one screen, ranks districts and decides funding holds and releases.",
    next_pilot="Confirm pilot centres — at least one per division — for the first rollout phase",
    benefit_stat=("31", "DISTRICTS, ONE COMMAND SCREEN"),
    sample_kpis=None,
  ),
  "tamilnadu": dict(
    file="Command-Center-Proposal-Tamil-Nadu",
    short="TAMIL NADU", shortsub="Youth Welfare & Sports Dev.",
    coverfor="TAMIL NADU", coverforsub="Chennai", logo="tn-sdat-logo.png",
    body="Department of Youth Welfare and Sports Development, Tamil Nadu",
    hub="Chennai",
    cover_sub=("One verified record for every athlete, academy and rupee — identity checks, kit and diet "
               "reconciliation, funding compliance and athlete welfare on a single screen for Tamil Nadu's "
               "sports programme."),
    cover_pill="Tamil Nadu — Chennai command hub · 38 districts",
    deck="Tamil Nadu",
    challenge_title="Many schemes, one athlete — and no single view across them",
    challenge=[
      ("fa-folder-open", "", "No single athlete record",
       "Hostels, academies, centres of excellence and talent-development centres each hold part of an athlete's story."),
      ("fa-file-invoice-dollar", "pink", "Funds follow claims",
       "Releases rest on periodic returns — hard to verify facility by facility, and in time."),
      ("fa-boxes-stacked", "", "Leakage found late",
       "Kit, diet and stipend mismatches surface at audit, not at the point they occur."),
      ("fa-user-injured", "", "Welfare signals surface late",
       "Injuries, return-to-play decisions and dropouts are noticed after the season, not during it."),
    ],
    scope_kicker="TAMIL NADU",
    scope_head="38 districts, every programme, one command screen",
    scope_list=["Sports hostels", "Academies", "Centres of excellence", "Talent-development centres",
                "Joint sports development centres in colleges"],
    scope_note="Command room in Chennai, linked to the Sports Development Authority of Tamil Nadu (SDAT).",
    scope_points=[
      "In-scope: athlete records, identity checks, kit and diet tracking, funding compliance, welfare and injury clearance",
      "All 28 SDAT sports hostels and every academy and centre, linked to its district sports office",
      "Role-based access: athlete, centre executive, district sports officer, medical officer, SDAT head office",
      "Designed to work alongside existing state portals, DBT and DigiLocker",
      "Phased rollout: pilot centres first, then statewide standardisation",
    ],
    foot="Command Center — Tamil Nadu",
    stake_hq="SDAT Head Office, Chennai",
    stake_hq_desc="Sees every district on one screen, ranks programmes and decides funding holds and releases.",
    next_pilot="Confirm pilot centres — a hostel and an academy in each pilot district — for the first rollout phase",
    benefit_stat=("38", "DISTRICTS, ONE COMMAND SCREEN"),
    sample_kpis=None,
  ),
}

def esc(s): return html.escape(s, quote=True)

# ---------------------------------------------------------------- slide parts
def chrome(st, n, eyebrow, title):
    return f"""
    <div class="eyebrow">{esc(eyebrow)}</div>
    <h2 class="title">{esc(title)}</h2>
    <div class="badges">{('<span class="wm">' + BRAND + '</span>') if BRAND else ''}
      {bsv_small()}{logo_img(st, 48) or ('<div class="tile-for"><b>' + esc(st['short']) + '</b><span>' + esc(st['shortsub']) + '</span></div>')}</div>
    <div class="foot">{(BRAND.title() + " · ") if BRAND else ""}State Sports Control Command Center — {esc(st['deck'])}</div>
    <div class="pg">{n}</div>"""

def bg_logo():
    b = base64.b64encode(open(pathlib.Path(__file__).parent / "bsv-logo.png", "rb").read()).decode()
    return (f'<img src="data:image/png;base64,{b}" alt="" style="position:absolute;right:40px;bottom:30px;'
            f'width:620px;height:auto;opacity:.16;pointer-events:none">')

TRACK_SVG = """<svg class="track" viewBox="0 0 980 760" fill="none" stroke="#fff" stroke-width="3">
  <g transform="rotate(-14 490 380)">
    <rect x="40" y="110" width="900" height="540" rx="270"/>
    <rect x="95" y="160" width="790" height="440" rx="220"/>
    <rect x="150" y="210" width="680" height="340" rx="170"/>
    <rect x="205" y="260" width="570" height="240" rx="120"/>
    <rect x="260" y="310" width="460" height="140" rx="70"/>
    <line x1="490" y1="110" x2="490" y2="160"/>
  </g></svg>"""

import base64
def logo_img(st, h):
    if not st.get("logo"): return ""
    b = base64.b64encode(open(pathlib.Path(__file__).parent / st["logo"], "rb").read()).decode()
    return f'<img src="data:image/png;base64,{b}" alt="" style="height:{h}px;width:auto;display:block">'

def bsv_small():
    b = base64.b64encode(open(pathlib.Path(__file__).parent / "bsv-logo.png", "rb").read()).decode()
    return f'<img src="data:image/png;base64,{b}" alt="BSV" style="height:46px;width:auto;display:block">'

def brand_logo():
    b = base64.b64encode(open(pathlib.Path(__file__).parent / "bsv-logo.png", "rb").read()).decode()
    return f'<div><img src="data:image/png;base64,{b}" alt="BSV" style="display:block;height:118px;width:auto"></div>'

def cover_for(st):
    """Top-right 'Prepared for' tile: state emblem if st['logo'] is set, else text tile."""
    if st.get("logo"):
        b = base64.b64encode(open(pathlib.Path(__file__).parent / st["logo"], "rb").read()).decode()
        return f'<div class="cov-logo"><img src="data:image/png;base64,{b}" alt=""></div>'
    return (f'<div><div class="lbl" style="text-align:right;margin-bottom:10px">Prepared for</div>'
            f'<div class="cov-for"><b>{esc(st["coverfor"])}</b><span>{esc(st["coverforsub"])}</span></div></div>')

def s_cover(st):
    return f"""<section class="slide dark">{bg_logo()}
    <div class="cov-top">
      {('<div><div class="lbl">Prepared by</div><div class="cov-brand">' + BRAND + '</div></div>') if BRAND else brand_logo()}
      {cover_for(st)}
    </div>
    <div class="cov-eyebrow">Sports Governance &nbsp;·&nbsp; Project Proposal</div>
    <h1 class="cov-h">State Control<br>Command Center</h1>
    <div class="cov-sub">{esc(st['cover_sub'])}</div>
    <div class="cov-pill">{esc(st['cover_pill'])}</div>
    <div class="cov-foot">Prepared for the {esc(st['body'])}</div></section>"""

def s_challenge(st):
    pos = [(65,169),(704,169),(65,463),(704,463)]
    cards = ""
    for (icon, tone, t, d), (x, y) in zip(st['challenge'], pos):
        cards += f"""<div class="card" style="left:{x}px;top:{y}px;width:606px;height:256px;padding:35px 36px">
          <div class="ico {tone}"><i class="fa-solid {icon}"></i></div>
          <div class="ct" style="margin-top:36px">{esc(t)}</div>
          <div class="cd" style="margin-top:22px">{esc(d)}</div></div>"""
    return f"""<section class="slide">{chrome(st,2,'The challenge today',st['challenge_title'])}{cards}</section>"""

def s_objectives(st):
    items = [("fa-file-circle-check","One record, for life",
              "Give every athlete a single verified record that follows them across schemes, academies and postings."),
             ("fa-indian-rupee-sign","Funds follow compliance",
              "Release and hold money against a live compliance score, not a paper claim."),
             ("fa-map-location-dot","See the whole state, same day",
              "Every district and facility on one screen — today's picture, not last month's return."),
             ("fa-heart-pulse","Catch welfare risks early",
              "Flag injuries, overload and falling attendance while there is still time to act.")]
    cards = ""
    for i, (ic, t, d) in enumerate(items):
        x = 65 + i*339.5
        cards += f"""<div class="card" style="left:{x}px;top:229px;width:306px;height:425px;padding:30px 28px">
          <div class="ico"><i class="fa-solid {ic}"></i></div>
          <div style="height:1px;background:#dfe7f3;margin:46px 0 40px"></div>
          <div class="ct" style="font-size:24px">{esc(t)}</div>
          <div class="cd" style="margin-top:30px;font-size:16px">{esc(d)}</div></div>"""
    return f"""<section class="slide">{chrome(st,3,'Objectives','What the system sets out to do')}{cards}</section>"""

def s_scope(st):
    lis = "".join(f"""<div style="display:flex;align-items:center;gap:20px;font-size:19.5px;color:#e8eefb;margin-top:15px">
        <span style="width:11px;height:11px;border-radius:50%;background:#1268ee;flex:none"></span>{esc(x)}</div>"""
        for x in st['scope_list'])
    pts = ""
    for i, p in enumerate(st['scope_points']):
        y = 180 + i*115
        pts += f"""<div class="card" style="left:715px;top:{y}px;width:672px;height:88px;padding:0 30px;
            display:flex;align-items:center;gap:22px"><span class="sq"></span>
            <span style="font-size:16.5px;line-height:1.45;color:#0a0f1e">{esc(p)}</span></div>"""
    return f"""<section class="slide">{chrome(st,4,'Scope of coverage','Every facility in the state, one command screen')}
      <div class="dpanel" style="left:65px;top:169px;width:622px;height:514px;padding:42px 44px">
        <div style="font-size:14px;font-weight:900;letter-spacing:.18em;color:#1f6bf0">{esc(st['scope_kicker'])}</div>
        <div class="serif" style="font-weight:700;font-size:35px;line-height:1.22;margin-top:22px;width:540px">{esc(st['scope_head'])}</div>
        <div style="margin-top:10px">{lis}</div>
        <div style="margin-top:26px;padding-top:16px;border-top:1px solid #1d2a4d;font-style:italic;font-size:14.5px;line-height:1.45;color:#9fb0d6">{esc(st['scope_note'])}</div>
      </div>{pts}</section>"""

def pts_block(items):
    out = ""
    for i, (t, d) in enumerate(items):
        out += f"""<div class="pt" style="top:{158 + i*146}px"><div class="n">{i+1}</div>
          <h4>{esc(t)}</h4><p>{esc(d)}</p></div>"""
    return out

def s_app_overview(st):
    # sample weekly on-time filing trend (illustrative, not region-specific)
    vals = [61,63,66,68,72,76,79,83]
    x0,x1,y0,y1 = 14, 326, 78, 10
    xs = [x0 + i*(x1-x0)/7 for i in range(8)]
    ys = [y0 - (v-55)/(90-55)*(y0-y1) for v in vals]
    line = " ".join(f"{x:.1f},{y:.1f}" for x,y in zip(xs,ys))
    area = f"{xs[0]:.1f},{y0+8} {line} {xs[-1]:.1f},{y0+8}"
    chart = f"""<svg class="area" viewBox="0 0 340 100" preserveAspectRatio="none">
      <polygon points="{area}" fill="#1268ee" fill-opacity=".14"/>
      <polyline points="{line}" fill="none" stroke="#1268ee" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="{xs[-1]:.1f}" cy="{ys[-1]:.1f}" r="4.2" fill="#1268ee"/>
      <text x="{xs[-1]-4:.1f}" y="{ys[-1]-9:.1f}" text-anchor="end" font-size="11" font-weight="900" fill="#0a0f1e">83%</text>
      </svg>"""
    frame = f"""<div class="frame"><div class="fbar"><i></i><i></i><i></i><span>State command overview</span></div>
      <div class="fbody">
        <div class="ktiles">
          <div class="kt"><b>83%</b><em>Facilities filed on time</em><div class="bars"><s style="height:55%"></s><s style="height:62%"></s><s style="height:70%"></s><s style="height:80%"></s><s style="height:100%"></s></div></div>
          <div class="kt"><b>91%</b><em>Athletes identity-verified</em><div class="bars"><s style="height:70%"></s><s style="height:78%"></s><s style="height:84%"></s><s style="height:90%"></s><s style="height:100%"></s></div></div>
          <div class="kt"><b>6</b><em>Facilities below funding floor</em><div class="bars"><s style="height:100%;background:#f0a3ae"></s><s style="height:80%;background:#f0a3ae"></s><s style="height:70%;background:#f0a3ae"></s><s style="height:55%;background:#f0a3ae"></s><s style="height:45%;background:#f0a3ae"></s></div></div>
          <div class="kt"><b>14</b><em>Open alerts today</em><div class="bars"><s style="height:40%"></s><s style="height:65%"></s><s style="height:50%"></s><s style="height:85%"></s><s style="height:60%"></s></div></div>
        </div>
        <div class="panel"><h5>Weekly on-time filing <small>last 8 weeks</small></h5>{chart}</div>
        <div class="panel"><h5>Needs attention <small>View all</small></h5>
          <div class="arow"><span class="dot">ID</span>Possible duplicate registration — review queue<span class="pill p-red">Critical</span></div>
          <div class="arow"><span class="dot">KT</span>Kit received below dispatched count at a centre<span class="pill p-amber">High</span></div>
          <div class="arow"><span class="dot">FN</span>Funding on hold — filing below compliance floor<span class="pill p-blue">Hold</span></div>
          <div class="arow"><span class="dot">WL</span>Attendance falling for 3 athletes — welfare review<span class="pill p-green">New</span></div>
        </div>
        <div class="sample">Illustrative screen · sample data</div>
      </div></div>"""
    pts = pts_block([
      ("The whole state, one page", "Every district's facilities, compliance and alerts load together, the moment the Director logs in."),
      ("Compliance you can rank", "Facilities are scored on weekly filing — the bottom of the list is visible, not buried in a report."),
      ("Alerts in one feed", "Fraud, funding and welfare flags land together, tagged by severity, ready to action."),
      ("Drill down in a click", "From state to district to centre to a single athlete's record, on the same screen."),
    ])
    return f"""<section class="slide">{chrome(st,5,'App screen · Command dashboard','The command screen — the whole state, at a glance')}{frame}{pts}</section>"""

def s_features(st):
    f = [("fa-fingerprint","Verified athlete identity","Age and identity are sealed once, and duplicate registrations are flagged the same day."),
         ("fa-boxes-stacked","Kit & diet reconciliation","Kit and rations are tracked from warehouse to centre to athlete, billed against verified check-ins."),
         ("fa-scale-balanced","Funding on compliance","Releases are tied to a live compliance score; below the floor, money is held and the reason is on record."),
         ("fa-notes-medical","Injury clearance lock","No return to play without medical clearance — any override attempt is flagged."),
         ("fa-bell","Welfare & dropout alerts","Falling attendance and overload surface weeks before an athlete leaves the programme."),
         ("fa-trophy","Streaks & recognition","Centres and athletes earn badges for on-time filing and consistency, keeping data fresh.")]
    cards = ""
    for i, (ic, t, d) in enumerate(f):
        x = 65 + (i % 3)*452; y = 185 + (i // 3)*313
        cards += f"""<div class="card" style="left:{x}px;top:{y}px;width:423px;height:279px;padding:32px 29px">
          <div class="ico" style="width:70px;height:70px;font-size:29px"><i class="fa-solid {ic}"></i></div>
          <div class="ct" style="margin-top:38px;font-size:24px">{esc(t)}</div>
          <div class="cd" style="margin-top:22px;font-size:15.5px">{esc(d)}</div></div>"""
    return f"""<section class="slide">{chrome(st,6,'Key features','Built around one athlete, one record, for life')}{cards}</section>"""

def s_flow(st, n, title, steps, result):
    xs = [198 + i*265 for i in range(5)]
    body = '<div class="flowline"></div>'
    for i, (t, d) in enumerate(steps):
        body += f'<div class="circ" style="left:{xs[i]}px">{i+1}</div>'
        body += f'<div class="fl" style="left:{xs[i]}px">{esc(t)}</div>'
        body += f'<div class="fd" style="left:{xs[i]}px">{esc(d)}</div>'
        if i < 4:
            body += f'<div class="chev" style="left:{(xs[i]+xs[i+1])/2}px"><i class="fa-solid fa-angles-right"></i></div>'
    body += f"""<div class="result"><span class="sq" style="width:26px;height:26px;border-radius:7px"></span>
        <span class="rtag">RESULT</span><span class="rtx">{esc(result)}</span></div>"""
    return f"""<section class="slide">{chrome(st,n,'Process flow · What we will build',title)}{body}</section>"""

def s_app_welfare(st):
    frame = """<div class="frame"><div class="fbar"><i></i><i></i><i></i><span>Athlete welfare desk</span></div>
      <div class="fbody">
        <div class="ktiles" style="grid-template-columns:repeat(3,1fr)">
          <div class="kt"><b style="color:#c21f3a">14</b><em>Athletes at risk</em></div>
          <div class="kt"><b style="color:#1268ee">6</b><em>Clearances pending</em></div>
          <div class="kt"><b style="color:#157a43">1</b><em>Override attempt blocked</em></div>
        </div>
        <div class="panel"><h5>At-risk athletes <small>Sorted by risk</small></h5>
          <div class="arow"><span class="dot">A1</span>Athlete A-1042 · attendance 58% and falling<span class="pill p-red">High</span></div>
          <div class="arow"><span class="dot">A2</span>Athlete A-0877 · attendance 64% and falling<span class="pill p-amber">Medium</span></div>
          <div class="arow"><span class="dot">A3</span>Athlete A-0231 · 4 sessions missed this month<span class="pill p-amber">Medium</span></div>
          <div class="arow"><span class="dot">A4</span>Athlete A-0615 · load spike, recovery score low<span class="pill p-blue">Watch</span></div>
        </div>
        <div class="panel"><h5>Injury clearance — Athlete A-0877 <small>Sample record</small></h5>
          <div class="steps" style="margin-top:12px">
            <div class="stp done"><i>1</i>Injury reported</div>
            <div class="stp done"><i>2</i>Medical review</div>
            <div class="stp"><i>3</i>Cleared to train</div>
            <div class="stp"><i>4</i>Cleared to compete</div>
          </div>
          <div class="arow" style="margin-top:14px;border-top:1px solid #edf1f8"><span class="dot" style="background:#fde3e7;color:#c21f3a">!</span>Coach tried to re-activate without clearance — blocked and logged<span class="pill p-red">Blocked</span></div>
        </div>
        <div class="sample">Illustrative screen · sample data</div>
      </div></div>"""
    pts = pts_block([
      ("Early warning, not exit interview", "Falling attendance and overload are flagged while the athlete is still in the programme."),
      ("Clearance you can't skip", "An injured athlete cannot be re-activated without medical sign-off — the attempt itself is logged."),
      ("One page per athlete", "Attendance, injuries, load and recovery sit together, so a decision is made on the full picture."),
      ("Ready to act", "The medical officer and district officer see the queue each morning and close cases from the same screen."),
    ])
    return f"""<section class="slide">{chrome(st,9,'App screen · Welfare desk','The welfare desk — catch risk before it becomes a loss')}{frame}{pts}</section>"""

def s_benefits(st):
    big = [(st['benefit_stat'][0], st['benefit_stat'][1]),
           ("Same-day", "FACILITY DATA, NOT MONTH-END"),
           ("Auto", "COMPLIANCE SCORING & ALERTS"),
           ("1 record", "PER ATHLETE, FOR LIFE")]
    tiles = ""
    for i, (v, l) in enumerate(big):
        x = 65 + i*339.5
        tiles += f"""<div class="dpanel" style="left:{x}px;top:169px;width:306px;height:168px;padding:30px 28px">
          <div class="serif blue" style="font-weight:700;font-size:{52 if len(v)<7 else 46}px;line-height:1">{esc(v)}</div>
          <div style="position:absolute;left:28px;bottom:26px;font-size:13.5px;font-weight:900;letter-spacing:.1em;color:#d5dff3">{esc(l)}</div></div>"""
    cards = [("No duplicate registrations","Identity is sealed once, so one athlete cannot draw two scholarships."),
             ("Funding with a reason on record","Every hold and release traces to a compliance score anyone can audit."),
             ("Welfare caught early","Dropout and injury signals surface through routine data, not a crisis."),
             ("Less time on returns","Centres file once, weekly; the state stops chasing paper month-end reports.")]
    body = ""
    for i, (t, d) in enumerate(cards):
        x = 65 + (i % 2)*683; y = 374 + (i // 2)*158
        body += f"""<div class="card" style="left:{x}px;top:{y}px;width:640px;height:136px;padding:30px 32px">
          <div style="display:flex;align-items:center;gap:16px"><span class="sq"></span>
            <span class="ct" style="font-size:22px">{esc(t)}</span></div>
          <div class="cd" style="margin-top:20px;font-size:16px">{esc(d)}</div></div>"""
    return f"""<section class="slide">{chrome(st,10,'Benefits','What changes for athletes and for command')}{tiles}{body}</section>"""

def s_stakeholders(st):
    s = [("fa-person-running","Athletes","Sees their own record, stipend status and badges — one profile across schemes."),
         ("fa-clipboard-user","Centre Executive","Logs daily attendance, kit and ration receipts, and files the centre's weekly return."),
         ("fa-user-tie","District Sports Officer","Tracks district compliance, schedules inspections and clears escalations."),
         ("fa-stethoscope","Medical Officer","Records injuries, issues return-to-play clearance and follows up flagged athletes."),
         ("fa-building-columns",st['stake_hq'],st['stake_hq_desc'])]
    cards = ""
    for i, (ic, t, d) in enumerate(s):
        x = 65 + i*270
        cards += f"""<div class="card" style="left:{x}px;top:207px;width:245px;height:512px;padding:44px 22px;text-align:center">
          <div class="ico" style="margin:0 auto;width:82px;height:82px;font-size:34px;color:#0a0f1e"><i class="fa-solid {ic}"></i></div>
          <div class="ct" style="margin-top:46px;font-size:21px">{esc(t)}</div>
          <div class="cd" style="margin-top:86px;font-size:15px">{esc(d)}</div></div>"""
    return f"""<section class="slide">{chrome(st,11,'Stakeholders','Who uses the system, and how')}{cards}</section>"""

def s_next(st):
    items = [st['next_pilot'],
             "Digitise existing registers, rosters and scheme files where available",
             "Run a supervised pilot through one full funding cycle, then expand",
             "Hand over with training for centre executives, district officers and medical officers"]
    lis = "".join(f'<div class="nxt-li" style="top:{370+i*55}px"><span class="sq"></span>{esc(t)}</div>'
                  for i, t in enumerate(items))
    return f"""<section class="slide dark">{bg_logo()}
      <div class="cov-top">{('<div><div class="lbl">Prepared by</div><div class="cov-brand">' + BRAND + '</div></div>') if BRAND else brand_logo()}
        {cover_for(st)}</div>
      <h2 class="nxt-h">Next Steps</h2>{lis}
      <div style="position:absolute;left:76px;top:590px;border-top:1px solid rgba(255,255,255,.22);padding-top:18px;width:560px">
        <div class="lbl" style="margin-bottom:10px">Contact</div>
        <div style="font-family:'Lora',serif;font-weight:700;font-size:24px;color:#fff">Pranab Mukherjee</div>
        <div style="margin-top:8px;font-size:17px;color:#dbe6ff;line-height:1.6">+91 98181 85513<br>www.bharatsportsventure.com</div>
      </div>
      <div class="cov-foot">{(BRAND.title() + " · ") if BRAND else ""}State Control Command Center — Prepared for {esc(st['deck'])}</div></section>"""

FLOW1 = ("How an athlete is verified — once",
  [("Register","The athlete is enrolled at a centre and given one state record."),
   ("Verify","Age and identity are checked and locked through DigiLocker."),
   ("Screen","Duplicate and age-fraud checks run before anything is paid."),
   ("Seal","The record is sealed and every later change is logged."),
   ("Follow","Attendance, stipend and progress follow the athlete, for life.")],
  "One verified record per athlete — no duplicates, from district trial to national selection.")
FLOW2 = ("How a funding release is decided",
  [("File","The centre files its weekly return — attendance, kit, rations."),
   ("Score","A compliance score is calculated from what was filed and verified."),
   ("Flag","Facilities below the funding floor are flagged for review."),
   ("Decide","Funds are released, or held — with the reason recorded."),
   ("Audit","Every decision stays on an open, traceable trail.")],
  "Money follows verified compliance — not paper claims — and every decision can be audited.")

def build(key):
    st = STATES[key]
    slides = [s_cover(st), s_challenge(st), s_objectives(st), s_scope(st), s_app_overview(st),
              s_features(st), s_flow(st,7,*FLOW1), s_flow(st,8,*FLOW2), s_app_welfare(st),
              s_benefits(st), s_stakeholders(st), s_next(st)]
    page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>State Control Command Center — {esc(st['deck'])}</title>
<link rel="stylesheet" href="{FONTS}"><link rel="stylesheet" href="{FA}">
<style>{CSS}</style></head><body>{''.join(slides)}</body></html>"""
    return st, page

if __name__ == "__main__":
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(".")
    for key in STATES:
        st, page = build(key)
        p = out / f"{st['file']}.html"
        p.write_text(page, encoding="utf-8")
        print("wrote", p)
