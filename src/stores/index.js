import { reactive, ref } from 'vue'
import { defineStore } from '../../pinia'

function apiLogin(a, p) {
  if (a === 'ed' && p === 'ed') return Promise.resolve({ isAdmin: true })
  if (p === 'ed') return Promise.resolve({ isAdmin: false })
  return Promise.reject('invalid credentials')
}


export const useOptions = defineStore({
  id: 'options',
  state: () => ({ n: 1, username: '', password: 'ceshi ' }),
  getters: {
    doubleOptions: (state) => state.n * 2,
  },
  actions: {
    method1(a) {
      this.n += a
    },
    method2() { },
    method3() { },
  }
})

export const useIdSetup = defineStore('idSetup', () => {
  const state = reactive({
    num: 10,
    isAdmin: false
  })

  const dataRef = ref('')

  const add = () => {
    state.num++
  }

  const login = async (user, password) => {
    const userData = await apiLogin(user, password)

    state.isAdmin = userData.isAdmin
  }

  return { state, dataRef, add, login }
})

export const useId = defineStore('id', {
  state: () => ({ m: 3 }),
  getters: {
    doubleId1: (state) => state.m * 2,
    doubleId2: (state) => state.m * 3,
  },
  actions: {
    method1(a, b, c) {
      a = b = c
    },
    method2() { },
    method3() { },
  }
})
