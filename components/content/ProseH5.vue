<script setup lang="ts">
import ProseH from './ProseH.vue'
</script>

<template>
  <ProseH
    :level="5"
    v-bind="$props"
  >
    <slot />
  </ProseH>
</template>
