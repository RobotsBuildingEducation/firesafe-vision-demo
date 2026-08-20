import React, { useState, useRef, useEffect, useCallback } from "react";

/* ============================================================
   FireSafe Vision
   Demo build — intake → photo → hazard report, plus Learn section.
   Hazard flags are derived from intake answers (deterministic),
   standing in for the vision-model analysis in production.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.fsv {
  --dg:      #E4E7DF;   /* decomposed granite — page base */
  --paper:   #FBFCF9;   /* card surface */
  --ink:     #14211B;   /* evergreen-black */
  --sage:    #5C7362;   /* chaparral — secondary text */
  --gravel:  #99A095;   /* tertiary */
  --line:    #CBD2C6;   /* hairlines */
  --dudleya: #7FA3A0;   /* chalky blue-green — interactive accent */
  --deep:    #234E42;   /* deep pine — primary action */

  --sev-high:#9E3B22;
  --sev-med: #A9782E;
  --sev-low: #4A7C59;
  --sev-high-bg:#F3E2DC;
  --sev-med-bg: #F4EBD9;
  --sev-low-bg: #E2EDE3;

  --r: 10px;

  margin: 0;
  min-height: 100vh;
  background: var(--dg);
  color: var(--ink);
  font-family: 'Instrument Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.fsv h1, .fsv h2, .fsv h3, .fsv .display {
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.12;
  margin: 0;
}
.fsv .mono {
  font-family: 'IBM Plex Mono', monospace;
  font-variant-ligatures: none;
}

.fsv button { font-family: inherit; font-size: inherit; cursor: pointer; }
.fsv :focus-visible { outline: 2px solid var(--deep); outline-offset: 2px; border-radius: 4px; }

/* ---------- shell ---------- */
.fsv-bar {
  position: sticky; top: 0; z-index: 40;
  background: rgba(228,231,223,.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.fsv-bar-in {
  max-width: 1040px; margin: 0 auto; padding: 13px 22px;
  display: flex; align-items: center; gap: 26px;
}
.fsv-mark { display:flex; align-items:center; gap:9px; margin-right:auto; }
.fsv-mark .glyph { flex:none; }
.fsv-mark .name {
  font-family:'Bricolage Grotesque',sans-serif; font-weight:700;
  font-size:16px; letter-spacing:-.03em;
}
.fsv-tabs { display:flex; gap:2px; }
.fsv-tab {
  border:none; background:transparent; color:var(--sage);
  padding:7px 15px; border-radius:99px; font-weight:500;
}
.fsv-tab:hover { color: var(--ink); }
.fsv-tab[data-on="true"] { background: var(--ink); color: var(--dg); }

.fsv-main { max-width: 1040px; margin: 0 auto; padding: 34px 22px 90px; }
.fsv-narrow { max-width: 700px; }

/* ---------- the zone ruler — signature element ---------- */
/* A measured band. Distance from the wall is the organizing fact of this
   entire subject, so it is the organizing device of the interface. */
.ruler { margin: 0 0 30px; }
.ruler-track {
  position: relative; height: 3px; background: var(--line);
  border-radius: 2px;
}
.ruler-fill {
  position:absolute; left:0; top:0; height:100%;
  background: var(--ink); border-radius:2px;
  transition: width .5s cubic-bezier(.2,.7,.3,1);
}
.ruler-ticks { position: relative; height: 34px; }
.ruler-tick {
  position:absolute; top:0; transform: translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:5px;
}
.ruler-tick i {
  display:block; width:1px; height:7px; background:var(--line);
}
.ruler-tick[data-on="true"] i { background: var(--ink); }
.ruler-tick span {
  font-family:'IBM Plex Mono',monospace; font-size:10.5px;
  color: var(--gravel); letter-spacing:.04em; white-space:nowrap;
}
.ruler-tick[data-on="true"] span { color: var(--ink); }
.ruler-cap {
  display:flex; justify-content:space-between; align-items:baseline;
  margin-bottom:9px;
}
.eyebrow {
  font-family:'IBM Plex Mono',monospace; font-size:10.5px;
  letter-spacing:.13em; text-transform:uppercase; color:var(--sage);
}

/* ---------- cards / forms ---------- */
.card {
  background: var(--paper); border:1px solid var(--line);
  border-radius: var(--r); padding: 24px;
}
.q { margin-bottom: 26px; }
.q:last-child { margin-bottom: 0; }
.q-label { font-weight:600; margin-bottom:3px; font-size:15px; }
.q-help { color: var(--sage); font-size:13.5px; margin-bottom:11px; }
.chips { display:flex; flex-wrap:wrap; gap:7px; }
.chip {
  border:1px solid var(--line); background:transparent; color:var(--ink);
  padding:8px 14px; border-radius:99px; font-size:14px;
  transition: background .13s, border-color .13s;
}
.chip:hover { border-color: var(--dudleya); }
.chip[data-on="true"] {
  background: var(--ink); border-color: var(--ink); color: var(--paper);
}

.btn {
  border:none; border-radius:99px; padding:12px 26px;
  font-weight:600; background:var(--deep); color:#F4F7F2;
  transition: background .15s;
}
.btn:hover { background:#1B3E34; }
.btn:disabled { background:var(--gravel); cursor:not-allowed; }
.btn-ghost {
  background:transparent; color:var(--sage); border:1px solid var(--line);
}
.btn-ghost:hover { background:transparent; color:var(--ink); border-color:var(--ink); }
.row { display:flex; gap:10px; align-items:center; margin-top:24px; }

/* ---------- upload ---------- */
.drop {
  border:1.5px dashed var(--line); border-radius:var(--r);
  background:var(--paper); padding:46px 26px; text-align:center;
  transition: border-color .15s, background .15s;
}
.drop[data-over="true"] { border-color:var(--deep); background:#F2F6F0; }
.drop h3 { font-size:19px; margin-bottom:6px; }
.drop p { color:var(--sage); font-size:14px; margin:0 auto 18px; max-width:340px; }
.shotlist {
  margin-top:16px; padding-top:16px; border-top:1px solid var(--line);
  display:grid; gap:7px; text-align:left; max-width:400px; margin-inline:auto;
}
.shotlist li { list-style:none; color:var(--sage); font-size:13.5px; display:flex; gap:9px; }
.shotlist .n {
  font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--dudleya);
  padding-top:2px; flex:none;
}

/* ---------- analyzing ---------- */
.scan { display:grid; gap:1px; background:var(--line); border-radius:var(--r); overflow:hidden; border:1px solid var(--line); }
.scan-row {
  background:var(--paper); padding:14px 18px; display:flex; align-items:center; gap:12px;
  font-size:14.5px; color:var(--gravel);
}
.scan-row[data-state="active"] { color:var(--ink); }
.scan-row[data-state="done"] { color:var(--sage); }
.dot { width:7px; height:7px; border-radius:50%; background:var(--line); flex:none; }
.scan-row[data-state="active"] .dot { background:var(--dudleya); animation: pulse 1.1s ease-in-out infinite; }
.scan-row[data-state="done"] .dot { background:var(--sev-low); }
@keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:1} }

/* ---------- before / after ---------- */
.ba { position:relative; border-radius:var(--r); overflow:hidden; background:var(--ink); user-select:none; touch-action:none; }
.ba img { display:block; width:100%; }
.ba-after { position:absolute; inset:0; overflow:hidden; }
.ba-after img { filter: saturate(.72) brightness(1.06) contrast(1.03); }
.ba-tint { position:absolute; inset:0; background:linear-gradient(180deg, rgba(127,163,160,.10), rgba(74,124,89,.16)); }
.ba-handle { position:absolute; top:0; bottom:0; width:2px; background:#FBFCF9; cursor:ew-resize; }
.ba-knob {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  width:38px; height:38px; border-radius:50%; background:#FBFCF9;
  display:grid; place-items:center; box-shadow:0 2px 10px rgba(0,0,0,.28);
}
.ba-tag {
  position:absolute; bottom:12px; padding:5px 11px; border-radius:99px;
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.09em;
  text-transform:uppercase; background:rgba(20,33,27,.76); color:#EEF2EC;
  backdrop-filter: blur(3px);
}
.pin {
  position:absolute; width:26px; height:26px; border-radius:50%;
  border:2px solid #FBFCF9; display:grid; place-items:center;
  font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:500;
  color:#FBFCF9; transform:translate(-50%,-50%); z-index:3;
  box-shadow:0 1px 7px rgba(0,0,0,.35);
}
.pin[data-sel="true"] { box-shadow:0 0 0 4px rgba(251,252,249,.5); }

/* ---------- report ---------- */
.lens {
  display:inline-flex; gap:2px; padding:3px; background:var(--paper);
  border:1px solid var(--line); border-radius:99px;
}
.lens button {
  border:none; background:transparent; color:var(--sage);
  padding:6px 14px; border-radius:99px; font-size:13.5px; font-weight:500;
}
.lens button[data-on="true"] { background:var(--ink); color:var(--paper); }

.flag {
  width:100%; text-align:left; background:var(--paper);
  border:1px solid var(--line); border-radius:var(--r);
  padding:15px 17px; margin-bottom:8px; transition:border-color .13s;
}
.flag:hover { border-color:var(--dudleya); }
.flag[data-open="true"] { border-color:var(--ink); }
.flag-top { display:flex; align-items:center; gap:11px; }
.flag-code {
  font-family:'IBM Plex Mono',monospace; font-size:11px; padding:2px 7px;
  border-radius:4px; flex:none; font-weight:500;
}
.flag-title { font-weight:600; font-size:14.5px; }
.flag-chev { margin-left:auto; color:var(--gravel); flex:none; transition:transform .2s; }
.flag[data-open="true"] .flag-chev { transform:rotate(90deg); }
.flag-body { margin-top:14px; padding-top:14px; border-top:1px solid var(--line); }
.flag-obs { color:var(--sage); font-size:14px; margin-bottom:14px; }
.statuses { display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-bottom:14px; }
.status { border:1px solid var(--line); border-radius:8px; padding:10px 12px; }
.status .k {
  font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.11em;
  text-transform:uppercase; color:var(--gravel); margin-bottom:4px;
}
.status .v { font-size:13.5px; font-weight:600; line-height:1.3; }
.status .n { font-size:12.5px; color:var(--sage); margin-top:3px; line-height:1.4; }
.status[data-live="true"] { border-color:var(--deep); background:#F2F6F0; }
.action { font-size:14px; }
.action b { display:block; font-size:12px; letter-spacing:.04em; text-transform:uppercase; color:var(--gravel); font-weight:500; margin-bottom:3px; font-family:'IBM Plex Mono',monospace; }
.action p { margin:0 0 9px; }

.zone-head {
  display:flex; align-items:baseline; gap:10px; margin:26px 0 11px;
  padding-bottom:8px; border-bottom:1px solid var(--line);
}
.zone-head h3 { font-size:17px; }
.zone-head .dist {
  font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:var(--gravel);
  margin-left:auto;
}

.tally { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; margin-bottom:8px; }
.tally div { background:var(--paper); border:1px solid var(--line); border-radius:var(--r); padding:14px 16px; }
.tally .num { font-family:'Bricolage Grotesque',sans-serif; font-size:29px; font-weight:600; line-height:1; }
.tally .lab { font-size:12.5px; color:var(--sage); margin-top:4px; }

.pathway { background:var(--paper); border:1px solid var(--line); border-radius:var(--r); padding:22px; margin-top:26px; }
.pathway h3 { font-size:17px; margin-bottom:5px; }
.pathway .sub { color:var(--sage); font-size:14px; margin-bottom:16px; }
.blockers { display:grid; gap:7px; }
.blocker { display:flex; gap:10px; align-items:flex-start; font-size:14px; }
.blocker .b-code { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--gravel); padding-top:3px; flex:none; }

.plants { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:9px; }
.plant { background:var(--paper); border:1px solid var(--line); border-radius:var(--r); padding:14px 16px; }
.plant .pn { font-weight:600; font-size:14.5px; }
.plant .ps { font-style:italic; color:var(--sage); font-size:12.5px; margin-bottom:6px; }
.plant .pd { font-size:13px; color:var(--sage); line-height:1.45; }

/* ---------- learn ---------- */
.hero { padding: 18px 0 44px; }
.hero .kicker { margin-bottom:18px; }
.hero h1 { font-size: clamp(34px, 6vw, 56px); max-width: 15ch; margin-bottom:20px; }
.hero p { font-size:17px; color:var(--sage); max-width:56ch; margin:0; }
.hero em { font-style:normal; color:var(--ink); }

.sect { margin-top:56px; }
.sect > h2 { font-size:25px; margin-bottom:8px; }
.sect > .lede { color:var(--sage); max-width:62ch; margin:0 0 22px; }

.myth { border-top:1px solid var(--line); }
.myth-row { border-bottom:1px solid var(--line); padding:18px 0; }
.myth-q { display:flex; gap:12px; align-items:baseline; }
.myth-q .verdict {
  font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.1em;
  text-transform:uppercase; padding:3px 8px; border-radius:4px; flex:none;
  background:var(--sev-high-bg); color:var(--sev-high);
}
.myth-q .verdict[data-v="partly"] { background:var(--sev-med-bg); color:var(--sev-med); }
.myth-q p { margin:0; font-weight:600; font-size:15.5px; }
.myth-a { color:var(--sage); font-size:14.5px; margin:9px 0 0 0; max-width:66ch; }

.zonecards { display:grid; gap:9px; }
.zonecard { background:var(--paper); border:1px solid var(--line); border-radius:var(--r); padding:20px 22px; }
.zonecard .zh { display:flex; align-items:baseline; gap:11px; margin-bottom:8px; }
.zonecard h3 { font-size:17px; }
.zonecard .band {
  font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--paper);
  background:var(--ink); padding:2px 8px; border-radius:4px;
}
.zonecard p { margin:0 0 10px; color:var(--sage); font-size:14.5px; }
.zonecard ul { margin:0; padding-left:17px; display:grid; gap:4px; }
.zonecard li { font-size:14px; color:var(--sage); }
.zonecard li b { color:var(--ink); font-weight:600; }

.tracks { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
.track { background:var(--paper); border:1px solid var(--line); border-radius:var(--r); padding:20px 22px; }
.track[data-live="true"] { border-color:var(--deep); }
.track .th { display:flex; align-items:center; gap:9px; margin-bottom:4px; }
.track h3 { font-size:16px; }
.track .badge {
  font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.09em;
  text-transform:uppercase; padding:3px 8px; border-radius:99px;
  background:var(--dg); color:var(--sage);
}
.track[data-live="true"] .badge { background:var(--sev-low-bg); color:var(--sev-low); }
.track .auth { font-size:12.5px; color:var(--gravel); margin:0 0 12px; font-family:'IBM Plex Mono',monospace; }
.track p { font-size:14px; color:var(--sage); margin:0 0 10px; }
.track dl { margin:0; display:grid; gap:8px; }
.track dt { font-size:11.5px; font-family:'IBM Plex Mono',monospace; letter-spacing:.07em; text-transform:uppercase; color:var(--gravel); }
.track dd { margin:2px 0 0; font-size:14px; }

.srcs { display:grid; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:var(--r); overflow:hidden; }
.src { background:var(--paper); padding:14px 18px; display:flex; gap:14px; align-items:baseline; }
.src .sname { font-weight:600; font-size:14px; flex:none; min-width:170px; }
.src .swhat { font-size:13.5px; color:var(--sage); }

.cta-strip {
  margin-top:56px; background:var(--ink); border-radius:var(--r);
  padding:32px; color:var(--dg);
}
.cta-strip h2 { font-size:23px; color:#F4F7F2; margin-bottom:7px; }
.cta-strip p { color:#AFBDB0; margin:0 0 20px; max-width:52ch; font-size:14.5px; }
.cta-strip .btn { background:#F4F7F2; color:var(--ink); }
.cta-strip .btn:hover { background:#fff; }

.note {
  font-size:12.5px; color:var(--gravel); line-height:1.5;
  border-left:2px solid var(--line); padding-left:12px; margin-top:20px;
}

@media (max-width: 680px) {
  .tally { grid-template-columns:1fr; }
  .tracks { grid-template-columns:1fr; }
  .statuses { grid-template-columns:1fr; }
  .fsv-bar-in { gap:14px; }
  .src { flex-direction:column; gap:3px; }
  .src .sname { min-width:0; }
}

@media (prefers-reduced-motion: reduce) {
  .fsv *, .fsv *::before, .fsv *::after {
    animation-duration:.001ms !important; transition-duration:.001ms !important;
  }
}
`;

/* ---------------- content ---------------- */

const INTAKE_STEPS = [
  {
    title: "The property",
    help: "Sets the baseline risk and which spacing rules apply.",
    qs: [
      { id: "propertyType", label: "What are you assessing?", opts: ["Single-family home", "ADU or detached structure", "Rural / WUI parcel"] },
      { id: "topography", label: "The ground it sits on", help: "Fire moves faster uphill, so slope changes the spacing requirements.", opts: ["Flat", "Mild slope", "Moderate slope", "Steep slope", "Canyon", "Ridgetop"] },
      { id: "hazardZone", label: "Fire hazard severity zone", help: "Look up your parcel on the CAL FIRE hazard map if you're unsure.", opts: ["Moderate", "High", "Very High", "Not sure"] },
    ],
  },
  {
    title: "The first five feet",
    help: "Zone 0 — the strip right against the wall. This is where most homes actually catch.",
    qs: [
      { id: "surface", label: "What's on the ground against the wall?", opts: ["Mulch or bark", "Lawn or grass", "Bare soil", "Gravel or DG", "Concrete or pavers", "Mixed"] },
      { id: "veg", label: "Plants growing within five feet of the wall?", opts: ["Yes", "A few", "None"] },
      { id: "fence", label: "Fence material where it meets the house", opts: ["Wood", "Vinyl", "Metal", "Masonry", "No fence"] },
      { id: "vents", label: "Vent screens", help: "Foundation, gable, soffit, and ridge vents.", opts: ["Fine metal mesh", "Standard or coarse", "None", "Not sure"] },
      { id: "stored", label: "Anything stored against the house?", help: "Firewood, bins, propane, patio furniture, doormats.", opts: ["Yes", "No"] },
      { id: "gutters", label: "Gutters and eaves", opts: ["Clear", "Some debris", "Full of debris", "Not sure"] },
    ],
  },
  {
    title: "What you're working toward",
    help: "Zone 0 is governed by two different standards. This decides which one we hold your property to.",
    qs: [
      {
        id: "goal",
        label: "Your goal",
        opts: ["Lower my insurance", "Meet the state rules", "Both"],
        help: "The insurance standard is stricter, and it's the one that's actually in force today.",
      },
      { id: "jurisdiction", label: "Where the property is", help: "Some cities adopted their own Zone 0 rules ahead of the state.", opts: ["Los Angeles County", "San Diego", "Elsewhere in California"] },
    ],
  },
];

const SCAN_STEPS = [
  "Reading ground surface and materials",
  "Locating vegetation against the structure",
  "Checking fence and attachment points",
  "Inspecting vents, gutters, and eaves",
  "Matching conditions to zone standards",
  "Generating the resilient view",
];

/* Hazard library. `standard` mirrors assessment-framework.md v1.1. */
const LIB = {
  "Z0-SURFACE": {
    zone: 0, sev: "high", standard: "BOTH", title: "No noncombustible perimeter",
    reg: ["Anticipated", "In the state's draft rule, not yet adopted."],
    ins: ["Required", "Both IBHS tiers."],
    action: "Replace the surface material within five feet of every wall with something that can't burn.",
    options: "3/4-inch crushed gravel, decomposed granite, concrete, brick, flagstone, or pervious pavers.",
    why: "Surface material in the first five feet is the main path for ember ignition. This is the single highest-impact change you can make.",
    cost: "Low to medium · doable yourself",
  },
  "Z0-MULCH": {
    zone: 0, sev: "high", standard: "BOTH", title: "Combustible mulch against the wall",
    reg: ["Anticipated", "In the state's draft rule, not yet adopted."],
    ins: ["Required", "Both IBHS tiers."],
    action: "Pull all bark and wood-chip mulch out of the first five feet.",
    options: "Replace with inorganic gravel or decomposed granite.",
    why: "Bark mulch works as an ember bed — it catches embers and holds them until they ignite.",
    cost: "Low · doable yourself",
  },
  "Z0-LAWN": {
    zone: 0, sev: "medium", standard: "BOTH", title: "Lawn running up to the wall",
    reg: ["Anticipated", "In the state's draft rule, not yet adopted."],
    ins: ["Required", "Both IBHS tiers."],
    action: "Pull the lawn back and replace the five-foot strip with hardscape.",
    options: "Gravel, DG, or pavers. Keep irrigation on whatever lawn remains beyond five feet.",
    why: "Grass cures out and carries flame to the foundation faster than most people expect, even when it looks green.",
    cost: "Low to medium · doable yourself",
  },
  "Z0-VEG": {
    zone: 0, sev: "high", standard: "IBHS", title: "Plants within five feet of the wall",
    reg: ["Anticipated, with an exception", "The state draft allows irrigated low succulents."],
    ins: ["Required, no exception", "IBHS allows zero vegetation here."],
    action: "Remove every plant, shrub, and organic ground cover inside the five-foot line.",
    options: "Move the planting bed outward. Zone 1 starts at five feet and there's a full palette available there.",
    why: "This is the one place the two standards genuinely disagree. If you're after the insurance discount, the state's succulent exception won't get you there.",
    cost: "Low · doable yourself",
    diverges: true,
  },
  "Z0-FENCE": {
    zone: 0, sev: "high", standard: "BOTH", title: "Combustible fence attached to the house",
    reg: ["Anticipated", "Draft §1298.04(b)(8)–(9). Check for a local ordinance."],
    ins: ["Required", "Both IBHS tiers."],
    action: "Replace the section of fence that meets the structure with noncombustible material.",
    options: "Aluminum, steel, wrought iron, concrete block, masonry, or fiber cement. At minimum, swap the five feet closest to the wall.",
    why: "A wood fence is a fuse. It carries fire from the yard directly to the siding.",
    cost: "Medium to high · contractor recommended",
  },
  "Z0-GUTTER": {
    zone: 0, sev: "high", standard: "BOTH", title: "Debris in gutters and eaves",
    reg: ["Anticipated", "In the state's draft rule, not yet adopted."],
    ins: ["Required", "Both IBHS tiers."],
    action: "Clear all leaf litter, needles, and debris from gutters, eaves, and roof valleys.",
    options: "Add metal mesh gutter guards. Clear again after every significant wind event.",
    why: "Embers land on the roof and collect in the gutter line. Dry needles there are the ignition point on a lot of lost homes.",
    cost: "Low · doable yourself",
  },
  "Z0-ITEMS": {
    zone: 0, sev: "medium", standard: "IBHS", title: "Combustible items stored against the house",
    reg: ["Not addressed", "The current draft text is silent on movable items."],
    ins: ["Required", "Both IBHS tiers."],
    action: "Move firewood, bins, propane, doormats, and combustible furniture out of the five-foot zone.",
    options: "Metal furniture is fine to leave. Everything else goes beyond five feet.",
    why: "Free to fix and it counts toward the designation. Start here on the day you decide to do this.",
    cost: "Free · today",
  },
  "Z0-VENT": {
    zone: 0, sev: "high", standard: "IBHS-only", title: "Vents without ember-resistant screening",
    reg: ["Not required", "Ch. 7A covers new construction only, not retrofits."],
    ins: ["Required", "Both IBHS tiers."],
    action: "Cover or replace foundation, gable, soffit, and ridge vents with mesh tested to ASTM E2886.",
    options: "1/16-inch stainless mesh. Photograph every vent after install — the evaluator checks for gaps.",
    why: "Embers pulled through an open vent ignite the house from inside, where nothing you did to the yard helps.",
    cost: "Low to medium · doable yourself",
  },
  "Z1-SLOPE": {
    zone: 1, sev: "medium", standard: "PRC 4291", title: "Slope without increased spacing",
    reg: ["Required today", "PRC 4291 Zone 1 is in force and inspected."],
    ins: ["Counts", "Defensible space is a Safer from Wildfires measure."],
    action: "Widen the spacing between shrubs and tree canopies to match the slope.",
    options: "On slope, space shrubs 3× their height instead of 2×. Increase canopy separation as grade steepens.",
    why: "Flame lengths grow and travel faster uphill, so the flat-ground spacing numbers stop working.",
    cost: "Low to medium · doable yourself",
  },
  "Z1-DEAD": {
    zone: 1, sev: "high", standard: "PRC 4291", title: "Dead and dry vegetation in Zone 1",
    reg: ["Required today", "PRC 4291 Zone 1 is in force and inspected."],
    ins: ["Counts", "Defensible space is a Safer from Wildfires measure."],
    action: "Remove all dead plants, dried grass, dead branches, and accumulated litter from five to thirty feet.",
    options: "This is recurring maintenance, not a one-time project. Re-check monthly through dry season.",
    why: "Dead material ignites at far lower temperatures than living plants and carries fire quickly.",
    cost: "Low · doable yourself",
  },
};

const PLANTS = [
  { n: "Chalk dudleya", s: "Dudleya pulverulenta", d: "Native succulent, very low flammability, drought tolerant once it's established." },
  { n: "Lemonade berry", s: "Rhus integrifolia", d: "Native shrub with excellent fire resistance. Works as a hedge in Zone 1 or 2." },
  { n: "Toyon", s: "Heteromeles arbutifolia", d: "Fire-adapted by nature and recovers after burning. Good structure plant." },
  { n: "Coffeeberry", s: "Frangula californica", d: "Low fuel load, high moisture content. One of the safer Zone 1 shrubs." },
  { n: "Yarrow", s: "Achillea millefolium", d: "Low-growing native perennial. Fire-resilient and good pollinator habitat." },
  { n: "Catalina cherry", s: "Prunus ilicifolia ssp. lyonii", d: "Excellent fire resistance for Zone 2. Space 10–15 ft apart." },
];

const MYTHS = [
  {
    v: "false",
    q: "The flames never reached my street, so my house was never really at risk.",
    a: "Most homes lost in a wildfire are not touched by the flame front. They ignite from wind-blown embers that land ahead of the fire and collect in the places nobody looks — the gutter line, the vent screen, the bark mulch banked against the siding. Ember exposure reaches far past the visible edge of a fire.",
  },
  {
    v: "false",
    q: "Clearing a hundred feet of brush is the main thing that matters.",
    a: "The hundred-foot requirement is real and it's in force. But research keeps pointing back to the first five feet as the highest-leverage strip on the property. A cleared hillside doesn't help if there's bark mulch banked against the siding.",
  },
  {
    v: "partly",
    q: "Native and drought-tolerant plants are fire-safe.",
    a: "Native doesn't mean fire-safe. Chaparral species are fire-adapted, which means they're built to burn and come back. Some natives are genuinely low-flammability; others, like untended sage, accumulate dead wood and become a hazard. Selection and maintenance both matter.",
  },
  {
    v: "false",
    q: "There's a statewide Zone 0 law I'm already breaking.",
    a: "Not yet. The Board of Forestry has been drafting the ember-resistant zone rule since AB 3074 passed in 2020. The December 2025 adoption deadline passed without a final rule, and the latest draft is from April 2026. Some cities adopted their own ahead of the state. What is in force everywhere is Zone 1 and Zone 2 under PRC 4291.",
  },
  {
    v: "partly",
    q: "None of this pays for itself.",
    a: "Some of it does. California requires insurers that price wildfire risk to discount for documented mitigation, and carriers publish credits in the 5–35% range. Two of the highest-value actions — ember-resistant vents and clearing the first five feet — are among the cheapest on the list.",
  },
];

const ZONES = [
  {
    band: "0–5 ft", name: "The ember zone",
    p: "The strip right against the wall. Nothing here should be able to catch.",
    li: ["<b>Ground:</b> gravel, DG, concrete, or pavers — nothing organic", "<b>Plants:</b> none, if you want the insurance designation", "<b>Fence:</b> noncombustible where it meets the structure", "<b>Storage:</b> empty. No firewood, bins, or propane"],
  },
  {
    band: "5–30 ft", name: "Lean, clean, and green",
    p: "Living plants are welcome here. Dead material and tight spacing are not.",
    li: ["<b>Spacing:</b> shrubs at 2× their height on flat ground, 3× on slope", "<b>Ladder fuels:</b> remove shrubs growing under trees", "<b>Limb up:</b> lowest tree branches at least 6 ft off the ground", "<b>Dead material:</b> cleared on a recurring schedule"],
  },
  {
    band: "30–100 ft", name: "Reduced fuel",
    p: "Thin things out so a fire arrives slower and smaller than it otherwise would.",
    li: ["<b>Canopy gaps:</b> 18 ft at the near edge, tapering to 6 ft at 100 ft", "<b>On slope:</b> 20 ft under 20% grade, 40 ft at 20–40%", "<b>Over 40% grade:</b> single trees only, no groupings", "<b>Dead trees:</b> removed, not deferred"],
  },
];

const SOURCES = [
  ["CAL FIRE / PRC § 4291", "The defensible space law itself. Zones 1 and 2, in force since the 2005 expansion to 100 feet."],
  ["Board of Forestry", "The Zone 0 ember-resistant zone rulemaking. Latest draft April 17, 2026 — still a draft."],
  ["IBHS Wildfire Prepared Home", "The insurer-backed designation standard. Essential and Enhanced tiers, both requiring a noncombustible first five feet."],
  ["CDI / 10 CCR § 2644.9", "Safer from Wildfires. Requires insurers pricing wildfire risk to discount documented mitigation. Expanded by AB 1 in January 2026."],
  ["CalScape & UC Cooperative Extension", "Species-level flammability and the Southern California plant palette."],
  ["USGBC-CA Wildfire Defense", "Home-hardening curriculum and the rebuilding guidance this project grew out of."],
];

/* ---------------- helpers ---------------- */

const sevColor = (s) => ({ high: "var(--sev-high)", medium: "var(--sev-med)", low: "var(--sev-low)" }[s]);
const sevBg = (s) => ({ high: "var(--sev-high-bg)", medium: "var(--sev-med-bg)", low: "var(--sev-low-bg)" }[s]);
const sevWord = (s) => ({ high: "Act first", medium: "Worth doing", low: "Maintain" }[s]);

function deriveFlags(a) {
  const f = [];
  if (a.surface === "Mulch or bark") f.push("Z0-MULCH", "Z0-SURFACE");
  else if (a.surface === "Lawn or grass") f.push("Z0-LAWN", "Z0-SURFACE");
  else if (a.surface === "Bare soil" || a.surface === "Mixed") f.push("Z0-SURFACE");
  if (a.veg === "Yes" || a.veg === "A few") f.push("Z0-VEG");
  if (a.fence === "Wood" || a.fence === "Vinyl") f.push("Z0-FENCE");
  if (a.vents && a.vents !== "Fine metal mesh") f.push("Z0-VENT");
  if (a.stored === "Yes") f.push("Z0-ITEMS");
  if (a.gutters && a.gutters !== "Clear") f.push("Z0-GUTTER");
  if (["Mild slope", "Moderate slope", "Steep slope", "Canyon", "Ridgetop"].includes(a.topography)) f.push("Z1-SLOPE");
  if (a.gutters === "Full of debris" || a.veg === "Yes") f.push("Z1-DEAD");
  return [...new Set(f)];
}

/* Demo pin coordinates. In production these come from the vision model. */
const PIN_POS = {
  "Z0-MULCH": [26, 78], "Z0-SURFACE": [50, 85], "Z0-LAWN": [30, 80],
  "Z0-VEG": [70, 72], "Z0-FENCE": [88, 62], "Z0-GUTTER": [42, 22],
  "Z0-ITEMS": [16, 68], "Z0-VENT": [60, 44], "Z1-SLOPE": [82, 88], "Z1-DEAD": [10, 55],
};

/* ---------------- ruler ---------------- */

function Ruler({ label, right, pct, ticks, active }) {
  return (
    <div className="ruler">
      <div className="ruler-cap">
        <span className="eyebrow">{label}</span>
        {right && <span className="eyebrow">{right}</span>}
      </div>
      <div className="ruler-track"><div className="ruler-fill" style={{ width: `${pct}%` }} /></div>
      <div className="ruler-ticks">
        {ticks.map((t, i) => (
          <div key={t} className="ruler-tick" data-on={i <= active}
            style={{ left: `${(i / (ticks.length - 1)) * 100}%` }}>
            <i /><span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- before / after ---------------- */

function BeforeAfter({ src, flags, sel, onSel }) {
  const [x, setX] = useState(52);
  const box = useRef(null);
  const drag = useRef(false);

  const move = useCallback((clientX) => {
    if (!box.current) return;
    const r = box.current.getBoundingClientRect();
    setX(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const mm = (e) => drag.current && move(e.clientX);
    const tm = (e) => drag.current && move(e.touches[0].clientX);
    const up = () => (drag.current = false);
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchmove", tm);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [move]);

  return (
    <div className="ba" ref={box}>
      <img src={src} alt="Your property as it is now" />
      {flags.map((c, i) => {
        const p = PIN_POS[c] || [50, 50];
        if (p[0] > x) return null;
        return (
          <button key={c} className="pin mono" data-sel={sel === c}
            style={{ left: `${p[0]}%`, top: `${p[1]}%`, background: sevColor(LIB[c].sev) }}
            onClick={() => onSel(sel === c ? null : c)}
            aria-label={`${LIB[c].title} — hazard ${i + 1}`}>{i + 1}</button>
        );
      })}
      <div className="ba-after" style={{ clipPath: `inset(0 0 0 ${x}%)` }}>
        <img src={src} alt="The same property with resilient changes applied" />
        <div className="ba-tint" />
      </div>
      <div className="ba-tag" style={{ left: 12 }}>Now</div>
      <div className="ba-tag" style={{ right: 12 }}>Resilient</div>
      <div className="ba-handle" style={{ left: `${x}%` }}
        onMouseDown={() => (drag.current = true)}
        onTouchStart={() => (drag.current = true)}>
        <div className="ba-knob">
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M5 1L1 5.5L5 10M10 1L14 5.5L10 10" stroke="#14211B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------------- flag row ---------------- */

function FlagRow({ code, n, lens, open, onToggle }) {
  const d = LIB[code];
  const insLive = lens !== "state";
  return (
    <button className="flag" data-open={open} onClick={onToggle} aria-expanded={open}>
      <div className="flag-top">
        <span className="flag-code" style={{ background: sevBg(d.sev), color: sevColor(d.sev) }}>{code}</span>
        <span className="flag-title">{d.title}</span>
        <svg className="flag-chev" width="7" height="11" viewBox="0 0 7 11" fill="none">
          <path d="M1 1L5.5 5.5L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {open && (
        <div className="flag-body">
          <p className="flag-obs">{d.why}</p>
          <div className="statuses">
            <div className="status" data-live={!insLive}>
              <div className="k">State rule</div>
              <div className="v" style={{ color: d.reg[0].startsWith("Required") ? "var(--sev-high)" : "inherit" }}>{d.reg[0]}</div>
              <div className="n">{d.reg[1]}</div>
            </div>
            <div className="status" data-live={insLive}>
              <div className="k">Insurance</div>
              <div className="v">{d.ins[0]}</div>
              <div className="n">{d.ins[1]}</div>
            </div>
          </div>
          <div className="action">
            <b>Do this</b>
            <p>{d.action}</p>
            <b>Materials</b>
            <p>{d.options}</p>
            <b>Effort</b>
            <p style={{ marginBottom: 0 }}>{d.cost}</p>
          </div>
        </div>
      )}
    </button>
  );
}

/* ---------------- assess flow ---------------- */

function Assess({ onLearn }) {
  const [phase, setPhase] = useState("intake");
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [img, setImg] = useState(null);
  const [over, setOver] = useState(false);
  const [scan, setScan] = useState(0);
  const [sel, setSel] = useState(null);
  const [lens, setLens] = useState("both");
  const fileRef = useRef(null);

  const flags = phase === "report" ? deriveFlags(ans) : [];
  const cur = INTAKE_STEPS[step];
  const done = cur ? cur.qs.every((q) => ans[q.id]) : true;

  const load = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => { setImg(e.target.result); setPhase("analyzing"); };
    r.readAsDataURL(file);
  };

  useEffect(() => {
    if (phase !== "analyzing") return;
    setScan(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1; setScan(i);
      if (i > SCAN_STEPS.length) { clearInterval(t); setPhase("report"); }
    }, 620);
    return () => clearInterval(t);
  }, [phase]);

  const phaseIdx = { intake: step, photo: 3, analyzing: 4, report: 5 }[phase];

  /* ---- report ---- */
  if (phase === "report") {
    const z0 = flags.filter((c) => LIB[c].zone === 0);
    const z1 = flags.filter((c) => LIB[c].zone === 1);
    const high = flags.filter((c) => LIB[c].sev === "high").length;
    const insBlockers = flags.filter((c) => LIB[c].ins[0].startsWith("Required"));
    const freeWins = flags.filter((c) => LIB[c].cost.startsWith("Free") || LIB[c].cost.startsWith("Low ·"));

    return (
      <>
        <Ruler label="Your property" right="Report" pct={100}
          ticks={["Property", "Zone 0", "Goal", "Photo", "Analysis", "Report"]} active={5} />

        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <h1 style={{ fontSize: 28 }}>What we found</h1>
          <div className="lens" style={{ marginLeft: "auto" }} role="group" aria-label="Which standard to show">
            {[["both", "Both"], ["state", "State rule"], ["ins", "Insurance"]].map(([k, l]) => (
              <button key={k} data-on={lens === k} onClick={() => setLens(k)}>{l}</button>
            ))}
          </div>
        </div>

        <BeforeAfter src={img} flags={flags} sel={sel} onSel={setSel} />
        <p className="note">
          Drag the handle to compare. The resilient view is a demo placeholder in this build — in production it's
          generated from your photo by the image model. Hazard pins are illustrative positions, not detected coordinates.
        </p>

        <div className="tally" style={{ marginTop: 26 }}>
          <div><div className="num">{flags.length}</div><div className="lab">conditions flagged</div></div>
          <div><div className="num" style={{ color: high ? "var(--sev-high)" : "inherit" }}>{high}</div><div className="lab">to act on first</div></div>
          <div><div className="num">{freeWins.length}</div><div className="lab">you can do this weekend</div></div>
        </div>

        {z0.length > 0 && (
          <>
            <div className="zone-head">
              <h3>Zone 0</h3><span className="dist mono">0–5 ft</span>
            </div>
            {z0.map((c, i) => (
              <FlagRow key={c} code={c} n={i} lens={lens} open={sel === c}
                onToggle={() => setSel(sel === c ? null : c)} />
            ))}
          </>
        )}

        {z1.length > 0 && (
          <>
            <div className="zone-head">
              <h3>Zone 1</h3><span className="dist mono">5–30 ft</span>
            </div>
            {z1.map((c, i) => (
              <FlagRow key={c} code={c} n={i} lens={lens} open={sel === c}
                onToggle={() => setSel(sel === c ? null : c)} />
            ))}
          </>
        )}

        {flags.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <h3 style={{ fontSize: 19, marginBottom: 7 }}>Nothing flagged from your answers</h3>
            <p style={{ color: "var(--sage)", margin: 0 }}>
              Zone 0 looks clear on the conditions we asked about. Keep it that way — it needs re-checking
              before fire season and after every wind event.
            </p>
          </div>
        )}

        <div className="pathway">
          <h3>Your insurance pathway</h3>
          <p className="sub">
            {insBlockers.length === 0
              ? "Nothing in your answers blocks the IBHS Essential designation on Zone 0 grounds."
              : `${insBlockers.length} ${insBlockers.length === 1 ? "condition stands" : "conditions stand"} between you and the IBHS Essential designation. Every required action has to be complete — partial mitigation doesn't qualify.`}
          </p>
          {insBlockers.length > 0 && (
            <div className="blockers">
              {insBlockers.map((c) => (
                <div className="blocker" key={c}>
                  <span className="b-code">{c}</span>
                  <span>{LIB[c].action}</span>
                </div>
              ))}
            </div>
          )}
          <p className="note" style={{ marginTop: 18 }}>
            Once the work is documented, California requires insurers that price wildfire risk to reflect it —
            published carrier credits run roughly 5–35%. Photograph everything as you go; the evaluator asks for it.
          </p>
        </div>

        <div className="zone-head" style={{ marginTop: 34 }}>
          <h3>Plants for beyond the five-foot line</h3>
        </div>
        <div className="plants">
          {PLANTS.slice(0, 4).map((p) => (
            <div className="plant" key={p.n}>
              <div className="pn">{p.n}</div>
              <div className="ps">{p.s}</div>
              <div className="pd">{p.d}</div>
            </div>
          ))}
        </div>

        <div className="row">
          <button className="btn" onClick={() => { setPhase("intake"); setStep(0); setAns({}); setImg(null); setSel(null); }}>
            Assess another photo
          </button>
          <button className="btn btn-ghost" onClick={onLearn}>Read why this matters</button>
        </div>
      </>
    );
  }

  /* ---- analyzing ---- */
  if (phase === "analyzing") {
    return (
      <div className="fsv-narrow">
        <Ruler label="Reading your photo" right="Step 5 of 6" pct={83}
          ticks={["Property", "Zone 0", "Goal", "Photo", "Analysis", "Report"]} active={4} />
        <h1 style={{ fontSize: 26, marginBottom: 20 }}>Looking at your property</h1>
        <div className="scan">
          {SCAN_STEPS.map((s, i) => (
            <div className="scan-row" key={s} data-state={scan > i ? "done" : scan === i ? "active" : "idle"}>
              <span className="dot" />{s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---- photo ---- */
  if (phase === "photo") {
    return (
      <div className="fsv-narrow">
        <Ruler label="Your photo" right="Step 4 of 6" pct={66}
          ticks={["Property", "Zone 0", "Goal", "Photo", "Analysis", "Report"]} active={3} />
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Photograph the first five feet</h1>
        <p style={{ color: "var(--sage)", marginTop: 0, marginBottom: 22 }}>
          Stand back far enough to get the base of the wall and the ground in front of it in the same frame.
        </p>
        <div className="drop" data-over={over}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); load(e.dataTransfer.files[0]); }}>
          <h3>Drop a photo here</h3>
          <p>JPG or PNG. Nothing leaves your browser in this demo build.</p>
          <button className="btn" onClick={() => fileRef.current?.click()}>Choose a photo</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => load(e.target.files[0])} />
          <ul className="shotlist">
            <li><span className="n">01</span><span>Get the ground-to-wall junction in frame — that's the whole subject.</span></li>
            <li><span className="n">02</span><span>Shoot in daylight, no flash. Shadows hide mulch and debris.</span></li>
            <li><span className="n">03</span><span>Include the fence line where it meets the house, if there is one.</span></li>
            <li><span className="n">04</span><span>One wall at a time. Run it again for each side of the house.</span></li>
          </ul>
        </div>
        <div className="row">
          <button className="btn btn-ghost" onClick={() => { setPhase("intake"); setStep(2); }}>Back</button>
        </div>
      </div>
    );
  }

  /* ---- intake ---- */
  return (
    <div className="fsv-narrow">
      <Ruler label={cur.title} right={`Step ${step + 1} of 6`} pct={(step / 5) * 100}
        ticks={["Property", "Zone 0", "Goal", "Photo", "Analysis", "Report"]} active={phaseIdx} />
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{cur.title}</h1>
      <p style={{ color: "var(--sage)", marginTop: 0, marginBottom: 22 }}>{cur.help}</p>
      <div className="card">
        {cur.qs.map((q) => (
          <div className="q" key={q.id}>
            <div className="q-label">{q.label}</div>
            {q.help && <div className="q-help">{q.help}</div>}
            <div className="chips">
              {q.opts.map((o) => (
                <button key={o} className="chip" data-on={ans[q.id] === o}
                  onClick={() => setAns({ ...ans, [q.id]: o })}>{o}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <button className="btn" disabled={!done}
          onClick={() => (step < 2 ? setStep(step + 1) : setPhase("photo"))}>
          {step < 2 ? "Continue" : "Add your photo"}
        </button>
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
      </div>
    </div>
  );
}

/* ---------------- learn ---------------- */

function Learn({ onStart }) {
  return (
    <>
      <div className="hero">
        <div className="eyebrow kicker">Why this exists</div>
        <h1>Most homes don't burn from the front. They burn from the edges.</h1>
        <p>
          In the January 2025 Los Angeles fires, whole blocks went while the trees between them stayed standing.
          That pattern isn't random. Homes ignite from <em>wind-blown embers</em> that land ahead of the fire and
          collect in the places nobody looks — the gutter line, the vent screen, the bark mulch banked against the
          siding. FireSafe Vision exists to show you those places on your own property, in a photo of your own house.
        </p>
      </div>

      <div className="sect">
        <h2>What people get wrong</h2>
        <p className="lede">
          Five things we hear constantly, and what the research and the code actually say.
        </p>
        <div className="myth">
          {MYTHS.map((m) => (
            <div className="myth-row" key={m.q}>
              <div className="myth-q">
                <span className="verdict" data-v={m.v}>{m.v === "partly" ? "Partly" : "Not so"}</span>
                <p>{m.q}</p>
              </div>
              <p className="myth-a">{m.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sect">
        <h2>The three zones</h2>
        <p className="lede">
          Defensible space is measured outward from the wall of your house. Each band asks something different of you.
        </p>
        <div className="zonecards">
          {ZONES.map((z) => (
            <div className="zonecard" key={z.band}>
              <div className="zh">
                <span className="band mono">{z.band}</span>
                <h3>{z.name}</h3>
              </div>
              <p>{z.p}</p>
              <ul>{z.li.map((l, i) => <li key={i} dangerouslySetInnerHTML={{ __html: l }} />)}</ul>
            </div>
          ))}
        </div>
      </div>

      <div className="sect">
        <h2>Two standards, not one</h2>
        <p className="lede">
          This is the part almost nobody explains. The first five feet around your house is governed by two separate
          systems that don't require the same things and aren't on the same timeline. Knowing which one you're working
          toward changes what you do.
        </p>
        <div className="tracks">
          <div className="track">
            <div className="th"><h3>The state rule</h3><span className="badge">Still a draft</span></div>
            <p className="auth">PRC § 4291 · AB 3074 · Board of Forestry</p>
            <p>
              AB 3074 told the Board of Forestry to write a Zone 0 rule back in 2020. The December 2025 deadline
              passed without adoption, and the newest draft is from April 2026. There is no enforceable statewide
              Zone 0 requirement right now.
            </p>
            <dl>
              <div><dt>In force today</dt><dd>Zone 1 and Zone 2 only — and those are inspected.</dd></div>
              <div><dt>If you ignore it</dt><dd>Citations from $100–$500, lien risk on the Zone 1 and 2 requirements.</dd></div>
              <div><dt>Watch for</dt><dd>Local ordinances. San Diego adopted its own ahead of the state.</dd></div>
            </dl>
          </div>
          <div className="track" data-live="true">
            <div className="th"><h3>The insurance standard</h3><span className="badge">In force now</span></div>
            <p className="auth">IBHS Wildfire Prepared Home · 10 CCR § 2644.9</p>
            <p>
              IBHS runs a voluntary designation with its own noncombustible first five feet — stricter than the state
              draft, with no vegetation exception. California separately requires insurers who price wildfire risk to
              discount documented mitigation.
            </p>
            <dl>
              <div><dt>In force today</dt><dd>Fully. You can pursue the designation this month.</dd></div>
              <div><dt>What it's worth</dt><dd>Published carrier credits of roughly 5–35%, plus a route off the FAIR Plan.</dd></div>
              <div><dt>The catch</dt><dd>All required actions, or none. Partial work doesn't earn the designation.</dd></div>
            </dl>
          </div>
        </div>
        <p className="note">
          Where they disagree: the state's draft allows well-irrigated low succulents inside the five-foot line.
          IBHS allows nothing. If you're working toward the discount, follow IBHS — the more lenient language
          won't get you there.
        </p>
      </div>

      <div className="sect">
        <h2>Plants that earn their place</h2>
        <p className="lede">
          Nothing belongs in the first five feet. Past that line, species choice matters — high moisture content,
          low dead-material retention, no resinous sap.
        </p>
        <div className="plants">
          {PLANTS.map((p) => (
            <div className="plant" key={p.n}>
              <div className="pn">{p.n}</div>
              <div className="ps">{p.s}</div>
              <div className="pd">{p.d}</div>
            </div>
          ))}
        </div>
        <p className="note">
          Keep away from structures: eucalyptus, juniper, Italian cypress, most ornamental grasses, dense-form
          rosemary, acacia. High oil content, heavy dead-material accumulation, or both.
        </p>
      </div>

      <div className="sect">
        <h2>Where this comes from</h2>
        <p className="lede">
          Every recommendation traces to a primary source. None of it is ours.
        </p>
        <div className="srcs">
          {SOURCES.map(([n, w]) => (
            <div className="src" key={n}>
              <span className="sname">{n}</span>
              <span className="swhat">{w}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-strip">
        <h2>See it on your own house</h2>
        <p>
          Six questions and one photo. You'll get the flagged conditions, what each one is worth under both
          standards, and what it takes to fix.
        </p>
        <button className="btn" onClick={onStart}>Start an assessment</button>
      </div>
    </>
  );
}

/* ---------------- root ---------------- */

export default function FireSafeVision() {
  const [tab, setTab] = useState("learn");

  return (
    <div className="fsv">
      <style>{CSS}</style>

      <header className="fsv-bar">
        <div className="fsv-bar-in">
          <div className="fsv-mark">
            <svg className="glyph" width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
              <circle cx="9.5" cy="9.5" r="8.5" stroke="#14211B" strokeWidth="1.1" />
              <circle cx="9.5" cy="9.5" r="5" stroke="#7FA3A0" strokeWidth="1.1" />
              <rect x="7" y="7" width="5" height="5" rx="1" fill="#14211B" />
            </svg>
            <span className="name">FireSafe Vision</span>
          </div>
          <nav className="fsv-tabs">
            <button className="fsv-tab" data-on={tab === "assess"} onClick={() => setTab("assess")}>Assess</button>
            <button className="fsv-tab" data-on={tab === "learn"} onClick={() => setTab("learn")}>Learn</button>
          </nav>
        </div>
      </header>

      <main className="fsv-main">
        {tab === "assess"
          ? <Assess onLearn={() => setTab("learn")} />
          : <Learn onStart={() => setTab("assess")} />}
      </main>
    </div>
  );
}
