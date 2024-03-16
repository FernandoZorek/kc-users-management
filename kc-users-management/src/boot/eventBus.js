import mitt from 'mitt'
const emitter = mitt()
import { boot } from 'quasar/wrappers'

export default boot(async ({ app }) => {
  app.provide('emitter', emitter)
})
