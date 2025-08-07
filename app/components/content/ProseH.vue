<script lang="ts" setup>
const { level, id } = defineProps<{
  level: 1 | 2 | 3 | 4 | 5 | 6
  id?: string
}>()
const tag = computed(() => `h${level}` as const)

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.[tag.value])))
</script>

<template>
  <component
    :is="tag"
    :id
    class="relative"
  >
    <a
      v-if="generate"
      class="absolute left--8 op-0 hover:op-50"
      :href="`#${id}`"
    >#</a>
    <slot />
  </component>
</template>

<style>
</style>
