<script lang="ts" setup>
const isDark = useDark()
</script>

<template>
  <FlickeringGrid
    class="fixed inset-0 z--1"
    :color="isDark ? '#acd3df' : '#58a7c0'"
    :max-opacity="0.3"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
