<script lang="ts" setup>
// MIT License
// https://github.com/unovue/inspira-ui/blob/main/LICENSE

interface FlickeringGridProps {
  squareSize: number
  gridGap: number
  flickerChance: number
  color: string
  maxOpacity: number
}

const {
  squareSize,
  gridGap,
  flickerChance,
  color,
  maxOpacity,
} = defineProps<FlickeringGridProps>()

const { width, height } = useWindowSize()

const canvasRef = useTemplateRef('canvasRef')
const context = shallowRef<CanvasRenderingContext2D>()

const gridParams = ref<{
  cols: number
  rows: number
  squares: Float32Array
  dpr: number
}>()

const computedColor = computed(() => {
  if (!context.value)
    return '255, 0, 0'

  const hex = color.replace(/^#/, '')
  const bigint = Number.parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
})

useRafFn(({ delta }) => {
  if (!context.value || !gridParams.value)
    return

  const { cols, rows, squares, dpr } = gridParams.value!

  // #region updateSquares
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < flickerChance * delta) {
      squares[i] = Math.random() * maxOpacity
    }
  }
  // #endregion

  // #region drawGrid
  const ctx = context.value
  const width = canvasRef.value!.width
  const height = canvasRef.value!.height

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, width, height)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const opacity = squares[i * rows + j]
      ctx.fillStyle = `rgba(${computedColor.value}, ${opacity})`
      ctx.fillRect(
        i * (squareSize + gridGap) * dpr,
        j * (squareSize + gridGap) * dpr,
        squareSize * dpr,
        squareSize * dpr,
      )
    }
  }
  // #endregion
}, { fpsLimit: 2 })

function setupCanvas() {
  const canvas = canvasRef.value!
  const dpr = window.devicePixelRatio || 1
  canvas.width = width.value * dpr
  canvas.height = height.value * dpr
  canvas.style.width = `${width.value}px`
  canvas.style.height = `${height.value}px`

  const cols = Math.floor(width.value / (squareSize + gridGap))
  const rows = Math.floor(height.value / (squareSize + gridGap))

  const squares = new Float32Array(cols * rows)
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * maxOpacity
  }
  gridParams.value = { cols, rows, squares, dpr }
}

watch([width, height], setupCanvas)

onMounted(() => {
  context.value = canvasRef.value!.getContext('2d')!
  setupCanvas()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none"
  />
</template>
