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

router.beforeEach(async (to, from) => {
  try {
    const prevContent = state.contents.get(state.currentContentPath)
    if (prevContent && state.scrollY !== undefined) {
      prevContent.scrollY = state.scrollY
    }
    let path = to.path
    state.href = path
    if (path[path.length - 1] === '/') {
      path = `${path}index`
    }
    if (!state.contents.has(path)) {
      state.pendingContent = await CL.load(path)
    }
    state.pendingContentPath = path
    state.exception = null
  } catch (e) {
    state.exception = e
  }
})

// Content needs to be applied AFTER the history/document URI has changed,
// otherwise relative URLs (images etc.) will be fetched incorrectly
router.afterEach(() => {
  if (state.exception === null) {
    if (!state.contents.has(state.pendingContentPath)) {
      state.contents.set(state.pendingContentPath, state.pendingContent)
    }
    state.currentContentPath = state.pendingContentPath
    delete state.pendingContent
    delete state.pendingContentPath
  }
})

app.use(router)
app.provide(stateSymbol, state)
app.mount('#target')

document.addEventListener('scroll', () => {
   state.scrollY = window.scrollY
});
