<template>
  <div class="layout">
    <AppHeader />
    <main class="mx-auto my-10 max-w-205 w-85% flex flex-1 flex-col lg:w-60% md:w-65%">
      <div class="flex-1">
        <slot />
      </div>
      <AppFooter class="mt-40 w-full color-secondary" />
    </main>
  </div>
</template>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
