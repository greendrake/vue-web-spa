import { reactive, provide, inject } from 'vue'
export const stateSymbol = Symbol('state')
export const createState = () => reactive({
  exception: null,
  contents: new Map(),
  currentContentPath: '/',
  spinner: false,
  href: location.pathname,
})
export const useState = () => inject(stateSymbol)
export const provideState = () => provide(
  stateSymbol, 
  createState()
)