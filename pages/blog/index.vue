<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'

useHead({
  title: 'Blogs',
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollection('blog')
  .order('date', 'DESC')
  .all())
const blogList = computed(() => {
  const data = navigation.value?.filter((item) => !item.draft) || []
  const result = new Map<string, BlogCollectionItem[]>()
  data.forEach((blog) => {
    const year = blog.path.split('/')[2]
    if (!result.has(year)) {
      result.set(year, [])
    }
    const list = result.get(year)!
    list.push(blog)
    result.set(year, list)
  })
  return result
})
</script>

<template>
  <main>
    <ul v-for="[title, children] in blogList" :key="title" class="my-10 text-5">
      <p class="mb-1 c-gray-400 dark:c-gray-600">
        {{ `< ${title} />` }}
      </p>
      <ul>
        <li v-for="link of children" :key="link.path">
          <NuxtLink class="c-gray-800 op-80 dark:c-gray-300 hover:op-100" :to="link.path">
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </ul>
  </main>
</template>
