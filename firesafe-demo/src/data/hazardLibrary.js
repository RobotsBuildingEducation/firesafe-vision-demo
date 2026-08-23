/**
 * FireSafe Vision — Hazard Library
 * Structured definitions for Zone 0, Zone 1, and Zone 2 hazard flags.
 * Sources: CAL FIRE PRC § 4291, Board of Forestry Zone 0 draft,
 * IBHS Wildfire Prepared Home Technical Standard, 10 CCR § 2644.9 (Safer from Wildfires).
 */

export const HAZARD_LIBRARY = {
  // === ZONE 0 HAZARDS (0–5 ft) ===
  'Z0-SURFACE': {
    code: 'Z0-SURFACE',
    zone: 0,
    severity: 'high',
    standard: 'BOTH',
    title: 'No non-combustible perimeter',
    reg: ['Anticipated', 'In the state draft rule (§1298.04); not yet adopted statewide.'],
    ins: ['Required', 'Mandatory for both IBHS Essential and Enhanced designations.'],
    action: 'Replace the surface material within five feet of every wall with non-combustible hardscaping.',
    options: '3/4-inch crushed gravel, decomposed granite, concrete, brick, flagstone, or pervious pavers.',
    why: 'Surface material in the first five feet is the primary pathway for wind-blown ember ignition. Replacing it is the single highest-impact action on the property.',
    cost: 'Low to medium · DIY accessible',
    diverges: false,
  },
  'Z0-MULCH': {
    code: 'Z0-MULCH',
    zone: 0,
    severity: 'high',
    standard: 'BOTH',
    title: 'Combustible mulch against the wall',
    reg: ['Anticipated', 'In the state draft rule; pending statewide adoption.'],
    ins: ['Required', 'Mandatory for both IBHS Essential and Enhanced designations.'],
    action: 'Pull all bark and wood-chip mulch out of the first five feet entirely.',
    options: 'Replace with inorganic crushed gravel, pebbles, or decomposed granite.',
    why: 'Bark mulch acts as an ember bed — catching flying embers, smoldering quietly, and transferring direct flame to siding or foundation vents.',
    cost: 'Low · DIY accessible (free to clear)',
    diverges: false,
  },
  'Z0-LAWN': {
    code: 'Z0-LAWN',
    zone: 0,
    severity: 'medium',
    standard: 'BOTH',
    title: 'Lawn running up to the wall',
    reg: ['Anticipated', 'In the state draft rule; pending statewide adoption.'],
    ins: ['Required', 'Mandatory for both IBHS Essential and Enhanced designations.'],
    action: 'Pull turf back five feet and install a non-combustible hardscape edge along the foundation.',
    options: 'Gravel band, decomposed granite apron, or flagstone walkway. Maintain irrigation on lawn beyond five feet.',
    why: 'Turf grass cures out quickly during dry windy spells and carries creeping ground fire directly to the foundation walls.',
    cost: 'Low to medium · DIY accessible',
    diverges: false,
  },
  'Z0-VEG': {
    code: 'Z0-VEG',
    zone: 0,
    severity: 'high',
    standard: 'IBHS',
    title: 'Plants within five feet of the wall',
    reg: ['Anticipated, with exception', 'State draft allows well-irrigated, low-growing succulents (e.g. Dudleya).'],
    ins: ['Required, zero exception', 'IBHS requires zero vegetation in the first five feet.'],
    action: 'Remove all plants, shrubs, and organic ground cover inside the five-foot line.',
    options: 'Relocate plantings outward to Zone 1 (starting at 5 ft) where a rich native palette is permitted.',
    why: 'This is the primary point where the two standards diverge. If you are seeking an insurance discount under Safer from Wildfires (10 CCR § 2644.9), follow the stricter IBHS zero-vegetation rule.',
    cost: 'Low · DIY accessible',
    diverges: true,
  },
  'Z0-FENCE': {
    code: 'Z0-FENCE',
    zone: 0,
    severity: 'high',
    standard: 'BOTH',
    title: 'Combustible fence attached to the structure',
    reg: ['Anticipated', 'State draft §1298.04(b)(8)–(9). Note: check local ordinances (e.g., San Diego allows certain vinyl).'],
    ins: ['Required', 'Mandatory for both IBHS Essential and Enhanced designations.'],
    action: 'Replace the section of fence that touches the structure with non-combustible material.',
    options: 'Aluminum, steel, wrought iron, masonry wall, fiber-cement, or a 5-foot metal transition gate.',
    why: 'A wood fence functions like a burning fuse, guiding surface flame directly into the home siding and eaves.',
    cost: 'Medium to high · Contractor recommended',
    diverges: false,
  },
  'Z0-GUTTER': {
    code: 'Z0-GUTTER',
    zone: 0,
    severity: 'high',
    standard: 'BOTH',
    title: 'Debris in gutters, eaves, or roof valleys',
    reg: ['Anticipated', 'In the state draft rule and standard fire safe guidelines.'],
    ins: ['Required', 'Mandatory for both IBHS Essential and Enhanced designations.'],
    action: 'Clear all dry pine needles, leaves, and organic litter from gutters, eaves, and roof valleys.',
    options: 'Install non-combustible corrosion-resistant metal mesh gutter covers (tested to WUI standards).',
    why: 'Wind-blown embers collect in roof valleys and dry gutters. Burning gutter litter quickly ignites fascia boards and under-eave venting.',
    cost: 'Low · DIY accessible (clear immediately)',
    diverges: false,
  },
  'Z0-ITEMS': {
    code: 'Z0-ITEMS',
    zone: 0,
    severity: 'medium',
    standard: 'IBHS',
    title: 'Combustible items stored against structure',
    reg: ['Not addressed', 'Current state draft text is silent on movable patio items.'],
    ins: ['Required', 'Mandatory for both IBHS Essential and Enhanced designations.'],
    action: 'Relocate firewood piles, trash bins, propane tanks, combustible furniture, and door mats beyond five feet.',
    options: 'Store firewood >= 30 ft away or in a non-combustible enclosure. Metal patio furniture is permitted.',
    why: 'Movable combustible items against exterior walls create high-intensity point-source fires that breach windows and siding.',
    cost: 'Free · Immediate action today',
    diverges: false,
  },
  'Z0-VENT': {
    code: 'Z0-VENT',
    zone: 0,
    severity: 'high',
    standard: 'IBHS-only',
    title: 'Vents without ember-resistant screening',
    reg: ['Not required for retrofits', 'State Building Code Ch. 7A mandates ember-resistant vents for new construction only, not retrofits.'],
    ins: ['Required', 'Mandatory for IBHS Essential designation (tested to ASTM E2886 standard).'],
    action: 'Cover or replace foundation, gable, soffit, and crawlspace vents with ember-resistant mesh.',
    options: '1/16-inch to 1/8-inch corrosion-resistant stainless steel mesh or certified baffle vent retrofits (ASTM E2886).',
    why: 'Wind-driven embers enter attic and foundation vents, igniting homes from the interior regardless of yard landscaping.',
    cost: 'Low to medium · DIY accessible for mesh inserts',
    diverges: false,
  },

  // === ZONE 1 HAZARDS (5–30 ft) ===
  'Z1-DEAD': {
    code: 'Z1-DEAD',
    zone: 1,
    severity: 'high',
    standard: 'PRC 4291',
    title: 'Dead and dry vegetation in Zone 1',
    reg: ['Enforceable today', 'State law under PRC § 4291; actively inspected by fire authorities.'],
    ins: ['Counts toward credit', 'Required under CA Department of Insurance defensible space rules.'],
    action: 'Remove all dead plants, dried grasses, dead branches, and accumulated leaf litter between 5 and 30 feet.',
    options: 'Establish a monthly dry-season inspection and clearance routine.',
    why: 'Dead plant tissue has negligible moisture content and ignites at low heat, amplifying flame front intensity.',
    cost: 'Low · DIY accessible',
    diverges: false,
  },
  'Z1-LADDER': {
    code: 'Z1-LADDER',
    zone: 1,
    severity: 'high',
    standard: 'PRC 4291',
    title: 'Ladder fuels beneath tree canopies',
    reg: ['Enforceable today', 'Mandated under PRC § 4291 defensible space rules.'],
    ins: ['Counts toward credit', 'Defensible space compliance prerequisite.'],
    action: 'Clear shrubs and small trees growing beneath larger mature tree canopies.',
    options: 'Maintain vertical separation equal to at least 3× the height of underlying shrubs to the lowest tree limb.',
    why: 'Ladder fuels allow low-intensity surface fires to climb directly into the tree canopy, creating destructive crown fires.',
    cost: 'Low to medium · DIY accessible / arborist',
    diverges: false,
  },
  'Z1-DENSE': {
    code: 'Z1-DENSE',
    zone: 1,
    severity: 'high',
    standard: 'PRC 4291',
    title: 'Dense continuous shrub masses',
    reg: ['Enforceable today', 'State law under PRC § 4291.'],
    ins: ['Counts toward credit', 'Required for wildfire risk mitigation credits.'],
    action: 'Break up continuous hedge or brush lines into separated plant groupings.',
    options: 'Space shrub clusters by at least 2× shrub height on flat ground, and 3× on slopes.',
    why: 'Continuous thick vegetation provides an uninterrupted path of fuel leading directly toward the home.',
    cost: 'Low to medium · DIY accessible',
    diverges: false,
  },
  'Z1-SPACING': {
    code: 'Z1-SPACING',
    zone: 1,
    severity: 'medium',
    standard: 'PRC 4291',
    title: 'Insufficient horizontal plant spacing',
    reg: ['Enforceable today', 'Mandated under PRC § 4291.'],
    ins: ['Counts toward credit', 'Part of comprehensive defensible space review.'],
    action: 'Thin plantings to maintain at least 10 ft separation between tree canopies.',
    options: 'Replace dense invasive shrubs with fire-resilient native perennials spaced in island groupings.',
    why: 'Horizontal gaps prevent radiant heat transfer from plant to plant.',
    cost: 'Low to medium · DIY accessible',
    diverges: false,
  },
  'Z1-LIMB': {
    code: 'Z1-LIMB',
    zone: 1,
    severity: 'medium',
    standard: 'PRC 4291',
    title: 'Low-hanging tree limbs below 6 feet',
    reg: ['Enforceable today', 'Mandated under PRC § 4291.'],
    ins: ['Counts toward credit', 'Standard defensible space inspection item.'],
    action: 'Prune all lower tree branches up to a minimum clearance of 6 feet from the ground (8–10 ft on slopes).',
    options: 'Do not remove more than 1/3 of the tree crown in a single growing season.',
    why: 'Limbing up prevents surface grass fires from igniting the tree canopy.',
    cost: 'Low to medium · DIY or arborist',
    diverges: false,
  },
  'Z1-SLOPE': {
    code: 'Z1-SLOPE',
    zone: 1,
    severity: 'medium',
    standard: 'PRC 4291',
    title: 'Slope present without expanded spacing',
    reg: ['Enforceable today', 'Mandated under PRC § 4291 topography rules.'],
    ins: ['Counts toward credit', 'Factored into site risk scoring.'],
    action: 'Expand shrub and tree spacing by 50% to 100% on sloped ground facing the home.',
    options: 'Install low terraced rock retaining walls to break slope velocity and stabilize soil with deep-rooted natives.',
    why: 'Wildfire travels up to 4× faster uphill due to pre-heating of uphill vegetation by rising hot air and convection.',
    cost: 'Medium to high · Landscape contractor',
    diverges: false,
  },

  // === ZONE 2 HAZARDS (30–100 ft) ===
  'Z2-DEAD': {
    code: 'Z2-DEAD',
    zone: 2,
    severity: 'high',
    standard: 'PRC 4291',
    title: 'Dead or dying trees in outer fuel zone',
    reg: ['Enforceable today', 'Mandated under PRC § 4291 Zone 2.'],
    ins: ['Counts toward credit', 'Required clearance.'],
    action: 'Fell and remove dead, drought-killed, or beetle-infested trees from the 30–100 ft perimeter.',
    options: 'Hire a licensed tree care professional to safely fell hazardous trees.',
    why: 'Dead standing timber generates extreme radiant heat and throws long-distance firebrands into Zone 0.',
    cost: 'Medium to high · Licensed arborist',
    diverges: false,
  },
  'Z2-CANOPY': {
    code: 'Z2-CANOPY',
    zone: 2,
    severity: 'medium',
    standard: 'PRC 4291',
    title: 'Overlapping canopies in Zone 2',
    reg: ['Enforceable today', 'Mandated under PRC § 4291.'],
    ins: ['Counts toward credit', 'Reduced fuel standard.'],
    action: 'Thin tree canopies to maintain 18 ft spacing at 30 ft, tapering to 6 ft spacing at 100 ft.',
    options: 'Selective thinning focusing on keeping healthy, deep-rooted native broadleaf trees.',
    why: 'Canopy separation prevents high-speed crown fire runs across the property.',
    cost: 'Medium · Professional tree service',
    diverges: false,
  },
  'Z2-STEEP': {
    code: 'Z2-STEEP',
    zone: 2,
    severity: 'high',
    standard: 'PRC 4291',
    title: 'Steep slope (>40%) with dense vegetation',
    reg: ['Enforceable today', 'PRC § 4291 slope modifier requirements.'],
    ins: ['Counts toward credit', 'WUI high hazard standard.'],
    action: 'On slopes exceeding 40%, eliminate all grouped plantings — keep individual isolated specimens only.',
    options: 'Space shrubs 6× their height; install gabion or rock stabilization where needed.',
    why: 'Steep slopes create chimney effects that funnel extreme fire energy toward the crest.',
    cost: 'Medium to high · Contractor',
    diverges: false,
  },
  'Z2-LIMB': {
    code: 'Z2-LIMB',
    zone: 2,
    severity: 'low',
    standard: 'PRC 4291',
    title: 'Unpruned lower branches in Zone 2',
    reg: ['Enforceable today', 'Mandated under PRC § 4291.'],
    ins: ['Counts toward credit', 'General maintenance.'],
    action: 'Prune branches within 6 feet of the ground on all mature trees in Zone 2.',
    options: 'Mow or cut dry annual grasses to a maximum height of 4 inches during dry season.',
    why: 'Maintains an open understory so approaching fires drop to low-intensity ground fires that firefighters can suppress.',
    cost: 'Low · DIY accessible',
    diverges: false,
  },
}

export const PIN_COORDINATES = {
  'Z0-FENCE': [5, 52],
  'Z0-SURFACE': [22, 58],
  'Z0-MULCH': [38, 80],
  'Z0-LAWN': [30, 82],
  'Z0-VEG': [60, 58],
  'Z0-GUTTER': [40, 24],
  'Z0-ITEMS': [52, 60],
  'Z0-VENT': [16, 56],
  'Z1-DEAD': [72, 70],
  'Z1-LADDER': [7, 24],
  'Z1-DENSE': [54, 62],
  'Z1-SPACING': [82, 64],
  'Z1-LIMB': [10, 18],
  'Z1-SLOPE': [88, 75],
  'Z2-DEAD': [15, 30],
  'Z2-CANOPY': [48, 18],
  'Z2-STEEP': [86, 75],
  'Z2-LIMB': [72, 35],
}

function hasOption(val, keyword) {
  if (!val) return false
  if (Array.isArray(val)) {
    return val.some((v) => v.toLowerCase().includes(keyword.toLowerCase()))
  }
  return String(val).toLowerCase().includes(keyword.toLowerCase())
}

export function deriveHazardFlags(intake) {
  const flags = []

  // Zone 0 Evaluation (0–5 ft)
  if (hasOption(intake.surface, 'mulch') || hasOption(intake.surface, 'bark')) {
    flags.push('Z0-MULCH', 'Z0-SURFACE')
  }
  if (hasOption(intake.surface, 'lawn') || hasOption(intake.surface, 'turf')) {
    flags.push('Z0-LAWN', 'Z0-SURFACE')
  }
  if (hasOption(intake.surface, 'soil') || hasOption(intake.surface, 'dirt')) {
    flags.push('Z0-SURFACE')
  }
  if (
    !hasOption(intake.surface, 'gravel') &&
    !hasOption(intake.surface, 'concrete') &&
    !hasOption(intake.surface, 'paver') &&
    !hasOption(intake.surface, 'granite')
  ) {
    flags.push('Z0-SURFACE')
  }

  if (
    hasOption(intake.veg, 'shrub') ||
    hasOption(intake.veg, 'dense') ||
    hasOption(intake.veg, 'ivy') ||
    hasOption(intake.veg, 'vine') ||
    hasOption(intake.veg, 'succulent') ||
    hasOption(intake.veg, 'perennial') ||
    hasOption(intake.veg, 'yes')
  ) {
    flags.push('Z0-VEG')
  }

  if (
    hasOption(intake.fence, 'wood') ||
    hasOption(intake.fence, 'vinyl') ||
    hasOption(intake.fence, 'deck') ||
    hasOption(intake.fence, 'porch')
  ) {
    flags.push('Z0-FENCE')
  }

  if (
    hasOption(intake.vents, 'coarse') ||
    hasOption(intake.vents, 'open') ||
    hasOption(intake.vents, 'not sure') ||
    hasOption(intake.vents, 'crawlspace') ||
    hasOption(intake.vents, 'soffit')
  ) {
    flags.push('Z0-VENT')
  }

  if (
    hasOption(intake.stored, 'firewood') ||
    hasOption(intake.stored, 'trash') ||
    hasOption(intake.stored, 'propane') ||
    hasOption(intake.stored, 'furniture') ||
    hasOption(intake.stored, 'mat') ||
    hasOption(intake.stored, 'yes')
  ) {
    flags.push('Z0-ITEMS')
  }

  if (
    hasOption(intake.gutters, 'needle') ||
    hasOption(intake.gutters, 'leaf') ||
    hasOption(intake.gutters, 'debris') ||
    hasOption(intake.gutters, 'valley') ||
    hasOption(intake.gutters, 'dead')
  ) {
    flags.push('Z0-GUTTER', 'Z1-DEAD')
  }

  // Zone 1 Evaluation (5–30 ft)
  if (
    hasOption(intake.topography, 'slope') ||
    hasOption(intake.topography, 'canyon') ||
    hasOption(intake.topography, 'ridgetop')
  ) {
    flags.push('Z1-SLOPE')
  }

  if (
    hasOption(intake.veg, 'branch') ||
    hasOption(intake.veg, 'overhang') ||
    hasOption(intake.veg, 'limb')
  ) {
    flags.push('Z1-LADDER', 'Z1-LIMB')
  }

  if (
    hasOption(intake.veg, 'dense') ||
    hasOption(intake.veg, 'shrub') ||
    hasOption(intake.veg, 'ivy')
  ) {
    flags.push('Z1-DENSE', 'Z1-SPACING')
  }

  // Zone 2 Evaluation (30–100 ft)
  if (
    hasOption(intake.topography, 'steep') ||
    hasOption(intake.topography, 'canyon')
  ) {
    flags.push('Z2-STEEP')
  }

  if (hasOption(intake.zone, 'zone 2') || hasOption(intake.zone, 'all')) {
    flags.push('Z2-CANOPY', 'Z2-LIMB')
  }

  return [...new Set(flags)]
}
