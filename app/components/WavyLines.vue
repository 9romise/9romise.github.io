<script lang="ts" setup>
import { createNoise2D } from 'simplex-noise'

interface Point {
  x: number
  y: number
  wave: { x: number, y: number }
  cursor: { x: number, y: number, vx: number, vy: number }
}

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const svgRef = useTemplateRef<SVGSVGElement>('svgRef')

const bounding = useElementBounding(containerRef)
const { x: mouseX, y: mouseY } = useMouse({ type: 'page' })
const { y: scrollY } = useWindowScroll()

const lines = shallowRef<Point[][]>([])
const paths = shallowRef<SVGPathElement[]>([])

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

function setLines() {
  const { width, height } = bounding
  const svg = svgRef.value
  if (!svg || !width.value || !height.value)
    return

  svg.style.width = `${width.value}px`
  svg.style.height = `${height.value}px`

  paths.value.forEach((path) => path.remove())

  const newLines: Point[][] = []
  const newPaths: SVGPathElement[] = []

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

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.classList.add('a__line', 'js-line')
    svg.appendChild(path)
    newPaths.push(path)
    newLines.push(points)
  }

  lines.value = newLines
  paths.value = newPaths
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

useEventListener(containerRef, 'touchmove', (e: TouchEvent) => {
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
    x: Math.round((point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0)) * 10) / 10,
    y: Math.round((point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0)) * 10) / 10,
  }
}

function drawLines() {
  lines.value.forEach((points, lIndex) => {
    const firstPoint = points[0]
    if (!firstPoint || points.length < 2)
      return

    const p0 = moved(firstPoint, false)
    let d = `M ${p0.x} ${p0.y}`

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]!
      const next = points[i + 1]!
      const isLastSegment = i === points.length - 2

      const p1 = moved(current, true)
      const p2 = moved(next, !isLastSegment)

      const midX = (p1.x + p2.x) / 2
      const midY = (p1.y + p2.y) / 2

      d += ` Q ${p1.x} ${p1.y} ${midX} ${midY}`
    }

    const lastPoint = points[points.length - 1]!
    const pLast = moved(lastPoint, false)
    d += ` L ${pLast.x} ${pLast.y}`

    paths.value[lIndex]?.setAttribute('d', d)
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
  <div
    ref="containerRef"
    class="wavy-lines"
  >
    <svg
      ref="svgRef"
      class="js-svg"
    />
  </div>
</template>

<style scoped>
.wavy-lines {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(path) {
    fill: none;
    stroke: rgba(22, 0, 0, 0.1);
    stroke-width: 0.75px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
