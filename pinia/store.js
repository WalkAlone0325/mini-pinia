import { inject, toRefs, getCurrentInstance, markRaw, isRef, isReactive, computed, reactive, toRaw } from 'vue'
import { piniaSymbol } from '.'

// 判断是否是 ref 并且存在 effect 即为 计算属性
function isComputed(o) {
  return !!(isRef(o) && o.effect)
}

// (id, () => {})
function createSetupStore($id, setup, options, pinia, hot, isOptionsStore) {
  const initialState = pinia.state.value[$id] | undefined

  if (!isOptionsStore && !initialState) {
    pinia.state.value[$id] = {}
  }

  function $patch() { }
  const $reset = () => { }
  function $dispose() { }

  // 处理 actions
  function wrapAction(name, action) {
    return function () {
      const args = Array.from(arguments)

      // ... 订阅

      let ret
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args)
      } catch (error) {
        throw error
      }

      // 处理异步
      if (ret instanceof Promise) {
        return ret
          .then(value => value)
          .catch(err => Promise.reject(err))
      }
      return ret
    }
  }

  const partialStore = {
    _p: pinia,
    $id,
    $patch,
    $reset,
    $dispose
  }

  const store = reactive(Object.assign({}, partialStore))
  // const store = reactive({})

  pinia._s.set($id, store)

  // scope 是为了作用域
  // const setupStore = pinia._e.run(() => {
  //   scope = effectScope()
  //   return scope.run(() => setup())
  // })
  // 相当于处理后的setup return 中的数据
  const setupStore = setup()

  for (const key in setupStore) {
    const prop = setupStore[key]

    // ref 或 reactive 的数据
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      if (!isOptionsStore) {
        // xx = ref('')/reactive({})
        pinia.state.value[$id][key] = prop
      }
    } else if (typeof prop === 'function') {
      const actionValue = wrapAction(key, prop)
      setupStore[key] = actionValue
    }
  }

  Object.assign(store, setupStore)
  // storeToRefs
  Object.assign(toRaw(store), setupStore)

  return store
}

function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options

  // const initialState = pinia.state.value[id]

  let store

  function setup() {
    pinia.state.value[id] = state ? state() : {}

    // state 转为=> reactive({})
    const localState = toRefs(pinia.state.value[id])

    return Object.assign(
      // state 
      localState,
      // acitons 即为 methods
      actions,
      // getters 转成 computed
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            const store = pinia._s.get(id)
            return getters[name].call(store, store)
          })
        )
        return computedGetters
      }, {})
    )

  }

  store = createSetupStore(id, setup, options, pinia, hot, true)

  console.log(store, 'store')
  // store.$reset = function $reset() {
  //   const newState = state ? state() : {}

  //   this.$patch(($state) => {
  //     Object.assign($state, newState)
  //   })
  // }

  return store
}

export function defineStore(idOrOptions, setup, setupOptions) {
  let id, options

  // 将传入的参数进行规范化处理 {id, state, getters, actions}
  const isSetupStore = typeof setup === 'function'
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = isSetupStore ? setupOptions : setup
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  // console.log(id, options)

  function useStore(pinia, hot) {
    const currentInstance = getCurrentInstance()
    pinia = currentInstance && inject(piniaSymbol)

    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        // setup 方式
        createSetupStore(id, setup, options, pinia)
      } else {
        // options 方式
        createOptionsStore(id, options, pinia)
      }
    }

    const store = pinia._s.get(id)

    return store
  }

  useStore.$id = id

  return useStore
}
