<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import Logo from './Logo.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const navItems = [
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
      <NuxtLink class="text-10 c-gray-500 dark:c-gray-300 hover:c-black" to="/">
        <Logo />
      </NuxtLink>
      <div class="flex items-center gap-3 text-4 md:gap-5">
        <NuxtLink
          v-for="({ title, to }) in navItems"
          :key="title"
          class="hover:underline"
          active-class="op-100 underline"
          :title
          :to
        >
          {{ title }}
        </NuxtLink>
        <a title="Github" href="https://github.com/9romise" target="_blank">
          <span class="i-ri-github-line" />
        </a>
        <a title="Toggle Color Theme" class="cursor-pointer">
          <span class="i-ri-sun-line dark:i-ri-moon-line" @click="toggleDark()" />
        </a>
      </div>
    </nav>
    <button
      title="scroll to top"
      class="fixed bottom-12 right-6 h-10 w-10 rounded-50% op-70 transition md:right-18 hover:bg-gray-200 hover:dark:bg-gray-600"
      @click="backTop"
    >
      <span class="i-ri:arrow-up-fill" />
    </button>
  </header>
</template>

<style scoped lang="scss">
a {
  @apply: op-60;
  &:hover {
    @apply: op-100;
  }
}
</style>
