<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'c-gray-700 dark:c-gray-400 bg-white dark:bg-gray-900 transition font-medium',
  },
})
</script>

<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<style></style>
