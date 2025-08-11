---
title: '探索Nuxt UI弹窗系统'
date: 2025-07-25
---

> 本文简单介绍了对Nuxt UI弹窗系统探索的心路历程

长久以来，对「状态驱动」和「命令式」来展示弹窗始终都有争议，在知乎上，Vue作者尤雨溪有对此做过[回答](https://www.zhihu.com/question/35820643/answer/64646527)，他的选择是：状态驱动；而我个人更偏向于命令式，但始终没有找到一个我满意的方案。

最近在使用`Nuxt UI`，它提供了[`useOverlay`](https://ui.nuxt.com/composables/use-overlay)，我认为它所提供的API非常合我的口味。于是好奇地想看看它是如何管理弹窗的，便以[`useOverlay`的源码](https://github.com/nuxt/ui/blob/v3/src/runtime/composables/useOverlay.ts)为入口开始阅读。

在[Usage](https://ui.nuxt.com/composables/use-overlay#usage)介绍了基础的使用方法：

``` vue
<script setup lang="ts">
import { LazyModalExample } from '#components'

const overlay = useOverlay()

const modal = overlay.create(LazyModalExample)

async function openModal() {
  modal.open()
}
</script>
```

所以我从[`create`](https://github.com/nuxt/ui/blob/v3/src/runtime/composables/useOverlay.ts#L64)方法开始：

``` ts
const overlays = shallowReactive<Overlay[]>([])

const create = <T extends Component>(component: T, _options?: OverlayOptions<ComponentProps<T>>): OverlayInstance<T> => {
  const { props, defaultOpen, destroyOnClose } = _options || {}

  const options = reactive<Overlay>({
    id: Symbol(import.meta.dev ? 'useOverlay' : ''),
    isOpen: !!defaultOpen,
    component: markRaw(component!),
    isMounted: !!defaultOpen,
    destroyOnClose: !!destroyOnClose,
    originalProps: props || {},
    props: { ...props }
  })

  overlays.push(options)

  return {
    ...options,
    open: <T extends Component>(props?: ComponentProps<T>) => open(options.id, props),
    close: value => close(options.id, value),
    patch: <T extends Component>(props: Partial<ComponentProps<T>>) => patch(options.id, props)
  }
}
```

它将组件和`OverlayOptions`合并后 push 到了`overlays`里，一个用于管理的数组，同时返回了`open`、`close`、`patch`方法等，仅此而已。

那么再看[`open`](https://github.com/nuxt/ui/blob/v3/src/runtime/composables/useOverlay.ts#L87)方法：

``` ts
const open = <T extends Component>(id: symbol, props?: ComponentProps<T>): OpenedOverlay<T> => {
  const overlay = getOverlay(id)

  // If props are provided, merge them with the original props, otherwise use the original props
  if (props) {
    overlay.props = { ...overlay.originalProps, ...props }
  } else {
    overlay.props = { ...overlay.originalProps }
  }

  overlay.isOpen = true // [!code focus]
  overlay.isMounted = true // [!code focus]
  const result = new Promise<any>(resolve => overlay.resolvePromise = resolve)

  return Object.assign(result, {
    id,
    isMounted: overlay.isMounted,
    isOpen: overlay.isOpen,
    result
  })
}
```

它也仅仅是通过`getOverlay`找到这个弹窗后将`isOpen`和`isMounted`设为`true`。

在[`getOverlay`](https://github.com/nuxt/ui/blob/v3/src/runtime/composables/useOverlay.ts#L142)中也仅仅是通过`id`找到了对应的`Overlay`：

``` ts
const getOverlay = (id: symbol): Overlay => {
  const overlay = overlays.find(overlay => overlay.id === id)

  if (!overlay) {
    throw new Error('Overlay not found')
  }

  return overlay
}
```

但是以上的这些操作，也仅仅是在操作弹窗组件的实例，并没有哪一步是将其实际渲染出来的，于是我又注意到刚刚的`overlays`。

最终我找到了[`OverlayProvider`](https://github.com/nuxt/ui/blob/main/src/runtime/components/OverlayProvider.vue)：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useOverlay } from '../composables/useOverlay'
import type { Overlay } from '../composables/useOverlay'

const { overlays, unmount, close } = useOverlay()

const mountedOverlays = computed(() => overlays.filter((overlay: Overlay) => overlay.isMounted))

const onAfterLeave = (id: symbol) => {
  close(id)
  unmount(id)
}

const onClose = (id: symbol, value: any) => {
  close(id, value)
}
</script>

<template>
  <component
    :is="overlay.component"
    v-for="overlay in mountedOverlays"
    :key="overlay.id"
    v-bind="overlay.props"
    v-model:open="overlay.isOpen"
    @close="(value:any) => onClose(overlay.id, value)"
    @after:leave="onAfterLeave(overlay.id)"
  />
</template>
```

这个组件使用`v-for`将`overlays`中的所有弹窗都进行了渲染，并且由于被`push`进数组的先后顺序，似乎也很好地解决了弹窗的层级问题。

现在组件是被渲染了，但是如何控制显示和隐藏呢？显然`v-model:open`一定是关键。

于是我寻找了官方示例中可以用于`useOverlay`的`Modal`组件

抛开所有无关的逻辑，实际与显示相关的代码是以下这些：

``` vue
const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits)

<template>
  <DialogRoot v-slot="{ open, close }" v-bind="rootProps">
    ...
  </DialogRoot>
</template>
```

根结点的[`DialogRoot`](https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Dialog/DialogRoot.vue)来自[`reka-ui`](https://reka-ui.com)，实际只是将`open`属性`provide`了出去：
``` vue
<script setup lang="ts">
provideDialogRootContext({
  open,
  modal,
  openModal: () => {
    open.value = true
  },
  onOpenChange: (value) => {
    open.value = value
  },
  onOpenToggle: () => {
    open.value = !open.value
  },
  contentId: '',
  titleId: '',
  descriptionId: '',
  triggerElement,
  contentElement,
})
</script>
```

对应地，寻找`inject`方法（`injectDialogRootContext`），最终在[`DialogOverly`](https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Dialog/DialogOverlay.vue)中找到了传入`open`的组件：[`Presence`](https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Presence/Presence.ts)，实际与显示相关的最简化代码为：

```ts
export default defineComponent({
  name: 'Presence',
  props: {
    present: {
      type: Boolean,
      required: true,
    },
  },
  slots: {} as SlotsType<{
    default: (opts: { present: boolean }) => any
  }>,
  setup(props, { slots, expose }) {
    const { present } = toRefs(props)

    return () => {
      if (present.value) {
        return h(slots.default()[0] as VNode)
      }
      else { return null }
    }
  },
})
```

至此，我对弹窗系统的探索就结束了，其实实现非常简单，但也收获颇丰。

另外，在探索的过程中可以发现，Nuxt UI的类型声明也非常优秀，值得学习，但在此不再过多赘述。

## Credits
- [Nuxt UI](https://ui.nuxt.com) - [MIT License](https://github.com/nuxt/ui?tab=MIT-1-ov-file#readme)
- [Reka UI](https://reka-ui.com) - [MIT License](https://github.com/unovue/reka-ui?tab=MIT-1-ov-file#readme)