<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import Logo from './Logo.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

function backTop() {
  scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <header class="mx-auto max-w-205 w-85% md:w-65% xl:w-60%">
    <nav class="h-9 flex items-end justify-between lh-none sm:h-17">
      <div class="text-4 c-gray-500 sm:text-10 dark:c-gray-300">
        <NuxtLink to="/">
          <Logo class="transition hover:c-black" />
        </NuxtLink>
      </div>
      <div class="flex gap-3 text-3.5 md:gap-5">
        <NuxtLink title="About" to="/about">
          About
        </NuxtLink>
        <NuxtLink title="Blog" to="/blog">
          Blog
        </NuxtLink>
        <NuxtLink title="Notes" to="/notes">
          Notes
        </NuxtLink>
        <a title="Github" href="https://github.com/9romise" target="_blank">
          <span class="i-ri-github-fill" />
        </a>
        <a title="Toggle Color Theme">
          <span class="i-ri-moon-fill dark:i-ri-sun-line" @click="toggleDark()" />
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
  opacity: 0.6;
  transition: opacity 0.3s ease;
  cursor: pointer;
  text-decoration: none;
}
</style>
