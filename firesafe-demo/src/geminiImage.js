import { getAI, getGenerativeModel, ResponseModality, VertexAIBackend } from 'firebase/ai'
import { getToken } from 'firebase/app-check'
import { appCheck, firebaseApp } from './firebase'

export const GEMINI_IMAGE_MODEL = 'gemini-3.1-flash-image'

/**
 * Force-mint an App Check token BEFORE calling Vertex AI so the *real*
 * root cause (bad site key, domain not allowlisted, unregistered debug
 * token, blocked reCAPTCHA script) surfaces here instead of as a generic
 * 401 "App Check token is invalid" from generateContent.
 */
/**
 * Reports which attestation flow is actually live in this browser tab.
 * Never logs secret values — only the mode, so 401s become diagnosable.
 */
function describeAppCheckFlow() {
  const debugGlobal = typeof window !== 'undefined' && window.FIREBASE_APPCHECK_DEBUG_TOKEN
  const enterprise = !!(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY || '').trim()
  const mode = debugGlobal ? 'debug-token' : enterprise ? 'reCAPTCHA Enterprise' : 'reCAPTCHA v3'
  return `flow=${mode} host=${window.location.host}`
}

async function ensureAppCheckToken() {
  if (!appCheck) {
    throw new Error(
      'App Check is not initialized (missing VITE_RECAPTCHA_SITE_KEY at build time). ' +
        'Add the key to .env and rebuild, otherwise enforced Firebase AI Logic calls 401.',
    )
  }
  try {
    // forceRefresh=true: bypass the cached token. Required here because the
    // old code forced a debug token on localhost, and that invalid token can
    // sit in IndexedDB cache and keep 401ing even after domains are fixed.
    const result = await getToken(appCheck, true)
    if (!result?.token) {
      throw new Error('App Check minted an empty token.')
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    throw new Error(
      `App Check could not mint a token on ${window.location.hostname}. ` +
        `Root cause: ${detail}. Fix: (1) localhost must be in your reCAPTCHA key's allowed domains, ` +
        `or set VITE_APPCHECK_DEBUG_TOKEN to a console-registered debug token; ` +
        `(2) production/preview domains must be allowlisted on the same reCAPTCHA key; ` +
        `(3) Firebase Console provider type (v3 vs Enterprise) must match the code.`,
      { cause: err },
    )
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function fileToImagePart(file) {
  return {
    inlineData: {
      data: await fileToBase64(file),
      mimeType: file.type || 'image/jpeg',
    },
  }
}

function getImageModel() {
  // Replay protection is enforced on Firebase AI Logic. Session tokens are
  // rejected with 401 "App Check token is invalid" — each call needs a
  // fresh limited-use token.
  const ai = getAI(firebaseApp, {
    backend: new VertexAIBackend('global'),
    useLimitedUseAppCheckTokens: true,
  })

  return getGenerativeModel(ai, {
    model: GEMINI_IMAGE_MODEL,
    generationConfig: {
      responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE],
    },
  })
}

async function generateWithDirectApiKey({ apiKey, photoFile, prompt }) {
  const imageBase64 = await fileToBase64(photoFile)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  data: imageBase64,
                  mime_type: photoFile.type || 'image/jpeg',
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    },
  )

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Gemini API request failed (${response.status}). ${body}`)
  }

  const body = await response.json()
  const parts = body.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((part) => {
    const inlineData = part.inlineData ?? part.inline_data
    return inlineData?.mimeType?.startsWith('image/') || inlineData?.mime_type?.startsWith('image/')
  })
  const inlineData = imagePart?.inlineData ?? imagePart?.inline_data

  if (!inlineData?.data) {
    const textDesc = parts.map((p) => p.text).filter(Boolean).join(' ')
    throw new Error(`Gemini returned analysis text but no generated image: ${textDesc.slice(0, 150)}`)
  }

  return {
    imageUrl: `data:${inlineData.mimeType ?? inlineData.mime_type ?? 'image/png'};base64,${inlineData.data}`,
    model: GEMINI_IMAGE_MODEL,
    text: parts
      .map((part) => part.text)
      .filter(Boolean)
      .join(' '),
  }
}

async function generateWithFirebaseVertexAI({ photoFile, prompt }) {
  try {
    // Surface attestation problems with an actionable message first.
    await ensureAppCheckToken()

    const model = getImageModel()
    const imagePart = await fileToImagePart(photoFile)
    const result = await model.generateContent([{ text: prompt }, imagePart])

    const parts = result.response.candidates?.[0]?.content?.parts ?? []
    const imagePartObj = parts.find((p) => {
      const inline = p.inlineData ?? p.inline_data
      return inline?.mimeType?.startsWith('image/') || inline?.mime_type?.startsWith('image/')
    })
    const inlineData = imagePartObj?.inlineData ?? imagePartObj?.inline_data

    let generatedImageUrl = ''
    if (inlineData?.data) {
      generatedImageUrl = `data:${inlineData.mimeType ?? inlineData.mime_type ?? 'image/png'};base64,${inlineData.data}`
    } else {
      const inlineParts = result.response.inlineDataParts?.() ?? []
      const fallbackPart = inlineParts.find((p) => p.inlineData?.mimeType?.startsWith('image/'))
      if (fallbackPart?.inlineData?.data) {
        generatedImageUrl = `data:${fallbackPart.inlineData.mimeType};base64,${fallbackPart.inlineData.data}`
      }
    }

    if (!generatedImageUrl) {
      const textOutput = result.response.text?.() || parts.map((p) => p.text).filter(Boolean).join(' ') || ''
      throw new Error(`Gemini returned analysis text but no image was generated: ${textOutput.slice(0, 150)}`)
    }

    return {
      imageUrl: generatedImageUrl,
      model: GEMINI_IMAGE_MODEL,
      text: result.response.text?.() ?? '',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (message.includes('GEN_AI_CONFIG_NOT_FOUND')) {
      throw new Error('Firebase AI Logic is missing provider configuration in Firebase Console.', {
        cause: error,
      })
    }

    if (
      message.includes('App Check token is invalid') ||
      message.includes('401') ||
      message.includes('UNAUTHENTICATED') ||
      message.includes('fetch-error')
    ) {
      throw new Error(
        `App Check rejected by Firebase AI Logic [${describeAppCheckFlow()}]. ` +
          `If flow=debug-token: the minted debug token is NOT on the registered list for THIS web app ` +
          `(Firebase Console > App Check > select web app ...812c7435 > Manage debug tokens). ` +
          `Re-copy the exact 'App Check debug token' logged in THIS browser tab on THIS origin ` +
          `(localhost vs 127.0.0.1 are different origins with different tokens), register it, put the UUID ` +
          `in .env as VITE_APPCHECK_DEBUG_TOKEN=<uuid>, and restart vite. ` +
          `If flow=reCAPTCHA: Console provider type (v3 vs Enterprise) and secret must match this site key. ` +
          `Original: ${message.slice(0, 200)}`,
        { cause: error },
      )
    }

    throw error
  }
}

/**
 * Builds a structured, domain-accurate prompt for image transformation
 * following the CAL FIRE & IBHS defensible space assessment framework.
 *
 * @param {Object} config
 * @param {string} [config.standard='both'] - 'both' | 'state' | 'ins'
 */
export function buildAssessmentImagePrompt({
  intakeAnswers = {},
  zone,
  topography,
  flags = [],
  hazardDefs = {},
  recommendations = {},
  standard = 'both',
}) {
  const zoneLabel = Array.isArray(zone)
    ? zone.join(', ')
    : zone === 'zone1'
      ? 'Zone 1 (5–30 ft)'
      : zone === 'zone2'
        ? 'Zone 2 (30–100 ft)'
        : 'Zone 0 (0–5 ft)'
  const topoLabel = Array.isArray(topography)
    ? topography.join(', ')
    : topography || intakeAnswers?.topography || 'Standard residential parcel'

  // Compile specific hazard fixes based on intake answers & flags
  const specificHazardActions = []
  if (flags.includes('Z0-MULCH') || String(intakeAnswers?.surface || '').toLowerCase().includes('mulch')) {
    specificHazardActions.push('Remove all wood bark mulch and replace with inorganic decomposed granite or gravel')
  }
  if (flags.includes('Z0-FENCE') || String(intakeAnswers?.fence || '').toLowerCase().includes('wood')) {
    specificHazardActions.push('Replace the 5-foot section of attached wood fence touching the house with a modern non-combustible metal transition gate')
  }
  if (String(intakeAnswers?.veg || '').toLowerCase().includes('ivy') || String(intakeAnswers?.veg || '').toLowerCase().includes('vine')) {
    specificHazardActions.push('Completely strip climbing ivy and vines from all siding and exterior walls')
  }
  if (flags.includes('Z0-ITEMS') || String(intakeAnswers?.stored || '').toLowerCase().includes('firewood') || String(intakeAnswers?.stored || '').toLowerCase().includes('bin')) {
    specificHazardActions.push('Remove firewood piles, plastic trash bins, and combustible patio items from exterior walls')
  }
  if (flags.includes('Z0-GUTTER') || String(intakeAnswers?.gutters || '').toLowerCase().includes('needle') || String(intakeAnswers?.gutters || '').toLowerCase().includes('debris')) {
    specificHazardActions.push('Clear all dry needles and leaves from roof valleys, eaves, and gutters')
  }
  if (flags.includes('Z0-VENT') || String(intakeAnswers?.vents || '').toLowerCase().includes('coarse') || String(intakeAnswers?.vents || '').toLowerCase().includes('open')) {
    specificHazardActions.push('Install corrosion-resistant 1/8-inch ember-resistant metal vent screens over foundation and soffit vents')
  }

  // Topography / Slope Engineering Modifiers (PRC § 4291 formulas)
  let slopeGuidance = 'Flat to gentle terrain: Maintain standard 2x shrub height spacing and clean permeable pathways.'
  const topoStr = String(topoLabel).toLowerCase()
  if (topoStr.includes('moderate') || topoStr.includes('20') || topoStr.includes('slope')) {
    slopeGuidance = 'Moderate slope (20–40%): Wildfire travels uphill rapidly — feature low terraced dry-stack rock retaining planters and expand plant spacing to 3x shrub height with deep-rooted slope stabilizers (Lemonade berry, Toyon).'
  } else if (topoStr.includes('steep') || topoStr.includes('40') || topoStr.includes('canyon')) {
    slopeGuidance = 'Steep slope / Canyon wind corridor (>40%): Render low terraced stone retaining walls to break uphill flame spread. Eliminate grouped plant clusters — maintain isolated individual specimens with 6x height spacing.'
  }

  // Plant Palettes by standard & topography
  const statePlants = 'Chalk dudleya (Dudleya pulverulenta), Shaw\'s agave, California fuchsia (Epilobium canum), Common yarrow, Toyon'
  const ibhsPlants = 'California fuchsia (Epilobium canum), Common yarrow (Achillea millefolium), Lemonade berry (Rhus integrifolia), Toyon, Cleveland sage'

  const actionList = specificHazardActions.length > 0
    ? specificHazardActions.join('. ')
    : (recommendations.actions || []).join('. ')
  const materials = recommendations.materials ? recommendations.materials.join(', ') : '3/4-inch crushed gravel, decomposed granite, steel transition gate, ASTM E2886 vent mesh'

  let standardGuidance
  if (standard === 'state') {
    standardGuidance = `
- Standard Track: CAL FIRE State Regulatory Rule (PRC § 4291).
- MANDATORY HAZARD DEMOLITION: Clear and remove all tall woody shrubs, dense hedges, climbing vines, and wood fences touching the siding, front steps, or bay windows.
- Zone 0 (0–5 ft Foundation Zone): Replace removed brush with decomposed granite or fine gravel beds planted with low-growing, well-spaced, irrigated native succulents and perennials (${statePlants}) kept under 18 inches tall with visible space between plants and clean siding.
- Zone 1 & 2 (Beyond 5 ft): Defensible landscape with healthy, well-spaced SoCal native plants (${ibhsPlants}), 6ft+ lower tree branch clearance, and clear horizontal spacing between shrub groupings.
- Slope Architecture: ${slopeGuidance}
- Fence Transition: 5-foot non-combustible metal transition gate where any fence meets the structure, preserving the remaining fence line.
- Aesthetic Goal: "Succulent-Friendly State Defensible Space" — maintaining vibrant foundation succulents while meeting state wildfire brush-clearing codes.
`.trim()
  } else if (standard === 'ins') {
    standardGuidance = `
- Standard Track: IBHS Wildfire Prepared Home (Safer from Wildfires / 10 CCR § 2644.9).
- MANDATORY HAZARD DEMOLITION: Clear and remove ALL vegetation, shrubs, mulch, and combustible materials within 5 feet of the entire house foundation, siding, bay windows, and steps.
- Zone 0 (0–5 ft Foundation Strip): STRICT ZERO VEGETATION. The entire first 5 feet against all exterior walls, posts, bay windows, and stairs must be a 100% clean, non-combustible apron of 3/4-inch crushed gravel, decomposed granite, or stone pavers. No plants, no flowers, no succulents, and no combustible mulch anywhere in this 5-ft buffer.
- Structure Hardening: Corrosion-resistant ember-resistant fine metal vent mesh (ASTM E2886) visible on foundation/soffit vents, plus a 5-foot metal transition gate attached to the house.
- Zone 1 & 2 (Beyond 5 ft): Standard defensible plantings (${ibhsPlants}) positioned strictly outside the 5-foot non-combustible apron.
- Slope Architecture: ${slopeGuidance}
- Aesthetic Goal: "The Hardened Insurance Shield" — strict 0-ft hardscape perimeter engineered for maximum ember defense and insurance discount qualification.
`.trim()
  } else {
    standardGuidance = `
- Standard Track: Comprehensive Master Plan (Dual Compliance: IBHS Hardened Structure + Spaced California Native Garden).
- MANDATORY HAZARD DEMOLITION: Clear and completely remove all existing overgrown shrubs, thick hedges, and combustible materials currently touching the siding, front steps, and foundation walls.
- Zone 0 (0–5 ft Foundation Strip): Pristine 5-foot non-combustible apron of decomposed granite, crushed gravel, or stone pavers against the walls (ZERO VEGETATION within 5 feet of any wall or window), ember-resistant 1/16" stainless steel vent screens, and dark metal transition gate.
- Zone 1 (5–30 ft) & Zone 2 (30–100 ft): Neat, beautifully designed Southern California native landscape starting strictly outside the 5-foot non-combustible buffer line. Feature colorful, drought-tolerant species (${ibhsPlants}) arranged in neat, separate, low-profile island clusters surrounded by decomposed granite paths (NO dense or overgrown hedges).
- Slope Architecture: ${slopeGuidance}
- Aesthetic Goal: "The Gold Standard Master Plan" — complete structure hardening at the foundation paired with a clean, well-spaced native landscape beyond 5 feet.
`.trim()
  }

  const flaggedTitles = flags
    .map((f) => hazardDefs?.[f]?.title || f)
    .filter(Boolean)
    .join('; ')

  return `
Transform this residential property photo into a photorealistic, fire-resilient Southern California defensible landscape.

CRITICAL HAZARD CLEARANCE & STRUCTURAL PRESERVATION:
- CLEAR AND ELIMINATE all overgrown vegetation, dense shrubs, and wood fences currently touching or encroaching within 5 feet of the building siding, windows, and stairs.
- Specific Identified Fixes: ${actionList}.
${flaggedTitles ? `- Active Flagged Conditions: ${flaggedTitles}.` : ''}
- Preserve the exact house architecture, roofline, siding color, window placements, stairs, camera perspective, lighting, and general property boundaries.
- Targeted defensible space zone(s): ${zoneLabel}.
- Topography setting: ${topoLabel}.
- Approved materials: ${materials}.

STANDARD-SPECIFIC LANDSCAPE SPECIFICATIONS:
${standardGuidance}

IMAGE GUIDELINES:
- DO NOT add flames, smoke, fire trucks, warning signs, text overlays, watermark labels, people, or disaster destruction.
- Render a photorealistic, clean, desirable, drought-tolerant, fire-hardened Southern California property.
`.trim()
}

/**
 * Main generator: Exclusively calls Gemini AI model to perform the image transformation.
 */
export async function generateFireSafeVisionImage({ photoFile, prompt }) {
  if (!photoFile) {
    throw new Error('Upload a property photo before running Gemini image generation.')
  }

  // 1. If direct Gemini API key is provided in env, use direct API
  const directKey = import.meta.env.VITE_GEMINI_API_KEY || ''
  if (directKey && directKey.trim()) {
    return generateWithDirectApiKey({ apiKey: directKey.trim(), photoFile, prompt })
  }

  // 2. Default: Call Gemini via Firebase Vertex AI SDK
  return generateWithFirebaseVertexAI({ photoFile, prompt })
}

/**
 * Multi-standard generator: Runs parallel transformations for State (PRC § 4291),
 * Insurance (IBHS / Safer from Wildfires), and Comprehensive Both Standards so
 * the user can instantly toggle between genuine standard variations on the report screen.
 */
export async function generateFireSafeVisionMultiStandardImages({ photoFile, basePromptConfig }) {
  if (!photoFile) {
    throw new Error('Upload a property photo before running Gemini image generation.')
  }

  const bothPrompt = buildAssessmentImagePrompt({
    ...basePromptConfig,
    standard: 'both',
  })

  const statePrompt = buildAssessmentImagePrompt({
    ...basePromptConfig,
    standard: 'state',
  })

  const ibhsPrompt = buildAssessmentImagePrompt({
    ...basePromptConfig,
    standard: 'ins',
  })

  const [bothSettled, stateSettled, ibhsSettled] = await Promise.allSettled([
    generateFireSafeVisionImage({ photoFile, prompt: bothPrompt }),
    generateFireSafeVisionImage({ photoFile, prompt: statePrompt }),
    generateFireSafeVisionImage({ photoFile, prompt: ibhsPrompt }),
  ])

  const bothResult = bothSettled.status === 'fulfilled' ? bothSettled.value : null
  const stateResult = stateSettled.status === 'fulfilled' ? stateSettled.value : null
  const ibhsResult = ibhsSettled.status === 'fulfilled' ? ibhsSettled.value : null

  if (!bothResult && !stateResult && !ibhsResult) {
    const errorMsg =
      (bothSettled.status === 'rejected' && bothSettled.reason?.message) ||
      (stateSettled.status === 'rejected' && stateSettled.reason?.message) ||
      (ibhsSettled.status === 'rejected' && ibhsSettled.reason?.message) ||
      'Gemini AI image generation request failed for defensible space standards.'
    throw new Error(errorMsg)
  }

  const primaryImage = bothResult?.imageUrl || ibhsResult?.imageUrl || stateResult?.imageUrl || ''
  const bothImage = bothResult?.imageUrl || primaryImage
  const stateImage = stateResult?.imageUrl || primaryImage
  const insImage = ibhsResult?.imageUrl || primaryImage

  const combinedText = [
    bothResult?.text ? `[Combined Standards] ${bothResult.text}` : '',
    ibhsResult?.text ? `[IBHS Standard] ${ibhsResult.text}` : '',
    stateResult?.text ? `[State Rule] ${stateResult.text}` : '',
  ]
    .filter(Boolean)
    .join(' \n\n')

  return {
    images: {
      both: bothImage,
      state: stateImage,
      ins: insImage,
    },
    text: combinedText || bothResult?.text || ibhsResult?.text || stateResult?.text || '',
  }
}


