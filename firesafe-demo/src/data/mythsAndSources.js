/**
 * FireSafe Vision — Myths, Zone Rules, and Authoritative Sources
 */

export const MYTHS = [
  {
    id: 'myth-flames',
    verdict: 'false',
    question: 'The wildfire flames never reached our street, so our house was never really in danger.',
    answer:
      'Over 85% of homes destroyed in catastrophic California wildfires are ignited not by the main flame wall, but by wind-driven embers. These firebrands travel miles ahead of the fire front, lodging into gutters, under roof tiles, into attic vents, and against wood mulch banking the siding.',
  },
  {
    id: 'myth-100ft',
    verdict: 'false',
    question: 'Clearing brush 100 feet out is the only thing that actually protects a house.',
    answer:
      'While the 100-foot Zone 2 clearance is legally required under PRC § 4291 to slow flame velocity, IBHS and NIST research proves that the first 5 feet (Zone 0) is the ultimate determinant of survival. A 100-foot cleared lot will not save a home if glowing embers land in dry mulch or patio cushions next to wood siding.',
  },
  {
    id: 'myth-natives',
    verdict: 'partly',
    question: 'All California native and drought-tolerant plants are automatically fire-safe.',
    answer:
      'Native does not inherently mean fire-resistant. Chaparral native species (like overgrown buckbrush or neglected chamise) are fire-adapted—meaning they are designed by nature to burn aggressively and regenerate. Choosing broadleaf, high-moisture natives with airy growth habits and regular dead-wood pruning is critical.',
  },
  {
    id: 'myth-zone0-law',
    verdict: 'false',
    question: 'There is an active statewide Zone 0 law that I am currently violating.',
    answer:
      'Not yet statewide. AB 3074 directed the California Board of Forestry to draft Zone 0 ember-resistant zone rules. The initial 2025 deadline passed without adoption, and the latest release is a draft from April 2026. However, some municipal jurisdictions (like the City of San Diego) have already enacted local Zone 0 laws, and PRC § 4291 Zone 1 and 2 rules remain fully enforceable statewide.',
  },
  {
    id: 'myth-roi',
    verdict: 'partly',
    question: 'Defensible space and home hardening upgrades never pay for themselves.',
    answer:
      'Under California Insurance Code regulation 10 CCR § 2644.9 ("Safer from Wildfires", expanded by AB 1 in Jan 2026), admitted insurance carriers pricing wildfire risk are required to provide documented premium discounts (ranging from 5% to 35%) for completing these designated mitigations, in addition to helping homeowners secure coverage outside the FAIR Plan.',
  },
]

export const DEFENSIBLE_ZONES = [
  {
    zone: 'Zone 0',
    range: '0–5 ft',
    title: 'The Ember-Resistant Ignition Zone',
    subtitle: 'Zero combustible materials immediately adjacent to structures',
    corePrinciple:
      'Eliminate all potential ember reception beds. If an ember lands here, it should burn out on stone or bare mineral soil without finding fuel.',
    requirements: [
      '<b>Ground Surface:</b> Crushed 3/4-inch gravel, decomposed granite, concrete pavers, or bare mineral soil.',
      '<b>Vegetation:</b> Zero plants for IBHS Insurance designation (state draft allows irrigated succulent exceptions).',
      '<b>Fencing:</b> Replace attached wood/vinyl fence runs within 5 ft of structure with metal, masonry, or gate breaks.',
      '<b>Storage:</b> No firewood, plastic garbage bins, propane tanks, or combustible patio furniture against walls.',
      '<b>Vents:</b> Retrofit attic and foundation vents with 1/16″ to 1/8″ ASTM E2886 corrosion-resistant stainless mesh.',
    ],
  },
  {
    zone: 'Zone 1',
    range: '5–30 ft',
    title: 'Lean, Clean, and Green Zone',
    subtitle: 'Actively maintained, irrigated, and horizontally spaced vegetation',
    corePrinciple:
      'Keep plant fuel loads low and well-hydrated to stop ground fire from propagating or leaping into tree canopies.',
    requirements: [
      '<b>Shrub Spacing:</b> Space shrubs at 2× shrub height on flat ground, expanding to 3× on slopes.',
      '<b>Tree Canopies:</b> Maintain at least 10 ft horizontal separation between mature tree canopies.',
      '<b>Limbing Up:</b> Prune lower tree branches up to 6 ft from the ground (8–10 ft on steep slopes).',
      '<b>Ladder Fuels:</b> Remove all intermediate brush beneath tree drip lines to prevent crown fire transitions.',
      '<b>Cleanliness:</b> Clear dead wood, pine needles, dry grasses, and fallen leaves on a recurring schedule.',
    ],
  },
  {
    zone: 'Zone 2',
    range: '30–100 ft',
    title: 'Reduced Fuel Area',
    subtitle: 'Interrupted fuels to break wildfire momentum and lower radiant heat',
    corePrinciple:
      'Thin out continuous vegetation so an oncoming wildfire drops to low flame lengths that firefighters can safely suppress.',
    requirements: [
      '<b>Canopy Gaps:</b> 18 ft between tree edges at 30 ft, tapering down to 6 ft separation at 100 ft.',
      '<b>Slope Modifiers:</b> Under 20% slope: 20 ft canopy gap; 20–40% slope: 40 ft gap; >40%: individual trees only.',
      '<b>Dead Standing Wood:</b> Remove dead, drought-stressed, and insect-damaged trees promptly.',
      '<b>Grass Management:</b> Mow annual grasses to 4 inches or less during dry fire season.',
      '<b>Access Routes:</b> Keep driveway corridors clear with 12 ft horizontal and 15 ft vertical clearance for fire engines.',
    ],
  },
]

export const SOURCES = [
  {
    name: 'CAL FIRE / PRC § 4291',
    scope: 'Defensible space statutory mandate for State Responsibility Areas (SRAs). Establishes Zone 1 & Zone 2 clearance and inspection authority.',
    url: 'https://www.fire.ca.gov/defensible-space',
  },
  {
    name: 'CA Board of Forestry & Fire Protection',
    scope: 'Zone 0 (0–5 ft) ember-resistant rulemaking docket. Public draft released April 17, 2026 under AB 3074 implementation.',
    url: 'https://bof.fire.ca.gov',
  },
  {
    name: 'IBHS Wildfire Prepared Home™',
    scope: 'Insurance Institute for Business & Home Safety technical standards (Essential and Enhanced tiers). Zero-vegetation Zone 0 mandate and ASTM E2886 vent standards.',
    url: 'https://wildfireprepared.org',
  },
  {
    name: 'CA Dept of Insurance (10 CCR § 2644.9 & AB 1)',
    scope: 'Safer from Wildfires framework requiring admitted property insurers to offer transparent discounts (5–35%) for verified hardening actions.',
    url: 'https://www.insurance.ca.gov',
  },
  {
    name: 'CalScape & UC Cooperative Extension',
    scope: 'Plant flammability studies, moisture retention indexing, and Southern California native plant palettes.',
    url: 'https://calscape.org',
  },
  {
    name: 'USGBC-CA Wildfire Defense Curriculum',
    scope: 'Post-fire resilient community rebuilding guidance, materials handoff, and contractor specifications.',
    url: 'https://usgbc-ca.org',
  },
]
