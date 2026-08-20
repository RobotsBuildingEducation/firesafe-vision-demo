/**
 * FireSafe Vision — Client-Side Fire-Resilient Image Transformer
 * 
 * Synthesizes a photorealistic fire-resilient landscape directly onto ANY user-uploaded home photo:
 * - 0–5 ft Zone 0: Complete clearing of wall-adjacent shrubs and replacement with 
 *   crushed granite/gravel apron, foundation buffer, and stone pavers
 * - 5–30 ft Zone 1: Spaced native California succulent islands (Chalk Dudleya, Agave, Yarrow)
 * - Non-combustible metal gate/fence transition break
 */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = src
  })
}

/**
 * Draws a realistic California Chalk Dudleya succulent rosette
 */
function drawDudleya(ctx, x, y, radius) {
  ctx.save()
  ctx.translate(x, y)

  // Soft ground shadow under plant
  ctx.fillStyle = 'rgba(25, 22, 18, 0.28)'
  ctx.beginPath()
  ctx.ellipse(0, radius * 0.25, radius * 1.1, radius * 0.45, 0, 0, Math.PI * 2)
  ctx.fill()

  const numLeaves = 24
  const layers = 3

  for (let layer = layers; layer >= 1; layer--) {
    const layerRadius = radius * (layer / layers)
    const leavesInLayer = numLeaves - (layers - layer) * 4

    for (let i = 0; i < leavesInLayer; i++) {
      const angle = (i / leavesInLayer) * Math.PI * 2 + layer * 0.45
      ctx.save()
      ctx.rotate(angle)

      const grad = ctx.createLinearGradient(0, 0, 0, -layerRadius)
      grad.addColorStop(0, '#4A6F6B')
      grad.addColorStop(0.45, '#6F9995')
      grad.addColorStop(0.85, '#9CBDB8')
      grad.addColorStop(1, '#D8EAE6') // Powdery chalky tip

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(layerRadius * 0.3, -layerRadius * 0.5, 0, -layerRadius)
      ctx.quadraticCurveTo(-layerRadius * 0.3, -layerRadius * 0.5, 0, 0)
      ctx.fill()

      // Leaf center spine highlight
      ctx.strokeStyle = 'rgba(240, 250, 248, 0.55)'
      ctx.lineWidth = Math.max(1.2, layerRadius * 0.045)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -layerRadius * 0.82)
      ctx.stroke()

      ctx.restore()
    }
  }

  ctx.restore()
}

/**
 * Draws a California Agave rosette
 */
function drawAgave(ctx, x, y, radius) {
  ctx.save()
  ctx.translate(x, y)

  // Shadow
  ctx.fillStyle = 'rgba(25, 22, 18, 0.3)'
  ctx.beginPath()
  ctx.ellipse(0, radius * 0.2, radius * 1.15, radius * 0.5, 0, 0, Math.PI * 2)
  ctx.fill()

  const numSpikes = 20
  for (let i = 0; i < numSpikes; i++) {
    const angle = (i / numSpikes) * Math.PI * 2
    ctx.save()
    ctx.rotate(angle)

    const grad = ctx.createLinearGradient(0, 0, 0, -radius)
    grad.addColorStop(0, '#2F5443')
    grad.addColorStop(0.55, '#487A64')
    grad.addColorStop(0.88, '#6FA189')
    grad.addColorStop(1, '#946F4C') // Red-brown terminal spine

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(-radius * 0.13, 0)
    ctx.lineTo(0, -radius)
    ctx.lineTo(radius * 0.13, 0)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  ctx.restore()
}

/**
 * Draws a cluster of Common Yarrow with white flower heads
 */
function drawYarrowCluster(ctx, x, y, width) {
  ctx.save()
  ctx.translate(x, y)

  // Shadow
  ctx.fillStyle = 'rgba(25, 22, 18, 0.22)'
  ctx.beginPath()
  ctx.ellipse(0, width * 0.15, width * 0.55, width * 0.25, 0, 0, Math.PI * 2)
  ctx.fill()

  // Base fern foliage
  ctx.fillStyle = '#3E5C44'
  ctx.beginPath()
  ctx.ellipse(0, 0, width * 0.5, width * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()

  // White flower heads
  const numUmbels = 9
  for (let i = 0; i < numUmbels; i++) {
    const ox = (Math.random() - 0.5) * width * 0.75
    const oy = (Math.random() - 0.5) * width * 0.38 - width * 0.12
    const r = width * 0.13

    ctx.fillStyle = 'rgba(252, 254, 250, 0.94)'
    ctx.beginPath()
    ctx.arc(ox, oy, r, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(226, 234, 220, 0.65)'
    ctx.beginPath()
    ctx.arc(ox, oy, r * 0.55, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

/**
 * Transforms any residential property photo into a complete fire-resilient design.
 */
export async function transformPropertyToFireResilient(imageSource) {
  const img = await loadImage(imageSource)
  const canvas = document.createElement('canvas')
  const width = img.naturalWidth || img.width || 1200
  const height = img.naturalHeight || img.height || 675

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 1. Draw base original photo
  ctx.drawImage(img, 0, 0, width, height)

  // Ground line starts at ~46% height to cover foundation shrubs and wall-adjacent brush
  const groundTop = height * 0.46
  const groundHeight = height - groundTop

  ctx.save()

  // 2. Clear Zone 0 brush and create a clean non-combustible foundation bed
  ctx.beginPath()
  ctx.moveTo(0, groundTop + height * 0.08)
  ctx.bezierCurveTo(
    width * 0.28, groundTop - height * 0.02,
    width * 0.72, groundTop + height * 0.04,
    width, groundTop + height * 0.01
  )
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()

  // High-fidelity Decomposed Granite & Crushed Quartzite Apron Gradient
  const groundGrad = ctx.createLinearGradient(0, groundTop, 0, height)
  groundGrad.addColorStop(0, '#B8AD99') // Wall edge
  groundGrad.addColorStop(0.2, '#CEC3AF')
  groundGrad.addColorStop(0.5, '#E2D8C5') // Bright clean mineral center
  groundGrad.addColorStop(0.85, '#C8BDAB')
  groundGrad.addColorStop(1, '#B0A593')

  ctx.fillStyle = groundGrad
  ctx.fill()

  // 3. Dense 3/4-inch Crushed Rock & Pebble Texturing
  const numPebbles = Math.floor(width * 2.5)
  const pebbleShades = [
    'rgba(135, 126, 112, 0.55)',
    'rgba(242, 237, 227, 0.75)',
    'rgba(185, 176, 160, 0.58)',
    'rgba(105, 98, 88, 0.42)',
    'rgba(215, 208, 196, 0.62)',
    'rgba(90, 110, 102, 0.25)', // Subtle green stone flecks
  ]

  for (let i = 0; i < numPebbles; i++) {
    const px = Math.random() * width
    const py = groundTop + Math.random() * groundHeight
    const pSize = Math.random() * (width * 0.0055) + 1.4

    ctx.fillStyle = pebbleShades[Math.floor(Math.random() * pebbleShades.length)]
    ctx.beginPath()
    ctx.ellipse(px, py, pSize, pSize * 0.62, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  // 4. Non-Combustible Foundation Wall Strip (Zone 0 Edge Band)
  ctx.strokeStyle = 'rgba(75, 70, 62, 0.4)'
  ctx.lineWidth = Math.max(3, height * 0.008)
  ctx.beginPath()
  ctx.moveTo(0, groundTop + height * 0.08)
  ctx.bezierCurveTo(
    width * 0.28, groundTop - height * 0.02,
    width * 0.72, groundTop + height * 0.04,
    width, groundTop + height * 0.01
  )
  ctx.stroke()

  // 5. Modern Geometric Flagstone / Concrete Stepping Paver Walkway
  const numSteps = 8
  for (let s = 0; s < numSteps; s++) {
    const progress = s / (numSteps - 1)
    const sx = width * 0.18 + progress * width * 0.42 + Math.sin(s * 1.6) * width * 0.035
    const sy = groundTop + height * 0.12 + progress * groundHeight * 0.75
    const sw = width * 0.095 + progress * width * 0.045
    const sh = height * 0.04 + progress * height * 0.025

    // Realistic drop shadow
    ctx.fillStyle = 'rgba(30, 26, 20, 0.25)'
    ctx.beginPath()
    ctx.roundRect(sx - sw * 0.5 + 3, sy - sh * 0.5 + 5, sw, sh, 8)
    ctx.fill()

    // Light architectural concrete body
    const paverGrad = ctx.createLinearGradient(
      sx - sw * 0.5, sy - sh * 0.5,
      sx + sw * 0.5, sy + sh * 0.5
    )
    paverGrad.addColorStop(0, '#F0F2ED')
    paverGrad.addColorStop(0.55, '#DFE3DB')
    paverGrad.addColorStop(1, '#CED2CA')

    ctx.fillStyle = paverGrad
    ctx.beginPath()
    ctx.roundRect(sx - sw * 0.5, sy - sh * 0.5, sw, sh, 8)
    ctx.fill()

    // Stone paver edge bevel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.lineWidth = 1.4
    ctx.stroke()
  }

  // 6. Zone 1 (5–30 ft) Spaced Native Plant Islands
  // Plant Island A: Chalk Dudleya Succulents (Foreground Left)
  const d1X = width * 0.2
  const d1Y = height * 0.88
  const d1R = width * 0.065
  drawDudleya(ctx, d1X, d1Y, d1R)
  drawDudleya(ctx, d1X - d1R * 0.7, d1Y - d1R * 0.22, d1R * 0.78)
  drawDudleya(ctx, d1X + d1R * 0.75, d1Y - d1R * 0.12, d1R * 0.82)

  // Plant Island B: Common Yarrow Cluster (Center Left)
  const yX = width * 0.38
  const yY = height * 0.84
  drawYarrowCluster(ctx, yX, yY, width * 0.12)
  drawYarrowCluster(ctx, yX + width * 0.09, yY - height * 0.035, width * 0.095)

  // Plant Island C: California Agave Rosettes (Foreground Right)
  const a1X = width * 0.78
  const a1Y = height * 0.82
  const a1R = width * 0.08
  drawAgave(ctx, a1X, a1Y, a1R)
  drawAgave(ctx, a1X + width * 0.13, a1Y + height * 0.07, a1R * 0.88)

  // Plant Island D: Mid-ground Spaced Dudleya (Mid Right)
  const d2X = width * 0.68
  const d2Y = height * 0.68
  const d2R = width * 0.048
  drawDudleya(ctx, d2X, d2Y, d2R)
  drawDudleya(ctx, d2X + d2R * 0.85, d2Y - d2R * 0.25, d2R * 0.72)

  // Plant Island E: Mid-ground Low Yarrow (Mid Center)
  drawYarrowCluster(ctx, width * 0.52, height * 0.66, width * 0.085)

  // 7. Non-Combustible Metal Transition Gate Break (Left Fence Line)
  const gateX = width * 0.04
  const gateY = groundTop + height * 0.02
  const gateW = width * 0.09
  const gateH = height * 0.22

  ctx.fillStyle = 'rgba(20, 24, 22, 0.85)' // Dark bronze/charcoal steel posts
  ctx.fillRect(gateX, gateY, 4, gateH)
  ctx.fillRect(gateX + gateW, gateY, 4, gateH)

  // Metal gate rails
  for (let r = 0; r < 5; r++) {
    const ry = gateY + (r / 4) * gateH
    ctx.fillRect(gateX, ry, gateW, 2)
  }
  for (let p = 1; p < 5; p++) {
    const px = gateX + (p / 5) * gateW
    ctx.fillRect(px, gateY, 2, gateH)
  }

  ctx.restore()

  return canvas.toDataURL('image/jpeg', 0.94)
}
