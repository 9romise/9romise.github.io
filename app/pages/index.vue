<script setup lang="ts">
useHead({
  title: 'About',
})

const { data: page } = await useAsyncData('index', async () => queryCollection('content').path('/').first())
</script>

<template>
  <ContentRenderer
    v-if="page"
    class="px-24"
    :value="page"
  />
</template>
