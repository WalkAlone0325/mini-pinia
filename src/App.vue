<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import { useOptions, useId, useIdSetup } from './stores';

// const userStore = useUserStore()

// console.log(userStore)
// useUserStore
const options = useOptions()
const idSetup = useIdSetup()
const id = useId()

const testOptions = (num) => {
  options.method1(num)
}

console.log(options, 'useOptions 返回')
console.log(idSetup, 'useIdSetup 返回')
console.log(id, 'useId 返回')
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <button @click="testOptions(8)">按钮---{{options.n}}---{{options.doubleOptions}}</button>
  <button @click="idSetup.add()">idSetup: {{idSetup.state.num}}</button>
  <button @click="idSetup.login('ed', 'ed')">login</button>
  <h3>{{idSetup.state.isAdmin ? '登录成功' : '没有登录'}}</h3>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
