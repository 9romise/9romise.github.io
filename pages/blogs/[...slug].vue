<script lang="ts" setup>
import dayjs from 'dayjs'
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article class="px-0 lg:px-20">
      <h1 class="text-gray-900">
        {{ doc.title }}
      </h1>
      <p class="mt--6 text-gray-500">
        {{ `${dayjs(doc.time).format('MM/DD/YYYY ddd')}.` }}
      </p>
      <ContentRenderer :value="doc" />
    </article>
  </ContentDoc>
</template>
