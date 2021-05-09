<template>
  <div class="App">
    <div v-if="href !== '/'" class="App__Nav">
      <router-link to="/">Home</router-link>
    </div>
    <div class="App__TopRight" v-if="href !== '/about'">
      <router-link to="/about">About / Contact</router-link>
    </div>
    <template v-if="exception">
        <h1>{{exception}}</h1>
    </template>
    <Suspense>
        <template #default>
            <router-view v-show="!exception" />
        </template>
        <template #fallback>Loading...</template>
    </Suspense>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useState } from './state';
export default {
    setup() {
      const state = useState()
      const href = computed(() => state.href)
      const spinner = computed(() => state.spinner)
      const exception = computed(() => state.exception)
      watch(spinner, (v) => {
        document.body.className = v ? 'spinner' : ''
      })
      return { href, exception }
    }
}
</script>

<style>
.App {
  &__Nav {
    margin-top: 16px;
  }
  &__TopRight {
    position: absolute;
    right: 16px;
    top: 16px;
  }
}
</style>
