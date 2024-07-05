<script setup lang="ts">
const links = {
  Github: 'https://github.com/9romise',
}
</script>

<template>
  <footer>
    <div class="flex flex-col justify-between b-b b-gray-200 b-solid pb-12 md:flex-row dark:b-gray-800">
      <div class="flex flex-col">
        <Logo class="mb-5 text-8" />
        <p class="text-4.5">
          This theme is designed by
          <a
            class="c-gray-900 decoration-underline dark:c-gray-300"
            href="https://github.com/nrk9819"
            target="_blank"
          >nrk9819</a>.
        </p>
      </div>
      <div class="flex flex-col">
        <NuxtLink
          v-for="(link, key) in links"
          :key
          class="text-3.5 hover:decoration-underline"
          :to="link"
          target="_blank"
        >
          {{ key }}<span class="i-solar:arrow-right-up-bold ml-1" />
        </NuxtLink>
      </div>
    </div>
    <div>
      <div>@ 2024 Vida</div>
    </div>
  </footer>
</template>

<style scoped>
footer > div {
  margin-bottom: 2.5rem;
}
</style>
