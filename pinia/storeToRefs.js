import { isRef, isReactive, toRaw, toRef } from "vue";

export function storeToRefs(store) {
  store = toRaw(store)

  const refs = {}

  for (const key in store) {
    const value = store[key]
    // 将 ref 和 reactive 的数据转成 ref 数据
    if (isRef(value) || isReactive(value)) {
      refs[key] = toRef(store, key)
    }
  }

  return refs
}
