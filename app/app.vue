<script lang="ts" setup>
import WavyLines from './components/WavyLines.vue'

const isDark = useDark()
</script>

<template>
  <WavyLines />
  <!-- <FlickeringGrid
    class="fixed inset-0 z--1"
    :square-size="8"
    :grid-gap="4"
    :flicker-chance="0.005"
    :color="isDark ? '#acd3df' : '#58a7c0'"
    :max-opacity="0.2"
  /> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
