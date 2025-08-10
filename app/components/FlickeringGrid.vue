<script lang="ts" setup>
// MIT License
// https://github.com/unovue/inspira-ui/blob/main/LICENSE

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  maxOpacity?: number
}

const props = withDefaults(defineProps<FlickeringGridProps>(), {
  squareSize: 4,
  gridGap: 6,
  flickerChance: 0.3,
  color: '#000',
  maxOpacity: 0.3,
})

const { squareSize, gridGap, flickerChance, maxOpacity, color } = toRefs(props)

const { width, height } = useWindowSize()

const canvasRef = useTemplateRef('canvasRef')
const context = ref<CanvasRenderingContext2D>()

const isInView = ref(false)
const canvasSize = ref({ width: 0, height: 0 })

const computedColor = computed(() => {
  if (!context.value)
    return '255, 0, 0'

  const hex = color.value.replace(/^#/, '')
  const bigint = Number.parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
})

function setupCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): {
  cols: number
  rows: number
  squares: Float32Array
  dpr: number
} {
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const cols = Math.floor(width / (squareSize.value + gridGap.value))
  const rows = Math.floor(height / (squareSize.value + gridGap.value))

  const squares = new Float32Array(cols * rows)
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * maxOpacity.value
  }
  return { cols, rows, squares, dpr }
}

function updateSquares(squares: Float32Array, deltaTime: number) {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < flickerChance.value * deltaTime) {
      squares[i] = Math.random() * maxOpacity.value
    }
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cols: number,
  rows: number,
  squares: Float32Array,
  dpr: number,
) {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, width, height)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const opacity = squares[i * rows + j]
      ctx.fillStyle = `rgba(${computedColor.value}, ${opacity})`
      ctx.fillRect(
        i * (squareSize.value + gridGap.value) * dpr,
        j * (squareSize.value + gridGap.value) * dpr,
        squareSize.value * dpr,
        squareSize.value * dpr,
      )
    }
  }
}

const gridParams = ref<ReturnType<typeof setupCanvas>>()

function updateCanvasSize() {
  const newWidth = width.value
  const newHeight = height.value

  canvasSize.value = { width: newWidth, height: newHeight }
  gridParams.value = setupCanvas(canvasRef.value!, newWidth, newHeight)
}

let animationFrameId: number | undefined
let lastTime = 0

function animate(time: number) {
  if (!isInView.value)
    return

  const deltaTime = (time - lastTime) / 1000
  lastTime = time

  updateSquares(gridParams.value!.squares, deltaTime)
  drawGrid(
    context.value!,
    canvasRef.value!.width,
    canvasRef.value!.height,
    gridParams.value!.cols,
    gridParams.value!.rows,
    gridParams.value!.squares,
    gridParams.value!.dpr,
  )
  animationFrameId = requestAnimationFrame(animate)
}

useIntersectionObserver(canvasRef, ([entry]) => {
  isInView.value = entry!.isIntersecting
  animationFrameId = requestAnimationFrame(animate)
}, { threshold: 0 })

onMounted(() => {
  if (!canvasRef.value)
    return
  context.value = canvasRef.value.getContext('2d')!
  if (!context.value)
    return

  updateCanvasSize()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none"
    :width="canvasSize.width"
    :height="canvasSize.height"
  />
</template>
