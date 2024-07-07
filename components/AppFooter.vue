<script setup lang="ts">
const links = {
  Github: 'https://github.com/9romise',
}
</script>

<template>
  <footer>
    <div class="flex flex-col justify-between b-b b-gray-200 b-solid pb-6 md:flex-row dark:b-gray-800">
      <div class="flex flex-col">
        <Logo class="mb-5 text-8" />
        <p class="text-4.5" />
      </div>
      <div class="flex flex-col">
        <NuxtLink
          v-for="(link, key) in links"
          :key
          class="text-3.5 hover:underline"
          :to="link"
          target="_blank"
        >
          {{ key }}<span class="i-ri:arrow-right-up-line ml-1" />
        </NuxtLink>
      </div>
    </div>
    <div class="op-70">
      <a class="underline" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 2024-PRESENT © Vida Xie
    </div>
  </footer>
</template>

<style scoped>
footer > div {
  margin-bottom: 2rem;
}
</style>
