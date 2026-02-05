<script lang="ts" setup>
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

let noise: { perlin2: (x: number, y: number) => number, seed: (seed: number) => void }

function initNoise() {
  const perm = new Uint8Array(512)
  const gradP: number[][] = []

  const grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ]

  const p = [
    151,
    160,
    137,
    91,
    90,
    15,
    131,
    13,
    201,
    95,
    96,
    53,
    194,
    233,
    7,
    225,
    140,
    36,
    103,
    30,
    69,
    142,
    8,
    99,
    37,
    240,
    21,
    10,
    23,
    190,
    6,
    148,
    247,
    120,
    234,
    75,
    0,
    26,
    197,
    62,
    94,
    252,
    219,
    203,
    117,
    35,
    11,
    32,
    57,
    177,
    33,
    88,
    237,
    149,
    56,
    87,
    174,
    20,
    125,
    136,
    171,
    168,
    68,
    175,
    74,
    165,
    71,
    134,
    139,
    48,
    27,
    166,
    77,
    146,
    158,
    231,
    83,
    111,
    229,
    122,
    60,
    211,
    133,
    230,
    220,
    105,
    92,
    41,
    55,
    46,
    245,
    40,
    244,
    102,
    143,
    54,
    65,
    25,
    63,
    161,
    1,
    216,
    80,
    73,
    209,
    76,
    132,
    187,
    208,
    89,
    18,
    169,
    200,
    196,
    135,
    130,
    116,
    188,
    159,
    86,
    164,
    100,
    109,
    198,
    173,
    186,
    3,
    64,
    52,
    217,
    226,
    250,
    124,
    123,
    5,
    202,
    38,
    147,
    118,
    126,
    255,
    82,
    85,
    212,
    207,
    206,
    59,
    227,
    47,
    16,
    58,
    17,
    182,
    189,
    28,
    42,
    223,
    183,
    170,
    213,
    119,
    248,
    152,
    2,
    44,
    154,
    163,
    70,
    221,
    153,
    101,
    155,
    167,
    43,
    172,
    9,
    129,
    22,
    39,
    253,
    19,
    98,
    108,
    110,
    79,
    113,
    224,
    232,
    178,
    185,
    112,
    104,
    218,
    246,
    97,
    228,
    251,
    34,
    242,
    193,
    238,
    210,
    144,
    12,
    191,
    179,
    162,
    241,
    81,
    51,
    145,
    235,
    249,
    14,
    239,
    107,
    49,
    192,
    214,
    31,
    181,
    199,
    106,
    157,
    184,
    84,
    204,
    176,
    115,
    121,
    50,
    45,
    127,
    4,
    150,
    254,
    138,
    236,
    205,
    93,
    222,
    114,
    67,
    29,
    24,
    72,
    243,
    141,
    128,
    195,
    78,
    66,
    215,
    61,
    156,
    180,
  ]

  function seed(s: number) {
    if (s > 0 && s < 1)
      s *= 65536
    s = Math.floor(s)
    if (s < 256)
      s |= s << 8
    for (let i = 0; i < 256; i++) {
      const v = i & 1 ? (p[i] ?? 0) ^ (s & 255) : (p[i] ?? 0) ^ ((s >> 8) & 255)
      perm[i] = perm[i + 256] = v
      gradP[i] = gradP[i + 256] = grad3[v % 12] ?? [0, 0, 0]
    }
  }

  seed(Math.random())

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  function interpolate(a: number, b: number, t: number) {
    return (1 - t) * a + t * b
  }

  function perlin2(x: number, y: number) {
    let X = Math.floor(x)
    let Y = Math.floor(y)
    x = x - X
    y = y - Y
    X = X & 255
    Y = Y & 255

    const n00 = gradP[X + perm[Y]!] ?? [0, 0]
    const n01 = gradP[X + perm[Y + 1]!] ?? [0, 0]
    const n10 = gradP[X + 1 + perm[Y]!] ?? [0, 0]
    const n11 = gradP[X + 1 + perm[Y + 1]!] ?? [0, 0]

    const d00 = n00[0]! * x + n00[1]! * y
    const d01 = n01[0]! * x + n01[1]! * (y - 1)
    const d10 = n10[0]! * (x - 1) + n10[1]! * y
    const d11 = n11[0]! * (x - 1) + n11[1]! * (y - 1)

    const u = fade(x)

    return interpolate(
      interpolate(d00, d10, u),
      interpolate(d01, d11, u),
      fade(y),
    )
  }

  return { perlin2, seed }
}

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
      const move = noise.perlin2(
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

noise = initNoise()

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
