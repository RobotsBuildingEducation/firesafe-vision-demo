FireSafe Vision — AI-powered property assessment for wildfire resilience

### Design in simple terms

The logic is I take a photo and lets say its 0 - 5 ft away from the home and they upload that to the platform, then the generative AI part would transform the wildfire detriments into ideal native wildfire plants/materials would look like before they were to get the services/money to change their property

### Documentation

---

A homeowner uploads a photo of their property. The tool returns a transformed, AI-generated view showing fire-resilient design applied to their specific space — zone by zone.

The problem
Abstract guidance
Rebuilding guides stay generic. Homeowners can't picture what "Zone 0 hardscaping" actually means for their yard.

Decision paralysis
Dozens of material, plant, and layout choices with no visual feedback make post-fire rebuilding overwhelming.

Trust gap
Nonprofits and outreach teams need a tangible, visual artifact to build trust with displaced communities.

How it works
01
Upload photo
Homeowner uploads a photo of their property or specific zone

02
Select conditions
Choose topography, zone, current risk factors from the course framework

03
AI generates vision
Image generation renders fire-resilient design onto their actual property

04
Get action plan
Materials list, plant species, contractor connections — all localized

Before / after concept
Current state — high risk
Vegetation 0-5ft
No spacing
Fire-resilient vision
Gravel zone 0
Spaced natives

Tech stack — open source
Image generation
Stable Diffusion / DALL-E API with property-specific prompting
Vision analysis
GPT-4 Vision or Claude to read property conditions from photo
Knowledge base
USGBC-CA course content + CAL FIRE zone rules as RAG context
Frontend
React + Next.js — mobile-first, works in the field
Deployment
Open source repo — forkable by other nonprofits and COGs
Output
Shareable PDF with image, zone plan, materials, plant list

Potential reach
16K+
structures lost in LA County fires, Jan 2025
19
LARC colleges that could distribute the tool
$0
cost to homeowner — open source, grant-funded

n scope — MVP
in
Photo upload + zone selector
Homeowner uploads a property photo and selects which zone they want assessed (Zone 0, 1, or 2). Mobile-first, works on field visits.

in
Property condition intake
Short form: topography type, current vegetation, fence material, existing hardscaping. Feeds the prompt context for generation.

in
AI vision analysis
Claude or GPT-4 Vision reads the uploaded photo and surfaces hazards automatically — e.g. combustible fence in Zone 0, dense vegetation.

in
Before / after image generation
Stable Diffusion img2img conditioned on a fire-resilient design prompt. Generates a transformed version of the same property photo.

in
Recommendations output
Zone-specific action list with materials (gravel, fiber cement, metal fencing), native plant species for SoCal, and spacing guidance from the USGBC-CA curriculum.

in
Shareable PDF report
One-page output: before/after image, hazard flags, recommended actions, plant list. Designed to hand to a contractor or bring to a city permitting office.

Out of scope — v1
out
Contractor matching
Directory integration deferred. v1 links to USGBC-CA professionals directory.

out
Permit filing
Regulatory complexity varies by jurisdiction. Out of scope for prototype.

out
3D site modeling
LiDAR / parcel data integration is a v2 consideration tied to SGVCOG data access.

Future additions

Future additions
later
Neighborhood view
Aggregate risk score for a block — useful for FireSafe Council and COG outreach.

later
Multilingual
Spanish first — critical for Altadena/Pasadena affected populations.

later
Incentive finder
Auto-surface rebates and grants relevant to recommended upgrades.
