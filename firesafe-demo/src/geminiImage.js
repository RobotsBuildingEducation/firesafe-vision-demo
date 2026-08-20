import { getAI, getGenerativeModel, ResponseModality, VertexAIBackend } from 'firebase/ai'
import { firebaseApp } from './firebase'

export const GEMINI_IMAGE_MODEL = 'gemini-3.1-flash-image'

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
  const ai = getAI(firebaseApp, { backend: new VertexAIBackend('global') })

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

    throw error
  }
}

/**
 * Builds a structured, domain-accurate prompt for image transformation
 * following the CAL FIRE & IBHS defensible space assessment framework.
 */
export function buildAssessmentImagePrompt({ zone, topography, flags, hazardDefs, recommendations }) {
  const zoneLabel = zone === 'zone1' ? 'Zone 1 (5–30 ft)' : zone === 'zone2' ? 'Zone 2 (30–100 ft)' : 'Zone 0 (0–5 ft)'
  const flaggedTitles = flags.map((f) => hazardDefs[f]?.title || f).join('; ')
  const actionList = recommendations.actions.join('. ')
  const materials = recommendations.materials.join(', ')
  const plants = recommendations.plants.join(', ')

  return `
Transform this residential property photo into a photorealistic, fire-resilient Southern California defensible landscape.

Key Guidelines:
- Preserve the exact home architecture, roofline, siding style, window locations, camera angle, and natural lighting.
- Transform the targeted defensible area: ${zoneLabel}.
- Topography setting: ${topography}.
- Identified hazard conditions to fix: ${flaggedTitles}.
- Apply these fire-resilient design upgrades: ${actionList}.
- Materials to render: ${materials}.
- Plant palette (Zone 1/2 only, beyond the 5ft non-combustible perimeter): ${plants}.
- Ensure the first 5 feet against all walls, stairs, and posts is a clean non-combustible apron of crushed rock, decomposed granite, or flagstone pavers.
- Replace any combustible wood/vinyl fence meeting the structure with non-combustible metal, steel posts, or masonry.
- DO NOT add flames, smoke, fire trucks, warning signs, text overlays, watermark labels, people, or disaster destruction.
- Render a realistic, desirable, drought-tolerant, fire-hardened home exterior.
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
