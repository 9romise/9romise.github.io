<script setup lang="ts">
useHead({
  title: 'Blogs',
})

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const blogList = navigation.value!.find(({ title }) => title === 'Blogs')!.children
</script>

<template>
  <main>
    <ul v-for="{ title, children } in blogList" :key="title" class="my-2 text-5 c-gray-700">
      <p class="op-70">
        {{ `< ${title} />` }}
      </p>
      <ul>
        <li v-for="link of children" :key="link._path">
          <NuxtLink :to="link._path">
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </ul>
  </main>
</template>
