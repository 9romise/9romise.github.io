<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'c-gray-700 dark:c-gray-400 bg-white dark:bg-gray-900 transition font-medium',
  },
})
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="mx-auto my-10 max-w-205 w-85% flex-1 lg:my-30 lg:w-60% md:w-65%">
      <slot />
    </main>
    <AppFooter class="mx-auto max-w-205 w-85% lg:w-60% md:w-65% dark:c-gray-500" />
  </div>
</template>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
