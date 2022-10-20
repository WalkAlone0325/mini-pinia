import { markRaw, effectScope, ref } from "vue";

export const piniaSymbol = Symbol('pinia')

export function createPinia() {
  const scope = effectScope(true)
  const state = scope.run((() => ref({})))

  // 将一个对象标记为不可被转为代理。返回该对象本身。
  const pinia = markRaw({

    install(app) {
      // 注入 pinia 实例
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
    },
    // 注册 pinia 插件
    use(plugin) { },

    _e: scope,
    _s: new Map(),
    state
  })
  // devTools
  // pinia.use(devtoolsPlugin)


  // 返回 pinia 实例
  return pinia
}
