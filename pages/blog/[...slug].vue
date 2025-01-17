<script lang="ts" setup>
import { ContentRenderer } from '#components'
import dayjs from 'dayjs'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path).first())
</script>

<template>
  <main v-if="page">
    <article class="px-0 lg:px-20">
      <h1 class="mb-4 mt-0 text-10 text-gray-900 dark:text-gray-100">
        {{ page.title }}
      </h1>
      <p class="mt--6 text-gray-500 dark:c-gray-400">
        {{ `${dayjs(page.date).format('MMM DD, YYYY ddd')}.` }}
      </p>
      <ContentRenderer class="text-gray-600 dark:c-gray-300" :value="page" />
    </article>
  </main>
</template>
