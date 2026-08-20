/**
 * FireSafe Vision — Southern California Fire-Resilient Plant Database
 * Sources: CalScape (California Native Plant Society), UC Cooperative Extension,
 * CAL FIRE Vegetation Management, Las Pilitas Nursery Native Plant Database.
 */

export const PLANT_SELECTION_PRINCIPLES = [
  {
    trait: 'High moisture content',
    desc: 'Fleshy, well-hydrated foliage resists ignition and slows heat penetration.',
  },
  {
    trait: 'Water-like sap',
    desc: 'Non-resinous sap prevents the rapid explosive combustion common in pitch/oil-laden conifers.',
  },
  {
    trait: 'Open, airy growth habit',
    desc: 'Allows airflow and prevents dense buildup of interior dead twigs and dry wood.',
  },
  {
    trait: 'Broadleaf deciduous / semi-deciduous',
    desc: 'Generally far more fire-resilient than flammable resinous needle-bearing evergreens.',
  },
  {
    trait: 'Low dead-material retention',
    desc: 'Plants that shed litter cleanly and recover via resprouting after heat exposure.',
  },
]

export const PLANTS_TO_AVOID = [
  {
    name: 'Eucalyptus',
    scientific: 'Eucalyptus spp.',
    reason: 'Extremely high volatile oil content; shedding bark strips act as aerial torches throwing long-distance firebrands.',
  },
  {
    name: 'Italian Cypress',
    scientific: 'Cupressus sempervirens',
    reason: 'Dense columnar evergreen structure acts as a roman candle, pulling ground flames directly into roof eaves.',
  },
  {
    name: 'Juniper',
    scientific: 'Juniperus spp.',
    reason: 'Resinous foliage and thick interior accumulation of dead needle tinder; burns explosively.',
  },
  {
    name: 'Pampas Grass',
    scientific: 'Cortaderia selloana',
    reason: 'Invasive grass creating huge dry fuel mass; fine blades ignite instantly from ember contact.',
  },
  {
    name: 'Ornamental Grasses',
    scientific: 'Most non-native cultivars',
    reason: 'Fine dry blades provide high surface-area-to-volume ratio, facilitating rapid flame spread.',
  },
  {
    name: 'Rosemary (dense shrub form)',
    scientific: 'Salvia rosmarinus',
    reason: 'High essential oil content and heavy inner dead wood buildup unless aggressively pruned.',
  },
  {
    name: 'Acacia',
    scientific: 'Acacia spp.',
    reason: 'Resinous, highly invasive in Southern California hillsides, high dry-matter fuel load.',
  },
  {
    name: 'Bougainvillea',
    scientific: 'Bougainvillea spectabilis',
    reason: 'Dry papery flower bracts and woody stems climb walls directly up to wooden eaves.',
  },
  {
    name: 'Arborvitae / Thuja',
    scientific: 'Thuja spp.',
    reason: 'Dense resin-rich conifer that produces massive heat output when ignited.',
  },
  {
    name: 'Bamboo',
    scientific: 'Bambusa spp.',
    reason: 'Hollow dry canes accumulate dead leaf litter and crack loudly, shooting sparks under heat.',
  },
]

export const PLANT_DATABASE = [
  // Groundcovers & Low Perennials (Zone 1: 5–30 ft)
  {
    id: 'dudleya',
    name: 'Chalk dudleya',
    scientific: 'Dudleya pulverulenta',
    zone: 'Zone 1 (and Zone 0 state draft only)',
    type: 'Native succulent',
    height: '1–2 ft',
    water: 'Very low',
    fireResistance: 'Highest',
    desc: 'Chalky blue-green native rosette succulent. Extremely high moisture content, fire-resistant, thrives in poor gravel/rock soils.',
    highlight: true,
  },
  {
    id: 'yarrow',
    name: 'Common yarrow',
    scientific: 'Achillea millefolium',
    zone: 'Zone 1',
    type: 'Native perennial',
    height: '1–3 ft',
    water: 'Low to moderate',
    fireResistance: 'High',
    desc: 'Lush fern-like green foliage with white floral umbels. Drought-tolerant, excellent pollinator habitat, stays green with minimal irrigation.',
    highlight: true,
  },
  {
    id: 'fuchsia',
    name: 'California fuchsia',
    scientific: 'Epilobium canum',
    zone: 'Zone 1',
    type: 'Native perennial',
    height: '1–2 ft',
    water: 'Very low',
    fireResistance: 'High',
    desc: 'Vibrant scarlet tubular blossoms in late summer/fall. Spreads by rhizome to anchor topsoil, easily cut back annually in winter.',
    highlight: true,
  },
  {
    id: 'blue-eyed-grass',
    name: 'Blue-eyed grass',
    scientific: 'Sisyrinchium bellum',
    zone: 'Zone 1',
    type: 'Native perennial',
    height: '1 ft',
    water: 'Moderate',
    fireResistance: 'High',
    desc: 'Grass-like non-flammable iris relative with bright blue-purple petals. Excellent lawn replacement in low-traffic beds.',
  },
  {
    id: 'shaw-agave',
    name: "Shaw's agave",
    scientific: 'Agave shawii',
    zone: 'Zone 1',
    type: 'Native succulent',
    height: '2–4 ft',
    water: 'Very low',
    fireResistance: 'Highest',
    desc: 'Dramatic native architectural succulent from coastal sage scrub. Thick fleshy leaves store immense water volume.',
  },

  // Shrubs (Zone 1 & Zone 2)
  {
    id: 'lemonade-berry',
    name: 'Lemonade berry',
    scientific: 'Rhus integrifolia',
    zone: 'Zone 1 & Zone 2',
    type: 'Native evergreen shrub',
    height: '4–10 ft',
    water: 'Low',
    fireResistance: 'High',
    desc: 'Thick leathery leaves with high moisture retention. Can be pruned as a clean, open hedge or specimen shrub.',
    highlight: true,
  },
  {
    id: 'toyon',
    name: 'Toyon (California holly)',
    scientific: 'Heteromeles arbutifolia',
    zone: 'Zone 1 & Zone 2',
    type: 'Native shrub / small tree',
    height: '6–15 ft',
    water: 'Low',
    fireResistance: 'High',
    desc: 'Naturally fire-adapted keystone species. Features deep green serrated foliage, white summer flowers, and bright red winter berries.',
    highlight: true,
  },
  {
    id: 'coffeeberry',
    name: 'California coffeeberry',
    scientific: 'Frangula californica',
    zone: 'Zone 1 & Zone 2',
    type: 'Native evergreen shrub',
    height: '4–8 ft',
    water: 'Low',
    fireResistance: 'High',
    desc: 'Supple deep-green leaves with low fuel load and non-resinous tissue. One of the safest and cleanest native foundation shrubs.',
    highlight: true,
  },
  {
    id: 'catalina-cherry',
    name: 'Catalina cherry',
    scientific: 'Prunus ilicifolia ssp. lyonii',
    zone: 'Zone 2',
    type: 'Native small tree / large shrub',
    height: '10–25 ft',
    water: 'Low',
    fireResistance: 'High',
    desc: 'Dense, glossy green canopy that resists wind desiccation. Deep root anchor with low flammability when irrigated periodically.',
    highlight: true,
  },
  {
    id: 'hummingbird-sage',
    name: 'Hummingbird sage',
    scientific: 'Salvia spathacea',
    zone: 'Zone 1',
    type: 'Native sage groundcover',
    height: '1–2 ft',
    water: 'Low',
    fireResistance: 'Medium-High',
    desc: 'Fruity-scented broad leaves forming lush low colonies. Unlike woody shrub sages, this herbaceous sage stays low with minimal dead wood.',
  },

  // Trees (Zone 1 & Zone 2)
  {
    id: 'coast-live-oak',
    name: 'Coast live oak',
    scientific: 'Quercus agrifolia',
    zone: 'Zone 2 (canopy >= 10ft from roof)',
    type: 'Native evergreen oak',
    height: '25–50 ft',
    water: 'Very low',
    fireResistance: 'Highest for trees',
    desc: 'Thick fire-resistant corky bark; deep taproots stabilize hillsides; canopy shields understory from flying embers when limbed up 6+ ft.',
  },
  {
    id: 'desert-willow',
    name: 'Desert willow',
    scientific: 'Chilopsis linearis',
    zone: 'Zone 1 & Zone 2',
    type: 'Native deciduous tree',
    height: '15–25 ft',
    water: 'Low',
    fireResistance: 'High',
    desc: 'Airy, open branching structure with orchid-like pink blossoms. Deciduous habit removes canopy fuel during winter dormancy.',
  },
]
