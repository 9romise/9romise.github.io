<script setup lang="ts">
useHead({
  title: 'Blogs - Vida Xie',
})

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const blogList = navigation.value!
  .find(({ title }) => title === 'Blogs')!.children!
  .sort((a, b) => Number(b.title) - Number(a.title))
</script>

<template>
  <main>
    <ul v-for="{ title, children } in blogList" :key="title" class="my-10 text-5">
      <p class="mb-1 c-gray-400 dark:c-gray-600">
        {{ `< ${title} />` }}
      </p>
      <ul>
        <li v-for="link of children" :key="link._path">
          <NuxtLink class="c-gray-800 op-80 dark:c-gray-300 hover:op-100" :to="link._path">
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </ul>
  </main>
</template>
