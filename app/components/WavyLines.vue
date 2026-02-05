<script lang="ts" setup>
import { createNoise2D } from 'simplex-noise'

interface Point {
  x: number
  y: number
  wave: { x: number, y: number }
  cursor: { x: number, y: number, vx: number, vy: number }
}

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')

const bounding = useElementBounding(canvasRef)
const { x: mouseX, y: mouseY } = useMouse({ type: 'page' })
const { y: scrollY } = useWindowScroll()
const colorMode = useColorMode()

const lines = shallowRef<Point[][]>([])
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1

const mouse = {
  x: -10,
  y: 0,
  lx: 0,
  ly: 0,
  sx: 0,
  sy: 0,
  v: 0,
  vs: 0,
  a: 0,
  set: false,
}

const noise2D = createNoise2D()

function setupCanvas() {
  const canvas = canvasRef.value
  if (!canvas || !bounding.width.value || !bounding.height.value)
    return

  dpr = window.devicePixelRatio || 1
  canvas.width = bounding.width.value * dpr
  canvas.height = bounding.height.value * dpr
  canvas.style.width = `${bounding.width.value}px`
  canvas.style.height = `${bounding.height.value}px`

  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
}

function setLines() {
  const { width, height } = bounding
  if (!width.value || !height.value)
    return

  setupCanvas()

  const newLines: Point[][] = []

  const xGap = 28
  const yGap = 16

  const oWidth = width.value + 200
  const oHeight = height.value + 30

  const totalLines = Math.ceil(oWidth / xGap)
  const totalPoints = Math.ceil(oHeight / yGap)

  const xStart = (width.value - xGap * totalLines) / 2
  const yStart = (height.value - yGap * totalPoints) / 2

  for (let i = 0; i <= totalLines; i++) {
    const points: Point[] = []

    for (let j = 0; j <= totalPoints; j++) {
      points.push({
        x: xStart + xGap * i,
        y: yStart + yGap * j,
        wave: { x: 0, y: 0 },
        cursor: { x: 0, y: 0, vx: 0, vy: 0 },
      })
    }

    newLines.push(points)
  }

  lines.value = newLines
}

watch([() => bounding.width.value, () => bounding.height.value], () => {
  setLines()
})

watch([mouseX, mouseY], ([x, y]) => {
  mouse.x = x - bounding.left.value
  mouse.y = y - bounding.top.value + scrollY.value

  if (!mouse.set) {
    mouse.sx = mouse.x
    mouse.sy = mouse.y
    mouse.lx = mouse.x
    mouse.ly = mouse.y
    mouse.set = true
  }
})

useEventListener(canvasRef, 'touchmove', (e: TouchEvent) => {
  e.preventDefault()
  const touch = e.touches[0]
  if (touch) {
    mouse.x = touch.clientX - bounding.left.value
    mouse.y = touch.clientY - bounding.top.value + scrollY.value

    if (!mouse.set) {
      mouse.sx = mouse.x
      mouse.sy = mouse.y
      mouse.lx = mouse.x
      mouse.ly = mouse.y
      mouse.set = true
    }
  }
}, { passive: false })

function movePoints(time: number) {
  lines.value.forEach((points) => {
    points.forEach((p) => {
      const move = noise2D(
        (p.x + time * 0.008) * 0.0015,
        (p.y + time * 0.003) * 0.001,
      ) * 8
      p.wave.x = Math.cos(move) * 20
      p.wave.y = Math.sin(move) * 10

      const dx = p.x - mouse.sx
      const dy = p.y - mouse.sy
      const d = Math.hypot(dx, dy)
      const l = Math.max(200, mouse.vs)

      if (d < l) {
        const s = 1 - d / l
        const f = Math.cos(d * 0.001) * s
        p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.0004
        p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.0004
      }

      p.cursor.vx += (0 - p.cursor.x) * 0.003
      p.cursor.vy += (0 - p.cursor.y) * 0.003
      p.cursor.vx *= 0.96
      p.cursor.vy *= 0.96
      p.cursor.x += p.cursor.vx * 1.5
      p.cursor.y += p.cursor.vy * 1.5
      p.cursor.x = Math.min(60, Math.max(-60, p.cursor.x))
      p.cursor.y = Math.min(60, Math.max(-60, p.cursor.y))
    })
  })
}

function moved(point: Point, withCursorForce = true) {
  return {
    x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
    y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
  }
}

function drawLines() {
  if (!ctx || !bounding.width.value || !bounding.height.value)
    return

  ctx.clearRect(0, 0, bounding.width.value, bounding.height.value)

  const isDark = colorMode.value === 'dark'
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
  ctx.lineWidth = 0.75
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  lines.value.forEach((points) => {
    const firstPoint = points[0]
    if (!firstPoint || points.length < 2)
      return

    ctx!.beginPath()

    const p0 = moved(firstPoint, false)
    ctx!.moveTo(p0.x, p0.y)

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]!
      const next = points[i + 1]!
      const isLastSegment = i === points.length - 2

      const p1 = moved(current, true)
      const p2 = moved(next, !isLastSegment)

      const midX = (p1.x + p2.x) / 2
      const midY = (p1.y + p2.y) / 2

      ctx!.quadraticCurveTo(p1.x, p1.y, midX, midY)
    }

    const lastPoint = points[points.length - 1]!
    const pLast = moved(lastPoint, false)
    ctx!.lineTo(pLast.x, pLast.y)

    ctx!.stroke()
  })
}

useRafFn(({ timestamp }) => {
  mouse.sx += (mouse.x - mouse.sx) * 0.1
  mouse.sy += (mouse.y - mouse.sy) * 0.1

  const dx = mouse.x - mouse.lx
  const dy = mouse.y - mouse.ly
  const d = Math.hypot(dx, dy)

  mouse.v = d
  mouse.vs += (d - mouse.vs) * 0.1
  mouse.vs = Math.min(100, mouse.vs)
  mouse.lx = mouse.x
  mouse.ly = mouse.y
  mouse.a = Math.atan2(dy, dx)

  movePoints(timestamp)
  drawLines()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="wavy-lines"
  />
</template>

<style scoped>
.wavy-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
