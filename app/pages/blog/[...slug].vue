<script lang="ts" setup>
import { ContentRenderer } from '#components'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path).first())

// https://content.nuxt.com/docs/getting-started/installation#display-your-page
useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})
</script>

<template>
  <main>
    <article class="px-0 lg:px-20">
      <template v-if="page">
        <h1 class="mb-4 mt-0 text-10 text-gray-900 dark:text-gray-100">
          {{ page.title }}
        </h1>
        <p class="mt--6 color-secondary">
          <NuxtTime
            :datetime="page.date"
            year="numeric"
            month="2-digit"
            day="2-digit"
            time-zone-name="short"
          />
        </p>
        <ContentRenderer class="color-content" :value="page" />
      </template>
      <template v-else>
        <p class="color-secondary">
          Loading...
        </p>
      </template>
    </article>
  </main>
</template>
