import { getAI, getGenerativeModel, ResponseModality, VertexAIBackend } from 'firebase/ai'
import { firebaseApp } from './firebase'

export const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image'

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
    throw new Error('Gemini returned text but no generated image. Try a simpler photo or prompt.')
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
    const imageParts = result.response.inlineDataParts?.() ?? []
    const generatedImagePart = imageParts.find((part) =>
      part.inlineData?.mimeType?.startsWith('image/'),
    )

    if (!generatedImagePart?.inlineData?.data) {
      throw new Error('Gemini returned text but no generated image. Try a simpler photo or prompt.')
    }

    return {
      imageUrl: `data:${generatedImagePart.inlineData.mimeType};base64,${generatedImagePart.inlineData.data}`,
      model: GEMINI_IMAGE_MODEL,
      text: result.response.text?.() ?? '',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (message.includes('GEN_AI_CONFIG_NOT_FOUND')) {
      throw new Error(
        'Firebase AI Logic is missing provider configuration. Make sure Vertex AI Gemini API is selected and enabled in Firebase AI Logic settings, then try again after it propagates.',
        { cause: error },
      )
    }

    throw error
  }
}

export async function generateFireSafeVisionImage({ apiKey, photoFile, prompt }) {
  if (!photoFile) {
    throw new Error('Upload a property photo before running Gemini image generation.')
  }

  if (apiKey.trim()) {
    return generateWithDirectApiKey({ apiKey: apiKey.trim(), photoFile, prompt })
  }

  return generateWithFirebaseVertexAI({ photoFile, prompt })
}
