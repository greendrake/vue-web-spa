import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { stateSymbol, createState } from './state'
import App from './App.vue'
import Content from './components/Content.vue'
import CL from './classes/Content/Loader'
import './index.css'
window.randomString = (pref) => `${pref || ''}${Math.random().toString(36).substring(2)}`
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/:path(.*)*',
      component: Content
    }
  ]
})
const app = createApp(App)
const state = createState()

router.beforeEach(() => {
  const prevContent = state.contents.get(state.currentContentPath)
  if (prevContent && state.scrollY !== undefined) {
    prevContent.scrollY = state.scrollY
  }
})

// Content needs to be applied AFTER the history/document URI has changed,
// otherwise relative URLs (images etc.) will be fetched incorrectly
router.afterEach(async (to, from) => {
  try {
    let path = to.path
    if (path[path.length - 1] === '/') {
      path = `${path}index`
    }
    if (!state.contents.has(path)) {
      state.spinner = true
      state.contents.set(path, await CL.load(path))
      state.spinner = false
    }
    state.currentContentPath = path
    state.href = to.path
    state.exception = null
  } catch (e) {
    state.exception = e
  }  
})

app.use(router)
app.provide(stateSymbol, state)
app.mount('#target')

document.addEventListener('scroll', () => {
   state.scrollY = window.scrollY
});
