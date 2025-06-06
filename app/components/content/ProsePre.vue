<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div
    class="overflow-auto rounded-2 bg-gray-100 p-1em dark:bg-gray-800"
  >
    <pre
      v-bind="$attrs"
    ><slot /></pre>
  </div>
</template>
