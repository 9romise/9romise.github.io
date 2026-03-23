<script lang="ts" setup>
const isDark = useDark()
</script>

<template>
  <FlickeringGrid
    class="fixed inset-0 z--1"
    :square-size="4"
    :grid-gap="2"
    :flicker-chance="0.00005"
    :color="isDark ? '#3d3d3d' : '#d4d4d4'"
    :max-opacity="0.3"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
