<script lang="ts" setup>
const isDark = useDark()
</script>

<template>
  <FlickeringGrid
    class="fixed inset-0 z--1"
    :square-size="8"
    :grid-gap="4"
    :flicker-chance="0.0001"
    :color="isDark ? '#acd3df' : '#58a7c0'"
    :max-opacity="0.15"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
