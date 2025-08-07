<script setup lang="ts">
import Logo from './Logo.vue'

const { toggleDark } = useTheme()

const navItems = [
  {
    title: 'Blog',
    to: '/blog',
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
    <nav class="h-14 flex items-end justify-between lh-none sm:h-17">
      <NuxtLink
        class="text-10 c-gray-700 dark:c-gray-300"
        to="/"
      >
        <Logo animate />
      </NuxtLink>
      <div class="flex items-center gap-3 text-4 md:gap-5">
        <NuxtLink
          v-for="({ title, to }) in navItems"
          :key="title"
          class="op-60 hover:underline hover:op-100"
          active-class="op-100 underline"
          :title
          :to
        >
          {{ title }}
        </NuxtLink>
        <a
          v-for="{ title, href, icon } in SOCIAL_LINKS"
          :key="title"
          :title
          :href
          target="_blank"
        >
          <span :class="icon" />
        </a>
        <button title="Toggle Color Theme">
          <span
            class="i-ri-sun-line dark:i-ri-moon-line"
            @click="toggleDark"
          />
        </button>
      </div>
    </nav>
    <FloatButton
      title="scroll to top"
      class="bottom-12 right-6"
      :visibility-height="400"
    >
      <button
        title="scroll to top"
        class="h-10 w-10 rounded-50% op-70 transition md:right-18 hover:bg-gray-200 hover:dark:bg-gray-600"
        @click="backTop"
      >
        <span class="i-ri:arrow-up-fill" />
      </button>
    </FloatButton>
  </header>
</template>
