<script lang="ts" setup>
import dayjs from 'dayjs'
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article class="px-0 lg:px-20">
      <h1 class="mb-4 mt-0 text-10 text-gray-900 dark:text-gray-100">
        {{ doc.title }}
      </h1>
      <p class="mt--6 text-gray-500 dark:c-gray-400">
        {{ `${dayjs(doc.time).format('MMM DD, YYYY ddd')}.` }}
      </p>
      <ContentRenderer class="text-gray-600 dark:c-gray-300" :value="doc" />
    </article>
  </ContentDoc>
</template>
