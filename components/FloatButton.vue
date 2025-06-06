<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

const {
  visibilityHeight = 0,
} = defineProps<{
  visibilityHeight?: number
}>()

const visible = ref(visibilityHeight <= 0)

useEventListener('scroll', () => {
  if (visibilityHeight <= 0)
    return
  visible.value = document.documentElement.scrollTop >= visibilityHeight
})
</script>

<template>
  <Transition name="fade-in">
    <div
      v-show="visible"
      v-bind="$attrs"
      class="fixed"
    >
      <slot />
    </div>
  </Transition>
</template>

<style>
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s ease;
}
.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}
</style>
