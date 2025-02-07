<script lang="ts" setup>
import type { NuxtLinkProps } from '#app'

const { href = '', target } = defineProps<
  Pick<NuxtLinkProps, 'href' | 'target'>
>()
</script>

<template>
  <NuxtLink
    class="underline decoration-gray-700 underline-op-30 hover:underline-op-100"
    :href
    :target
  >
    <slot />
  </NuxtLink>
</template>
