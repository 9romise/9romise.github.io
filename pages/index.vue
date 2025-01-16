<script setup lang="ts">
useHead({
  title: 'About',
})

const info = [
  {
    title: 'Skills',
    details: [
      {
        name: 'Html',
        icon: 'i-vscode-icons:file-type-html',
      },
      {
        name: 'Css',
        icon: 'i-vscode-icons:file-type-css',
      },
      {
        name: 'JavaScript',
        icon: 'i-vscode-icons:file-type-js-official',
      },
      {
        name: 'TypeScript',
        icon: 'i-vscode-icons:file-type-typescript-official',
      },
      {
        name: 'Vue',
        icon: 'i-vscode-icons:file-type-vue',
      },
      {
        name: 'Node.js',
        icon: 'i-vscode-icons:file-type-node',
      },
      {
        name: 'LayaAir',
        link: 'https://layaair.com/',
      },
      {
        name: 'Kotlin',
        icon: 'i-vscode-icons:file-type-kotlin',
      },
    ],
  },
  {
    title: 'Uses',
    details: [
      {
        name: 'VSCode',
        icon: 'i-vscode-icons:file-type-vscode',
      },
      {
        name: 'Git',
        icon: 'i-vscode-icons:file-type-git',
      },
      {
        name: 'Vite',
        icon: 'i-vscode-icons:file-type-vite',
        link: 'https://vitejs.dev/',
      },
      {
        name: 'Vitest',
        icon: 'i-vscode-icons:file-type-vitest',
        link: 'https://vitest.dev/',
      },
      {
        name: 'Unocss',
        icon: 'i-vscode-icons:file-type-unocss',
        link: 'https://unocss.dev/',
      },
      {
        name: 'ESLint',
        icon: 'i-vscode-icons:file-type-eslint',
        link: 'https://eslint.org/',
      },
    ],
  },
  {
    title: 'What I made',
    details: [
      {
        name: 'eslint-import-resolver-oxc',
        link: 'https://github.com/9romise/eslint-import-resolver-oxc',
      },
    ],
  },
]

function codeClick(link: string | undefined) {
  if (link) {
    window.open(link)
  }
}
</script>

<template>
  <div>
    <h2>Vida Xie</h2>
    <div class="text-4 c-gray-500">
      <p>Hey, I am Vida Xie, born in 1999, a front-end engineer from China.</p>
      <p>I have been working as a front-end developer for 3 years.</p>
      <p>
        Since 2024, I have been involved in the open-source community and have developed a deep appreciation for it. Although I am still in the exploratory phase, I am trying to contribute to popular projects and continually learning through this experience.
      </p>
    </div>
    <div v-for="{ title, details } in info" :key="title">
      <h3>{{ title }}</h3>
      <p>
        <code
          v-for="{ icon, name, link } in details"
          :key="name"
          class="whitespace-nowrap"
          :class="[
            { 'cursor-pointer': link },
          ]"
          @click="codeClick(link)"
        >
          <i v-if="icon" class="mr-1" :class="icon" />{{ name }}<i v-if="link" class="i-ri:arrow-right-up-line ml-0.5 size-1em" />
        </code>
      </p>
    </div>
  </div>
</template>

<style>

</style>
