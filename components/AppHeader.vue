<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import Logo from './Logo.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const navItems = [
  {
    title: 'About',
    to: '/about',
  },
  {
    title: 'Blog',
    to: '/blogs',
  },
  // {
  //   title: 'Notes',
  //   to: '/notes',
  // },
]

function backTop() {
  scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <header class="w-full px-8">
    <nav class="h-10 flex items-end justify-between lh-none sm:h-17">
      <div class="text-4 c-gray-500 sm:text-10 dark:c-gray-300">
        <NuxtLink to="/">
          <Logo class="transition hover:c-black" />
        </NuxtLink>
      </div>
      <div class="flex items-center gap-3 text-4 md:gap-5">
        <NuxtLink
          v-for="({ title, to }) in navItems"
          :key="title"
          :title
          :to
        >
          {{ title }}
        </NuxtLink>
        <a title="Github" href="https://github.com/9romise" target="_blank">
          <span class="i-ri-github-line" />
        </a>
        <a title="Toggle Color Theme">
          <span class="i-ri-sun-line dark:i-ri-moon-line" @click="toggleDark()" />
        </a>
      </div>
    </nav>
    <button
      title="scroll to top"
      class="fixed bottom-12 right-6 h-8 w-8 rounded-50% op-70 transition md:right-18 hover:bg-gray-300 hover:dark:bg-gray-600"
      @click="backTop"
    >
      <span class="i-solar:arrow-up-bold" />
    </button>
  </header>
</template>

<style>
nav a {
  @apply opacity-60 transition cursor-pointer;
}
.router-link-active {
  @apply: opacity-100;
}
</style>
