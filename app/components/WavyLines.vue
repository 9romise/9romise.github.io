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

  const xGap = 10
  const yGap = 32

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
        (p.x + time * 0.0125) * 0.002,
        (p.y + time * 0.005) * 0.0015,
      ) * 12
      p.wave.x = Math.cos(move) * 32
      p.wave.y = Math.sin(move) * 16

      const dx = p.x - mouse.sx
      const dy = p.y - mouse.sy
      const d = Math.hypot(dx, dy)
      const l = Math.max(175, mouse.vs)

      if (d < l) {
        const s = 1 - d / l
        const f = Math.cos(d * 0.001) * s
        p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
        p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
      }

      p.cursor.vx += (0 - p.cursor.x) * 0.005
      p.cursor.vy += (0 - p.cursor.y) * 0.005
      p.cursor.vx *= 0.925
      p.cursor.vy *= 0.925
      p.cursor.x += p.cursor.vx * 2
      p.cursor.y += p.cursor.vy * 2
      p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x))
      p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y))
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
    if (!firstPoint)
      return

    let p1 = moved(firstPoint, false)
    let d = `M ${p1.x} ${p1.y}`

    points.forEach((point, pIndex) => {
      const isLast = pIndex === points.length - 1
      p1 = moved(point, !isLast)
      d += `L ${p1.x} ${p1.y}`
    })

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

  if (containerRef.value) {
    containerRef.value.style.setProperty('--x', `${mouse.sx}px`)
    containerRef.value.style.setProperty('--y', `${mouse.sy}px`)
  }

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
  --x: -0.5rem;
  --y: 50%;

  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 0.5rem;
    height: 0.5rem;
    background: #160000;
    border-radius: 50%;
    transform: translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0);
    will-change: transform;
    content: '';
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(path) {
    fill: none;
    stroke: #160000;
    stroke-width: 1px;
  }
}
</style>
