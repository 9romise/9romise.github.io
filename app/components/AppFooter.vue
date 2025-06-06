<script setup lang="ts">
const links = {
  Github: 'https://github.com/9romise',
}
</script>

<template>
  <footer>
    <div class="flex flex-col justify-between gap-8 b-b b-gray-200 b-solid pb-6 md:flex-row dark:b-gray-800">
      <div class="flex flex-col">
        <Logo class="text-8" />
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
    <div class="op-50">
      <a class="underline" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 2024-PRESENT © Vida Xie
    </div>
  </footer>
</template>

<style scoped>
footer > div {
  margin-bottom: 2rem;
}
</style>
